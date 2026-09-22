import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, ShoppingBag, Flame, Heart, ShoppingCart, 
  Package, Gamepad2, Wallet, Store, Settings, 
  HelpCircle, ChevronDown, ChevronRight, Menu, X, Shield
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ auth }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    shop: true,
    wallet: false,
    seller: false,
    admin: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="mobile-toggle" onClick={() => setIsMobileOpen(true)}>
        <Menu size={24} />
      </div>

      <div className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Gamepad2 size={32} className="logo-icon" />
          <h2>BUGKOShop</h2>
          <button className="close-btn" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item" onClick={closeMobileMenu}>
            <Home size={20} />
            <span>หน้าแรก</span>
          </NavLink>

          {/* Shop Menu */}
          <div className="nav-group">
            <div className={`nav-item ${openMenus.shop ? 'active-group' : ''}`} onClick={() => toggleMenu('shop')}>
              <ShoppingBag size={20} />
              <span>ร้านค้า</span>
              {openMenus.shop ? <ChevronDown size={16} className="chevron" /> : <ChevronRight size={16} className="chevron" />}
            </div>
            <div className={`submenu ${openMenus.shop ? 'open' : ''}`}>
              <NavLink to="/shop/all" className="sub-item" onClick={closeMobileMenu}>เกมทั้งหมด</NavLink>
              <NavLink to="/shop/steam" className="sub-item" onClick={closeMobileMenu}>Steam</NavLink>
              <NavLink to="/shop/roblox" className="sub-item" onClick={closeMobileMenu}>Roblox</NavLink>
              <NavLink to="/shop/epic-games" className="sub-item" onClick={closeMobileMenu}>Epic Games</NavLink>
              <NavLink to="/shop/playstation" className="sub-item" onClick={closeMobileMenu}>PlayStation</NavLink>
              <NavLink to="/shop/xbox" className="sub-item" onClick={closeMobileMenu}>Xbox</NavLink>
            </div>
          </div>





          <NavLink to="/cart" className="nav-item" onClick={closeMobileMenu}>
            <ShoppingCart size={20} />
            <span>ตะกร้า</span>
          </NavLink>

          <NavLink to="/orders" className="nav-item" onClick={closeMobileMenu}>
            <Package size={20} />
            <span>คำสั่งซื้อของฉัน</span>
          </NavLink>

          <NavLink to="/my-games" className="nav-item" onClick={closeMobileMenu}>
            <Gamepad2 size={20} />
            <span>รหัสเกมของฉัน</span>
          </NavLink>

          <div className="divider"></div>

          {/* Wallet Menu */}
          <NavLink to="/wallet" className="nav-item" onClick={closeMobileMenu}>
            <Wallet size={20} />
            <span>กระเป๋าเงิน</span>
          </NavLink>

          {/* Seller Center Menu (Admin Only) */}
          {auth?.role === 'admin' && (
            <>
              <div className="nav-group">
                <div className={`nav-item seller-center ${openMenus.seller ? 'active-group' : ''}`} onClick={() => toggleMenu('seller')}>
                  <Store size={20} />
                  <span>Seller Center</span>
                  {openMenus.seller ? <ChevronDown size={16} className="chevron" /> : <ChevronRight size={16} className="chevron" />}
                </div>
                <div className={`submenu ${openMenus.seller ? 'open' : ''}`}>
                  <NavLink to="/seller/dashboard" className="sub-item" onClick={closeMobileMenu}>Dashboard</NavLink>
                  <NavLink to="/seller/products" className="sub-item" onClick={closeMobileMenu}>สินค้า</NavLink>
                  <NavLink to="/seller/inventory" className="sub-item" onClick={closeMobileMenu}>คลังรหัส</NavLink>
                  <NavLink to="/seller/orders" className="sub-item" onClick={closeMobileMenu}>คำสั่งซื้อ</NavLink>
                  <NavLink to="/seller/sales" className="sub-item" onClick={closeMobileMenu}>ยอดขาย</NavLink>
                  <NavLink to="/seller/withdraw" className="sub-item" onClick={closeMobileMenu}>ถอนเงิน</NavLink>
                </div>
              </div>
              <div className="divider"></div>
            </>
          )}

          {/* Admin Menu */}
          {auth?.role === 'admin' && (
            <NavLink to="/admin/users" className="nav-item admin-center" onClick={closeMobileMenu}>
              <Shield size={20} />
              <span>ผู้ดูแลระบบ</span>
            </NavLink>
          )}

          {auth?.role === 'admin' && <div className="divider"></div>}

          <NavLink to="/settings" className="nav-item" onClick={closeMobileMenu}>
            <Settings size={20} />
            <span>ตั้งค่า</span>
          </NavLink>

          <NavLink to="/support" className="nav-item" onClick={closeMobileMenu}>
            <HelpCircle size={20} />
            <span>Support</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
