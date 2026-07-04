import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const myBookings = res.data.filter(b => b.user?.email === storedUser?.email);
      setBookings(myBookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? Seats will be restored.')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>My Bookings 🎟️</h1>
          <p style={styles.subtitle}>Manage all your event bookings</p>
        </div>
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loading}>⏳ Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <motion.div
            style={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={styles.emptyIcon}>🎪</div>
            <h3 style={styles.emptyTitle}>No bookings yet!</h3>
            <p style={styles.emptyText}>Start exploring events and book your first ticket</p>
            <a href="/events">
              <button style={styles.exploreBtn}>Explore Events →</button>
            </a>
          </motion.div>
        ) : (
          <div style={styles.grid}>
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                style={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Ticket Header */}
                <div style={styles.ticketHeader}>
                  <div style={styles.ticketLeft}>
                    <div style={styles.eventIcon}>🎪</div>
                    <div>
                      <div style={styles.eventName}>{booking.event?.title}</div>
                      <div style={styles.eventVenue}>📍 {booking.event?.venue}</div>
                    </div>
                  </div>
                  <div style={{
                    ...styles.statusBadge,
                    background: booking.status === 'PAID' ? '#d1fae5' : '#fef3c7',
                    color: booking.status === 'PAID' ? '#059669' : '#d97706',
                  }}>
                    {booking.status === 'PAID' ? '✅ PAID' : '⏳ CONFIRMED'}
                  </div>
                </div>

                {/* Ticket Divider */}
                <div style={styles.divider}>
                  <div style={styles.dividerCircleLeft} />
                  <div style={styles.dividerLine} />
                  <div style={styles.dividerCircleRight} />
                </div>

                {/* Ticket Details */}
                <div style={styles.ticketBody}>
                  <div style={styles.detailGrid}>
                    <div style={styles.detail}>
                      <div style={styles.detailLabel}>📅 Date</div>
                      <div style={styles.detailValue}>{booking.event?.eventDate}</div>
                    </div>
                    <div style={styles.detail}>
                      <div style={styles.detailLabel}>🎫 Tickets</div>
                      <div style={styles.detailValue}>{booking.quantity}</div>
                    </div>
                    <div style={styles.detail}>
                      <div style={styles.detailLabel}>💰 Total</div>
                      <div style={styles.detailValue}>₹{booking.totalAmount}</div>
                    </div>
                    <div style={styles.detail}>
                      <div style={styles.detailLabel}>🕐 Booked</div>
                      <div style={styles.detailValue}>
                        {new Date(booking.bookingTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={styles.bookingCode}>
                    <span style={styles.codeLabel}>Booking Code</span>
                    <span style={styles.codeValue}>
                      {booking.bookingCode?.substring(0, 16)}...
                    </span>
                  </div>

                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </motion.div>
            ))}
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
    padding: '48px 24px',
    borderBottom: '1px solid #e9d5ff',
  },
  headerContent: { maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '36px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#6b7280' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#6b7280', fontSize: '18px' },
  empty: {
    textAlign: 'center',
    padding: '80px',
    background: 'white',
    borderRadius: '24px',
    border: '1px solid #e9d5ff',
  },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyTitle: { fontSize: '24px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' },
  emptyText: { color: '#6b7280', marginBottom: '24px' },
  exploreBtn: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
  card: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  ticketHeader: {
    background: 'linear-gradient(135deg, #fce7f3, #ede9fe)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  eventIcon: {
    fontSize: '32px',
    width: '52px',
    height: '52px',
    background: 'white',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventName: { fontWeight: '700', fontSize: '16px', color: '#1e1b4b', marginBottom: '4px' },
  eventVenue: { fontSize: '13px', color: '#6b7280' },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '700',
  },
  divider: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
  },
  dividerCircleLeft: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fdf4ff',
    border: '1px solid #e9d5ff',
    marginLeft: '-30px',
    flexShrink: 0,
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    borderTop: '2px dashed #e9d5ff',
    margin: '0 8px',
  },
  dividerCircleRight: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fdf4ff',
    border: '1px solid #e9d5ff',
    marginRight: '-30px',
    flexShrink: 0,
  },
  ticketBody: { padding: '20px 24px 24px' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' },
  detail: {
    background: '#fdf4ff',
    borderRadius: '12px',
    padding: '12px',
  },
  detailLabel: { fontSize: '11px', color: '#6b7280', marginBottom: '4px' },
  detailValue: { fontSize: '14px', fontWeight: '700', color: '#1e1b4b' },
  bookingCode: {
    background: '#fdf4ff',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
  codeValue: { fontSize: '12px', color: '#a78bfa', fontWeight: '700', fontFamily: 'monospace' },
  cancelBtn: {
    width: '100%',
    background: '#fee2e2',
    border: 'none',
    color: '#f87171',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
  },
};

export default MyBookings;