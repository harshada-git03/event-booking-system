import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Landing = () => {
  const categories = [
    { icon: '🎵', label: 'Music', color: '#fce7f3' },
    { icon: '💻', label: 'Technology', color: '#ede9fe' },
    { icon: '🎨', label: 'Art', color: '#d1fae5' },
    { icon: '🎭', label: 'Theatre', color: '#fef3c7' },
    { icon: '🏃', label: 'Sports', color: '#fee2e2' },
    { icon: '🍕', label: 'Food', color: '#e0f2fe' },
  ];

  const stats = [
    { number: '500+', label: 'Events Listed' },
    { number: '50K+', label: 'Happy Attendees' },
    { number: '100+', label: 'Cities' },
    { number: '4.9★', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: '🎟️',
      title: 'Easy Booking',
      desc: 'Book tickets in seconds with our seamless checkout experience.',
      color: '#fce7f3',
    },
    {
      icon: '📧',
      title: 'Instant Confirmation',
      desc: 'Get your PDF ticket instantly in your email after booking.',
      color: '#ede9fe',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Reviews',
      desc: 'Smart sentiment analysis helps you pick the best events.',
      color: '#d1fae5',
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      desc: 'Pay safely with Razorpay — India\'s most trusted payment gateway.',
      color: '#fef3c7',
    },
  ];

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div style={styles.heroBadge}>✨ India's Favourite Event Platform</div>
            <h1 style={styles.heroTitle}>
              Discover & Book<br />
              <span style={styles.heroGradient}>Amazing Events</span><br />
              Near You
            </h1>
            <p style={styles.heroSubtitle}>
              From music festivals to tech conferences — find events that match your vibe,
              book instantly, and create memories that last.
            </p>
            <div style={styles.heroButtons}>
              <Link to="/register">
                <button style={styles.heroPrimary}>Get Started Free 🚀</button>
              </Link>
              <Link to="/login">
                <button style={styles.heroSecondary}>Browse Events</button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            style={styles.heroVisual}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={styles.floatingCard1}>
              <div style={styles.floatingCardIcon}>🎵</div>
              <div>
                <div style={styles.floatingCardTitle}>Pune Music Fest</div>
                <div style={styles.floatingCardSub}>Dec 15 • Shaniwar Wada</div>
                <div style={styles.floatingCardPrice}>₹499</div>
              </div>
            </div>
            <div style={styles.floatingCard2}>
              <div style={styles.floatingCardIcon}>💻</div>
              <div>
                <div style={styles.floatingCardTitle}>Tech Summit 2025</div>
                <div style={styles.floatingCardSub}>Nov 20 • Pune IT Park</div>
                <div style={styles.floatingCardPrice}>₹999</div>
              </div>
            </div>
            <div style={styles.floatingCard3}>
              🎉 <strong>2,400+</strong> tickets booked today!
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              style={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <p style={styles.sectionSubtitle}>Find events that match your interests</p>
          <div style={styles.categoriesGrid}>
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                style={{ ...styles.categoryCard, background: cat.color }}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div style={styles.categoryIcon}>{cat.icon}</div>
                <div style={styles.categoryLabel}>{cat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ ...styles.section, background: 'white' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Why Choose Eventify?</h2>
          <p style={styles.sectionSubtitle}>Everything you need for a perfect event experience</p>
          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                style={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ ...styles.featureIcon, background: f.color }}>
                  {f.icon}
                </div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Find Your Next Event?</h2>
          <p style={styles.ctaSubtitle}>Join thousands of event lovers on Eventify</p>
          <Link to="/register">
            <button style={styles.ctaButton}>Create Free Account →</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerLogo}>🎟️ Eventify</div>
            <div style={styles.footerText}>Made with ❤️ for event lovers</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 50%, #fce7f3 100%)',
    padding: '80px 24px',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '60px',
    width: '100%',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'white',
    border: '1px solid #e9d5ff',
    borderRadius: '50px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#a78bfa',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(167,139,250,0.15)',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#1e1b4b',
    marginBottom: '20px',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#6b7280',
    lineHeight: '1.7',
    marginBottom: '36px',
    maxWidth: '480px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  heroPrimary: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(244,114,182,0.35)',
    transition: 'all 0.3s',
  },
  heroSecondary: {
    background: 'white',
    border: '2px solid #f472b6',
    color: '#f472b6',
    padding: '14px 32px',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  heroVisual: {
    position: 'relative',
    flex: '1',
    minWidth: '320px',
  },
  floatingCard1: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(167,139,250,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    border: '1px solid #e9d5ff',
  },
  floatingCard2: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(167,139,250,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    marginLeft: '40px',
    border: '1px solid #e9d5ff',
  },
  floatingCard3: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    borderRadius: '16px',
    padding: '14px 20px',
    color: 'white',
    fontSize: '14px',
    display: 'inline-block',
    marginLeft: '20px',
  },
  floatingCardIcon: {
    fontSize: '32px',
    width: '52px',
    height: '52px',
    background: '#fdf4ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  floatingCardTitle: {
    fontWeight: '700',
    fontSize: '15px',
    color: '#1e1b4b',
  },
  floatingCardSub: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  floatingCardPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f472b6',
    marginTop: '4px',
  },
  statsSection: {
    background: 'white',
    padding: '40px 24px',
    borderBottom: '1px solid #e9d5ff',
  },
  statsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    textAlign: 'center',
  },
  statCard: {
    padding: '20px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
    marginTop: '4px',
  },
  section: {
    padding: '80px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1e1b4b',
    textAlign: 'center',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '48px',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
  },
  categoryCard: {
    borderRadius: '20px',
    padding: '28px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.8)',
  },
  categoryIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  categoryLabel: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#1e1b4b',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  featureCard: {
    background: '#fdf4ff',
    borderRadius: '20px',
    padding: '32px 24px',
    border: '1px solid #e9d5ff',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    padding: '80px 24px',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '40px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '36px',
  },
  ctaButton: {
    background: 'white',
    border: 'none',
    color: '#f472b6',
    padding: '16px 40px',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
  footer: {
    background: '#1e1b4b',
    padding: '32px 24px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'white',
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
};

export default Landing;