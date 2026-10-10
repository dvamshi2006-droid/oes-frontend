import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { examService } from '../services/examService';
import Sidebar from '../components/Sidebar';
import { PlusCircle, ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function CreateExam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Exam title is required';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.examDate) errs.examDate = 'Date is required';
    if (!formData.startTime) errs.startTime = 'Start time is required';
    if (formData.duration <= 0) errs.duration = 'Duration must be greater than 0';
    if (formData.totalMarks <= 0) errs.totalMarks = 'Total marks must be positive';
    if (formData.passingMarks < 0) errs.passingMarks = 'Passing marks cannot be negative';
    if (Number(formData.passingMarks) > Number(formData.totalMarks)) {
      errs.passingMarks = 'Passing marks cannot exceed total marks';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setLoading(true);
    try {
      // Ensure formatted time HH:mm:ss for backend
      const formattedTime = formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime;
      const payload = {
        ...formData,
        startTime: formattedTime,
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
      };

      const response = await examService.createExam(payload);
      if (response.success && response.data) {
        // Redirect to question manager for the newly created exam
        navigate(`/admin/questions?examId=${response.data.id}`);
      } else {
        setGeneralError(response.message || 'Failed to create examination');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || 'Error creating examination record.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/admin/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Exams List</span>
            </Link>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Create New Examination</h1>
            <p style={{ color: 'var(--slate-600)' }}>Configure examination parameters, scoring threshold, and duration</p>
          </div>

          {generalError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} />
              <span>{generalError}</span>
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Examination Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Advanced Java Programming"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Subject / Discipline</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Computer Science"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE (Ready for student attempts)</option>
                    <option value="UPCOMING">UPCOMING (Scheduled for future)</option>
                    <option value="COMPLETED">COMPLETED (Archived / Closed)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Provide syllabus summary or candidate instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Exam Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  />
                  {errors.examDate && <span className="form-error">{errors.examDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Scheduled Start Time</label>
                  <input
                    type="time"
                    required
                    className="form-control"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                  {errors.startTime && <span className="form-error">{errors.startTime}</span>}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                  {errors.duration && <span className="form-error">{errors.duration}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Total Marks</label>
                  <input
                    type="number"
                    min={1}
                    required
                    className="form-control"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  />
                  {errors.totalMarks && <span className="form-error">{errors.totalMarks}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Passing Marks</label>
                  <input
                    type="number"
                    min={0}
                    required
                    className="form-control"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                  />
                  {errors.passingMarks && <span className="form-error">{errors.passingMarks}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem' }}>
                <Link to="/admin/exams" className="btn btn-secondary">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  <span>{loading ? 'Creating...' : 'Save & Add Questions'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
