import Layout from '../components/Layout/Layout';
import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/cart';
import {toast} from 'react-toastify'

const ProductDetails = () => {
    const params=useParams();
    const [product,setProduct]=useState({})
    const [cart,setCart]=useCart()
    const [relatedProducts,setRelatedProducts]=useState([])


    useEffect(()=>{
       if(params?.slug) getProduct();
    },[params?.slug])
    //get product
    const getProduct= async(req,res)=>{
        try {
            const {data}= await axios.get(`http://localhost:8080/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProducts(data?.product._id,data?.product.category._id)
        } catch (error) {
            console.log(error)
        }
    }

    //get similar products
    const getSimilarProducts= async(pid,cid)=>{
        try {
            const {data}= await axios.get(`http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Layout>
        <div className='row container mt-2'>
            <div className='col-md-4 mt-2'>
            <img src={`/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} style={{height:'400px',width:'400px'}} />
            </div>
            <div className='col-md-6 mt-2'>
                <h1 className='p-3'>Product Details</h1>
                <h6 className='p-2'>Name: {product.name}</h6>
                <h6 className='p-2'>Description: {product.description}</h6>
                <h6 className='p-2'>Price: {product.price}</h6>
                <h6 className='p-2'>Category: {product.category?.name}</h6>
                <button  style={{backgroundColor:"pink"}} className='btn p-2'onClick={()=>{
              setCart([...cart,product])
              localStorage.setItem('cart',JSON.stringify([...cart,product]))
              toast.success('Item Added to Cart')}}>Add to Bag</button>
            </div>
        </div>
        <hr/>
        <div className='row p-5 container'>
            <h5>Similar products</h5>
            {relatedProducts.length < 1 && (<p className='text-center'>No Simialr Products Found</p>)}
            <div className='d-flex flex-wrap'>
          {relatedProducts?.map(p => (
        <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
          <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{height:'400px'}} />
          <div className="card-body">
            <h5 className="card-title">{p.name}</h5>
            <p className="card-text">{p.description.substring(0,30)}...</p>
            <p className="card-text"><h5>price:{p.price}</h5></p>
            <button style={{backgroundColor:"pink"}} className='btn' 
            onClick={()=>{
              setCart([...cart,p])
              localStorage.setItem('cart',JSON.stringify([...cart,p]))
              toast.success('Item Added to Cart')}}>Add to Bag</button>          
              </div>
        </div>
      ))}
          </div>
        </div>
    </Layout>
  )
}

export default ProductDetails