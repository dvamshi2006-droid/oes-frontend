import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, Award, CheckCircle2, XCircle, AlertCircle, Percent } from 'lucide-react';

export default function ExamStatistics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getExamStatistics();
        if (response.success) {
          setStats(response.data || []);
        } else {
          setError(response.message || 'Failed to load exam statistics');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to examination statistics backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalAttempts = stats.reduce((acc, s) => acc + s.totalAttempts, 0);
  const totalPassed = stats.reduce((acc, s) => acc + s.passCount, 0);
  const overallPassRate =
    totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 1000) / 10 : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Examination Analytics & Performance</h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
            Comprehensive pass/fail ratios, average candidate marks, and subject benchmark trends.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Aggregate Overview Card */}
        <div className="card" style={{ backgroundColor: 'var(--primary-900)', color: '#ffffff', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 size={22} color="var(--primary-500)" />
            <span>Aggregate Assessment Overview</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-200)' }}>Total Examinations</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.length}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-200)' }}>Total Attempts Recorded</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalAttempts}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-200)' }}>Total Passing Marks Awarded</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalPassed}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-200)' }}>Overall Pass Rate</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>{overallPassRate}%</div>
            </div>
          </div>
        </div>

        {/* Per-Exam Breakdown */}
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Individual Examination Performance Breakdown</h2>

        {loading ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading performance statistics...</p>
        ) : stats.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--slate-500)' }}>No examination records found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {stats.map((s) => (
              <div key={s.examId} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-info">{s.subject}</span>
                  <span className="badge badge-secondary">{s.totalAttempts} Attempts</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{s.examTitle}</h3>

                {/* Progress Visual Bar */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    <span>Pass Rate:</span>
                    <span style={{ color: 'var(--primary-700)' }}>{s.passPercentage}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${s.passPercentage}%`,
                        backgroundColor: s.passPercentage >= 50 ? 'var(--success-solid)' : 'var(--danger-solid)',
                        borderRadius: '999px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--slate-500)' }}>Passed Candidates:</span>
                    <div style={{ fontWeight: 700, color: 'var(--success-text)', fontSize: '1.1rem' }}>{s.passCount}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)' }}>Failed Candidates:</span>
                    <div style={{ fontWeight: 700, color: 'var(--danger-text)', fontSize: '1.1rem' }}>{s.failCount}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)' }}>Average Marks:</span>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.averageMarks}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)' }}>Average Percentage:</span>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.averagePercentage}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
