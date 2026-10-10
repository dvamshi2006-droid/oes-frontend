import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '../services/examService';
import Sidebar from '../components/Sidebar';
import { BookOpen, Clock, Award, CheckCircle2, ArrowRight, AlertCircle, Search } from 'lucide-react';

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examService.getAvailableExams();
        if (response.success) {
          setExams(response.data || []);
        } else {
          setError(response.message || 'Unable to load examinations');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch available examinations.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Available Examinations</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Select an active examination to review instructions and start your timed attempt.
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search by exam or subject..."
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--slate-500)' }}>Loading examinations...</p>
        ) : filteredExams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <BookOpen size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Examinations Found</h3>
            <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0 auto' }}>
              There are currently no active examinations matching your criteria. Check back later or contact your instructor.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredExams.map((exam) => (
              <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-info">{exam.subject}</span>
                  <span className="badge badge-success">{exam.status}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>{exam.title}</h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                  {exam.description || 'Comprehensive assessment covering core syllabus concepts and applications.'}
                </p>

                <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="var(--primary-600)" />
                    <span>Duration: <strong>{exam.duration} mins</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={16} color="var(--primary-600)" />
                    <span>Total Marks: <strong>{exam.totalMarks}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="var(--success-solid)" />
                    <span>Pass Marks: <strong>{exam.passingMarks}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={16} color="var(--primary-600)" />
                    <span>Questions: <strong>{exam.questionCount || 0}</strong></span>
                  </div>
                </div>

                <Link to={`/student/exams/${exam.id}/instructions`} className="btn btn-primary" style={{ width: '100%' }}>
                  <span>View Instructions & Start</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
