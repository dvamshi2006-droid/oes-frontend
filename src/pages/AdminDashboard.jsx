import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import {
  Users,
  FileCheck,
  HelpCircle,
  Award,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to load statistics');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to administrative analytics backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Administrator Command Center</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Real-time assessment metrics, examination management, and student performance oversight.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/exams/create" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create Examination</span>
            </Link>
            <Link to="/admin/questions" className="btn btn-secondary">
              <HelpCircle size={16} />
              <span>Question Bank</span>
            </Link>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Metric Stat Cards */}
        <div className="stat-grid">
          <StatCard
            label="Total Students"
            value={stats?.totalStudents ?? 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Total Examinations"
            value={stats?.totalExams ?? 0}
            icon={FileCheck}
            color="purple"
          />
          <StatCard
            label="Active Exams"
            value={stats?.activeExams ?? 0}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            label="Total Questions"
            value={stats?.totalQuestions ?? 0}
            icon={HelpCircle}
            color="amber"
          />
        </div>

        {/* Secondary Stat Grid */}
        <div className="stat-grid">
          <StatCard
            label="Total Attempts"
            value={stats?.totalAttempts ?? 0}
            icon={Award}
            color="blue"
          />
          <StatCard
            label="Passed Tests"
            value={stats?.passCount ?? 0}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Failed Tests"
            value={stats?.failCount ?? 0}
            icon={XCircle}
            color="red"
          />
          <StatCard
            label="Overall Avg Score"
            value={`${stats?.averagePercentage ?? 0}%`}
            icon={BarChart3}
            color="purple"
          />
        </div>

        {/* Recent Data Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
          {/* Recent Exams */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Examinations</h2>
              <Link to="/admin/exams" className="btn btn-outline btn-sm">
                Manage All
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--slate-500)' }}>Loading exams...</p>
            ) : !stats?.recentExams || stats.recentExams.length === 0 ? (
              <p style={{ color: 'var(--slate-500)' }}>No examinations created yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentExams.map((exam) => (
                      <tr key={exam.id}>
                        <td><strong>{exam.title}</strong></td>
                        <td>{exam.subject}</td>
                        <td>{exam.duration}m</td>
                        <td>
                          <span className={`badge ${
                            exam.status === 'ACTIVE'
                              ? 'badge-success'
                              : exam.status === 'UPCOMING'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}>
                            {exam.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/exams/${exam.id}/edit`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Latest Student Submissions</h2>
              <Link to="/admin/results" className="btn btn-outline btn-sm">
                All Results
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--slate-500)' }}>Loading results...</p>
            ) : !stats?.recentResults || stats.recentResults.length === 0 ? (
              <p style={{ color: 'var(--slate-500)' }}>No student submissions recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentResults.map((res) => (
                      <tr key={res.id}>
                        <td>
                          <strong>{res.studentName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{res.studentCode || res.studentEmail}</div>
                        </td>
                        <td>{res.examTitle}</td>
                        <td>{res.obtainedMarks}/{res.totalMarks}</td>
                        <td>{res.percentage}%</td>
                        <td>
                          <span className={`badge ${res.resultStatus === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                            {res.resultStatus}
                          </span>
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
