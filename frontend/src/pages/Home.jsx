import React, { useState, useEffect } from 'react';
import { Gamepad2, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

const Home = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shop/products`);
        if (response.ok) {
          const data = await response.json();
          // Take only the first 4 for the home page (assuming API returns newest first)
          setTrendingGames(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch trending games:', err);
      }
    };
    fetchTrending();
  }, []);

  const handleAddToCart = async (accountId, gameName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(`เพิ่ม ${gameName} ลงตะกร้าแล้ว! ไปที่ตะกร้าเพื่อชำระเงิน`);
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <div className="page-content home-page">
      <div className="hero-section">
        <h1>Welcome to BUGKOShop</h1>
        <p>The ultimate destination for premium game keys at the best prices.</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/shop/all')}>Browse Games</button>
      </div>

      <div className="section-header">
        <h2><TrendingUp size={24} /> Trending Now</h2>
      </div>
      
      <div className="game-grid">
        {trendingGames.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>ยังไม่มีเกมที่กำลังมาแรง</div>
        ) : (
          trendingGames.map(game => (
            <div key={game.id} className="game-card">
              {game.image_url ? (
                <img src={`${import.meta.env.VITE_API_URL}${game.image_url}`} alt="cover" className="game-card-image" style={{ objectFit: 'cover', width: '100%' }} />
              ) : (
                <div className="game-card-image placeholder-img">{game.game_name} Cover</div>
              )}
              <div className="game-card-content">
                <h3>{game.game_name}</h3>
                <p className="game-platform">{game.category}</p>
                <div className="game-price-row">
                  <span className="price">฿{parseFloat(game.price).toLocaleString()}</span>
                  <button className="btn-buy" onClick={() => handleAddToCart(game.id, game.game_name)}>Buy Now</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
