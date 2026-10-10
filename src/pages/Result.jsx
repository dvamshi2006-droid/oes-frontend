import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import Sidebar from '../components/Sidebar';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Check,
  X,
  HelpCircle
} from 'lucide-react';

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await resultService.getResultById(id);
        if (response.success && response.data) {
          setResult(response.data);
        } else {
          setError(response.message || 'Unable to retrieve result.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch examination result details.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar role="student" />
        <main className="dashboard-main">
          <p style={{ color: 'var(--slate-500)' }}>Retrieving evaluated score and performance report...</p>
        </main>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="dashboard-layout">
        <Sidebar role="student" />
        <main className="dashboard-main">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertCircle size={48} color="var(--danger-solid)" style={{ margin: '0 auto 1rem auto' }} />
            <h2>Result Not Found</h2>
            <p style={{ color: 'var(--slate-600)', margin: '1rem 0' }}>{error || 'Unable to find this result record.'}</p>
            <Link to="/student/history" className="btn btn-primary btn-sm">
              <ArrowLeft size={16} /> Back to History
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isPass = result.resultStatus === 'PASS';

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="dashboard-main">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <Link to="/student/history" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
                <ArrowLeft size={16} />
                <span>Back to Result History</span>
              </Link>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Examination Scorecard</h1>
              <p style={{ color: 'var(--slate-600)' }}>{result.examTitle} ({result.subject})</p>
            </div>

            <Link to="/student/exams" className="btn btn-outline btn-sm">
              Take Another Exam
            </Link>
          </div>

          {/* Performance Hero Card */}
          <div className="card" style={{
            background: isPass
              ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
              : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
            color: '#ffffff',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginBottom: '1rem'
            }}>
              {isPass ? <CheckCircle2 size={36} color="#ffffff" /> : <XCircle size={36} color="#ffffff" />}
            </div>

            <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
              {isPass ? 'CONGRATULATIONS! PASSED' : 'EXAMINATION FAILED'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.75rem' }}>
              {isPass
                ? 'You have successfully cleared this examination assessment.'
                : 'You did not achieve the required passing marks. Please review and try again.'}
            </p>

            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>Marks Obtained</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{result.obtainedMarks} / {result.totalMarks}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>Percentage</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{result.percentage}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>Status</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{result.resultStatus}</div>
              </div>
            </div>
          </div>

          {/* Breakdown Statistics Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Performance Breakdown</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>Total Questions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--slate-900)' }}>{result.totalQuestions}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--primary-800)', fontSize: '0.8rem', fontWeight: 600 }}>Attempted</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-900)' }}>{result.attemptedQuestions}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--success-text)', fontSize: '0.8rem', fontWeight: 600 }}>Correct Answers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success-solid)' }}>{result.correctAnswers}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--danger-text)', fontSize: '0.8rem', fontWeight: 600 }}>Incorrect Answers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger-solid)' }}>{result.incorrectAnswers}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--warning-text)', fontSize: '0.8rem', fontWeight: 600 }}>Unanswered</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--warning-solid)' }}>{result.unansweredQuestions}</div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          {result.reviewAnswers && result.reviewAnswers.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Detailed Answer Evaluation Review</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {result.reviewAnswers.map((item, index) => {
                  const isCorrect = item.isCorrect;
                  const isUnanswered = !item.selectedAnswer;

                  return (
                    <div
                      key={item.questionId || index}
                      className="card"
                      style={{
                        borderLeft: `5px solid ${
                          isCorrect
                            ? 'var(--success-solid)'
                            : isUnanswered
                            ? 'var(--warning-solid)'
                            : 'var(--danger-solid)'
                        }`,
                        marginBottom: 0
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
                          Question {index + 1}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className={`badge ${
                            isCorrect
                              ? 'badge-success'
                              : isUnanswered
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}>
                            {isCorrect ? 'Correct (+ ' + item.marksAwarded + ' Marks)' : isUnanswered ? 'Not Attempted (0 Marks)' : 'Incorrect (0 Marks)'}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '1rem' }}>
                        {item.questionText}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                        {[
                          { key: 'A', text: item.optionA },
                          { key: 'B', text: item.optionB },
                          { key: 'C', text: item.optionC },
                          { key: 'D', text: item.optionD },
                        ].map((opt) => {
                          const isSelectedByStudent = item.selectedAnswer === opt.key;
                          const isActualCorrect = item.correctAnswer === opt.key;

                          let bg = 'var(--slate-50)';
                          let border = 'var(--slate-200)';
                          let text = 'var(--slate-800)';

                          if (isActualCorrect) {
                            bg = 'var(--success-bg)';
                            border = 'var(--success-solid)';
                            text = 'var(--success-text)';
                          } else if (isSelectedByStudent && !isCorrect) {
                            bg = 'var(--danger-bg)';
                            border = 'var(--danger-solid)';
                            text = 'var(--danger-text)';
                          }

                          return (
                            <div
                              key={opt.key}
                              style={{
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-sm)',
                                border: `1.5px solid ${border}`,
                                backgroundColor: bg,
                                color: text,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <strong>{opt.key}.</strong>
                              <span>{opt.text}</span>
                              {isActualCorrect && <Check size={16} color="var(--success-solid)" style={{ marginLeft: 'auto' }} />}
                              {isSelectedByStudent && !isCorrect && <X size={16} color="var(--danger-solid)" style={{ marginLeft: 'auto' }} />}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', borderTop: '1px solid var(--slate-100)', paddingTop: '0.75rem', display: 'flex', gap: '1.5rem' }}>
                        <span>Your Answer: <strong>{item.selectedAnswer || 'None'}</strong></span>
                        <span>Correct Answer: <strong style={{ color: 'var(--success-text)' }}>{item.correctAnswer}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
