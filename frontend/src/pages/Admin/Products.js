import React,{useState,useEffect} from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products,setProducts]=useState([]);

    //get all products
    const getAllProducts = async ()=>{
        try {
            const {data}=await axios.get(`http://localhost:8080/api/v1/product/get-product`)
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

    useEffect(()=>{
        getAllProducts();
    },[])

  return (
    <Layout>
  <div className='row'>
    <div className='col-md-3 mt-5'>
      <AdminMenu/>
    </div>
    <div className='col-md-9 d-flex flex-wrap'>
      <h1 className='text-center w-100 mt-5'>All Products List</h1>
      {products?.map(p => (
        <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
        <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
          <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{height:'400px'}} />
          <div className="card-body">
            <h5 className="card-title">{p.name}</h5>
            <p className="card-text">{p.description}</p>
          </div>
        </div>
        </Link>
      ))}
    </div>
  </div>
</Layout>

  )
}

export default Products