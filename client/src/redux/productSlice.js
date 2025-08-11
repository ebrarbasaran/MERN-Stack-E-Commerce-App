import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    products: [],
    product: {},
    isLoading: false,
}

export const getProductsAsync = createAsyncThunk(
    'getProductsAsync',
    async() => {
        const res = await axios.get(`http://localhost:4000/products`)
        return res.data;
    }
)
export const getProductDetailAsync = createAsyncThunk(
    'getProductDetail',
    async(id) =>{
        const res = await axios.get(`http://localhost:4000/products/${id}`)
        return res.data;
    }
)

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProductsAsync.pending,(state) => {
            state.isLoading = true;
        })
        builder.addCase(getProductsAsync.fulfilled,(state,action) => {
            state.isLoading = false;
            state.products = action.payload
        })
        builder.addCase(getProductDetailAsync.pending,(state) => {
            state.isLoading = true;
        })
        builder.addCase(getProductDetailAsync.fulfilled,(state,action) => {
            state.isLoading = false;
            state.product = action.payload.product
        })
    }
})

export const { } = productSlice.actions

export default productSlice.reducer