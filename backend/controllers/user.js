const User = require('../models/user.js');
validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const sendEmail = require('../utils/sendEmail.js');

const register = async (req, res) => {

    const avatar = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 130,
        crop: "scale"
    })


    const { name, email, password, role } = req.body;

    //kullanci var mi kontrolu
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            message: "Bu e-posta ile zaten kayitli kullanici mevcut!"
        })
    }

    //email validasyonu
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Gecersiz e-posta formati!" })
    }


    //sifre validasyonu
    if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        returnScore: false //puan dondurme

    })) {
        return res.status(400).json({ message: "Sifre en az 6 karakter, 1 buyuk harf, 1 kucuk harf, 1 sayi ve 1 ozel karakter icermelidir! " })
    }

    try {
        //sifreyi hashleme
        const passwordHash = await bcrypt.hash(password, 10);
        /*
            Düz metin saklama riski: Veritabanı hacklendiğinde tüm şifreler ele geçer
            Hash'leme: Geri döndürülemez şifreleme sağlar
                const hash = await bcrypt.hash("123456", 10);
                Çıktı: $2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
    
        */

        //kullanciyi db'ye kaydet
        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
            avatar: {
                public_id: avatar.public_id,
                url: avatar.secure_url
            },
            role
        });

        //jwt token olustur
        const token = jwt.sign({
            userId: newUser._id,
            email: newUser.email
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } //token suresi 1 saat
        );

        //token;i http-only cookie ekle
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        return res.status(201).json({
            message: "Kullanici basariyla kaydedildi",
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Kullanici olusturulurken hata olustu",
            error: error.message
        })

    }


}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Boyle bir kullanici bulunamadi!" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(500).json({ message: "Yanlis sifre girdiniz!" })
    }

    try {
        //jwt token olustur
        const token = jwt.sign({
            userId: user._id,
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } //token suresi 1 saat
        );

        //token; http-only cookie ekle
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "Basariyla giris yapildi",
            user,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Giris yaparken bir hata olustu",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now())
    }
    return res.status(200).cookie("token", null, cookieOptions).json({ message: "Cikis islemi basarili" })
}


const forgetPassword = async (req, res) => {
    //kullanici var mi kontrol et 
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Boyle bir kullanici bulunamadi" })
    }

    //token olusturmak icin: crypto node.js icinde olan bi module
    //kullaniciya ozel zaman asimli reset token olusturmamiz gerekir
    const resetToken = crypto.randomBytes(20).toString('hex');
    //tokeni hashleyip modele ekledik  
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 dakida gecerli
    await user.save({ validateBeforeSave: false }); // sadece token kaydetsin

    //sifre sifirlama linki
    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Şifre sıfırlamak için bu linke tıkla:\n\n${resetUrl}\n\nBu bağlantı 15 dakika içinde geçerliliğini yitirecek.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Sifre Sifirlama Talebi`,
            message,
        });

        res.status(200).json({
            succes: true,
            message: `Şifre sıfırlama bağlantısı ${user.email} adresine gönderildi.`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "Mail gonderilemedi", error: error.message })
    }

}

const resetPassword = async (req, res) => {
    try {    //token'i hashleyerek db'de arama yap
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        //token'a sahip ve suresi gecmemis kullaniciyi bul 
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Gecersiz veya suresi gecmis token" });
        }

        //yeni sifreyi kaydet
        const newPassword = req.body.password;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Sifre en az 6 karakter olmali." });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: "Sifre basariyla sifirlandi.Lutfen giris yapiniz." })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Sifre sifirlama sirasinda bir hata olustu.",
            error: error.message,
        });
    }
}

const userDetail = async (req, res) => {
    const { user } = User.findById(req.params.id);
    res.status(200).json({
        user
    })
}
module.exports = { register, login, logout, forgetPassword, resetPassword, userDetail }