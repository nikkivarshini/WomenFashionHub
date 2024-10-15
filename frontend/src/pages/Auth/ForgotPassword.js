import React,{useState} from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify';
require('../../styles/AuthStyles.css')

const ForgotPassword = () => {
    const [email,setEmail]=useState("")
    const [newPassword,setNewPassword]=useState("")
    const [answer,setAnswer]=useState("")
    const navigate=useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const res= await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,{
            email,newPassword,answer
            });
            if(res && res.data.success){
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
              })
        }        
    }

  return (
    <Layout title={'Forgot Password'}>
         <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <h4 className='title'>RESET PASSWORD</h4>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="email" className="form-control" id="email" placeholder='Enter Your Email'value={email} onChange={(e)=>setEmail(e.target.value)}required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder='Enter Your New  Password'value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}required/>
                </div>
                <div className="mb-3" style={{width:'280px'}}>
                    <input type="text" className="form-control" id="answer" placeholder='Enter Your Favourite Sports'value={answer} onChange={(e)=>setAnswer(e.target.value)}required/>
                </div>
                <button type="submit" className="btn btn-primary">RESET</button>
                </form>

        </div>
    </Layout>
  )
}

export default ForgotPassword