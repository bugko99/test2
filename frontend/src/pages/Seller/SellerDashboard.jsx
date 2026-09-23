import React, { useState, useEffect } from 'react';
import { Store, ShoppingBag, Banknote, PackageOpen } from 'lucide-react';
import './Seller.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total_sales: 0,
    total_orders: 0,
    active_products: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><Store size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="seller-page"><div className="seller-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><Store size={28} /> Seller Dashboard</h1>
      </div>

      <div className="seller-stats-grid">
        <div className="seller-stat-card">
          <div className="seller-stat-icon"><Banknote size={28} /></div>
          <div className="seller-stat-info">
            <h3>ยอดขายสะสม</h3>
            <p>฿{parseFloat(stats.total_sales).toLocaleString()}</p>
          </div>
        </div>
        <div className="seller-stat-card">
          <div className="seller-stat-icon"><ShoppingBag size={28} /></div>
          <div className="seller-stat-info">
            <h3>คำสั่งซื้อทั้งหมด</h3>
            <p>{stats.total_orders}</p>
          </div>
        </div>
        <div className="seller-stat-card">
          <div className="seller-stat-icon"><PackageOpen size={28} /></div>
          <div className="seller-stat-info">
            <h3>สินค้าที่วางขาย</h3>
            <p>{stats.active_products}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
