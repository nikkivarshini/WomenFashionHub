import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { Select } from 'antd';
const { Option } = Select;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const [changeStatus, setChangeStatus] = useState("");
    const [status, setStatus] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Canceled"]);

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/v1/auth/all-orders`);
            setOrders(data); // Update orders state with fetched data
        } catch (error) {
            console.log("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getOrders();
            console.log("Status:", status);
        }
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`http://localhost:8080/api/v1/auth/order-status/${orderId}`, { status: value });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Layout>
            <div className='row p-3'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Orders</h1>
                    {orders.map((order, i) => (
                        <div key={order._id} className='border shadow mb-3'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Buyer</th>
                                        <th scope='col'>Order Date</th>
                                        <th scope='col'>Payment</th>
                                        <th scope='col'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>
                                        <Select onChange={(value) => handleChange(order._id,value)} defaultValue={order?.status}>
                                            {status.map((s, i) => (
                                                <Option key={i} value={s}>{s}</Option>
                                            ))}
                                        </Select>
                                        </td>
                                        <td>{order.buyer?.name}</td>
                                        <td>{moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>{order.payment.success ? "Success" : "Failed"}</td>
                                        <td>{order.products?.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='container'>
                                {order.products?.map((p) => (
                                    <div className='row mb-2 p-3 card flex-row' key={p._id}>
                                        <div className='col-md-4 p-1'>
                                            <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: '230px', width: "200px" }} />
                                        </div>
                                        <div className='col-md-8 p-2'>
                                            <h5 className='p-2'>Name: {p.name}</h5>
                                            <h5 className='p-2'>Description: {p.description?.substring(0, 30)}</h5>
                                            <h4 className='p-2' style={{ color: 'red' }}>Price: {p.price}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default AdminOrders;
