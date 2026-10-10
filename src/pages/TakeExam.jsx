import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import ConfirmModal from '../components/ConfirmModal';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [attemptData, setAttemptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' | 'B' | 'C' | 'D' }
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerRef = useRef(null);
  const isAutoSubmitting = useRef(false);

  // 1. Initialize Examination Attempt
  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      try {
        const response = await attemptService.startExam(examId);
        if (response.success && response.data) {
          if (!isMounted) return;
          setAttemptData(response.data);
          setQuestions(response.data.questions || []);
          setRemainingSeconds(response.data.remainingSeconds || 0);
        } else {
          setError(response.message || 'Unable to start examination.');
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || 'Failed to start examination. You may have already completed it.'
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    start();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!isAutoSubmitting.current) {
            isAutoSubmitting.current = true;
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingSeconds]);

  const handleAutoSubmit = async () => {
    alert('Examination time has expired! Your responses are being automatically submitted.');
    await executeSubmission();
  };

  const handleOptionSelect = (optionKey) => {
    const currentQ = questions[currentIndex];
    if (!currentQ || submitting) return;

    const newAnswers = { ...answers, [currentQ.id]: optionKey };
    setAnswers(newAnswers);

    // Save answer asynchronously on backend
    if (attemptData?.attemptId) {
      attemptService
        .saveAnswer(attemptData.attemptId, currentQ.id, optionKey)
        .catch((err) => console.warn('Incremental answer save warning:', err));
    }
  };

  const executeSubmission = async () => {
    if (!attemptData?.attemptId || submitting) return;
    setSubmitting(true);
    setShowSubmitModal(false);

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: Number(qId),
        selectedAnswer: ans,
      }));

      const response = await attemptService.submitExam(attemptData.attemptId, formattedAnswers);
      if (response.success && response.data) {
        navigate(`/student/results/${response.data.id}`, { replace: true });
      } else {
        setError(response.message || 'Submission failed');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error submitting examination.');
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Connecting to Secure Examination Engine...</h2>
        <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Loading questions and server clock...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-narrow" style={{ padding: '4rem 1.5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <AlertTriangle size={52} color="var(--danger-solid)" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Examination Alert</h2>
          <p style={{ color: 'var(--slate-600)', margin: '1rem 0 2rem 0' }}>{error}</p>
          <button onClick={() => navigate('/student/exams')} className="btn btn-primary">
            Return to Available Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = remainingSeconds !== null && remainingSeconds < 300; // < 5 mins

  return (
    <div style={{ backgroundColor: 'var(--slate-100)', minHeight: '100vh', padding: '1.5rem 0' }}>
      <div className="container">
        {/* Top Examination Banner */}
        <div className="exam-header-banner">
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.25rem' }}>
              {attemptData?.examTitle}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-200)' }}>
              Subject: <strong>{attemptData?.subject}</strong> | Total Marks: <strong>{attemptData?.totalMarks}</strong>
            </p>
          </div>

          <div className={`timer-box ${isTimeWarning ? 'warning' : ''}`}>
            <Clock size={22} />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="exam-body-grid">
          {/* Question Display Column */}
          <div>
            {currentQ ? (
              <div className="question-container">
                <div className="question-header">
                  <span className="question-number-badge">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="question-marks-badge">
                    +{currentQ.marks} Marks
                  </span>
                </div>

                <div className="question-text">
                  {currentQ.questionText}
                </div>

                <div className="options-list">
                  {[
                    { key: 'A', text: currentQ.optionA },
                    { key: 'B', text: currentQ.optionB },
                    { key: 'C', text: currentQ.optionC },
                    { key: 'D', text: currentQ.optionD },
                  ].map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.key;
                    return (
                      <div
                        key={opt.key}
                        className={`option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(opt.key)}
                      >
                        <div className="option-key">{opt.key}</div>
                        <div className="option-content">{opt.text}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="exam-nav-controls">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0 || submitting}
                    className="btn btn-secondary"
                  >
                    <ChevronLeft size={18} />
                    <span>Previous</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        <span>Next</span>
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        disabled={submitting}
                        className="btn btn-success"
                      >
                        <Send size={18} />
                        <span>Finish & Submit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <HelpCircle size={40} color="var(--slate-400)" />
                <p>No questions configured for this examination.</p>
              </div>
            )}
          </div>

          {/* Right Question Palette Column */}
          <div>
            <div className="question-palette-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Question Palette</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                Answered: <strong>{answeredCount}</strong> / {totalQuestions}
              </p>

              <div className="palette-grid">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentIndex;

                  let btnClass = 'palette-btn';
                  if (isAnswered) btnClass += ' answered';
                  if (isCurrent) btnClass += ' current';

                  return (
                    <button
                      key={q.id}
                      className={btnClass}
                      onClick={() => setCurrentIndex(idx)}
                      disabled={submitting}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="palette-legend">
                <div className="legend-item">
                  <div className="legend-indicator" style={{ backgroundColor: 'var(--success-solid)' }}></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-indicator" style={{ backgroundColor: 'var(--slate-200)', border: '1px solid var(--slate-300)' }}></div>
                  <span>Unanswered ({totalQuestions - answeredCount})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-indicator" style={{ backgroundColor: 'var(--slate-100)', border: '2px solid var(--primary-600)' }}></div>
                  <span>Current Question</span>
                </div>
              </div>

              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
                className="btn btn-danger"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                <Send size={16} />
                <span>Submit Final Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        title="Submit Examination?"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Once submitted, your examination will be finalized and evaluated immediately.`}
        confirmText={submitting ? 'Evaluating...' : 'Yes, Submit Final Exam'}
        cancelText="Review Questions"
        confirmType="success"
        onConfirm={executeSubmission}
        onCancel={() => setShowSubmitModal(false)}
      />
    </div>
  );
}
