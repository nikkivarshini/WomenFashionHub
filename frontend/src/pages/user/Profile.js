import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import {toast} from 'react-toastify'
import axios from 'axios'

const Profile = () => {
  const [auth,setAuth]=useAuth()
  const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [phone,setPhone]=useState("")
    const [address,setAddress]=useState("")

    useEffect(()=>{
      const {name,email,phone,address}=auth?.user
      setName(name);
      setEmail(email);
      setPhone(phone);
      setAddress(address);
    },[auth?.user])

    const handleSubmit= async(e)=>{
      e.preventDefault();
      try {
          const {data}= await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`,{
              name,email,password,phone,address
          });
          if(data?.error){
            toast.error(data?.error)
          }else{
            setAuth({...auth,user:data?.updatedUser})
            let ls=localStorage.getItem("auth")
            ls=JSON.parse(ls)
            ls.user=data.updatedUser
            localStorage.setItem('auth',JSON.stringify(ls))
            toast.success("Profile Updated Successfully");
          }
      } catch (error) {
          console.log(error);
          toast.error("Something went wrong",{
              position: 'top-center', 
              autoClose: 2000
            })}        
  }
  return (
    <Layout title={'Your Profile'}>
        <div className='container-fluid  m-3 p-3'>
        <div className='row'>
            <div className='col-md-3'>
                <UserMenu/>
            </div>
            <div className='col-md-9'>
            <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <h4 className='title'>USER PROFILE</h4>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="name" placeholder='Enter Your Name'value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="email" className="form-control" id="email" placeholder='Enter Your Email'value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder='Enter Your Password'value={password}onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="phone"  placeholder='Enter Your Phone number'value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <textarea type="text" className="form-control" id="address" placeholder='Enter Your Address'value={address} onChange={(e)=>setAddress(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">UPDATE</button>
                </form>

        </div>
            </div>
        </div>
        </div>
    </Layout>
  )
}

export default Profile