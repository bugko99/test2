import React from 'react';
import { TrendingUp, Download } from 'lucide-react';
import './Admin.css';

const AdminReports = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><TrendingUp size={28} /> รายงานยอดขาย</h1>
        <button className="btn-primary"><Download size={18} style={{ marginRight: '8px' }} /> Export CSV</button>
      </div>

      <div className="admin-table-container" style={{ padding: '2rem', textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <TrendingUp size={64} style={{ color: '#ffffff', opacity: 0.5, marginBottom: '1rem' }} />
          <h3>ระบบรายงานสถิติขั้นสูง</h3>
          <p style={{ color: 'var(--text-muted)' }}>พื้นที่สำหรับแสดงกราฟยอดขายรายเดือน (Chart.js / Recharts) จะถูกเพิ่มในอนาคต</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
