const User = require('../model/user.js');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('bcryptjs');

const register = async (req, res) => {
    const { name, email, password } = req.body;

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
        minLowercase1,
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
            password: passwordHash
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
        return res.status(400).json({ message: "Boyle bir kullanici bulunamadi!" });
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

    const logout = async (req, res) => {
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now())
        }
        res.status(200).cookie("token", null, cookieOptions).json({ message: "Cikis islemi basarili" })
    }

    const forgetPassword = async (req, res) => {

    }

    const resetPassword = async (req, res) => {

    }

    module.exports = { register, login, logout, forgetPassword, resetPassword }