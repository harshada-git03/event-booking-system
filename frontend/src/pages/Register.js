import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Please login 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
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
            <div style={styles.emoji}>🚀</div>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join thousands of event lovers</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>

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

            <div style={styles.field}>
              <label style={styles.label}>Account Type</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={styles.input}
              >
                <option value="USER">User — Browse & Book Events</option>
                <option value="ADMIN">Admin — Manage Events</option>
              </select>
            </div>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          style={styles.steps}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 style={styles.stepsTitle}>How it works</h3>
          {[
            { step: '1', title: 'Create Account', desc: 'Sign up in seconds — it\'s free!', color: '#fce7f3' },
            { step: '2', title: 'Browse Events', desc: 'Explore hundreds of events near you', color: '#ede9fe' },
            { step: '3', title: 'Book & Pay', desc: 'Secure checkout with Razorpay', color: '#d1fae5' },
            { step: '4', title: 'Get Your Ticket', desc: 'PDF ticket delivered to your email', color: '#fef3c7' },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.stepCard, background: s.color }}>
              <div style={styles.stepNumber}>{s.step}</div>
              <div>
                <div style={styles.stepTitle}>{s.title}</div>
                <div style={styles.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
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
    alignItems: 'flex-start',
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
  emoji: { fontSize: '48px', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: '#6b7280' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#1e1b4b' },
  input: {
    padding: '12px 16px',
    border: '2px solid #e9d5ff',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
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
  footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' },
  link: { color: '#f472b6', fontWeight: '600', textDecoration: 'none' },
  steps: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '12px' },
  stepsTitle: { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' },
  stepCard: {
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '16px',
    color: '#f472b6',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(244,114,182,0.2)',
  },
  stepTitle: { fontWeight: '700', fontSize: '14px', color: '#1e1b4b', marginBottom: '2px' },
  stepDesc: { fontSize: '13px', color: '#6b7280' },
};

export default Register;