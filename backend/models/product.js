const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
    },
    category: {
        type: String,
        required: true
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }

    ],
    rating: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                requiued: true,
            },
            rating: {
                type: Number,
                required: true
            },
        }
    ]
}, { timestamps: true }); //timestamps ile her veri eklendiginde createdAt ve veri her guncellendiginde updateAt degeri atanir
//loglama ve siralama gibi islemlerde kullanilir

module.exports = mongoose.model('Product', productSchema)