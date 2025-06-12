const user = require('../models/user.js');
const jwt = require('jsonwebtoken');

//kimlik dogrulama
const authenticationMid = async (req, res, next) => {
    const { token } = req.cookies;
    //kisi giris yaptiysa eger o tokeni verify et 
    //tokenin suresi gecmis mi? gercekten giris yapmis mi?

    if (!token) {
        return res.status(401).json({ success: false, message: "Token gerekli, erişim reddedildi." });
    }
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedData) {
            return res.status(401).json({ success: false, message: "Gecersiz token" })
        }

        //kullaniciyi db'den bul 
        loggedInUser = await user.findById(decodedData.userId);
        if (!loggedInUser) {
            return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı." });
        }

        //kullaniciyi requeste ekle
        req.user = loggedInUser;
        next();


    } catch (error) {
        return res.status(401).json({ success: false, message: "Geçersiz veya süresi dolmuş token." });
    }

}

//admin kontrolu
// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ success: false, message: "Admin yetkisi gerekli." });
//     }
//     next();
// };

/*
 Role bazli sistem(Role-based Access Control)
 daha olceklenebilir bakimi kolay ve esnek bir proje icin
 amac tek bir isAdmin yerine dinamik olarak hangi rollerin erisimi oldugunu belirlemek
 */

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bu islem icin admin yetkisi gerekli!"
            })
        }
        next();
    }
}

module.exports = { authenticationMid, authorizeRoles }