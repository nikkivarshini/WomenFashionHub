import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams ,useNavigate} from 'react-router-dom'
import { useCart } from '../context/cart'
import {toast} from 'react-toastify'

const CategoryProduct = () => {
    const [products,setProducts]=useState([])
    const [category,setCategory]=useState([])
    const [cart,setCart]=useCart()
    const params=useParams()
    const navigate=useNavigate()

    useEffect(()=>{
        if(params?.slug) getProductsByCat()
    },[params?.slug])
    const getProductsByCat =async()=>{
        try {
            const {data}= await axios.get(`http://localhost:8080/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Layout>
        <div className='container p-3'>
            <h3 className='text-center'>{category?.name}</h3>
            <h6 className='text-center'>{products?.length} Result Found</h6>
            <div className='d-flex flex-wrap'>
          {products?.map(p => (
        <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
          <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{height:'400px'}} />
          <div className="card-body">
            <h5 className="card-title">{p.name}</h5>
            <p className="card-text">{p.description.substring(0,30)}...</p>
            <p className="card-text"><h5>price:{p.price}</h5></p>
            <button class="btn  me-2" style={{backgroundColor:'lavender'}} onClick={()=>navigate(`/product/${p.slug}`)}>More Details</button>
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

export default CategoryProduct