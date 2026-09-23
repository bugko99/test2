import React, { useState, useEffect } from 'react';
import { Gamepad, Key, Copy, Eye, EyeOff } from 'lucide-react';
import './Main.css';

const MyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-games`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (err) {
        console.error('Failed to fetch my games', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const toggleKey = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('คัดลอกรหัสเกมแล้ว!');
  };

  if (loading) return <div className="page-content"><h2>กำลังโหลดรหัสเกม...</h2></div>;

  return (
    <div className="page-content">
      <div className="section-header">
        <h1><Gamepad size={28} /> รหัสเกมของฉัน</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {games.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>คุณยังไม่มีเกมในคลัง ไปช้อปเลย!</p>
        ) : (
          games.map(game => (
            <div key={game.order_id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                {game.image_url ? (
                  <img src={`${import.meta.env.VITE_API_URL}${game.image_url}`} alt="cover" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div className="placeholder-img" style={{ width: '60px', height: '60px', borderRadius: '8px' }}>IMG</div>
                )}
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{game.game_name}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>ซื้อเมื่อ: {new Date(game.created_at).toLocaleDateString('th-TH')}</p>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--border)', borderRadius: '8px', padding: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={14} /> ข้อมูลรหัส/ID Password
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type={showKeys[game.order_id] ? "text" : "password"} 
                    value={game.account_details} 
                    readOnly 
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '1.1rem' }} 
                  />
                  <button className="action-btn" onClick={() => toggleKey(game.order_id)}>
                    {showKeys[game.order_id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button className="action-btn" onClick={() => copyToClipboard(game.account_details)}>
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyGames;
