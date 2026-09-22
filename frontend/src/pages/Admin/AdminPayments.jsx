import React from 'react';
import { CreditCard, Check, X } from 'lucide-react';
import './Admin.css';

const mockPayments = [
  { id: 'TXN-901', user: 'user123', method: 'PromptPay', amount: 1290, status: 'success', date: '2023-11-15 14:31' },
  { id: 'TXN-902', user: 'test_acc', method: 'Credit Card', amount: 890, status: 'pending', date: '2023-11-15 10:05' },
];

const AdminPayments = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><CreditCard size={28} /> จัดการการชำระเงิน</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>ผู้ใช้</th>
              <th>ช่องทาง</th>
              <th>จำนวนเงิน</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th>อนุมัติ (Manual)</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map(txn => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.user}</td>
                <td>{txn.method}</td>
                <td>฿{txn.amount}</td>
                <td>{txn.date}</td>
                <td><span className={`badge ${txn.status === 'success' ? 'active' : 'pending'}`}>{txn.status}</span></td>
                <td>
                  {txn.status === 'pending' && (
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

export default AdminPayments;
