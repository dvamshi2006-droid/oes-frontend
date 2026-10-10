import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isAdmin, isStudent } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
        color: '#ffffff',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Sparkles size={16} color="#38bdf8" />
              <span>Full Stack Java + Spring Boot + React Assessment Portal</span>
            </div>

            <h1 style={{
              fontSize: '3.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              Next-Generation Online Examination System
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#cbd5e1',
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}>
              Conduct secure, time-limited multiple-choice examinations with real-time countdown timers, server-side deadline enforcement, automatic score evaluation, and comprehensive academic analytics.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                isAdmin ? (
                  <Link to="/admin/dashboard" className="btn btn-primary btn-lg" style={{ background: '#ffffff', color: 'var(--primary-800)' }}>
                    <span>Open Admin Dashboard</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <Link to="/student/dashboard" className="btn btn-primary btn-lg" style={{ background: '#ffffff', color: 'var(--primary-800)' }}>
                    <span>Go to Student Portal</span>
                    <ArrowRight size={18} />
                  </Link>
                )
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary btn-lg" style={{ background: '#ffffff', color: 'var(--primary-800)' }}>
                    <span>Student / Admin Sign In</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                    <span>Register as Student</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Key System Features
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Engineered for Academic Integrity & Speed
            </h2>
            <p style={{ color: 'var(--slate-600)' }}>
              A robust platform providing seamless test-taking experiences for students and comprehensive management tools for educators.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Server-Timed Examinations</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Exams enforce strict server-side deadlines. Countdown timers sync with the backend, preventing client-side manipulation or clock drift.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-bg)', color: 'var(--success-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Instant Automatic Evaluation</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Submissions are instantly graded upon completion with precise calculation of correct, incorrect, and unanswered questions.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Secure Role Authorization</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Built with Spring Security and JWT. Answer keys are strictly withheld on the backend until post-submission evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Box */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--slate-100)' }}>
        <div className="container">
          <div className="card" style={{ background: '#ffffff', border: '1.5px solid var(--primary-200)', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <BookOpen size={24} color="var(--primary-600)" />
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Quick Development & Demonstration Access</h3>
            </div>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              The database is pre-seeded with ready-to-use testing credentials:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">Administrator</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <div><strong>Email:</strong> <code>admin@example.com</code></div>
                  <div><strong>Password:</strong> <code>admin123</code></div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Permissions: Create exams, manage questions, view all results and student records.
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success">Student</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <div><strong>Email:</strong> <code>student@example.com</code></div>
                  <div><strong>Password:</strong> <code>student123</code></div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Permissions: View available tests, take timed examinations, receive instant evaluated marks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
