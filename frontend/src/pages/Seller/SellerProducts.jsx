import React, { useState, useEffect } from 'react';
import { PackageOpen, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import './Seller.css';
import '../Admin/Admin.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    game_name: '',
    category: 'Steam',
    price: '',
    account_details: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('game_name', formData.game_name);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('account_details', formData.account_details);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type, browser will set it to multipart/form-data with boundary
        },
        body: data
      });
      
      if (!response.ok) throw new Error('Failed to create product');
      
      alert('ลงขายเกมสำเร็จ!');
      setShowAddForm(false);
      setFormData({ game_name: '', category: 'Steam', price: '', account_details: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPrice = async (id, currentPrice, currentCategory) => {
    const newPrice = window.prompt(`แก้ไขราคาขาย (ราคาปัจจุบัน: ฿${currentPrice}):`, currentPrice);
    if (!newPrice || isNaN(newPrice)) return;
    
    const newCategory = window.prompt(`แก้ไขหมวดหมู่ (หมวดหมู่ปัจจุบัน: ${currentCategory}):`, currentCategory);
    if (!newCategory) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price: parseFloat(newPrice), category: newCategory })
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      alert('แก้ไขราคาสำเร็จ');
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากสต็อก?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(p => p.id !== id));
      alert('ลบสินค้าสำเร็จ');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><PackageOpen size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="seller-page"><div className="seller-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><PackageOpen size={28} /> จัดการสินค้า</h1>
        {!showAddForm && (
          <button className="btn-seller" onClick={() => setShowAddForm(true)}><Plus size={18} /> ลงขายเกมใหม่</button>
        )}
      </div>

      {showAddForm && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>ลงขายเกมใหม่</h2>
            <button className="action-btn" onClick={() => setShowAddForm(false)}><X size={24} /></button>
          </div>
          
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column - Image Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ color: 'var(--text-muted)' }}>ภาพปกเกม</label>
              <div 
                style={{ 
                  height: '250px', 
                  border: '2px dashed var(--border)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: imagePreview ? `url(${imagePreview}) center/cover` : 'rgba(255,255,255,0.02)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!imagePreview && (
                  <>
                    <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <span style={{ color: 'var(--text-muted)' }}>คลิกเพื่ออัปโหลดรูปภาพ</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  required
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ชื่อเกม</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  style={{ width: '100%' }} 
                  placeholder="เช่น Elden Ring"
                  value={formData.game_name}
                  onChange={(e) => setFormData({...formData, game_name: e.target.value})}
                  required 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>หมวดหมู่</label>
                  <select 
                    className="auth-input" 
                    style={{ width: '100%', appearance: 'auto' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Steam">Steam</option>
                    <option value="Roblox">Roblox</option>
                    <option value="Epic Games">Epic Games</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ราคา (บาท)</label>
                  <input 
                    type="number" 
                    className="auth-input" 
                    style={{ width: '100%' }} 
                    placeholder="เช่น 1290"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>คีย์เกม / ไอดีพาสเวิร์ด (ลูกค้าจะเห็นหลังชำระเงิน)</label>
                <textarea 
                  className="auth-input" 
                  style={{ width: '100%', height: '100px', resize: 'none' }} 
                  placeholder="ใส่โค้ดเกมที่นี่..."
                  value={formData.account_details}
                  onChange={(e) => setFormData({...formData, account_details: e.target.value})}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '1rem' }} disabled={submitting}>
                {submitting ? 'กำลังอัปโหลด...' : 'ยืนยันลงขายเกม'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>รูป</th>
              <th>ชื่อเกม</th>
              <th>หมวดหมู่</th>
              <th>ราคาขาย</th>
              <th>รายละเอียด (ซ่อน)</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มีสินค้าในสต็อก</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image_url ? (
                      <img src={`${import.meta.env.VITE_API_URL}${product.image_url}`} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                    )}
                  </td>
                  <td>{product.game_name}</td>
                  <td>{product.category}</td>
                  <td>฿{parseFloat(product.price).toLocaleString()}</td>
                  <td><span style={{ color: 'var(--text-muted)' }}>***ถูกซ่อน***</span></td>
                  <td>
                    <span className={`badge ${product.status === 'available' ? 'active' : product.status === 'pending' ? 'pending' : 'rejected'}`}>
                      {product.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditPrice(product.id, product.price, product.category)} title="แก้ไขราคาและหมวดหมู่"><Edit size={18} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(product.id)} title="ลบสินค้า"><Trash2 size={18} /></button>
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

export default SellerProducts;
