import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name });
      setMessage('Profile updated!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (

    <>  
    <div className="dashboard">
      <div className="dash-glow" />

      <nav className="dash-nav">
        <div className="dash-brand">⬡ AuthApp</div>
        <button className="logout-btn" onClick={handleLogout}>Sign out</button>
      </nav>

      <main className="dash-main">
        <div className="dash-card profile-card">
          <div className="profile-avatar">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <span>{initials}</span>
            }
            <div className={`provider-badge ${user?.authProvider}`}>
              {user?.authProvider === 'google' ? 'G' : '✓'}
            </div>
          </div>

          <div className="profile-info">
            {editing ? (
              <form onSubmit={handleSave} className="edit-form">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="edit-input"
                  required
                />
                <div className="edit-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? '...' : 'Save'}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="name-row">
                <h2>{user?.name}</h2>
                <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
            <p className="user-email">{user?.email}</p>
            {message && <p className="success-msg">{message}</p>}
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-card info-card">
            <div className="info-label">Auth Provider</div>
            <div className="info-value capitalize">{user?.authProvider}</div>
          </div>
          <div className="dash-card info-card">
            <div className="info-label">Account Status</div>
            <div className="info-value verified">{user?.isVerified ? 'Verified ✓' : 'Unverified'}</div>
          </div>
          <div className="dash-card info-card">
            <div className="info-label">Role</div>
            <div className="info-value capitalize">{user?.role}</div>
          </div>
          <div className="dash-card info-card">
            <div className="info-label">Member since</div>
            <div className="info-value">{joinDate}</div>
          </div>
        </div>

      </main>
    </div>
     </>
  );
};

export default Dashboard;
