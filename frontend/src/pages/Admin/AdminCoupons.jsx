import React from 'react';
import { Ticket, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const mockCoupons = [
  { id: 1, code: 'NEWUSER50', discount: '50THB', minSpend: 300, usage: '45/100', status: 'active' },
  { id: 2, code: 'MEGA20', discount: '20%', minSpend: 1000, usage: '12/50', status: 'active' },
  { id: 3, code: 'EXPIRED10', discount: '10THB', minSpend: 0, usage: '100/100', status: 'expired' },
];

const AdminCoupons = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Ticket size={28} /> จัดการคูปอง</h1>
        <button className="btn-primary">สร้างคูปองใหม่</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>รหัสคูปอง (Code)</th>
              <th>ส่วนลด</th>
              <th>ขั้นต่ำ</th>
              <th>สิทธิ์ที่ใช้ไป</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockCoupons.map(coupon => (
              <tr key={coupon.id}>
                <td>{coupon.id}</td>
                <td><strong>{coupon.code}</strong></td>
                <td>{coupon.discount}</td>
                <td>฿{coupon.minSpend}</td>
                <td>{coupon.usage}</td>
                <td><span className={`badge ${coupon.status === 'active' ? 'active' : 'rejected'}`}>{coupon.status}</span></td>
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

export default AdminCoupons;
