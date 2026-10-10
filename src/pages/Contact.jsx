import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Administration & Support</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', marginBottom: '2.5rem' }}>
          Have inquiries regarding examination schedules, accounts, or technical issues? Get in touch with our team.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Send a Message</h2>
            {submitted ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="var(--success-solid)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                  Thank you for reaching out. Our support team will respond to your email shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1.25rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message / Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    className="form-control"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Send size={16} />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="var(--primary-600)" />
                  <span>support@eduexam.portal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="var(--primary-600)" />
                  <span>+1 (800) 555-0199</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={18} color="var(--primary-600)" />
                  <span>University Assessment Center, Academic Hall 4</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>Examination Guidelines</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                Ensure your internet connection is stable prior to initiating an examination attempt. Once started, the timer cannot be paused.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
