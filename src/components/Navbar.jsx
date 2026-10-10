import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User, LayoutDashboard, FileText, CheckCircle2, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={26} />
          </div>
          <span>EduExam Portal</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {isStudent && (
                  <>
                    <li>
                      <Link
                        to="/student/dashboard"
                        className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/student/exams"
                        className={`nav-link ${isActive('/student/exams') ? 'active' : ''}`}
                      >
                        Available Exams
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/student/history"
                        className={`nav-link ${isActive('/student/history') ? 'active' : ''}`}
                      >
                        My Results
                      </Link>
                    </li>
                  </>
                )}

                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                  <Link to="/student/profile" className="nav-user-badge" title="View Profile">
                    {isAdmin ? <Shield size={16} color="#2563eb" /> : <User size={16} color="#059669" />}
                    <span>{user?.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    title="Log Out"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li style={{ display: 'flex', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
