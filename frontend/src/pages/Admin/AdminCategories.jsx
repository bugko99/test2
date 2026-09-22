import React from 'react';
import { FolderTree, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const mockCategories = [
  { id: 1, name: 'Action', gameCount: 150 },
  { id: 2, name: 'RPG', gameCount: 85 },
  { id: 3, name: 'FPS', gameCount: 120 },
  { id: 4, name: 'Simulation', gameCount: 40 },
];

const AdminCategories = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FolderTree size={28} /> จัดการหมวดหมู่</h1>
        <button className="btn-primary">เพิ่มหมวดหมู่</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อหมวดหมู่</th>
              <th>จำนวนเกม</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.gameCount}</td>
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

export default AdminCategories;
