import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import moment from 'moment'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/auth/orders`);
      setOrders(data); // Update orders state with fetched data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={'Your Orders'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h3 className='text-center'>All Orders</h3>
            {orders.map((order, i) => (
              <div key={order._id} className='border shadow mb-3'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>#</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Buyer</th>
                      <th scope='col'>Orders</th>
                      <th scope='col'>Payment</th>
                      <th scope='col'>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{order.status}</td>
                      <td>{order.buyer.name}</td>
                      <td>{moment(order?.createAt).fromNow()}</td>
                      <td>{order.payment.success? "Success":"Failed"}</td>
                      <td>{order.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className='container'>
                {order?.products?.map((p) => (
                            <div className='row mb-2 p-3 card flex-row' key={p._id}>
                                <div className='col-md-4 p-1'>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: '230px', width: "200px" }} />
                                </div>
                                <div className='col-md-8 p-2'>
                                    <h5 className='p-2'>Name: {p.name}</h5>
                                    <h5 className='p-2'>Description: {p.description.substring(0, 30)}</h5>
                                    <h4 className='p-2' style={{ color: 'red' }}>Price: {p.price}</h4>
                                </div>
                            </div>
                        ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default Orders