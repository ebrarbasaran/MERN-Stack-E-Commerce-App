const { search } = require("../routes/product");

class ProductQuery {
    constructor(query, queryStr) {
        this.query = query; //mongodb sorgusu or: product.find()
        this.queryStr = queryStr; //url uzerinden gelen parametrelerdir backend'de req.query olarak alınır
    }

    //http://localhost:4000/products?category=elbise&minPrice=100

    // const { keyword, sort, page, limit } = req.query;
    // req.query her zaman string değerler döner
    //  sayı ile işlem yapacaksan parseInt() kullanman gerekir

    //arama
    search() {
        //eger urlde keyword varsa arama yapilacak
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i" //buyuk kucuk harf duyarsiz insensitive
            }
        } : {}

        this.query = this.query.find({ ...keyword }) //name alaninda keyworde gore filtreleme
        return this;
    }

    //filtreleme
    filter() {
        const queryCopy = { ...this.queryStr }; //kopyasini aliyoruz

        //arama, sayfalama gibi şeyler filtre değil
        const removeFields = ["search", "sort", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key])
        //bu alanlari querCopy icinden siliyoruz

        let queryStr = JSON.stringify(queryCopy); //string hale getiriyoruz ki regex ile duzenleyebilelim
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        //mongoDB'e uygula 
        this.query = this.query.find(JSON.parse(queryStr)); //string halini tekrar JSON formatına çeviriyoruz ve find ile mongoDB'e gonderiyoruz
        return this;

    }

    //sayfalama
    pagination(resultPerPage) {
        const currentPage = this.queryStr.page || 1; //urlden gelen page degerini alir yoksa default 1 
        const skip = resultPerPage * (currentPage - 1); //kac veri atlanmali onu hesapla

        this.query = this.query.limit(resultPerPage).skip(skip); //MongoDB sorgusuna limit ve skip eklenir
        return this;
    }

    //siralama
    sort() {
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            //gelen siralama degerlerini virgul ile ayirir ve araya bosluk koyar
            //cunku mongoose .sort() icinde "price -rating" gibi bosluklu string ister
            //or ?sort=price,-rating → "price -rating"
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
            //eğer kullanıcı sort parametresi göndermezse, veriler oluşturulma tarihine göre yeni en üstte olacak şekilde sıralanır
        }
        return this;
    }

}

module.exports = ProductQuery