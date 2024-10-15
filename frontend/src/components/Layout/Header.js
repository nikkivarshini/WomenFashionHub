import React from 'react';
import {Link, NavLink} from 'react-router-dom'
import Logo from './images/logo.png';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';


const Header = () => {
  const [auth,setAuth]=useAuth();
  const [cart,setCart]=useCart();
  const categories=useCategory()
  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({
      user: null,
      token: ''
    });
    toast.success('Logged out successfully!',{
      position: 'top-center', 
      autoClose: 2000
    });
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary with-background-image">
      <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
      <NavLink to='/' className="navbar-brand " >
      <img src={Logo} alt="Logo" />
      </NavLink>
      <ul className="navbar-nav mx-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item ">
          <SearchInput />
      </li>
        <li className="nav-item">
          <NavLink to='/' className="nav-link" >Home</NavLink>
        </li>
        <li className="nav-item dropdown">
          <Link to={'/categories'} className="nav-link dropdown-toggle" data-bs-toggle="dropdown" >
            Category
          </Link>
          <ul className="dropdown-menu">
            <li>
            <Link className="dropdown-item"to={'/categories'}>All Categories</Link>
            </li>
            {categories?.map(c => (
              <li key={c.id}>
                <Link className="dropdown-item"to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </li>
        {auth.user ? (
              <>
               <li className="nav-item dropdown">
                  <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {auth?.user?.name}
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li><NavLink to={`/dashboard/${auth?.user.role===1 ? 'admin' : 'user'}`} className="dropdown-item" >Dashboard</NavLink></li>
                    <li>
                  <NavLink onClick={handleLogout} to='/login' className="dropdown-item">Logout</NavLink>
                </li>
                </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to='/register' className="nav-link" href="#">SignUp</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/login' className="nav-link" href="#">Login</NavLink>
                </li>
              </>
            )}
        <li className="nav-item">
          <Badge count={cart?.length} showZero>
          <NavLink to='/cart' className="nav-link" href="#">Cart</NavLink>
          </Badge>
        </li>
      </ul>
    </div>
  </div>
</nav>

    </>
  )
}

export default Header