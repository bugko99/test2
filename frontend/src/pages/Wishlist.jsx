import React from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import './Main.css';

const Wishlist = () => {
  return (
    <div className="page-content">
      <div className="section-header">
        <h1 style={{ color: '#ffffff' }}><Heart size={28} fill="#ffffff" /> เกมที่อยากได้ (Wishlist)</h1>
      </div>

      <div className="list-container">
        <div className="list-item">
          <div className="list-item-img placeholder-img">Img</div>
          <div className="list-item-info">
            <h3>Elden Ring</h3>
            <p>Steam</p>
          </div>
          <div className="list-item-price">฿1,290</div>
          <div className="list-item-actions">
            <button className="btn-buy"><ShoppingCart size={18} /> ลงตะกร้า</button>
            <button className="action-btn delete"><Trash2 size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
