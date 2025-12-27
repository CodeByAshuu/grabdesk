
import Landing from './pages/Landing'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Blog from './pages/Blog';  
import Contact from './pages/Contact';
import './App.css'
import Login from './pages/Login';
import WishlistPage from './pages/WishlistPage';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Signup from './pages/Signup';
import ScrollToTop from './components/ScrollToTop';
import AdminDashbord from './admin/AdminDashboard';
import FashionWebsite from './components/FashionWebsite';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <>
      <ToastProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/home' element={<Home />} />
              <Route path='/product' element={<Product />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/checkout' element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path='/cart' element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path='/contact' element={<Contact />} />
              <Route path='/blog' element={<Blog />} />
              <Route path='/admindashbord' element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashbord />
                </ProtectedRoute>
              } />
              <Route path='/wishlist' element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </ToastProvider>


    </>
  )
}

export default App
