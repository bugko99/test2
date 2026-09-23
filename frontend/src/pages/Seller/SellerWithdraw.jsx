import React, { useState, useEffect } from 'react';
import { CreditCard, History, Wallet } from 'lucide-react';
import './Seller.css';
import '../Admin/Admin.css';

const SellerWithdraw = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch balance
      const balRes = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const balData = await balRes.json();
      setBalance(balData.balance);

      // Fetch withdrawal history
      const withRes = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/withdrawals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const withData = await withRes.json();
      setWithdrawals(withData);
      
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      alert('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }
    
    if (parseFloat(withdrawAmount) > balance) {
      alert('ยอดเงินไม่เพียงพอ');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/withdraw`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
      
      alert('ส่งคำร้องขอถอนเงินสำเร็จ! กรุณารอแอดมินอนุมัติ');
      setWithdrawAmount('');
      fetchData(); // Refresh list and balance
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="seller-page"><div className="seller-header"><h1><CreditCard size={28} /> กำลังโหลด...</h1></div></div>;

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1><CreditCard size={28} /> ถอนเงิน (Withdraw)</h1>
      </div>

      <div className="responsive-grid-1-2" style={{ marginBottom: '2rem' }}>
        
        {/* Left Column - Request Form */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wallet size={20} /> ยอดเงินที่ถอนได้</h3>
          <h1 style={{ fontSize: '3rem', margin: '0 0 2rem 0', color: '#fff' }}>฿{parseFloat(balance).toLocaleString(undefined, {minimumFractionDigits:2})}</h1>
          
          <form onSubmit={handleWithdraw}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>จำนวนเงินที่ต้องการถอน (บาท)</label>
            <input 
              type="number" 
              className="auth-input" 
              style={{ width: '100%', marginBottom: '1.5rem', fontSize: '1.2rem', padding: '1rem' }} 
              placeholder="ระบุจำนวนเงิน..."
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required 
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={submitting}>
              {submitting ? 'กำลังดำเนินการ...' : 'ยืนยันการถอนเงิน'}
            </button>
          </form>
        </div>

        {/* Right Column - History */}
        <div className="admin-table-container">
          <h3 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><History size={20} /> ประวัติการถอนเงิน</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>วันที่ทำรายการ</th>
                <th>จำนวนเงิน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มีประวัติการถอนเงิน</td></tr>
              ) : (
                withdrawals.map(w => (
                  <tr key={w.id}>
                    <td>#{w.id}</td>
                    <td>{new Date(w.created_at).toLocaleString('th-TH')}</td>
                    <td style={{ fontWeight: 'bold' }}>฿{parseFloat(w.amount).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${w.status === 'completed' ? 'active' : w.status === 'pending' ? 'pending' : 'rejected'}`}>
                        {w.status === 'completed' ? 'โอนสำเร็จ' : w.status === 'pending' ? 'รอดำเนินการ' : 'ถูกปฏิเสธ'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SellerWithdraw;
