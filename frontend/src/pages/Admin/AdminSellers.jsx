import React from 'react';
import { Store, Check, X } from 'lucide-react';
import './Admin.css';

const mockSellers = [
  { id: 1, shopName: 'ProGamer Shop', owner: 'seller_one', status: 'active', sales: 450 },
  { id: 2, shopName: 'CheapKeys Store', owner: 'keymaster', status: 'pending', sales: 0 },
  { id: 3, shopName: 'Elite Gaming', owner: 'elite_guy', status: 'rejected', sales: 0 },
];

const AdminSellers = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Store size={28} /> จัดการ Seller</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อร้านค้า</th>
              <th>เจ้าของร้าน</th>
              <th>ยอดขาย (รายการ)</th>
              <th>สถานะ</th>
              <th>อนุมัติ</th>
            </tr>
          </thead>
          <tbody>
            {mockSellers.map(seller => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.shopName}</td>
                <td>{seller.owner}</td>
                <td>{seller.sales}</td>
                <td><span className={`badge ${seller.status}`}>{seller.status.toUpperCase()}</span></td>
                <td>
                  {seller.status === 'pending' && (
                    <>
                      <button className="action-btn"><Check size={18} color="#10b981" /></button>
                      <button className="action-btn delete"><X size={18} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSellers;
