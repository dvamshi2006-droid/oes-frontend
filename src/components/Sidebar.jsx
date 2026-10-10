import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  PlusCircle,
  HelpCircle,
  Users,
  Award,
  BarChart3,
  BookOpen,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ role = 'admin' }) {
  if (role === 'admin') {
    return (
      <aside className="sidebar">
        <div className="sidebar-title">Administration</div>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-title">Examination Control</div>
        <NavLink
          to="/admin/exams"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FileCheck size={18} />
          <span>Manage Exams</span>
        </NavLink>
        <NavLink
          to="/admin/exams/create"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Create New Exam</span>
        </NavLink>
        <NavLink
          to="/admin/questions"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <HelpCircle size={18} />
          <span>Question Bank</span>
        </NavLink>

        <div className="sidebar-title">Students & Analytics</div>
        <NavLink
          to="/admin/students"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Student Records</span>
        </NavLink>
        <NavLink
          to="/admin/results"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Award size={18} />
          <span>Results & Scores</span>
        </NavLink>
        <NavLink
          to="/admin/statistics"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <BarChart3 size={18} />
          <span>Exam Statistics</span>
        </NavLink>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Student Portal</div>
      <NavLink
        to="/student/dashboard"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        <span>My Dashboard</span>
      </NavLink>
      <NavLink
        to="/student/exams"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <BookOpen size={18} />
        <span>Available Exams</span>
      </NavLink>
      <NavLink
        to="/student/history"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Award size={18} />
        <span>My Results</span>
      </NavLink>
      <NavLink
        to="/student/profile"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <UserCheck size={18} />
        <span>My Profile</span>
      </NavLink>
    </aside>
  );
}
