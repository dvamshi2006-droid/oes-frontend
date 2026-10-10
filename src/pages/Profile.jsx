import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { User, Mail, Phone, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            studentId: res.data.studentId || '',
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await api.put('/students/me', formData);
      if (response.data.success) {
        setSuccessMsg('Profile updated successfully!');
      } else {
        setErrorMsg(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error updating profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={isAdmin ? 'admin' : 'student'} />

      <main className="dashboard-main">
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Account Profile</h1>
            <p style={{ color: 'var(--slate-600)' }}>Manage your personal details and contact preferences</p>
          </div>

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{formData.name || 'User Profile'}</h3>
                <span className={`badge ${isAdmin ? 'badge-info' : 'badge-success'}`} style={{ marginTop: '0.35rem' }}>
                  {isAdmin ? 'System Administrator' : 'Registered Student'}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {!isAdmin && (
                <div className="form-group">
                  <label className="form-label">Student ID / Candidate Code</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
