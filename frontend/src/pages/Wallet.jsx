import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, History, Zap } from 'lucide-react';
import './Main.css';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [balance, setBalance] = useState(0);
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTopup = async () => {
    if (!topupAmount || topupAmount <= 0) {
      alert('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/wallet/topup', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(topupAmount) })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setTopupAmount('');
        alert(`เติมเงินสำเร็จ ${topupAmount} บาท`);
        setActiveTab('balance');
      } else {
        alert('เกิดข้อผิดพลาดในการเติมเงิน');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  if (loading) return <div className="page-content"><h2>กำลังโหลด...</h2></div>;

  return (
    <div className="page-content">
      <div className="section-header">
        <h1><WalletIcon size={28} /> กระเป๋าเงิน (Wallet)</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          className={`btn-secondary ${activeTab === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveTab('balance')}
          style={{ background: activeTab === 'balance' ? 'var(--accent)' : 'transparent', color: activeTab === 'balance' ? 'white' : '' }}
        >ยอดเงิน</button>
        <button 
          className={`btn-secondary ${activeTab === 'topup' ? 'active' : ''}`}
          onClick={() => setActiveTab('topup')}
          style={{ background: activeTab === 'topup' ? 'var(--accent)' : 'transparent', color: activeTab === 'topup' ? 'white' : '' }}
        >เติมเงิน (จำลอง)</button>
        <button 
          className={`btn-secondary ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{ background: activeTab === 'history' ? 'var(--accent)' : 'transparent', color: activeTab === 'history' ? 'white' : '' }}
        >ประวัติธุรกรรม</button>
      </div>

      {activeTab === 'balance' && (
        <div className="hero-section" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border)' }}>
          <h2 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>ยอดเงินคงเหลือ</h2>
          <h1 style={{ fontSize: '4rem', color: '#ffffff', margin: 0 }}>฿{parseFloat(balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setActiveTab('topup')}><Plus size={18} /> เติมเงินเข้ากระเป๋า</button>
        </div>
      )}

      {activeTab === 'topup' && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '2.5rem', 
          maxWidth: '500px',
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
            <Zap size={24} /> เติมเงินด่วน (Test Mode)
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>ระบบจำลองการเติมเงิน ยอดเงินจะเข้าสู่กระเป๋าทันที</p>
          
          <div className="responsive-grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            {[500, 1000, 3000, 5000].map(amt => (
              <button 
                key={amt}
                onClick={() => setTopupAmount(amt.toString())}
                style={{
                  background: topupAmount === amt.toString() ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: topupAmount === amt.toString() ? '2px solid var(--accent)' : '1px solid var(--border)',
                  color: topupAmount === amt.toString() ? 'var(--accent)' : '#fff',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: topupAmount === amt.toString() ? '0 0 15px rgba(249, 115, 22, 0.3)' : 'none'
                }}
              >
                ฿{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>฿</span>
            <input 
              type="number" 
              placeholder="ระบุจำนวนเงินที่ต้องการ..." 
              className="auth-input" 
              style={{ 
                width: '100%', 
                boxSizing: 'border-box',
                paddingLeft: '2.5rem',
                paddingRight: '3.5rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#ffffff',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)'
              }} 
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>THB</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} 
            onClick={handleTopup}
          >
            ยืนยันการทำรายการ
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="list-container">
           <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>ประวัติการทำธุรกรรมจะแสดงที่นี่ (อยู่ระหว่างการพัฒนาเฟสต่อไป)</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
