import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(`/product/${product?._id}`)} 
        className='w-[250px] h-[320px] border border-gray-300 shadow rounded hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/50 cursor-pointer'
        >
            {
                product?.images?.map((image, i) => (
                    <div key={i}>
                        <img src={image.url} alt="" className='w-full h-[200px] object-cover p-2' />
                    </div>

                ))
            }
            <div>
                <h2 className='mt-2 p-2 font-semibold'>{product?.name}</h2>
                <p className='text-gray-500 text-[12px] p-1 truncate'>{product?.description}</p>
                <p className='flex justify-end items-end p-1 mr-1'>{product?.price} ₺</p>
            </div>
        </div>
    )
}

export default ProductCard