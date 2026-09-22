import React from 'react';
import { Gamepad2, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const mockGames = [
  { id: 1, title: 'Elden Ring', platform: 'Steam', price: 1290, stock: 45 },
  { id: 2, title: 'Cyberpunk 2077', platform: 'Steam', price: 890, stock: 12 },
  { id: 3, title: 'Minecraft', platform: 'PC', price: 790, stock: 0 },
];

const AdminGames = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Gamepad2 size={28} /> จัดการเกม</h1>
        <button className="btn-primary">เพิ่มเกมใหม่</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อเกม</th>
              <th>แพลตฟอร์ม</th>
              <th>ราคาอ้างอิง</th>
              <th>สต็อกรหัส</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockGames.map(game => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.title}</td>
                <td>{game.platform}</td>
                <td>฿{game.price}</td>
                <td><span className={`badge ${game.stock > 0 ? 'active' : 'rejected'}`}>{game.stock}</span></td>
                <td>
                  <button className="action-btn"><Edit size={18} /></button>
                  <button className="action-btn delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGames;
