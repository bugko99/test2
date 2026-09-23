import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? (บัญชีที่เกี่ยวข้องกับผู้ใช้นี้จะถูกลบไปด้วย)')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(u => u.id !== id));
      alert('ลบผู้ใช้สำเร็จ');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditRole = async (id, newRole) => {
    if (!newRole) return;
    
    const roleString = newRole.trim().toLowerCase();
    if (!['user', 'seller', 'admin'].includes(roleString)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: roleString })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update role');
      }
      
      setUsers(users.map(u => u.id === id ? { ...u, role: roleString } : u));
      alert('เปลี่ยน Role สำเร็จ');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-page"><div className="admin-header"><h1><Users size={28} /> กำลังโหลด...</h1></div></div>;
  if (error) return <div className="admin-page"><div className="admin-header"><h1 style={{ color: '#ef4444' }}>เกิดข้อผิดพลาด: {error}</h1></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Users size={28} /> จัดการสมาชิก</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>วันที่สมัคร</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>ไม่มีข้อมูลผู้ใช้</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role} 
                      onChange={(e) => handleEditRole(user.id, e.target.value)}
                      className={`badge ${user.role}`}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border)', 
                        color: '#fff', 
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        outline: 'none'
                      }}
                    >
                      <option value="user" style={{ background: 'var(--bg-dark)' }}>USER</option>
                      <option value="seller" style={{ background: 'var(--bg-dark)' }}>SELLER</option>
                      <option value="admin" style={{ background: 'var(--bg-dark)' }}>ADMIN</option>
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString('th-TH')}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => handleDelete(user.id)} title="ลบผู้ใช้"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
