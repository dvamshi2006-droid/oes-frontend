import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examService } from '../services/examService';
import Sidebar from '../components/Sidebar';
import {
  FileText,
  Clock,
  Award,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await examService.getExamInstructions(id);
        if (response.success) {
          setExam(response.data);
        } else {
          setError(response.message || 'Exam not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch examination instructions.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [id]);

  const handleStartExam = () => {
    if (!agreed) return;
    navigate(`/student/take-exam/${id}`);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar role="student" />
        <main className="dashboard-main">
          <p style={{ color: 'var(--slate-500)' }}>Loading examination instructions...</p>
        </main>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="dashboard-layout">
        <Sidebar role="student" />
        <main className="dashboard-main">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <AlertTriangle size={48} color="var(--danger-solid)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>Unable to Load Examination</h3>
            <p style={{ color: 'var(--slate-600)', margin: '1rem 0' }}>{error || 'Examination does not exist or is inactive.'}</p>
            <Link to="/student/exams" className="btn btn-primary btn-sm">
              <ArrowLeft size={16} /> Back to Exams
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="dashboard-main">
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/student/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Available Exams</span>
            </Link>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{exam.title}</h1>
            <p style={{ color: 'var(--slate-600)' }}>Subject: <strong>{exam.subject}</strong></p>
          </div>

          {/* Exam Summary Header */}
          <div className="card" style={{ backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>{exam.duration} mins</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Total Marks</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>{exam.totalMarks}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Passing Marks</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success-text)' }}>{exam.passingMarks}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Total Questions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>{exam.questionCount || 0}</div>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--primary-600)" />
              <span>Examination Rules & Instructions</span>
            </h2>

            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--slate-700)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <li><strong>Time Limit & Deadline:</strong> The examination timer begins immediately upon clicking the <em>"Start Examination"</em> button. The timer is managed on the server and will continue even if you refresh your browser.</li>
              <li><strong>Multiple Choice Questions:</strong> Each question has 4 options (A, B, C, D) with exactly one correct answer.</li>
              <li><strong>Navigation:</strong> You can move forward and backward across questions using the <em>"Previous"</em> and <em>"Next"</em> buttons or directly via the Question Palette.</li>
              <li><strong>Answer Saving:</strong> Your selections are saved incrementally. You can change your chosen answer at any time prior to final submission.</li>
              <li><strong>Automatic Submission:</strong> When the remaining countdown timer reaches <code>00:00</code>, your attempt will automatically be finalized and submitted to the evaluation engine.</li>
              <li><strong>Academic Honesty:</strong> Refreshing or closing the tab does not pause the examination countdown. Ensure you have a stable network connection.</li>
            </ol>
          </div>

          {/* Agreement & Action */}
          <div className="card" style={{ border: '1.5px solid var(--slate-300)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                I have carefully read and agreed to abide by all the examination rules and instructions listed above.
              </span>
            </label>

            <button
              onClick={handleStartExam}
              disabled={!agreed}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <Play size={20} />
              <span>Start Examination Now</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
