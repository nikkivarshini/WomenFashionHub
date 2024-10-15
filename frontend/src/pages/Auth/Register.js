import React,{useState} from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';
require('../../styles/AuthStyles.css')


const Register = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [phone,setPhone]=useState("")
    const [address,setAddress]=useState("")
    const [answer,setAnswer]=useState("")
    const navigate=useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const res= await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,{
                name,email,password,phone,address,answer
            });
            if( res && res.data.success){
                toast.success(res && res.data.message,{
                    position: 'top-center', 
                    autoClose: 2000
                  });                
                navigate('/login');
            }else{
                toast.error(res.data.message,{
                    position: 'top-center', 
                    autoClose: 2000
                  });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong",{
                position: 'top-center', 
                autoClose: 2000
              })        }        
    }

  return (
    <Layout title={"Register"}>
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <h4 className='title'>REGISTER FORM</h4>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="name" placeholder='Enter Your Name'value={name} onChange={(e)=>setName(e.target.value)} required/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="email" className="form-control" id="email" placeholder='Enter Your Email'value={email} onChange={(e)=>setEmail(e.target.value)}required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder='Enter Your Password'value={password}onChange={(e)=>setPassword(e.target.value)}required/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="phone"  placeholder='Enter Your Phone number'value={phone} onChange={(e)=>setPhone(e.target.value)} required/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <textarea type="text" className="form-control" id="address" placeholder='Enter Your Address'value={address} onChange={(e)=>setAddress(e.target.value)} required/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="answer"  placeholder='what is your favourite sports'value={answer} onChange={(e)=>setAnswer(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>

        </div>
    </Layout>
  )
}

export default Register