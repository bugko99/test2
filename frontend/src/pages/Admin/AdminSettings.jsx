import React from 'react';
import { Settings, Save } from 'lucide-react';
import './Admin.css';

const AdminSettings = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Settings size={28} /> ตั้งค่าระบบ (Global Settings)</h1>
        <button className="btn-primary"><Save size={18} style={{ marginRight: '8px' }} /> บันทึกการตั้งค่า</button>
      </div>

      <div className="admin-table-container" style={{ padding: '2rem' }}>
        <form className="auth-form" style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label>ชื่อเว็บไซต์ (Site Name)</label>
            <input type="text" defaultValue="BUGKOShop" />
          </div>
          <div className="form-group">
            <label>ค่าธรรมเนียมแพลตฟอร์ม (Platform Fee %)</label>
            <input type="number" defaultValue="5" />
          </div>
          <div className="form-group">
            <label>ระบบเปิด/ปิด การสมัครสมาชิก (Allow Registration)</label>
            <select>
              <option value="yes">เปิด</option>
              <option value="no">ปิด</option>
            </select>
          </div>
          <div className="form-group">
            <label>การยืนยัน Seller อัตโนมัติ</label>
            <select>
              <option value="manual">รอแอดมินอนุมัติ</option>
              <option value="auto">อัตโนมัติ</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
