import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login({ email: res.data.email, role: res.data.role }, res.data.token);
      toast.success('Welcome back! 🎉');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.header}>
            <div style={styles.emoji}>🎟️</div>
            <h1 style={styles.title}>Welcome Back!</h1>
            <p style={styles.subtitle}>Login to discover amazing events</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Register here</Link>
          </p>
        </motion.div>

        {/* Side Visual */}
        <motion.div
          style={styles.visual}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={styles.visualCard}>
            <div style={styles.visualEmoji}>🎵</div>
            <h3 style={styles.visualTitle}>500+ Events</h3>
            <p style={styles.visualText}>Discover music, tech, art and more</p>
          </div>
          <div style={styles.visualCard2}>
            <div style={styles.visualEmoji}>📧</div>
            <h3 style={styles.visualTitle}>Instant Tickets</h3>
            <p style={styles.visualText}>PDF tickets delivered to your inbox</p>
          </div>
          <div style={styles.visualCard3}>
            <div style={styles.visualEmoji}>🤖</div>
            <h3 style={styles.visualTitle}>AI Reviews</h3>
            <p style={styles.visualText}>Smart sentiment analysis on reviews</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 50%, #fce7f3 100%)',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '60px 24px',
    display: 'flex',
    gap: '60px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 8px 40px rgba(167,139,250,0.15)',
    border: '1px solid #e9d5ff',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  emoji: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e1b4b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e1b4b',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e9d5ff',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border 0.2s',
    color: '#1e1b4b',
  },
  btn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(244,114,182,0.3)',
    marginTop: '8px',
    fontFamily: 'Poppins, sans-serif',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#6b7280',
  },
  link: {
    color: '#f472b6',
    fontWeight: '600',
    textDecoration: 'none',
  },
  visual: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: '1',
  },
  visualCard: {
    background: '#fce7f3',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #fbcfe8',
  },
  visualCard2: {
    background: '#ede9fe',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #ddd6fe',
    marginLeft: '24px',
  },
  visualCard3: {
    background: '#d1fae5',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #a7f3d0',
  },
  visualEmoji: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  visualTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: '4px',
  },
  visualText: {
    fontSize: '13px',
    color: '#6b7280',
  },
};

export default Login;