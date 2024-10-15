import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';
import { Link } from 'react-router-dom';
import shopbycat from './images/shopbycat.png';

const Categories = () => {
    const categories = useCategory();

    return (
        <Layout>
            <div className='container'>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={shopbycat} alt='all products' style={{ textAlign: 'center', width: '1200px' }} />
                </div>
                <div className='row'>
                    {categories.map((c) => (
                        <div className='col-md-3 p-3' key={c._id}>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{c.name}</h5>
                                    <Link to={`/category/${c.slug}`} className='btn btn-primary'>View Products</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Categories;
