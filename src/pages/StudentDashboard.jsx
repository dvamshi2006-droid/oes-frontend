import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/examService';
import { resultService } from '../services/resultService';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { BookOpen, CheckCircle, Award, Clock, ArrowRight, Play, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          examService.getAvailableExams(),
          resultService.getMyResults(),
        ]);

        if (examsRes.success) setAvailableExams(examsRes.data || []);
        if (resultsRes.success) setResults(resultsRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard records from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const passCount = results.filter((r) => r.resultStatus === 'PASS').length;
  const avgPercentage =
    results.length > 0
      ? Math.round(
          (results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length) * 10
        ) / 10
      : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="dashboard-main">
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ color: 'var(--primary-100)', fontSize: '0.95rem' }}>
              Student ID: <strong>{user?.studentId || 'N/A'}</strong> | Email: <strong>{user?.email}</strong>
            </p>
          </div>
          <Link to="/student/exams" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--primary-800)' }}>
            <Play size={16} />
            <span>Take An Examination</span>
          </Link>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stat-grid">
          <StatCard
            label="Available Exams"
            value={availableExams.length}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            label="Exams Completed"
            value={results.length}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            label="Tests Passed"
            value={passCount}
            icon={Award}
            color="amber"
          />
          <StatCard
            label="Average Score"
            value={`${avgPercentage}%`}
            icon={Clock}
            color="purple"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {/* Available Exams Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Active Examinations</h2>
              <Link to="/student/exams" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--slate-500)', padding: '1rem 0' }}>Loading available tests...</p>
            ) : availableExams.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', padding: '1rem 0' }}>No active examinations currently available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {availableExams.slice(0, 3).map((exam) => (
                  <div
                    key={exam.id}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'var(--slate-50)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{exam.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                        Subject: <strong>{exam.subject}</strong> • Duration: <strong>{exam.duration} mins</strong> • Marks: <strong>{exam.totalMarks}</strong>
                      </p>
                    </div>
                    <Link to={`/student/exams/${exam.id}/instructions`} className="btn btn-primary btn-sm">
                      <span>Start</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Result History</h2>
              <Link to="/student/history" className="btn btn-outline btn-sm">
                Full History
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--slate-500)', padding: '1rem 0' }}>Loading results...</p>
            ) : results.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', padding: '1rem 0' }}>You haven't completed any examinations yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 4).map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.examTitle}</td>
                        <td>{r.obtainedMarks} / {r.totalMarks}</td>
                        <td>{r.percentage}%</td>
                        <td>
                          <span className={`badge ${r.resultStatus === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                            {r.resultStatus}
                          </span>
                        </td>
                        <td>
                          <Link to={`/student/results/${r.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
