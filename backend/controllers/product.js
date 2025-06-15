const Product = require("../models/product.js");
const ProductQuery = require("../utils/productQuery.js");
const cloudinary = require('../config/cloudinary.js')

const allProducts = async (req, res) => {
    const resultPerPage = 10;
    const productQuery = new ProductQuery(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
        .sort();

    const products = await productQuery.query;

    res.status(200).json({
        products,
    });
};

const adminProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        products
    })
}

const detailProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
        product,
    });
};

//admin
const createProduct = async (req, res) => {
    /*
    cloudinary
    bu yapi hem tek hem coklu gorsel yuklemeyi destekler ve gorsellerin guvenli sekilde saklanmasini saglar
    gorseller icin bos bir dizi olustur 
   */
    let images = [];
    //tek gorsel mi coklu mu kontrol et
    if (typeof req.body.images === "string") {
        //eger tek bir gorsel string olarak gelmisse diziye ekle
        images.push(req.body.images);
    } else {
        //zaten dizi halindeyse direkt ata
        images = req.body.images;
    }

    let allImage = []; //Cloudinary'e yüklenecek tüm görseller için boş dizi
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products", //gorsellerin yuklenecegi klasor
        });
        //yuklenen gorsel bilgilerini dizide sakla
        allImage.push({
            public_id: result.public_id, //cloudinary'deki benzersiz id
            url: result.secure_url, // https erisim url'si
        });

        /* back-ende gelen gorseli karsilayacagiz ama servera kaydetmeden cloudinary hesabimiza gonderip sadece public_id ve url'i db'ye kaydedecegiz
                or: ******gelen request 
                {
                    "name": "Örnek Ürün",
                    "price": 100,
                    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."]
                }
                    ******cloudinary ciktisi
                {
                    "public_id": "products/xqy3kf2j8dpg0vbstl4a",
                    "secure_url": "https://res.cloudinary.com/demo/image/upload/v123/products/xqy3kf2j8dpg0vbstl4a.jpg"
                }
                    ******veritabani kaydi
                {
                    "_id": "60f7b9b0e6b3a1b9e4c8a7d2",
                    "name": "Örnek Ürün",
                    "price": 100,
                    "images": [
                        {
                            "public_id": "products/xqy3kf2j8dpg0vbstl4a",
                            "url": "https://res.cloudinary.com/demo/image/upload/v123/products/xqy3kf2j8dpg0vbstl4a.jpg"
                        }
                ]
    }
             */
    }

    //orijinal request'in images alanını güncelle
    req.body.images = allImage;
    req.body.user = req.user.id; //user kullandigimiz icin req.user.id verdik

    const product = await Product.create(req.body);

    res.status(201).json({
        product,
    });
};
//admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    //db'den urun sildigimizde cloudinary'deki gorselleri de silmemiz gerekir
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({
        message: "Urun basariyla silindi",
    });
};

const updateProduct = async (req, res) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    //disaridan gorsel geldiyse
    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id);
        }
    }

    let allImage = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
        });
        allImage.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = allImage;

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        product,
    });
};

const createReview = async (req, res, next) => {
    const { productId, comment, rating } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        comment,
        rating: Number(rating)
    }

    const product = await Product.findById(productId);

    product.reviews.push(review);

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.rating = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        message: "Yorum basariyla kaydedildi"
    })
}

module.exports = {
    allProducts,
    detailProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    createReview,
    adminProducts
};
