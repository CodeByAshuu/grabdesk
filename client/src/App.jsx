
import Landing from './pages/Landing'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Studio from './pages/Studio';
import Contact from './pages/Contact';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import ScrollToTop from './components/ScrollToTop';


function App() {

  return (
    <>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/studio' element={<Studio />} />
          <Route path='/admindashbord' element={<AdminDashbord/>}/>
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
