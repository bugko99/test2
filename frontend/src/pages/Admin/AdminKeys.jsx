import React from 'react';
import { Key, Eye, Trash2 } from 'lucide-react';
import './Admin.css';

const mockKeys = [
  { id: 1, game: 'Elden Ring', seller: 'ProGamer Shop', code: 'XXXX-XXXX-XXXX-1234', status: 'available' },
  { id: 2, game: 'Cyberpunk 2077', seller: 'Elite Gaming', code: 'XXXX-XXXX-XXXX-5678', status: 'sold' },
];

const AdminKeys = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Key size={28} /> จัดการรหัสเกม (Keys)</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>เกม</th>
              <th>ร้านค้า (Seller)</th>
              <th>รหัส (ซ่อน)</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockKeys.map(k => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td>{k.game}</td>
                <td>{k.seller}</td>
                <td>{k.code}</td>
                <td><span className={`badge ${k.status === 'available' ? 'active' : 'rejected'}`}>{k.status}</span></td>
                <td>
                  <button className="action-btn"><Eye size={18} /></button>
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

export default AdminKeys;
