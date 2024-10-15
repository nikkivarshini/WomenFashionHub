import Layout from '../components/Layout/Layout'
import React from 'react'
import { useSearch } from '../context/search'
import { useCart } from '../context/cart'
import {toast} from 'react-toastify'

const Search = () => {
    const [values,setValues]=useSearch()
    const [cart,setCart]=useCart()
  return (
    <Layout>
        <div className='container'>
            <div className='text-center'>
                <h1 className='p-3'>Search Results</h1>
                <h6>{values?.results.length<1 ? "No Products Found" :`Found ${values?.results.length}`}</h6>
                <div className='d-flex flex-wrap mt-4'>
                {values?.results.map(p => (
                <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{height:'400px'}} />
                <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <p className="card-text"><h5>price:{p.price}</h5></p>
                    <button class="btn  me-2" style={{backgroundColor:'lavender'}}>More Details</button>
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
        </div>
    </Layout>
  )
}

export default Search