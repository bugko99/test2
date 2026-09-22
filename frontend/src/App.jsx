import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Promotions from './pages/Promotions'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import UserOrders from './pages/UserOrders'
import MyGames from './pages/MyGames'
import Wallet from './pages/Wallet'
import SellerDashboard from './pages/Seller/SellerDashboard'
import SellerProducts from './pages/Seller/SellerProducts'
import SellerInventory from './pages/Seller/SellerInventory'
import SellerOrders from './pages/Seller/SellerOrders'
import SellerSales from './pages/Seller/SellerSales'
import SellerWithdraw from './pages/Seller/SellerWithdraw'
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSellers from './pages/Admin/AdminSellers';
import AdminGames from './pages/Admin/AdminGames';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminKeys from './pages/Admin/AdminKeys';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminPayments from './pages/Admin/AdminPayments';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';
import AdminCoupons from './pages/Admin/AdminCoupons';
import AdminPromotions from './pages/Admin/AdminPromotions';
import AdminReviews from './pages/Admin/AdminReviews';
import AdminDisputes from './pages/Admin/AdminDisputes';
import AdminReports from './pages/Admin/AdminReports';
import AdminSettings from './pages/Admin/AdminSettings';
import './App.css';

// Placeholder component for routes
const PlaceholderPage = ({ title }) => (
  <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
    <h1 style={{ color: 'var(--text-muted)' }}>{title}</h1>
  </div>
);

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`)
        const data = await response.json()
        setApiStatus(`API: ${data.status}, DB: ${data.db}`)
      } catch (error) {
        setApiStatus('API Disconnected')
      }
    }
    fetchStatus()
  }, [])

  return (
    <Router>
      <div className="app-container">
        <Sidebar auth={auth} />
        
        <main className="main-content">
          <header className="top-header">
            {auth?.role === 'admin' ? (
              <div className="system-status">
                <span className={`status-indicator ${apiStatus.includes('ok') ? 'online' : 'offline'}`}></span>
                {apiStatus}
              </div>
            ) : (
              <div></div>
            )}
            <div className="user-profile">
              {auth ? (
                <div className="user-menu">
                  <span className="welcome-text">Hi, {auth.username}</span>
                  <div className="avatar">{auth.username.charAt(0).toUpperCase()}</div>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <Link to="/login" className="login-btn">Login</Link>
              )}
            </div>
          </header>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:category?" element={<Shop />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/my-games" element={<MyGames />} />
            
            <Route path="/wallet/*" element={<Wallet />} />

            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
            
            {/* Seller */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/inventory" element={<SellerInventory />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/sales" element={<SellerSales />} />
            <Route path="/seller/withdraw" element={<SellerWithdraw />} />
            <Route path="/seller/settings" element={<PlaceholderPage title="⚙️ ตั้งค่าร้านค้า" />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/games" element={<AdminGames />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/keys" element={<AdminKeys />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/promotions" element={<AdminPromotions />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="/settings" element={<PlaceholderPage title="⚙️ ตั้งค่า" />} />
            <Route path="/support" element={<PlaceholderPage title="🆘 Support" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
