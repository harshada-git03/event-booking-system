import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getReviewsByEvent, getEventSentimentSummary, createReview, getEventById } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

// Mock data for demo when API fails
const mockReviews = [
  { id: 1, user: { name: 'Priya S.' }, rating: 5, comment: 'Absolutely amazing event! The atmosphere was electric and the organization was top-notch.', sentiment: 'POSITIVE', aiSummary: 'Reviewer had an outstanding experience with excellent organization and atmosphere.' },
  { id: 2, user: { name: 'Rahul M.' }, rating: 4, comment: 'Great event overall. Music was fantastic but parking was a bit difficult.', sentiment: 'POSITIVE', aiSummary: 'Positive experience with minor inconvenience regarding parking facilities.' },
  { id: 3, user: { name: 'Sneha K.' }, rating: 3, comment: 'Event was okay. Expected more from the lineup but venue was nice.', sentiment: 'NEUTRAL', aiSummary: 'Mixed feelings with reasonable satisfaction about venue but disappointment with lineup.' },
  { id: 4, user: { name: 'Amit P.' }, rating: 2, comment: 'Long queues and poor sound quality made it a disappointing experience.', sentiment: 'NEGATIVE', aiSummary: 'Negative experience due to operational issues with queues and audio quality.' },
  { id: 5, user: { name: 'Kavya R.' }, rating: 5, comment: 'Best event I have attended this year! Will definitely come back next time.', sentiment: 'POSITIVE', aiSummary: 'Highly enthusiastic reviewer with strong intent to attend future events.' },
];

const mockSummary = {
  totalReviews: 5,
  positiveCount: 3,
  negativeCount: 1,
  neutralCount: 1,
  averageRating: 3.8,
  overallSentiment: 'POSITIVE',
};

const sentimentConfig = {
  POSITIVE: { color: '#059669', bg: '#d1fae5', icon: '😊', label: 'Positive' },
  NEGATIVE: { color: '#dc2626', bg: '#fee2e2', icon: '😞', label: 'Negative' },
  NEUTRAL: { color: '#d97706', bg: '#fef3c7', icon: '😐', label: 'Neutral' },
};

const Reviews = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const fetchData = async () => {
    try {
      const [reviewsRes, summaryRes, eventRes] = await Promise.all([
        getReviewsByEvent(eventId),
        getEventSentimentSummary(eventId),
        getEventById(eventId),
      ]);
      setReviews(reviewsRes.data.length > 0 ? reviewsRes.data : mockReviews);
      setSummary(reviewsRes.data.length > 0 ? summaryRes.data : mockSummary);
      setUseMockData(reviewsRes.data.length === 0);
      setEvent(eventRes.data);
    } catch {
      setReviews(mockReviews);
      setSummary(mockSummary);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const usersRes = await fetch('http://localhost:8080/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const users = await usersRes.json();
      const currentUser = users.find(u => u.email === storedUser.email);

      await createReview({
        userId: currentUser.id,
        eventId: parseInt(eventId),
        comment: form.comment,
        rating: form.rating,
      });

      toast.success('Review submitted! AI is analyzing sentiment 🤖');
      setShowForm(false);
      setForm({ comment: '', rating: 5 });
      fetchData();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate(`/events/${eventId}`)} style={styles.backBtn}>
            ← Back to Event
          </button>
          <h1 style={styles.title}>🤖 AI Sentiment Analysis</h1>
          <p style={styles.subtitle}>
            {event?.title} — Powered by Google Gemini AI
          </p>
          {useMockData && (
            <div style={styles.demoBanner}>
              ✨ Demo Mode — Showing sample AI analysis to demonstrate the feature
            </div>
          )}
        </div>
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loading}>🤖 AI is analyzing reviews...</div>
        ) : (
          <>
            {/* Summary Cards */}
            {summary && (
              <div style={styles.summaryGrid}>
                <motion.div
                  style={styles.overallCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={styles.overallIcon}>
                    {sentimentConfig[summary.overallSentiment]?.icon || '😊'}
                  </div>
                  <div style={styles.overallLabel}>Overall Sentiment</div>
                  <div style={{
                    ...styles.overallValue,
                    color: sentimentConfig[summary.overallSentiment]?.color,
                  }}>
                    {summary.overallSentiment}
                  </div>
                  <div style={styles.overallRating}>⭐ {summary.averageRating} / 5</div>
                </motion.div>

                <div style={styles.statsGrid}>
                  {[
                    { label: 'Total Reviews', value: summary.totalReviews, icon: '📝', color: '#ede9fe' },
                    { label: 'Positive', value: summary.positiveCount, icon: '😊', color: '#d1fae5' },
                    { label: 'Neutral', value: summary.neutralCount, icon: '😐', color: '#fef3c7' },
                    { label: 'Negative', value: summary.negativeCount, icon: '😞', color: '#fee2e2' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      style={{ ...styles.statCard, background: stat.color }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div style={styles.statIcon}>{stat.icon}</div>
                      <div style={styles.statValue}>{stat.value}</div>
                      <div style={styles.statLabel}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment Bar */}
            {summary && (
              <div style={styles.sentimentBar}>
                <h3 style={styles.barTitle}>Sentiment Distribution</h3>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.barFill,
                    width: `${(summary.positiveCount / summary.totalReviews) * 100}%`,
                    background: '#34d399',
                  }} />
                  <div style={{
                    ...styles.barFill,
                    width: `${(summary.neutralCount / summary.totalReviews) * 100}%`,
                    background: '#fbbf24',
                  }} />
                  <div style={{
                    ...styles.barFill,
                    width: `${(summary.negativeCount / summary.totalReviews) * 100}%`,
                    background: '#f87171',
                  }} />
                </div>
                <div style={styles.barLegend}>
                  <span style={styles.legendItem}><span style={{ ...styles.dot, background: '#34d399' }} /> Positive ({summary.positiveCount})</span>
                  <span style={styles.legendItem}><span style={{ ...styles.dot, background: '#fbbf24' }} /> Neutral ({summary.neutralCount})</span>
                  <span style={styles.legendItem}><span style={{ ...styles.dot, background: '#f87171' }} /> Negative ({summary.negativeCount})</span>
                </div>
              </div>
            )}

            {/* Write Review Button */}
            <div style={styles.reviewHeader}>
              <h2 style={styles.reviewsTitle}>Reviews ({reviews.length})</h2>
              <button
                style={styles.writeBtn}
                onClick={() => setShowForm(!showForm)}
              >
                ✍️ Write a Review
              </button>
            </div>

            {/* Review Form */}
            {showForm && (
              <motion.div
                style={styles.formCard}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={styles.formTitle}>Share Your Experience</h3>
                <form onSubmit={handleSubmit}>
                  <div style={styles.ratingRow}>
                    <label style={styles.formLabel}>Your Rating</label>
                    <div style={styles.stars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          style={{
                            fontSize: '28px',
                            cursor: 'pointer',
                            color: star <= form.rating ? '#fbbf24' : '#e9d5ff',
                          }}
                          onClick={() => setForm({ ...form, rating: star })}
                        >★</span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience at this event..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    style={styles.textarea}
                    rows={4}
                    required
                  />
                  <div style={styles.formNote}>
                    🤖 Google Gemini AI will automatically analyze the sentiment of your review
                  </div>
                  <button type="submit" style={styles.submitBtn} disabled={submitting}>
                    {submitting ? '🤖 AI Analyzing...' : 'Submit Review →'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Reviews List */}
            <div style={styles.reviewsList}>
              {reviews.map((review, i) => {
                const sentiment = sentimentConfig[review.sentiment] || sentimentConfig.NEUTRAL;
                return (
                  <motion.div
                    key={review.id}
                    style={styles.reviewCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div style={styles.reviewTop}>
                      <div style={styles.reviewer}>
                        <div style={styles.reviewerAvatar}>
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</div>
                          <div style={styles.reviewStars}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                      </div>
                      <div style={{ ...styles.sentimentBadge, background: sentiment.bg, color: sentiment.color }}>
                        {sentiment.icon} {sentiment.label}
                      </div>
                    </div>

                    <p style={styles.reviewComment}>{review.comment}</p>

                    {review.aiSummary && (
                      <div style={styles.aiSummary}>
                        <span style={styles.aiLabel}>🤖 AI Summary:</span>
                        <span style={styles.aiText}>{review.aiSummary}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#fdf4ff' },
  header: {
    background: 'linear-gradient(135deg, #fce7f3, #ede9fe)',
    padding: '48px 24px',
    borderBottom: '1px solid #e9d5ff',
  },
  headerContent: { maxWidth: '1200px', margin: '0 auto' },
  backBtn: {
    background: 'white',
    border: '1px solid #e9d5ff',
    color: '#6b7280',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '16px',
    fontFamily: 'Poppins, sans-serif',
  },
  title: { fontSize: '36px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#6b7280' },
  demoBanner: {
    marginTop: '16px',
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    border: '1px solid #fbbf24',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '13px',
    color: '#92400e',
    fontWeight: '600',
    display: 'inline-block',
  },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  loading: { textAlign: 'center', padding: '80px', fontSize: '18px', color: '#6b7280' },
  summaryGrid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', marginBottom: '24px' },
  overallCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  overallIcon: { fontSize: '56px', marginBottom: '12px' },
  overallLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' },
  overallValue: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
  overallRating: { fontSize: '16px', color: '#fbbf24', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statCard: { borderRadius: '16px', padding: '24px', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  sentimentBar: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px 32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  barTitle: { fontSize: '16px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' },
  barTrack: {
    height: '12px',
    borderRadius: '50px',
    overflow: 'hidden',
    background: '#f3f4f6',
    display: 'flex',
    marginBottom: '12px',
  },
  barFill: { height: '100%', transition: 'width 0.5s ease' },
  barLegend: { display: 'flex', gap: '24px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  reviewsTitle: { fontSize: '22px', fontWeight: '700', color: '#1e1b4b' },
  writeBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px' },
  ratingRow: { marginBottom: '16px' },
  formLabel: { fontSize: '13px', fontWeight: '600', color: '#1e1b4b', display: 'block', marginBottom: '8px' },
  stars: { display: 'flex', gap: '4px' },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e9d5ff',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    resize: 'vertical',
    color: '#1e1b4b',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  formNote: {
    background: '#ede9fe',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '12px',
    color: '#7c3aed',
    marginBottom: '16px',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
  },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  reviewCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(167,139,250,0.08)',
    border: '1px solid #e9d5ff',
  },
  reviewTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  reviewer: { display: 'flex', alignItems: 'center', gap: '12px' },
  reviewerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  reviewerName: { fontWeight: '700', fontSize: '15px', color: '#1e1b4b', marginBottom: '2px' },
  reviewStars: { color: '#fbbf24', fontSize: '14px', letterSpacing: '2px' },
  sentimentBadge: {
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
  },
  reviewComment: { fontSize: '14px', color: '#374151', lineHeight: '1.7', marginBottom: '12px' },
  aiSummary: {
    background: '#f0fdf4',
    borderRadius: '10px',
    padding: '10px 14px',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  aiLabel: { fontSize: '12px', fontWeight: '700', color: '#059669', flexShrink: 0 },
  aiText: { fontSize: '12px', color: '#374151', lineHeight: '1.5' },
};

export default Reviews;