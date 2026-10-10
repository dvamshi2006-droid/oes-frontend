import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--slate-200)',
      padding: '2.5rem 0 1.5rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--slate-100)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Online Examination System</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: 0 }}>
                Enterprise academic assessment platform
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            <span>Secure Role-based Portal</span>
            <span>•</span>
            <span>Real-time Auto Evaluation</span>
            <span>•</span>
            <span>Server-Authoritative Clock</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          paddingTop: '1.25rem',
          fontSize: '0.85rem',
          color: 'var(--slate-500)'
        }}>
          <p>© {new Date().getFullYear()} Online Examination System. All rights reserved.</p>
          <p>Java Full Stack Web Application (Spring Boot + React + MySQL)</p>
        </div>
      </div>
    </footer>
  );
}
