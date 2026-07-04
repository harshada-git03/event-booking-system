import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          🎟️ <span style={styles.logoText}>Eventify</span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          {isLoggedIn() && (
            <>
              <Link to="/events" style={{
                ...styles.link,
                ...(isActive('/events') ? styles.activeLink : {})
              }}>Events</Link>
              <Link to="/my-bookings" style={{
                ...styles.link,
                ...(isActive('/my-bookings') ? styles.activeLink : {})
              }}>My Bookings</Link>
              {isAdmin() && (
                <Link to="/admin" style={{
                  ...styles.link,
                  ...(isActive('/admin') ? styles.activeLink : {})
                }}>Dashboard</Link>
              )}
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={styles.authButtons}>
          {isLoggedIn() ? (
            <div style={styles.userSection}>
              <div style={styles.avatar}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span style={styles.userName}>{user?.email?.split('@')[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button style={styles.loginBtn}>Login</button>
              </Link>
              <Link to="/register">
                <button style={styles.registerBtn}>Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #e9d5ff',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(167,139,250,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '22px',
    fontWeight: '800',
    textDecoration: 'none',
  },
  logoText: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '15px',
    transition: 'color 0.2s',
    padding: '4px 0',
    borderBottom: '2px solid transparent',
  },
  activeLink: {
    color: '#f472b6',
    borderBottom: '2px solid #f472b6',
  },
  authButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  loginBtn: {
    background: 'transparent',
    border: '2px solid #f472b6',
    color: '#f472b6',
    padding: '8px 20px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(244,114,182,0.3)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  userName: {
    fontWeight: '600',
    color: '#1e1b4b',
    fontSize: '14px',
  },
  logoutBtn: {
    background: '#fee2e2',
    border: 'none',
    color: '#f87171',
    padding: '8px 16px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default Navbar;