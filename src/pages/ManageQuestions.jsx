import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { examService } from '../services/examService';
import { questionService } from '../services/questionService';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import {
  HelpCircle,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  X,
  Save,
  Check
} from 'lucide-react';

export default function ManageQuestions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialExamId = searchParams.get('examId');

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(initialExamId || '');
  const [questions, setQuestions] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [modalForm, setModalForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 10,
  });
  const [modalError, setModalError] = useState('');
  const [modalSaving, setModalSaving] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Fetch all exams for dropdown
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examService.getAllExams();
        if (response.success && response.data) {
          setExams(response.data);
          if (!selectedExamId && response.data.length > 0) {
            setSelectedExamId(response.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch examinations list.');
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, []);

  // Fetch questions when selectedExamId changes
  useEffect(() => {
    if (!selectedExamId) return;

    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      setError('');
      try {
        const response = await questionService.getQuestionsByExam(selectedExamId);
        if (response.success) {
          setQuestions(response.data || []);
        } else {
          setError(response.message || 'Failed to load questions.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching questions for this examination.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
    setSearchParams({ examId: selectedExamId });
  }, [selectedExamId]);

  const handleOpenAddModal = () => {
    setEditingQuestionId(null);
    setModalForm({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 10,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestionId(q.id);
    setModalForm({
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setModalError('');

    if (
      !modalForm.questionText.trim() ||
      !modalForm.optionA.trim() ||
      !modalForm.optionB.trim() ||
      !modalForm.optionC.trim() ||
      !modalForm.optionD.trim()
    ) {
      setModalError('Question text and all 4 options (A, B, C, D) are required.');
      return;
    }

    setModalSaving(true);
    try {
      if (editingQuestionId) {
        // Update
        const res = await questionService.updateQuestion(editingQuestionId, {
          ...modalForm,
          marks: Number(modalForm.marks),
        });
        if (res.success) {
          setQuestions(
            questions.map((q) => (q.id === editingQuestionId ? res.data : q))
          );
          setIsModalOpen(false);
        } else {
          setModalError(res.message || 'Failed to update question');
        }
      } else {
        // Add
        const res = await questionService.addQuestion(selectedExamId, {
          ...modalForm,
          marks: Number(modalForm.marks),
        });
        if (res.success && res.data) {
          setQuestions([...questions, res.data]);
          setIsModalOpen(false);
        } else {
          setModalError(res.message || 'Failed to add question');
        }
      }
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Error saving question to database.');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteClick = (qId) => {
    setQuestionToDelete(qId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      const res = await questionService.deleteQuestion(questionToDelete);
      if (res.success) {
        setQuestions(questions.filter((q) => q.id !== questionToDelete));
        setDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting question.');
    }
  };

  const selectedExam = exams.find((e) => e.id.toString() === selectedExamId);

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Question Bank & Multiple Choice Editor</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Create and manage multiple-choice questions, options, correct answers, and marks allocation.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            disabled={!selectedExamId}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>Add New Question</span>
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Exam Selector Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              <label style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                Select Examination:
              </label>
              <select
                className="form-select"
                style={{ backgroundColor: '#ffffff' }}
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.subject}) - Total Marks: {ex.totalMarks}
                  </option>
                ))}
              </select>
            </div>

            {selectedExam && (
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                <span>Total Marks: <strong>{selectedExam.totalMarks}</strong></span>
                <span>Pass Marks: <strong>{selectedExam.passingMarks}</strong></span>
                <span>Questions in Exam: <strong>{questions.length}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Questions List */}
        {loadingQuestions ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading questions for selected exam...</p>
        ) : questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <HelpCircle size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No Questions Configured</h3>
            <p style={{ color: 'var(--slate-500)', margin: '0.5rem 0 1.5rem 0' }}>
              This examination does not have any questions yet. Add questions with 4 options and set the correct answer.
            </p>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Add First Question</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, index) => (
              <div key={q.id} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-600)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {index + 1}
                    </span>
                    <span className="badge badge-info">+{q.marks} Marks</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Question"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(q.id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
                  {q.questionText}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'A', text: q.optionA },
                    { key: 'B', text: q.optionB },
                    { key: 'C', text: q.optionC },
                    { key: 'D', text: q.optionD },
                  ].map((opt) => {
                    const isCorrect = q.correctAnswer === opt.key;
                    return (
                      <div
                        key={opt.key}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${isCorrect ? 'var(--success-solid)' : 'var(--slate-200)'}`,
                          backgroundColor: isCorrect ? 'var(--success-bg)' : 'var(--slate-50)',
                          color: isCorrect ? 'var(--success-text)' : 'var(--slate-800)',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem'
                        }}
                      >
                        <strong>{opt.key}.</strong>
                        <span>{opt.text}</span>
                        {isCorrect && (
                          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-solid)' }}>
                            <Check size={14} /> CORRECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                  {editingQuestionId ? 'Edit Multiple Choice Question' : 'Add Multiple Choice Question'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveQuestion}>
                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <textarea
                    required
                    rows={3}
                    className="form-control"
                    placeholder="Enter question statement..."
                    value={modalForm.questionText}
                    onChange={(e) => setModalForm({ ...modalForm, questionText: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Option A</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Option A text"
                      value={modalForm.optionA}
                      onChange={(e) => setModalForm({ ...modalForm, optionA: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Option B</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Option B text"
                      value={modalForm.optionB}
                      onChange={(e) => setModalForm({ ...modalForm, optionB: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Option C</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Option C text"
                      value={modalForm.optionC}
                      onChange={(e) => setModalForm({ ...modalForm, optionC: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Option D</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Option D text"
                      value={modalForm.optionD}
                      onChange={(e) => setModalForm({ ...modalForm, optionD: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-select"
                      value={modalForm.correctAnswer}
                      onChange={(e) => setModalForm({ ...modalForm, correctAnswer: e.target.value })}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Marks Awarded</label>
                    <input
                      type="number"
                      min={1}
                      required
                      className="form-control"
                      value={modalForm.marks}
                      onChange={(e) => setModalForm({ ...modalForm, marks: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={modalSaving} className="btn btn-primary">
                    <Save size={16} />
                    <span>{modalSaving ? 'Saving...' : 'Save Question'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Question?"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Yes, Delete Question"
          confirmType="danger"
          onConfirm={confirmDeleteQuestion}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </main>
    </div>
  );
}
