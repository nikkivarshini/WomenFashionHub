import React,{useState} from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import {useNavigate,useLocation} from 'react-router-dom'
import {toast} from 'react-toastify';
import { useAuth } from '../../context/auth';
require('../../styles/AuthStyles.css')

const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [auth,setAuth]=useAuth();
    const navigate=useNavigate();
    const location=useLocation();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const res= await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{
            email,password
            });
            if(res && res.data.success){
                toast.success(res && res.data.message,{
                    position: 'top-center', 
                    autoClose: 2000
                  });
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token,
                })
                localStorage.setItem('auth',JSON.stringify(res.data))
                navigate(location.state || '/');
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
              })
        }        
    }

  return (
    <Layout title={"Login"}>
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <h4 className='title'>LOGIN FORM</h4>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="email" className="form-control" id="email" placeholder='Enter Your Email'value={email} onChange={(e)=>setEmail(e.target.value)}required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder='Enter Your Password'value={password}onChange={(e)=>setPassword(e.target.value)}required/>
                </div>
                <div className='mb-3' >
                <button type="button" className="btn btn-primary" onClick={()=>{navigate('/forgot-password')}}>Forgot Password</button>
                </div>
                <button type="submit" className="btn btn-primary">LOGIN</button>
                </form>

        </div>
    </Layout>
  )
}

export default Login