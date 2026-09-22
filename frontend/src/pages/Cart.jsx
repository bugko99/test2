import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.cart_item_id !== cartItemId));
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    if (!window.confirm(`ยืนยันการสั่งซื้อสินค้าทั้งหมดในราคา ฿${totalPrice.toLocaleString()}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('ชำระเงินสำเร็จ! คุณสามารถดูรหัสเกมได้ที่เมนู "รหัสเกมของฉัน"');
        navigate('/my-games');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาดในการชำระเงิน');
        if (data.message === 'Insufficient balance') {
          if(window.confirm('ยอดเงินไม่พอ ต้องการไปเติมเงินหรือไม่?')) {
            navigate('/wallet');
          }
        }
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อระบบชำระเงิน');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  if (loading) return <div className="page-content"><h2>กำลังโหลดตะกร้า...</h2></div>;

  return (
    <div className="page-content cart-page">
      <div className="section-header">
        <h1><ShoppingCart size={28} /> ตะกร้าสินค้า</h1>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <ShoppingCart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2>ไม่มีสินค้าในตะกร้า</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>เลือกซื้อเกมพรีเมียมจากหน้าร้านค้าได้เลย</p>
          <button className="btn-primary" onClick={() => navigate('/shop/all')}>ไปที่ร้านค้า</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          <div className="cart-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.cart_item_id} style={{ display: 'flex', gap: '1rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                {item.image_url ? (
                  <img src={`http://localhost:5001${item.image_url}`} alt="cover" style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div className="placeholder-img" style={{ width: '120px', height: '80px', borderRadius: '8px' }}>{item.game_name} Cover</div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.game_name}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>หมวดหมู่: {item.category} | ร้าน: {item.seller_name}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>฿{parseFloat(item.price).toLocaleString()}</span>
                  <button className="action-btn delete" onClick={() => handleRemove(item.cart_item_id)} title="ลบออกจากตะกร้า"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>สรุปคำสั่งซื้อ</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>ยอดรวมสินค้า ({cartItems.length} ชิ้น)</span>
              <span>฿{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>ส่วนลด</span>
              <span>฿0.00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.2rem' }}>ยอดชำระสุทธิ</strong>
              <strong style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>฿{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={handleCheckout}>
              <CreditCard size={20} /> ชำระเงินทันที
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
