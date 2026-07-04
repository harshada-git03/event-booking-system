import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getAllEvents, getAllBookings, getAllUsers,
  createEvent, updateEvent, deleteEvent, deleteUser
} from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const emptyForm = {
  title: '', description: '', venue: '',
  eventDate: '', price: '', totalSeats: '', category: 'Music',
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [evRes, bkRes, usRes] = await Promise.all([
        getAllEvents(),
        getAllBookings(),
        getAllUsers(),
      ]);
      setEvents(evRes.data.content || evRes.data || []);
      setBookings(bkRes.data || []);
      setUsers(usRes.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, { ...form, price: parseFloat(form.price), totalSeats: parseInt(form.totalSeats) });
        toast.success('Event updated!');
      } else {
        await createEvent({ ...form, price: parseFloat(form.price), totalSeats: parseInt(form.totalSeats) });
        toast.success('Event created!');
      }
      setShowForm(false);
      setEditingEvent(null);
      setForm(emptyForm);
      fetchAll();
    } catch {
      toast.error('Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({ ...event, price: event.price.toString(), totalSeats: event.totalSeats.toString() });
    setShowForm(true);
    setTab('events');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    { label: 'Total Events', value: events.length, icon: '🎪', color: '#fce7f3' },
    { label: 'Total Bookings', value: bookings.length, icon: '🎟️', color: '#ede9fe' },
    { label: 'Total Users', value: users.length, icon: '👥', color: '#d1fae5' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#fef3c7' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Admin Dashboard 🎛️</h1>
          <p style={styles.subtitle}>Manage your event platform</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
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

        {/* Tabs */}
        <div style={styles.tabs}>
          {['overview', 'events', 'bookings', 'users'].map(t => (
            <button
              key={t}
              style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}
              onClick={() => setTab(t)}
            >
              {t === 'overview' ? '📊' : t === 'events' ? '🎪' : t === 'bookings' ? '🎟️' : '👥'}
              {' '}{t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div style={styles.overviewGrid}>
            <div style={styles.overviewCard}>
              <h3 style={styles.cardTitle}>Recent Bookings</h3>
              {bookings.slice(0, 5).map((b, i) => (
                <div key={i} style={styles.listRow}>
                  <div>
                    <div style={styles.listTitle}>{b.event?.title}</div>
                    <div style={styles.listSub}>{b.user?.email}</div>
                  </div>
                  <div style={styles.listAmount}>₹{b.totalAmount}</div>
                </div>
              ))}
            </div>
            <div style={styles.overviewCard}>
              <h3 style={styles.cardTitle}>Top Events</h3>
              {events.slice(0, 5).map((e, i) => (
                <div key={i} style={styles.listRow}>
                  <div>
                    <div style={styles.listTitle}>{e.title}</div>
                    <div style={styles.listSub}>{e.category} • {e.availableSeats} seats left</div>
                  </div>
                  <div style={styles.listAmount}>₹{e.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {tab === 'events' && (
          <div>
            <div style={styles.tabHeader}>
              <h2 style={styles.tabTitle}>Manage Events</h2>
              <button
                style={styles.addBtn}
                onClick={() => { setShowForm(!showForm); setEditingEvent(null); setForm(emptyForm); }}
              >
                + Add Event
              </button>
            </div>

            {showForm && (
              <motion.div
                style={styles.formCard}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={styles.formTitle}>
                  {editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}
                </h3>
                <form onSubmit={handleSubmit} style={styles.formGrid}>
                  {[
                    { key: 'title', label: 'Event Title', type: 'text', placeholder: 'Enter event title' },
                    { key: 'venue', label: 'Venue', type: 'text', placeholder: 'Enter venue' },
                    { key: 'eventDate', label: 'Event Date', type: 'date' },
                    { key: 'price', label: 'Price (₹)', type: 'number', placeholder: '0' },
                    { key: 'totalSeats', label: 'Total Seats', type: 'number', placeholder: '0' },
                  ].map(field => (
                    <div key={field.key} style={styles.formField}>
                      <label style={styles.formLabel}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        style={styles.formInput}
                        required
                      />
                    </div>
                  ))}

                  <div style={styles.formField}>
                    <label style={styles.formLabel}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={styles.formInput}
                    >
                      {['Music', 'Technology', 'Art', 'Theatre', 'Sports', 'Food'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ ...styles.formField, gridColumn: '1 / -1' }}>
                    <label style={styles.formLabel}>Description</label>
                    <textarea
                      placeholder="Event description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      style={{ ...styles.formInput, height: '80px', resize: 'vertical' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                    <button type="submit" style={styles.submitBtn}>
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      style={styles.cancelBtn}
                      onClick={() => { setShowForm(false); setEditingEvent(null); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Event</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Seats</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, i) => (
                    <tr key={event.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>
                        <div style={styles.tdTitle}>{event.title}</div>
                        <div style={styles.tdSub}>{event.venue}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryChip}>{event.category}</span>
                      </td>
                      <td style={styles.td}>{event.eventDate}</td>
                      <td style={styles.td}>₹{event.price}</td>
                      <td style={styles.td}>{event.availableSeats}/{event.totalSeats}</td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.editBtn} onClick={() => handleEdit(event)}>Edit</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div>
            <h2 style={styles.tabTitle}>All Bookings</h2>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Event</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>
                        <div style={styles.tdTitle}>{b.event?.title}</div>
                      </td>
                      <td style={styles.td}>{b.user?.email}</td>
                      <td style={styles.td}>{b.quantity}</td>
                      <td style={styles.td}>₹{b.totalAmount}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusChip,
                          background: b.status === 'PAID' ? '#d1fae5' : '#fef3c7',
                          color: b.status === 'PAID' ? '#059669' : '#d97706',
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(b.bookingTime).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <h2 style={styles.tabTitle}>All Users</h2>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>
                        <div style={styles.userRow}>
                          <div style={styles.userAvatar}>
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div style={styles.tdTitle}>{u.name}</div>
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.roleChip,
                          background: u.role === 'ADMIN' ? '#ede9fe' : '#fce7f3',
                          color: u.role === 'ADMIN' ? '#7c3aed' : '#db2777',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
  statCard: { borderRadius: '20px', padding: '28px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.8)' },
  statIcon: { fontSize: '36px', marginBottom: '12px' },
  statValue: { fontSize: '32px', fontWeight: '800', color: '#1e1b4b', marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '28px', background: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #e9d5ff', width: 'fit-content' },
  tab: {
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '10px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    color: 'white',
  },
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
  overviewCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px' },
  listRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  listTitle: { fontSize: '14px', fontWeight: '600', color: '#1e1b4b' },
  listSub: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  listAmount: { fontSize: '14px', fontWeight: '700', color: '#f472b6' },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  tabTitle: { fontSize: '22px', fontWeight: '700', color: '#1e1b4b', marginBottom: '20px' },
  addBtn: {
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
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#1e1b4b', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '12px', fontWeight: '600', color: '#1e1b4b' },
  formInput: {
    padding: '10px 14px',
    border: '2px solid #e9d5ff',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    color: '#1e1b4b',
    width: '100%',
    boxSizing: 'border-box',
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
  },
  cancelBtn: {
    background: '#fee2e2',
    border: 'none',
    color: '#f87171',
    padding: '12px 28px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  tableCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(167,139,250,0.1)',
    border: '1px solid #e9d5ff',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: 'linear-gradient(135deg, #fce7f3, #ede9fe)' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#1e1b4b' },
  trEven: { background: 'white' },
  trOdd: { background: '#fdf4ff' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#374151', verticalAlign: 'middle' },
  tdTitle: { fontWeight: '600', color: '#1e1b4b', marginBottom: '2px' },
  tdSub: { fontSize: '12px', color: '#6b7280' },
  categoryChip: {
    background: '#ede9fe',
    color: '#7c3aed',
    padding: '4px 10px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusChip: {
    padding: '4px 10px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
  },
  roleChip: {
    padding: '4px 10px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: { display: 'flex', gap: '8px' },
  editBtn: {
    background: '#ede9fe',
    border: 'none',
    color: '#7c3aed',
    padding: '6px 14px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  },
  deleteBtn: {
    background: '#fee2e2',
    border: 'none',
    color: '#f87171',
    padding: '6px 14px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  },
  userRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
};

export default AdminDashboard;
