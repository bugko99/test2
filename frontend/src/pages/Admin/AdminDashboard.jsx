import React from 'react';
import { LayoutDashboard, Users, Store, Banknote, ShoppingBag } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><LayoutDashboard size={28} /> Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Banknote size={28} /></div>
          <div className="stat-info">
            <h3>ยอดขายรวมทั้งหมด</h3>
            <p>฿125,430</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShoppingBag size={28} /></div>
          <div className="stat-info">
            <h3>คำสั่งซื้อทั้งหมด</h3>
            <p>1,234</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Users size={28} /></div>
          <div className="stat-info">
            <h3>สมาชิกทั้งหมด</h3>
            <p>856</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Store size={28} /></div>
          <div className="stat-info">
            <h3>Seller ที่ยืนยันแล้ว</h3>
            <p>42</p>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>คำสั่งซื้อล่าสุด</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>ลูกค้า</th>
              <th>เกม</th>
              <th>ราคา</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-8942</td>
              <td>user123</td>
              <td>Elden Ring Steam Key</td>
              <td>฿1,290</td>
              <td><span className="badge active">สำเร็จ</span></td>
            </tr>
            <tr>
              <td>#ORD-8941</td>
              <td>gamer_boy</td>
              <td>Roblox Gift Card 1000 Robux</td>
              <td>฿350</td>
              <td><span className="badge active">สำเร็จ</span></td>
            </tr>
            <tr>
              <td>#ORD-8940</td>
              <td>test_acc</td>
              <td>Cyberpunk 2077</td>
              <td>฿890</td>
              <td><span className="badge pending">รอชำระเงิน</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
