import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Filter, X } from 'lucide-react';
import './Main.css';

const Shop = () => {
  const { category } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddToCart = async (accountId, gameName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อนเพิ่มลงตะกร้า');
        return;
      }
      
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(`เพิ่ม ${gameName} ลงตะกร้าแล้ว!`);
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const displayCategory = category === 'all' || !category ? 'เกมทั้งหมด' 
    : category.replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5001/api/shop/products';
        if (category && category !== 'all') {
          url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [category]);

  // Apply filters and sorting
  let filteredGames = [...games];
  
  if (searchQuery) {
    filteredGames = filteredGames.filter(g => g.game_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  
  if (maxPrice && !isNaN(maxPrice)) {
    filteredGames = filteredGames.filter(g => parseFloat(g.price) <= parseFloat(maxPrice));
  }
  
  if (sortBy === 'price_asc') {
    filteredGames.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortBy === 'price_desc') {
    filteredGames.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }
  // 'newest' is default from API (DESC ID), so no sort needed for newest

  if (loading) return <div className="page-content shop-page"><div className="shop-header"><h1><ShoppingBag size={28} /> กำลังโหลดข้อมูล...</h1></div></div>;
  if (error) return <div className="page-content shop-page"><div className="shop-header"><h1 style={{color: '#ef4444'}}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="page-content shop-page">
      <div className="shop-header">
        <h1><ShoppingBag size={28} /> {displayCategory}</h1>
        <button 
          className={`btn-secondary ${showFilters ? 'active' : ''}`} 
          onClick={() => setShowFilters(!showFilters)}
          style={{ background: showFilters ? 'var(--accent)' : '', color: showFilters ? '#fff' : '' }}
        >
          {showFilters ? <X size={18} /> : <Filter size={18} />} 
          {showFilters ? ' ปิดตัวกรอง' : ' กรองผลลัพธ์'}
        </button>
      </div>

      {showFilters && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ค้นหาชื่อเกม</label>
            <input 
              type="text" 
              className="auth-input" 
              style={{ width: '100%' }} 
              placeholder="เช่น GTA V"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>เรียงลำดับ</label>
            <select 
              className="auth-input" 
              style={{ width: '100%', appearance: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">มาใหม่ล่าสุด</option>
              <option value="price_asc">ราคา: ต่ำไปสูง</option>
              <option value="price_desc">ราคา: สูงไปต่ำ</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ราคาสูงสุด (บาท)</label>
            <input 
              type="number" 
              className="auth-input" 
              style={{ width: '100%' }} 
              placeholder="ไม่จำกัด"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="game-grid">
        {filteredGames.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            ไม่พบเกมที่ตรงกับเงื่อนไข
          </div>
        ) : (
          filteredGames.map(game => (
            <div key={game.id} className="game-card">
              {game.image_url ? (
                <img src={`http://localhost:5001${game.image_url}`} alt="cover" className="game-card-image" style={{ objectFit: 'cover', width: '100%' }} />
              ) : (
                <div className="game-card-image placeholder-img">{game.game_name} Cover</div>
              )}
              <div className="game-card-content">
                <h3>{game.game_name}</h3>
                <p className="game-platform">หมวดหมู่: {game.category} | คนขาย: {game.seller_name}</p>
                <div className="game-price-row">
                  <span className="price">฿{parseFloat(game.price).toLocaleString()}</span>
                  <button className="btn-buy" onClick={() => handleAddToCart(game.id, game.game_name)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
