import React from 'react';
import { Banknote, Check, X } from 'lucide-react';
import './Admin.css';

const mockWithdrawals = [
  { id: 'WD-001', seller: 'ProGamer Shop', amount: 5000, bank: 'KBANK - 0123456789', status: 'pending', date: '2023-11-15 09:00' },
  { id: 'WD-002', seller: 'Elite Gaming', amount: 12000, bank: 'SCB - 9876543210', status: 'completed', date: '2023-11-14 15:30' },
];

const AdminWithdrawals = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Banknote size={28} /> จัดการถอนเงิน</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ร้านค้า (Seller)</th>
              <th>จำนวนเงิน</th>
              <th>บัญชีธนาคาร</th>
              <th>วันที่ขอถอน</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {mockWithdrawals.map(wd => (
              <tr key={wd.id}>
                <td>{wd.id}</td>
                <td>{wd.seller}</td>
                <td>฿{wd.amount}</td>
                <td>{wd.bank}</td>
                <td>{wd.date}</td>
                <td><span className={`badge ${wd.status === 'completed' ? 'active' : 'pending'}`}>{wd.status}</span></td>
                <td>
                  {wd.status === 'pending' && (
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

export default AdminWithdrawals;
