import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getProductDetailAsync } from '../redux/productSlice';
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector(((store) => store.product))

  useEffect(() => {
    if (id) {
      dispatch(getProductDetailAsync(id))
    }
  }, [dispatch, id])

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    adaptiveHeight: true
  }

  if (isLoading) return <div className="text-center py-8">Yükleniyor...</div>
  if (!product) return <div className="text-center py-8">Ürün bulunamadı</div>

  console.log(product)


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="border rounded-lg overflow-hidden">
            {product.images?.length > 0 ? (
              <Slider {...sliderSettings}>
                {product.images.map((image, index) => (
                  <div key={index} className="h-96">
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">Görsel bulunamadı</span>
              </div>
            )}
          </div>
        </div>


        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-3xl font-semibold text-indigo-600 mb-4">
            {product.price} ₺
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Ürün Açıklaması</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Ürün Puanı</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.rating}</p>

          </div>

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Sepete Ekle
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className='w-full mb-6'>
        <h2 className='text-xl font-semibold my-2'>Degerlendirmeler</h2>
        {
          product.reviews?.length > 0 ? (
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id} className='border-b pb-4 last:border-b-0'>
                  <div className='flex flex-col mb-1'>
                    <span className='font-medium'>{review.name}</span>
                    <span className='ml-2 text-yellow-500'>
                      <span className='text-black mr-1'>{review.rating}</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className='text-gray-700'>{review.comment}</p>
                  <p className='text-gray-500 text-sm mt-1'>
                    {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>Henüz değerlendirme yapılmamış</p>
          )
        }
      </div>

    </div>
  )
}

export default ProductDetail