import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import {toast} from 'react-toastify';
import {Select,Modal} from 'antd'
const { Option } = Select;

const UpdateProduct = () => {
  const navigate=useNavigate()
  const params=useParams()
  const [categories,setCategories]=useState([])
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [price,setPrice]=useState('')
  const [photo,setPhoto]=useState('')
  const [category,setCategory]=useState('')
  const [quantity,setQuantity]=useState('')
  const [shipping,setShipping]=useState('')
  const [id,setId]=useState('')
  const [visible, setVisible] = useState(false);

  
  //get single product
  const getSingleProduct= async()=>{
    try {
        const {data}= await axios.get(`http://localhost:8080/api/v1/product/get-product/${params.slug}`)
        setName(data.product.name)
        setId(data.product._id)
        setDescription(data.product.description)
        setPrice(data.product.price)
        setQuantity(data.product.quantity)
        setShipping(data.product.shipping)
        setCategory(data.product.category._id)

    } catch (error) {
        console.log(error)
        toast.error()
    }
  }

  useEffect(()=>{
    getSingleProduct()
  },[])

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    getAllCategory(); 
  }, []);

//update product
const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("quantity", quantity);
    photo && productData.append("photo", photo);
    productData.append("category", category);
    
    const { data } = await axios.put(`http://localhost:8080/api/v1/product/update-product/${id}`, productData);
    
    if (data?.success) {
      toast.success('Product Updated successfully');
      navigate('/dashboard/admin/products')
    } else {
      toast.error(data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error('Something went wrong');
  }
};

//delete product
const showModal = () => {
    setVisible(true);
  };

 const handleOk = async () => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/api/v1/product/delete-product/${id}`);
      toast.success('Product Deleted successfully');
      setVisible(false);
      navigate('/dashboard/admin/products');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false); 
  };


  return (
    <Layout title={'Admin-Create Product'}>
        <div className='container-fluid m-3 p-3'>
        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className='col-md-9'>
                <h1>Update Product</h1>
                <div className='m-1 w-75' >
                <Select variant={false} placeholder='Select a category' size='large' showSearch className='form-select mb-3' onChange={(value)=>{console.log("Selected Category ID:", value);setCategory(value)}} value={category}>
                  {categories?.map(c => (
                  <Option key={c._id} value={c._id}>{c.name}</Option>
                  ))}
                </Select>
                <div className='mb-3'>
                  <label className='btn btn-outline-secondary col-md-12'>
                    {photo? photo.name:"Upload Photo"}
                  <input type='file' name='photo' accept='image/*' onChange={(e)=>setPhoto(e.target.files[0])} hidden></input>
                  </label>
                </div>
                <div className='mb-3'>
                  {photo ?(
                    <div className='text-center'>
                      <img src={URL.createObjectURL(photo)} alt='product_photo' height={'200px'}className='img img-responsive'/>
                    </div>
                  ):(
                    <div className='text-center'>
                    <img src={`/api/v1/product/product-photo/${id}`} alt='product_photo' height={'200px'}className='img img-responsive'/>
                  </div> 
                  )}
                </div>
                <div className='mb-3'>
                  <input type='text' value={name} placeholder='Enter Product Name' className='form-control' onChange={(e)=>setName(e.target.value)}/>
                  </div>
                  <div className='mb-3'>
                  <textarea type='text' value={description} placeholder='Enter Product description' className='form-control' onChange={(e)=>setDescription(e.target.value)}/>
                  </div>
                  <div className='mb-3'>
                  <input type='number' value={price} placeholder='Enter Product price' className='form-control' onChange={(e)=>setPrice(e.target.value)}/>
                  </div>
                  <div className='mb-3'>
                  <input type='number' value={quantity} placeholder='Enter Product quantity' className='form-control' onChange={(e)=>setQuantity(e.target.value)}/>
                  </div>
                  <div className='mb-3'>
                    <Select
                    variant={false}
                    placeholder='Select Shipping'
                    size='L'
                    showSearch
                    className='form-select mb-3'
                    onChange={(value)=>{
                      setShipping(value);
                    }} value={shipping? "No":"Yes"}>
                      <Option value='1'>Yes</Option>
                      <Option value='0'>No</Option>
                    </Select>
                  </div>
                  <div className='d-flex mb-3 '>
                  <div className='mb-3 me-2'>
                    <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
                  </div>
                  <div className='mb-3'>
                    <button className='btn btn-danger' onClick={showModal}>DELETE PRODUCT</button>
                  </div>
                  </div>
                  <Modal
                    title="Confirm Delete"
                    open={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Yes"
                    cancelText="No"
                >
                <p>Are you sure you want to delete the product?</p>
                </Modal>
                </div>
            </div>
        </div>
        </div>
    </Layout>
  )
}

export default UpdateProduct