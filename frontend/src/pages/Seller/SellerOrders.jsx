import React, { useState, useEffect } from 'react';
import { Package, Eye } from 'lucide-react';
import './Seller.css';
import '../Admin/Admin.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><Package size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="seller-page"><div className="seller-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><Package size={28} /> คำสั่งซื้อจากลูกค้า</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>ชื่อลูกค้า</th>
              <th>เกมที่สั่งซื้อ</th>
              <th>ราคา</th>
              <th>วันที่สั่งซื้อ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มีคำสั่งซื้อ</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#ORD-{order.id}</td>
                  <td>{order.buyer_name}</td>
                  <td>{order.game_name}</td>
                  <td>฿{parseFloat(order.price).toLocaleString()}</td>
                  <td>{new Date(order.created_at).toLocaleString('th-TH')}</td>
                  <td>
                    <span className={`badge ${order.status === 'completed' ? 'active' : 'pending'}`}>
                      {order.status === 'completed' ? 'จัดส่งสำเร็จ' : order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
