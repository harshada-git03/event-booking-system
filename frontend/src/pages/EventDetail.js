import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventById, createBooking, createPaymentOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data);
      } catch {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) return toast.error('Please login first');
    setBooking(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const usersRes = await fetch('http://localhost:8080/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const users = await usersRes.json();
      const currentUser = users.find(u => u.email === storedUser.email);

      if (!currentUser) return toast.error('User not found');

      const bookingRes = await createBooking({
        userId: currentUser.id,
        eventId: parseInt(id),
        quantity,
      });

      toast.success('Booking confirmed! Check your email for ticket 🎟️');

      // Trigger Razorpay payment
      const orderRes = await createPaymentOrder(bookingRes.data.id);
      const { orderId, amount, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Eventify',
        description: event.title,
        order_id: orderId,
        handler: function (response) {
          toast.success('Payment successful! 🎉');
          navigate('/my-bookings');
        },
        prefill: {
          email: storedUser.email,
        },
        theme: { color: '#f472b6' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.loading}>⏳ Loading event details...</div>
    </div>
  );

  if (!event) return null;

  const isSoldOut = event.availableSeats === 0;
  const totalPrice = (event.price * quantity).toFixed(2);

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button onClick={() => navigate('/events')} style={styles.backBtn}>
              ← Back to Events
            </button>
            <div style={styles.categoryBadge}>{event.category}</div>
            <h1 style={styles.title}>{event.title}</h1>
            <div style={styles.metaRow}>
              <span style={styles.metaChip}>📍 {event.venue}</span>
              <span style={styles.metaChip}>📅 {event.eventDate}</span>
              <span style={styles.metaChip}>🪑 {event.availableSeats} seats left</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Left */}
          <motion.div
            style={styles.left}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>About This Event</h2>
              <p style={styles.description}>{event.description}</p>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Event Details</h2>
              <div style={styles.detailsGrid}>
                {[
                  { icon: '📍', label: 'Venue', value: event.venue },
                  { icon: '📅', label: 'Date', value: event.eventDate },
                  { icon: '🏷️', label: 'Category', value: event.category },
                  { icon: '🪑', label: 'Available Seats', value: `${event.availableSeats} / ${event.totalSeats}` },
                  { icon: '💰', label: 'Price per ticket', value: `₹${event.price}` },
                ].map((d, i) => (
                  <div key={i} style={styles.detailRow}>
                    <span style={styles.detailIcon}>{d.icon}</span>
                    <div>
                      <div style={styles.detailLabel}>{d.label}</div>
                      <div style={styles.detailValue}>{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(`/reviews/${id}`)}
              style={styles.reviewsBtn}
            >
              🤖 View AI Sentiment Analysis & Reviews
            </button>
          </motion.div>

          {/* Right — Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div style={styles.bookingCard}>
              <div style={styles.priceTag}>₹{event.price}</div>
              <div style={styles.priceLabel}>per ticket</div>

              {isSoldOut ? (
                <div style={styles.soldOut}>
                  <div style={styles.soldOutIcon}>😔</div>
                  <div style={styles.soldOutText}>This event is sold out</div>
                </div>
              ) : (
                <>
                  <div style={styles.quantitySection}>
                    <label style={styles.quantityLabel}>Number of Tickets</label>
                    <div style={styles.quantityControl}>
                      <button
                        style={styles.qtyBtn}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      >−</button>
                      <span style={styles.qtyValue}>{quantity}</span>
                      <button
                        style={styles.qtyBtn}
                        onClick={() => setQuantity(q => Math.min(event.availableSeats, q + 1))}
                      >+</button>
                    </div>
                  </div>

                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total Amount</span>
                    <span style={styles.totalAmount}>₹{totalPrice}</span>
                  </div>

                  <button
                    style={styles.bookBtn}
                    onClick={handleBooking}
                    disabled={booking}
                  >
                    {booking ? '⏳ Processing...' : '🎟️ Book & Pay Now'}
                  </button>

                  <div style={styles.secureNote}>
                    🔒 Secured by Razorpay • PDF ticket on email
                  </div>
                </>
              )}
            </div>

            {/* Seats Progress */}
            <div style={styles.seatsCard}>
              <div style={styles.seatsHeader}>
                <span style={styles.seatsLabel}>Seats Availability</span>
                <span style={styles.seatsCount}>
                  {event.availableSeats}/{event.totalSeats}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                  background: event.availableSeats < event.totalSeats * 0.2
                    ? '#f87171'
                    : 'linear-gradient(135deg, #f472b6, #a78bfa)',
                }} />
              </div>
              {event.availableSeats < event.totalSeats * 0.2 && event.availableSeats > 0 && (
                <div style={styles.urgency}>🔥 Almost sold out!</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#fdf4ff' },
  loading: { textAlign: 'center', padding: '80px', fontSize: '18px', color: '#6b7280' },
  hero: {
    background: 'linear-gradient(135deg, #fce7f3, #ede9fe)',
    padding: '48px 24px',
    borderBottom: '1px solid #e9d5ff',
  },
  heroContent: { maxWidth: '1200px', margin: '0 auto' },
  backBtn: {
    background: 'white',
    border: '1px solid #e9d5ff',
    color: '#6b7280',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontFamily: 'Poppins, sans-serif',
  },
  categoryBadge: {
    display: 'inline-block',
    background: 'white',
    color: '#f472b6',
    border: '1px solid #fbcfe8',
    padding: '4px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  title: { fontSize: '40px', fontWeight: '800', color: '#1e1b4b', marginBottom: '20px' },
  metaRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  metaChip: {
    background: 'white',
    border: '1px solid #e9d5ff',
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' },
  left: { display: 'flex', flexDirection: 'column', gap: '24px' },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' },
  description: { fontSize: '15px', color: '#6b7280', lineHeight: '1.8' },
  detailsGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#fdf4ff', borderRadius: '12px' },
  detailIcon: { fontSize: '24px', width: '40px', textAlign: 'center' },
  detailLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
  detailValue: { fontSize: '15px', color: '#1e1b4b', fontWeight: '600' },
  reviewsBtn: {
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    border: 'none',
    color: '#059669',
    padding: '14px 24px',
    borderRadius: '16px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'left',
  },
  bookingCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.15)',
    border: '1px solid #e9d5ff',
    marginBottom: '16px',
  },
  priceTag: { fontSize: '40px', fontWeight: '800', color: '#f472b6' },
  priceLabel: { fontSize: '14px', color: '#6b7280', marginBottom: '24px' },
  soldOut: { textAlign: 'center', padding: '24px' },
  soldOutIcon: { fontSize: '48px', marginBottom: '8px' },
  soldOutText: { fontSize: '16px', color: '#9ca3af', fontWeight: '600' },
  quantitySection: { marginBottom: '20px' },
  quantityLabel: { fontSize: '13px', fontWeight: '600', color: '#1e1b4b', display: 'block', marginBottom: '10px' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '16px' },
  qtyBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid #e9d5ff',
    background: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f472b6',
    fontWeight: '700',
  },
  qtyValue: { fontSize: '22px', fontWeight: '700', color: '#1e1b4b', minWidth: '32px', textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fdf4ff', borderRadius: '12px', marginBottom: '20px' },
  totalLabel: { fontSize: '14px', color: '#6b7280', fontWeight: '500' },
  totalAmount: { fontSize: '24px', fontWeight: '800', color: '#1e1b4b' },
  bookBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '16px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 20px rgba(244,114,182,0.3)',
    marginBottom: '12px',
  },
  secureNote: { textAlign: 'center', fontSize: '12px', color: '#9ca3af' },
  seatsCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  seatsHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  seatsLabel: { fontSize: '14px', fontWeight: '600', color: '#1e1b4b' },
  seatsCount: { fontSize: '14px', color: '#6b7280' },
  progressBar: { height: '8px', background: '#f3f4f6', borderRadius: '50px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', borderRadius: '50px', transition: 'width 0.5s ease' },
  urgency: { fontSize: '13px', color: '#f87171', fontWeight: '600' },
};

export default EventDetail;