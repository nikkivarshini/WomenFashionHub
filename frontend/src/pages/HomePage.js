import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import {Carousel, Checkbox,Radio} from 'antd'
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import MainBanner from './images/MainBanner.jpg';
import Carosel2 from './images/Carosel2.png';
import Carosel3 from './images/Carosel3.png';
import AllProd from './images/All Products.png';

const HomePage = () => {
  const navigate=useNavigate();
  const [cart,setCart]=useCart()
  const [products,setProducts]=useState([])
  const [categories,setCategories]=useState([])
  const [checked,setChecked]=useState([])
  const [radio,setRadio]=useState([])
  const [total,setTotal]=useState(0)
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  

 //get all cat
 const getAllCategory = async () => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/v1/category/get-category`);
    if (data?.success) {
      setCategories(data?.category);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  getAllCategory(); 
  getTotal();
}, []);

  //get all products
  const getAllProducts = async ()=>{
    try {
      setLoading(true)
        const {data}=await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`)
        setLoading(false)
        setProducts(data.products);
    } catch (error) {
        console.log(error);
        setLoading(false)
    }
}
useEffect(()=>{
  if(!checked.length || !radio.length)  getAllProducts();
},[checked.length,radio.length])

useEffect(()=>{
  if(checked.length || radio.length)filteredProduct()
},[checked,radio])

  //filter by cat
  const handleFilter =(value,id)=>{
    let all=[...checked]
    if(value){
      all.push(id)
    }else{
      all= all.filter(c=>c!==id)
    }
    setChecked(all);
  }

  //get total count
  const getTotal= async()=>{
    try {
      const {data}=await axios.get(`http://localhost:8080/api/v1/product/product-count`)
      setTotal(data?.total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(page===1)return
    loadMore();
  },[page])
  //load more
  const loadMore=async()=>{
    try {
      setLoading(true)
      const {data}=await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`)
      setLoading(false)
      setProducts([...products,...data?.products])
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  //get filtered product
  const filteredProduct=async()=>{
    try {
      const {data}=await axios.post(`http://localhost:8080/api/v1/product/product-filters`,{checked,radio})
      setProducts(data?.products)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title={"Nikki-The Fashionista Hub"}>
      <div className='row'>
        <div className='col-md-3 p-4'>
          <h6 className='text-center'>Filter by category</h6>
          <div className='d-flex flex-column p-3'>
            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)} className='p-1'>
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h6 className='text-center'>Filter by Price</h6>
          <div className='d-flex flex-column p-3'>
            <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
              {Prices?.map((p)=>(
                <div key={p._id} className='p-1'>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-wrap p-3 ms-5'>
            <button className='btn btn-danger' onClick={()=>window.location.reload()}>RESET FILTERS</button>
          </div>
        </div>
        <div className='col-md-9 p-4'>
        <Carousel autoplay autoPlaySpeed={3000} infiniteLoop >
      <div >
        <img src={MainBanner} alt="Main Banner"style={{width:'960px',height:'450px'}} />
      </div>
      <div  >
        <img src={Carosel2} alt="Carousel 2"style={{width:'960px',height:'450px'}} />
      </div>
      <div >
        <img src={Carosel3} alt="Carousel 3"style={{width:'960px',height:'450px'}} />
      </div>
    </Carousel>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
      <img src={AllProd} alt='all products' style={{ textAlign: 'center' }} />
    </div>          
    <div className='d-flex flex-wrap ms-3'>
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
          <div className='m-2 p-3'>{products && products.length<total && (
            <button className='btn btn-warning' onClick={(e)=>{
              e.preventDefault();
              setPage(page+1);
            }}>
              {loading?"Loading...":"Load more"}
            </button>
          )}</div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage