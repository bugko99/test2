import React, { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';
import './Main.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page-content"><h2>กำลังโหลดข้อมูลคำสั่งซื้อ...</h2></div>;

  return (
    <div className="page-content">
      <div className="section-header">
        <h1><Package size={28} /> คำสั่งซื้อของฉัน</h1>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div className="search-bar" style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
          <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '1rem' }} />
          <input type="text" placeholder="ค้นหาจากชื่อเกม หรือ หมายเลขคำสั่งซื้อ..." style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }} />
        </div>
      </div>

      <div className="list-container">
        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>ยังไม่มีคำสั่งซื้อใดๆ</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="list-item" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              {order.image_url ? (
                <img src={`${import.meta.env.VITE_API_URL}${order.image_url}`} alt="cover" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <div className="placeholder-img" style={{ width: '80px', height: '80px', borderRadius: '8px' }}>IMG</div>
              )}
              <div className="list-item-info">
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{order.game_name}</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>รหัสอ้างอิง: #{order.id} | สั่งซื้อเมื่อ: {new Date(order.created_at).toLocaleString('th-TH')}</p>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>ร้านค้า: {order.seller_name}</p>
              </div>
              <div className="list-item-price" style={{ textAlign: 'right' }}>
                <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 'bold' }}>฿{parseFloat(order.price).toLocaleString()}</div>
                <div className={`badge ${order.status === 'completed' ? 'active' : 'pending'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>{order.status === 'completed' ? 'สำเร็จ' : 'คืนเงิน'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
