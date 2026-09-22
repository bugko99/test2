import React from 'react';
import { Package, Eye } from 'lucide-react';
import './Admin.css';

const mockOrders = [
  { id: 'ORD-8942', user: 'user123', total: 1290, date: '2023-11-15 14:30', status: 'completed' },
  { id: 'ORD-8941', user: 'gamer_boy', total: 350, date: '2023-11-15 13:15', status: 'completed' },
  { id: 'ORD-8940', user: 'test_acc', total: 890, date: '2023-11-15 10:05', status: 'pending' },
];

const AdminOrders = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Package size={28} /> จัดการคำสั่งซื้อ</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>ลูกค้า</th>
              <th>ยอดรวม</th>
              <th>วันที่สั่งซื้อ</th>
              <th>สถานะ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>฿{order.total}</td>
                <td>{order.date}</td>
                <td><span className={`badge ${order.status === 'completed' ? 'active' : 'pending'}`}>{order.status}</span></td>
                <td>
                  <button className="action-btn"><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
