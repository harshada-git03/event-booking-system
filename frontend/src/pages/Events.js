import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllEvents, searchEvents } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Music: { bg: '#fce7f3', text: '#f472b6', icon: '🎵' },
  Technology: { bg: '#ede9fe', text: '#a78bfa', icon: '💻' },
  Art: { bg: '#d1fae5', text: '#34d399', icon: '🎨' },
  Theatre: { bg: '#fef3c7', text: '#fbbf24', icon: '🎭' },
  Sports: { bg: '#fee2e2', text: '#f87171', icon: '🏃' },
  Food: { bg: '#e0f2fe', text: '#38bdf8', icon: '🍕' },
};

const getCategoryStyle = (category) =>
  categoryColors[category] || { bg: '#f3f4f6', text: '#6b7280', icon: '🎪' };

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let res;
      if (keyword || category) {
        res = await searchEvents({ keyword, category, page, size: 9 });
      } else {
        res = await getAllEvents(page, 9);
      }
      setEvents(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchEvents();
  };

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={styles.title}>Discover Events 🎪</h1>
            <p style={styles.subtitle}>Find your next unforgettable experience</p>
          </motion.div>

          {/* Search */}
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <input
              type="text"
              placeholder="🔍  Search events, venues..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={styles.searchInput}
            />
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(0); }}
              style={styles.categorySelect}
            >
              <option value="">All Categories</option>
              <option value="Music">🎵 Music</option>
              <option value="Technology">💻 Technology</option>
              <option value="Art">🎨 Art</option>
              <option value="Theatre">🎭 Theatre</option>
              <option value="Sports">🏃 Sports</option>
              <option value="Food">🍕 Food</option>
            </select>
            <button type="submit" style={styles.searchBtn}>Search</button>
          </form>
        </div>
      </div>

      {/* Events Grid */}
      <div style={styles.container}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>⏳</div>
            <p>Loading amazing events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🎪</div>
            <h3>No events found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {events.map((event, i) => {
              const catStyle = getCategoryStyle(event.category);
              const isSoldOut = event.availableSeats === 0;
              return (
                <motion.div
                  key={event.id}
                  style={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(167,139,250,0.25)' }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {/* Card Header */}
                  <div style={{ ...styles.cardHeader, background: catStyle.bg }}>
                    <div style={styles.cardEmoji}>{catStyle.icon}</div>
                    <div style={styles.cardBadges}>
                      <span style={{ ...styles.badge, background: catStyle.bg, color: catStyle.text }}>
                        {event.category}
                      </span>
                      {isSoldOut && (
                        <span style={styles.soldOutBadge}>SOLD OUT</span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{event.title}</h3>
                    <p style={styles.cardDesc}>
                      {event.description?.length > 80
                        ? event.description.substring(0, 80) + '...'
                        : event.description}
                    </p>

                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>📍 {event.venue}</div>
                      <div style={styles.metaItem}>📅 {event.eventDate}</div>
                      <div style={styles.metaItem}>
                        🪑 {event.availableSeats}/{event.totalSeats} seats
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={styles.price}>₹{event.price}</div>
                      <button
                        style={isSoldOut ? styles.soldOutBtn : styles.bookBtn}
                        disabled={isSoldOut}
                      >
                        {isSoldOut ? 'Sold Out' : 'Book Now →'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
            <button
              style={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#fdf4ff' },
  header: {
    background: 'linear-gradient(135deg, #fce7f3, #ede9fe)',
    padding: '48px 24px 40px',
    borderBottom: '1px solid #e9d5ff',
  },
  headerContent: { maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '36px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '28px' },
  searchBar: {
    display: 'flex',
    gap: '12px',
    background: 'white',
    borderRadius: '16px',
    padding: '8px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.15)',
    border: '1px solid #e9d5ff',
  },
  searchInput: {
    flex: '1',
    padding: '10px 16px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    color: '#1e1b4b',
    background: 'transparent',
  },
  categorySelect: {
    padding: '10px 16px',
    border: '1px solid #e9d5ff',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    color: '#1e1b4b',
    outline: 'none',
    background: '#fdf4ff',
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#6b7280' },
  loadingSpinner: { fontSize: '48px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '80px', color: '#6b7280' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    padding: '32px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardEmoji: { fontSize: '48px' },
  cardBadges: { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' },
  badge: {
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
  },
  soldOutBadge: {
    background: '#fee2e2',
    color: '#f87171',
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '11px',
    fontWeight: '700',
  },
  cardBody: { padding: '20px 24px 24px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' },
  cardDesc: { fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' },
  cardMeta: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  metaItem: { fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '22px', fontWeight: '800', color: '#f472b6' },
  bookBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  soldOutBtn: {
    background: '#f3f4f6',
    border: 'none',
    color: '#9ca3af',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'not-allowed',
    fontFamily: 'Poppins, sans-serif',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '40px',
  },
  pageBtn: {
    background: 'white',
    border: '2px solid #e9d5ff',
    color: '#a78bfa',
    padding: '10px 24px',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  pageInfo: { color: '#6b7280', fontWeight: '500', fontSize: '14px' },
};

export default Events;