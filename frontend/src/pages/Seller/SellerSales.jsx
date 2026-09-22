import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import './Seller.css';
import '../Admin/Admin.css';

const SellerSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/seller/sales', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch sales data');
        
        const data = await response.json();
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><TrendingUp size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="seller-page"><div className="seller-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  const totalRevenue = sales.reduce((sum, day) => sum + parseFloat(day.total_revenue), 0);
  const totalItemsSold = sales.reduce((sum, day) => sum + parseInt(day.total_orders), 0);

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><TrendingUp size={28} /> รายงานยอดขาย</h1>
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={20} /> รายได้รวม (30 วันล่าสุด)</h3>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0 0 0', color: '#fff' }}>฿{totalRevenue.toLocaleString()}</h1>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={20} /> จำนวนเกมที่ขายได้ (30 วันล่าสุด)</h3>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0 0 0', color: '#fff' }}>{totalItemsSold} ชิ้น</h1>
        </div>
      </div>

      <div className="admin-table-container">
        <h3 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid var(--border)' }}>ยอดขายรายวัน</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>จำนวนเกมที่ขายได้</th>
              <th>รายได้สุทธิ</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มียอดขาย</td></tr>
            ) : (
              sales.map((day, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} color="var(--text-muted)" />
                      {new Date(day.sale_date).toLocaleDateString('th-TH', { dateStyle: 'long' })}
                    </div>
                  </td>
                  <td>{day.total_orders} ชิ้น</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 'bold' }}>฿{parseFloat(day.total_revenue).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assuming Package is imported above, but let's just make sure
import { Package } from 'lucide-react';
export default SellerSales;
