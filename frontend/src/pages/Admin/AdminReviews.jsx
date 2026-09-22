import React from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import './Admin.css';

const mockReviews = [
  { id: 1, user: 'gamer_boy', game: 'Roblox Gift Card', rating: 5, comment: 'ส่งไวมากครับ ใช้งานได้จริง', status: 'approved' },
  { id: 2, user: 'test_acc', game: 'Cyberpunk 2077', rating: 1, comment: 'รหัสใช้ไม่ได้ครับ ขอเงินคืน!', status: 'pending' },
];

const AdminReviews = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Star size={28} /> จัดการรีวิว</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ผู้รีวิว</th>
              <th>สินค้า (เกม)</th>
              <th>คะแนน</th>
              <th>ข้อความ</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockReviews.map(rev => (
              <tr key={rev.id}>
                <td>{rev.id}</td>
                <td>{rev.user}</td>
                <td>{rev.game}</td>
                <td>
                  <div style={{ color: '#cccccc', display: 'flex' }}>
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </td>
                <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rev.comment}</td>
                <td><span className={`badge ${rev.status === 'approved' ? 'active' : 'pending'}`}>{rev.status}</span></td>
                <td>
                  {rev.status === 'pending' && <button className="action-btn"><Check size={18} color="#10b981" /></button>}
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

export default AdminReviews;
