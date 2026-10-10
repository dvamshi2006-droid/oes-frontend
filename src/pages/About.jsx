import React from 'react';
import { Layers, Database, Shield, Cpu, Code2, Server } from 'lucide-react';

export default function About() {
  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About Online Examination System</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          A robust, production-ready Full Stack web application engineered with Spring Boot, React, and MySQL, designed for academic institutions, certifications, and corporate assessment needs.
        </p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={22} color="var(--primary-600)" />
            <span>Architecture & Technology Stack</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <strong>Frontend Layer</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
                React 18+, Vite, React Router 6, Axios, Modern Responsive Design System.
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <strong>Backend Layer</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
                Java 17+, Spring Boot 3.2, Spring Security with JJWT, Spring Data JPA.
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <strong>Database Layer</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
                MySQL 8.0+ relational schema with foreign key constraints, indexes & ACID transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={22} color="var(--success-solid)" />
            <span>Key Engineering Principles</span>
          </h2>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--slate-700)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            <li><strong>Server-Authoritative Evaluation:</strong> Scoring and pass/fail determinations are strictly calculated by Spring Boot; client answers are only validated as inputs.</li>
            <li><strong>Data Integrity & Security:</strong> Correct answers are never sent to students before an examination attempt is finalized.</li>
            <li><strong>Tamper Resistance:</strong> Exam duration deadlines are tracked on the server to prevent local system clock modifications.</li>
            <li><strong>Idempotent Submissions:</strong> Multiple rapid submission clicks are handled idempotently to eliminate duplicate results.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
