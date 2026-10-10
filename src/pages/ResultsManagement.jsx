import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import Sidebar from '../components/Sidebar';
import { Award, Search, FileText, CheckCircle2, XCircle, AlertCircle, Filter } from 'lucide-react';

export default function ResultsManagement() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultService.getAllResults();
        if (response.success) {
          setResults(response.data || []);
        } else {
          setError(response.message || 'Failed to load results');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to results service.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(search.toLowerCase()) ||
      (r.studentCode && r.studentCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.resultStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Examination Results & Scores</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Comprehensive evaluation logs, candidate scorecards, and grading breakdown.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <input
                type="text"
                placeholder="Search student, exam, or student ID..."
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-600)' }}>Grade Status:</label>
              <select
                className="form-select"
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Grades</option>
                <option value="PASS">PASS Only</option>
                <option value="FAIL">FAIL Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading student score records...</p>
        ) : filteredResults.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <Award size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No Results Found</h3>
            <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>No student submissions matched the criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Candidate</th>
                  <th>Examination</th>
                  <th>Score Obtained</th>
                  <th>Percentage</th>
                  <th>Questions (C/I/U)</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{res.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {res.studentCode || res.studentEmail}
                      </div>
                    </td>
                    <td>
                      <div><strong>{res.examTitle}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{res.subject}</div>
                    </td>
                    <td>
                      <strong>{res.obtainedMarks}</strong> / {res.totalMarks}
                    </td>
                    <td>
                      <strong>{res.percentage}%</strong>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>{res.correctAnswers}✓</span> /{' '}
                      <span style={{ color: 'var(--danger-text)', fontWeight: 600 }}>{res.incorrectAnswers}✗</span> /{' '}
                      <span style={{ color: 'var(--slate-400)' }}>{res.unansweredQuestions}-</span>
                    </td>
                    <td>
                      <span className={`badge ${res.resultStatus === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                        {res.resultStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      {res.createdAt ? new Date(res.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <Link
                        to={`/student/results/${res.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <FileText size={14} />
                        <span>Scorecard</span>
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
