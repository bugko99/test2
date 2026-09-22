import React from 'react';
import { Percent, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const mockPromotions = [
  { id: 1, name: 'Summer Sale 2024', discount: 'Up to 50%', startDate: '2024-04-01', endDate: '2024-04-30', status: 'upcoming' },
  { id: 2, name: 'Black Friday Event', discount: 'Site-wide 20%', startDate: '2023-11-24', endDate: '2023-11-27', status: 'active' },
];

const AdminPromotions = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Percent size={28} /> จัดการโปรโมชั่น</h1>
        <button className="btn-primary">สร้างโปรโมชั่น</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อแคมเปญ</th>
              <th>ส่วนลดสูงสุด</th>
              <th>วันเริ่ม</th>
              <th>วันสิ้นสุด</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockPromotions.map(promo => (
              <tr key={promo.id}>
                <td>{promo.id}</td>
                <td>{promo.name}</td>
                <td>{promo.discount}</td>
                <td>{promo.startDate}</td>
                <td>{promo.endDate}</td>
                <td><span className={`badge ${promo.status === 'active' ? 'active' : 'pending'}`}>{promo.status}</span></td>
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

export default AdminPromotions;
