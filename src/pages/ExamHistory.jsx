import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import Sidebar from '../components/Sidebar';
import { Award, Calendar, CheckCircle2, XCircle, ArrowRight, AlertCircle, FileText } from 'lucide-react';

export default function ExamHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await resultService.getMyHistory();
        if (response.success) {
          setHistory(response.data || []);
        } else {
          setError(response.message || 'Unable to load history');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your examination history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>My Examination History</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Review past tests, verified scores, and performance scorecards.
            </p>
          </div>

          <Link to="/student/exams" className="btn btn-primary btn-sm">
            Take New Exam
          </Link>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading examination history...</p>
        ) : history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <Award size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Examination History</h3>
            <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              You haven't attempted any tests yet. Check out available examinations to get started.
            </p>
            <Link to="/student/exams" className="btn btn-primary">
              View Available Exams
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Examination Title</th>
                  <th>Subject</th>
                  <th>Date Attempted</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Scorecard</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.examTitle}</strong>
                    </td>
                    <td>
                      <span className="badge badge-info">{item.subject}</span>
                    </td>
                    <td style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <strong>{item.obtainedMarks}</strong> / {item.totalMarks}
                    </td>
                    <td>
                      <strong>{item.percentage}%</strong>
                    </td>
                    <td>
                      <span className={`badge ${item.resultStatus === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                        {item.resultStatus}
                      </span>
                    </td>
                    <td>
                      <Link to={`/student/results/${item.id}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={14} />
                        <span>View Review</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
