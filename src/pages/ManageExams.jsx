import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '../services/examService';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import {
  FileCheck,
  PlusCircle,
  Edit,
  Trash2,
  HelpCircle,
  Search,
  AlertCircle,
  Clock,
  Award
} from 'lucide-react';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const fetchExams = async () => {
    try {
      const response = await examService.getAllExams();
      if (response.success) {
        setExams(response.data || []);
      } else {
        setError(response.message || 'Unable to load examinations');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to examination service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedExamId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedExamId) return;
    try {
      const res = await examService.deleteExam(selectedExamId);
      if (res.success) {
        setExams(exams.filter((e) => e.id !== selectedExamId));
        setDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete examination.');
    }
  };

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Manage Examinations</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Create, update schedules, configure passing marks, and manage question sets.
            </p>
          </div>

          <Link to="/admin/exams/create" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Create New Exam</span>
          </Link>
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
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="Search by title or subject..."
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-600)' }}>Status:</label>
              <select
                className="form-select"
                style={{ width: '160px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading examinations list...</p>
        ) : filteredExams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <FileCheck size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No Examinations Found</h3>
            <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Create your first examination to get started.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Subject</th>
                  <th>Schedule</th>
                  <th>Duration</th>
                  <th>Total / Pass Marks</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{exam.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{exam.subject}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{exam.examDate}</div>
                      <div style={{ color: 'var(--slate-500)' }}>{exam.startTime}</div>
                    </td>
                    <td>{exam.duration} mins</td>
                    <td>
                      <strong>{exam.totalMarks}</strong> / <span style={{ color: 'var(--success-text)' }}>{exam.passingMarks}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{exam.questionCount || 0} Questions</span>
                    </td>
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
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link
                          to={`/admin/questions?examId=${exam.id}`}
                          className="btn btn-secondary btn-sm"
                          title="Manage Questions"
                        >
                          <HelpCircle size={14} />
                          <span>Questions</span>
                        </Link>
                        <Link
                          to={`/admin/exams/${exam.id}/edit`}
                          className="btn btn-secondary btn-sm"
                          title="Edit Exam"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(exam.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Exam"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Examination?"
          message="Are you sure you want to delete this examination? This will remove all associated questions and student records."
          confirmText="Yes, Delete Examination"
          confirmType="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </main>
    </div>
  );
}
