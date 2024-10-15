import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import { toast } from 'react-toastify';
import axios from 'axios';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // cart total
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.forEach((item) => {
                total += item.price;
            });
            return total.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR'
            });
        } catch (error) {
            console.log(error);
        }
    };

    // remove cart item
    const removeCartItem = (pid) => {
        try {
            const updatedCart = cart.filter(item => item._id !== pid);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (error) {
            console.log(error);
        }
    };

    // get payment token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    // handle payment
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`http://localhost:8080/api/v1/product/braintree/payment`, {
                nonce,
                cart
            });
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/dashboard/user/orders');
            toast.success('Payment Completed Successfully');
        } catch (error) {
            setLoading(false);
            console.error('Error processing payment:', error);
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row p-3'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length ? `You Have ${cart?.length} items in your cart ${auth?.token ? '' : 'Please Login to checkout'}` : "Your Cart is Empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        {cart?.map((p) => (
                            <div className='row mb-2 p-3 card flex-row' key={p._id}>
                                <div className='col-md-4 p-1'>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: '230px', width: "200px" }} />
                                </div>
                                <div className='col-md-8 p-2'>
                                    <h5 className='p-2'>{p.name}</h5>
                                    <h5 className='p-2'>{p.description.substring(0, 30)}</h5>
                                    <h4 className='p-2' style={{ color: 'red' }}>Price: {p.price}</h4>
                                    <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-5 ms-1 text-center'>
                        <h2>Cart Summary</h2>
                        <p>Total checkout</p>
                        <hr />
                        <h4>Total: {totalPrice()} </h4>
                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3 p-3'>
                                    <h4>Current Address</h4>
                                    <h5 className='p-3'>{auth?.user?.address}</h5>
                                    <button className='btn btn-outline-warning p-3' onClick={() => {
                                        navigate('/dashboard/user/profile');
                                    }}>Update Address</button>
                                </div>
                            </>
                        ) : (
                            <div className='mb-3'>
                                {auth?.token ? (
                                    <button className='btn btn-outline-warning p-3' onClick={() => {
                                        navigate('/dashboard/user/profile');
                                    }}>Update Address</button>
                                ) : (
                                    <button className='btn btn-outline-warning p-3' onClick={() => {
                                        navigate('/login', {
                                            state: '/cart'
                                        });
                                    }}>Please Login to Checkout</button>
                                )}
                            </div>
                        )}
                        <div className='mt-2'>
                            {clientToken && (
                                <>
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: 'vault'
                                            }
                                        }}
                                        onInstance={(instance) => setInstance(instance)}
                                    />
                                    <button className='btn btn-primary' onClick={handlePayment} disabled={loading}>{loading ? 'Processing...' : 'Make Payment'}</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
