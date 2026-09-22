import React from 'react';
import { Flame } from 'lucide-react';
import './Main.css';

const Promotions = () => {
  return (
    <div className="page-content">
      <div className="section-header">
        <h1 style={{ color: '#ffffff' }}><Flame size={28} /> โปรโมชั่นร้อนแรง</h1>
      </div>

      <div className="promo-grid">
        <div className="promo-card">
          <div className="promo-content">
            <h2>Summer Sale 2024</h2>
            <p>ลดราคาสูงสุด 50% สำหรับเกมหมวดหมู่ Action RPG!</p>
            <button className="btn-primary">ช้อปเลย</button>
          </div>
        </div>
        <div className="promo-card" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="promo-content">
            <h2>New User Bonus</h2>
            <p>สมัครใหม่วันนี้ รับส่วนลดทันที 100 บาท</p>
            <button className="btn-primary">รับสิทธิ์</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
