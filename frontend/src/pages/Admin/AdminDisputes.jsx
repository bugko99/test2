import React from 'react';
import { ShieldAlert, Eye, Check } from 'lucide-react';
import './Admin.css';

const mockDisputes = [
  { id: 'DSP-001', orderId: 'ORD-8940', buyer: 'test_acc', seller: 'Elite Gaming', reason: 'Invalid Key', status: 'open', date: '2023-11-15 11:30' },
  { id: 'DSP-002', orderId: 'ORD-8900', buyer: 'sad_gamer', seller: 'ProGamer Shop', reason: 'Not Received', status: 'resolved', date: '2023-11-10 14:00' },
];

const AdminDisputes = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><ShieldAlert size={28} /> ระบบร้องเรียน (Disputes)</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Order ID</th>
              <th>ผู้ซื้อ</th>
              <th>ผู้ขาย</th>
              <th>สาเหตุ</th>
              <th>วันที่ร้องเรียน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {mockDisputes.map(dsp => (
              <tr key={dsp.id}>
                <td>{dsp.id}</td>
                <td>{dsp.orderId}</td>
                <td>{dsp.buyer}</td>
                <td>{dsp.seller}</td>
                <td>{dsp.reason}</td>
                <td>{dsp.date}</td>
                <td><span className={`badge ${dsp.status === 'resolved' ? 'active' : 'rejected'}`}>{dsp.status.toUpperCase()}</span></td>
                <td>
                  <button className="action-btn"><Eye size={18} /></button>
                  {dsp.status === 'open' && <button className="action-btn"><Check size={18} color="#10b981" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDisputes;
