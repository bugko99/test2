import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Copy } from 'lucide-react';
import './Seller.css';
import '../Admin/Admin.css';

const SellerInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealedIds, setRevealedIds] = useState(new Set());

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch inventory');
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const toggleReveal = (id) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('คัดลอกรหัสแล้ว');
  };

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><Key size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="seller-page"><div className="seller-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><Key size={28} /> คลังรหัส (Inventory)</h1>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>ดูรหัสเกม / ไอดีพาสเวิร์ด ทั้งหมดที่คุณมีในระบบ</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อเกม</th>
              <th>สถานะ</th>
              <th>รหัสเกม / ID Password</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มีสินค้าในสต็อก</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.game_name}</td>
                  <td>
                    <span className={`badge ${product.status === 'available' ? 'active' : product.status === 'completed' ? 'rejected' : 'pending'}`}>
                      {product.status === 'available' ? 'พร้อมขาย' : product.status === 'completed' ? 'ขายแล้ว' : product.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type={revealedIds.has(product.id) ? "text" : "password"} 
                        value={product.account_details || ''}
                        readOnly
                        className="auth-input"
                        style={{ 
                          background: 'rgba(0,0,0,0.3)', 
                          padding: '0.5rem 1rem', 
                          width: '250px',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          letterSpacing: '1px',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      />
                      <button className="action-btn" onClick={() => toggleReveal(product.id)}>
                        {revealedIds.has(product.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <button className="btn-secondary" onClick={() => handleCopy(product.account_details)}>
                      <Copy size={16} /> คัดลอก
                    </button>
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

export default SellerInventory;
