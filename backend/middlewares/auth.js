const user = require('../models/user.js');
const jwt = require('jsonwebtoken');

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
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin yetkisi gerekli." });
    }
    next();
};

module.exports = { authenticationMid, isAdmin }