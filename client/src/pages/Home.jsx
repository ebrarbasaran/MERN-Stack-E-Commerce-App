import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsAsync } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((store) => store.product)
  useEffect(() => {
    dispatch(getProductsAsync())
  }, [dispatch])

  console.log(products, isLoading);
  return (
    <>
      {
        isLoading ? "Loading..." :
          <div>
            {
              products?.products && <div className='flex justify-center items-center gap-5 my-5 flex-wrap'>
                {
                  products?.products?.map((product, i) => (
                    <ProductCard product={product} key={i} />
                  ))
                }
              </div>
            }
          </div>
      }
    </>
  )
}

export default Home