import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { key: 'gallery', label: 'Gallery Upload' },
  { key: 'events', label: 'Events Manager' },
  { key: 'menu', label: 'Menu Manager' },
  { key: 'faq', label: 'FAQ Editor' },
];

const DEFAULT_FAQS = [
  { q: 'What are the opening hours?', a: "We're open every day from 12:00 PM to 12:00 AM." },
  { q: 'Is there a dress code?', a: 'Yes. We recommend smart casuals. No slippers or shorts for men after 7 PM.' },
  { q: 'Do you allow stag entry?', a: 'Yes, but stag entry may be restricted during special events. We recommend checking with our team beforehand.' },
  { q: 'Can I reserve a table in advance?', a: 'Absolutely! You can book via our website or Instagram DMs.' },
  { q: 'Do you host private parties or events?', a: 'Yes. We have party packages available for groups starting from 25 guests. Contact us for custom plans.' },
  { q: 'Are kids allowed?', a: "Entry is 21+ only after 7 PM. Kids are allowed with families during lunch hours." },
  { q: 'Is outside food or drink allowed?', a: 'No. We do not permit outside food or beverages inside the premises.' },
  { q: 'Is there a cover charge?', a: 'Entry is free on most days. On event nights, cover charges may apply. Follow our Instagram for updates.' },
  { q: 'What kind of music do you play?', a: 'A mix of Bollywood, commercial, house, EDM, and retro — depending on the event.' },
  { q: 'Do you have parking available?', a: 'Yes, we offer limited valet parking. First-come, first-served.' },
];

const API = '/api/hero-video';
const VIDEO_BASE = '/uploads/hero-video/';

const foodMenu = '/menu/FoodMenu.jpeg';
const liquorMenu = '/menu/LIquorMenu.jpeg';

function getGalleryImages() {
  return JSON.parse(localStorage.getItem('kiik69_gallery') || '[]');
}
function setGalleryImages(images) {
  localStorage.setItem('kiik69_gallery', JSON.stringify(images));
}
function getEvents() {
  return JSON.parse(localStorage.getItem('kiik69_events') || '[]');
}
function setEvents(events) {
  localStorage.setItem('kiik69_events', JSON.stringify(events));
}

function getMenuImage(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  return fallback;
}
function setMenuImage(key, dataUrl) {
  localStorage.setItem(key, dataUrl);
}

function getFaqs() {
  return JSON.parse(localStorage.getItem('kiik69_faqs') || 'null') || DEFAULT_FAQS;
}
function setFaqs(faqs) {
  localStorage.setItem('kiik69_faqs', JSON.stringify(faqs));
}

function getHeroVideo() {
  return localStorage.getItem('kiik69_hero_video') || '';
}
function setHeroVideo(val) {
  localStorage.setItem('kiik69_hero_video', val);
}

function BackgroundMusicChanger() {
  const [musicUrl, setMusicUrl] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const audioRef = useRef();

  useEffect(() => {
    fetch('/api/background-music')
      .then(res => res.json())
      .then(data => setMusicUrl(data.url ? data.url + '?t=' + Date.now() : ''))
      .catch(() => setMusicUrl(''));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) {
      setToast('Please paste a YouTube link.');
      return;
    }
    setLoading(true);
    setToast('');
    try {
      const res = await fetch('/api/background-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() }),
      });
      const data = await res.json();
      if (data.url) {
        setMusicUrl(data.url + '?t=' + Date.now());
        setToast('Background music updated!');
        setInput('');
        setTimeout(() => { audioRef.current && audioRef.current.load(); }, 500);
      } else {
        setToast(data.error || 'Failed to update music.');
      }
    } catch {
      setToast('Failed to update music.');
    }
    setLoading(false);
  }

  return (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>Background Music Changer</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <input
          type="url"
          placeholder="Paste YouTube link"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          style={styles.uploadBtn}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Set Music'}
        </button>
      </form>
      <div style={{ marginBottom: 12 }}>
        {musicUrl ? (
          <audio ref={audioRef} src={musicUrl} controls style={{ width: '100%' }} />
        ) : (
          <div style={{ color: '#fff', opacity: 0.7 }}>No background music set.</div>
        )}
      </div>
      {toast && (
        <div
          style={{
            marginTop: 12,
            color: '#fff',
            background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)',
            borderRadius: 12,
            padding: '10px 24px',
            fontWeight: 700,
            boxShadow: '0 0 16px #b47cff44',
            textAlign: 'center',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState('gallery');
  const [heroVideo, setHeroVideo] = useState(localStorage.getItem('kiik69_hero_video') || '');

  function handleLogout() {
    localStorage.removeItem('kiik69_admin_auth');
    navigate('/admin', { replace: true });
  }

  return (
    <div style={styles.bg}>
      {/* Top Navbar */}
      <div style={styles.topbar}>
        <span style={styles.logo}>KIIK69 Admin</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              style={{
                ...styles.sidebarBtn,
                ...(section === s.key ? styles.sidebarBtnActive : {}),
              }}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <main style={styles.main}>
          {section === 'gallery' && <GalleryUpload />}
          {section === 'events' && <EventsManager />}
          {section === 'menu' && <MenuManager />}
          {section === 'faq' && <FaqEditor />}
          {section !== 'gallery' && section !== 'events' && section !== 'menu' && section !== 'faq' && <Placeholder title={SECTIONS.find(s => s.key === section)?.label || ''} />}
        </main>
      </div>
    </div>
  );
}

function GalleryUpload() {
  const [images, setImages] = useState(getGalleryImages());
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      alt: file.name,
    }));
    setPreviews(newPreviews);
  }

  function handleUpload() {
    const newImages = previews.map(p => ({
      img: p.url,
      alt: p.alt,
    }));
    const updated = [...images, ...newImages];
    setImages(updated);
    setGalleryImages(updated);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDelete(idx) {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    setGalleryImages(updated);
  }

  // No edit for now, just delete

  return (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>Gallery Upload</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={styles.input}
        onChange={handleFileChange}
      />
      {previews.length > 0 && (
        <div style={styles.previewRow}>
          {previews.map((p, i) => (
            <div key={i} style={styles.previewTile}>
              <img src={p.url} alt={p.alt} style={styles.previewImg} />
            </div>
          ))}
        </div>
      )}
      {previews.length > 0 && (
        <button style={styles.uploadBtn} onClick={handleUpload}>Upload</button>
      )}
      <div style={styles.galleryGrid}>
        {images.map((img, i) => (
          <div key={i} style={styles.galleryTile}>
            <img src={img.img} alt={img.alt} style={styles.galleryImg} />
            <button style={styles.deleteBtn} onClick={() => handleDelete(i)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsManager() {
  const [events, setEventsState] = useState(getEvents());
  const [form, setForm] = useState({ title: '', date: '', desc: '', img: '' });
  const [imgPreview, setImgPreview] = useState('');
  const fileInputRef = useRef();

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(f => ({ ...f, img: url }));
      setImgPreview(url);
    }
  }
  function handleAddEvent(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.desc || !form.img) return;
    const updated = [...events, { ...form }];
    setEventsState(updated);
    setEvents(updated);
    setForm({ title: '', date: '', desc: '', img: '' });
    setImgPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  function handleDelete(idx) {
    const updated = events.filter((_, i) => i !== idx);
    setEventsState(updated);
    setEvents(updated);
  }
  // No edit for now, just delete

  return (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>Events Manager</h2>
      <form style={styles.eventForm} onSubmit={handleAddEvent}>
        <input
          style={styles.input}
          name="title"
          placeholder="Event Name"
          value={form.title}
          onChange={handleInput}
        />
        <input
          style={styles.input}
          name="date"
          placeholder="Date (e.g. Sat, 8 June · 9PM)"
          value={form.date}
          onChange={handleInput}
        />
        <input
          style={styles.input}
          name="desc"
          placeholder="Description"
          value={form.desc}
          onChange={handleInput}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={styles.input}
          onChange={handleImgChange}
        />
        {imgPreview && <img src={imgPreview} alt="Preview" style={styles.previewImg} />}
        <button style={styles.uploadBtn} type="submit">Add Event</button>
      </form>
      <div style={styles.eventsList}>
        {events.map((ev, i) => (
          <div key={i} style={styles.eventCard}>
            <img src={ev.img} alt={ev.title} style={styles.eventImg} />
            <div style={styles.eventInfo}>
              <div style={styles.eventName}>{ev.title}</div>
              <div style={styles.eventDate}>{ev.date}</div>
              <div style={styles.eventDesc}>{ev.desc}</div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuManager() {
  const [foodMenuState, setFoodMenu] = useState(getMenuImage('kiik69_menu_food', foodMenu));
  const [liquorMenuState, setLiquorMenu] = useState(getMenuImage('kiik69_menu_liquor', liquorMenu));
  const [toast, setToast] = useState('');

  function handleReplace(e, key, setImg) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setToast('Only image files allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast('File too large (max 2MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setMenuImage(key, ev.target.result);
      setImg(ev.target.result);
      setToast('Menu updated!');
      setTimeout(() => setToast(''), 2000);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>Menu Manager</h2>
      <div style={{ display: 'flex', gap: 32, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>Food Menu</div>
          <img src={foodMenuState} alt="Food Menu" style={{ width: 180, height: 240, objectFit: 'contain', borderRadius: 16, boxShadow: '0 2px 16px #b47cff44' }} />
          <input type="file" accept="image/*" style={styles.input} onChange={e => handleReplace(e, 'kiik69_menu_food', setFoodMenu)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>Liquor Menu</div>
          <img src={liquorMenuState} alt="Liquor Menu" style={{ width: 180, height: 240, objectFit: 'contain', borderRadius: 16, boxShadow: '0 2px 16px #b47cff44' }} />
          <input type="file" accept="image/*" style={styles.input} onChange={e => handleReplace(e, 'kiik69_menu_liquor', setLiquorMenu)} />
        </div>
      </div>
      {toast && <div style={{ marginTop: 18, color: '#fff', background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)', borderRadius: 12, padding: '10px 24px', fontWeight: 700, boxShadow: '0 0 16px #b47cff44', textAlign: 'center' }}>{toast}</div>}
    </div>
  );
}

function FaqEditor() {
  const [faqs, setFaqsState] = useState(getFaqs());
  const [openIdx, setOpenIdx] = useState(null);
  const [form, setForm] = useState({ q: '', a: '' });
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({ q: '', a: '' });

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleAddFaq(e) {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) return;
    const updated = [...faqs, { ...form }];
    setFaqsState(updated);
    setFaqs(updated);
    setForm({ q: '', a: '' });
  }
  function handleDelete(idx) {
    const updated = faqs.filter((_, i) => i !== idx);
    setFaqsState(updated);
    setFaqs(updated);
  }
  function handleEdit(idx) {
    setEditIdx(idx);
    setEditForm(faqs[idx]);
  }
  function handleEditFormChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
  function handleEditSave(idx) {
    if (!editForm.q.trim() || !editForm.a.trim()) return;
    const updated = faqs.map((f, i) => (i === idx ? { ...editForm } : f));
    setFaqsState(updated);
    setFaqs(updated);
    setEditIdx(null);
  }
  function handleEditCancel() {
    setEditIdx(null);
  }

  return (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>FAQ Editor</h2>
      <form style={{ width: '100%', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }} onSubmit={handleAddFaq}>
        <input
          style={{ ...styles.input, flex: 2 }}
          name="q"
          placeholder="Question"
          value={form.q}
          onChange={handleFormChange}
        />
        <input
          style={{ ...styles.input, flex: 3 }}
          name="a"
          placeholder="Answer"
          value={form.a}
          onChange={handleFormChange}
        />
        <button style={{ ...styles.uploadBtn, flex: 1, minWidth: 120 }} type="submit">Add FAQ</button>
      </form>
      <div style={{ width: '100%' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ ...styles.faqCard, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                style={{ ...styles.faqQuestion, fontWeight: 700, fontSize: '1.08rem', color: '#fff', background: 'none', border: 'none', cursor: 'pointer', flex: 1, textAlign: 'left' }}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                {editIdx === idx ? (
                  <>
                    <input
                      style={{ ...styles.input, marginBottom: 0, fontWeight: 700 }}
                      name="q"
                      value={editForm.q}
                      onChange={handleEditFormChange}
                    />
                  </>
                ) : (
                  faq.q
                )}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                {editIdx === idx ? (
                  <>
                    <button style={styles.uploadBtn} onClick={() => handleEditSave(idx)} type="button">Save</button>
                    <button style={styles.deleteBtn} onClick={handleEditCancel} type="button">Cancel</button>
                  </>
                ) : (
                  <>
                    <button style={styles.uploadBtn} onClick={() => handleEdit(idx)} type="button">Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(idx)} type="button">Delete</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ maxHeight: openIdx === idx ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(.4,1.4,.6,1)' }}>
              {editIdx === idx ? (
                <input
                  style={{ ...styles.input, marginBottom: 0 }}
                  name="a"
                  value={editForm.a}
                  onChange={handleEditFormChange}
                />
              ) : (
                <div style={{ ...styles.faqAnswer, color: '#fff', opacity: 0.85, fontSize: '1.01rem', padding: openIdx === idx ? '12px 0' : '0' }}>
                  {faq.a}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div style={styles.placeholder}>
      <h2 style={styles.placeholderTitle}>{title}</h2>
      <p style={styles.placeholderText}>Section coming soon...</p>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(120deg, #18122b 0%, #2a003e 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    height: 64,
    background: 'rgba(30,30,40,0.92)',
    boxShadow: '0 2px 24px #b47cff33',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.4rem',
    letterSpacing: 1.5,
    textShadow: '0 2px 12px #b47cff66, 0 1px 8px #fff2',
  },
  logoutBtn: {
    background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '10px 28px',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 0 16px #b47cff44',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  layout: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    height: 'calc(100vh - 64px)',
  },
  sidebar: {
    width: 220,
    background: 'rgba(30,30,40,0.82)',
    boxShadow: '2px 0 24px #b47cff22',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 0',
    gap: 8,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    minWidth: 120,
  },
  sidebarBtn: {
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 24px',
    margin: '0 16px',
    fontWeight: 600,
    fontSize: '1.08rem',
    marginBottom: 6,
    cursor: 'pointer',
    boxShadow: '0 0 12px #b47cff22',
    transition: 'background 0.2s, color 0.2s',
    textAlign: 'left',
  },
  sidebarBtnActive: {
    background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)',
    color: '#fff',
    boxShadow: '0 0 24px #b47cff44',
    fontWeight: 800,
  },
  main: {
    flex: 1,
    padding: '48px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
    overflowY: 'auto',
  },
  placeholder: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    boxShadow: '0 0 24px #b47cff22',
    padding: '48px 32px',
    minWidth: 260,
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  placeholderTitle: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.5rem',
    marginBottom: 12,
    textShadow: '0 2px 12px #b47cff66',
  },
  placeholderText: {
    color: '#fff',
    opacity: 0.7,
    fontSize: '1.08rem',
  },
  sectionCard: {
    background: 'rgba(30,30,40,0.92)',
    borderRadius: 24,
    boxShadow: '0 8px 40px #b47cff33, 0 2px 24px #ff3c7033',
    padding: '40px 32px',
    margin: '0 auto',
    maxWidth: 700,
    width: '100%',
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '2rem',
    marginBottom: 18,
    letterSpacing: 1.2,
    textShadow: '0 2px 12px #b47cff66, 0 1px 8px #fff2',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: 'none',
    outline: 'none',
    fontSize: '1.08rem',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    boxShadow: '0 0 12px #b47cff44',
    marginBottom: 8,
  },
  uploadBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 999,
    border: 'none',
    background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginTop: 8,
    boxShadow: '0 0 24px #b47cff44',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  previewRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  previewTile: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    boxShadow: '0 0 12px #b47cff22',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImg: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
    boxShadow: '0 2px 8px #b47cff44',
    marginBottom: 8,
  },
  galleryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 18,
    width: '100%',
    justifyContent: 'center',
  },
  galleryTile: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    boxShadow: '0 0 12px #b47cff22',
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  galleryImg: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    boxShadow: '0 2px 8px #b47cff44',
    marginBottom: 8,
  },
  deleteBtn: {
    background: 'linear-gradient(90deg, #ff3c70 0%, #b47cff 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '6px 18px',
    fontWeight: 700,
    fontSize: '0.98rem',
    boxShadow: '0 0 12px #ff3c7044',
    cursor: 'pointer',
    marginTop: 4,
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  eventCard: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    boxShadow: '0 0 12px #b47cff22',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    width: '100%',
    maxWidth: 520,
    position: 'relative',
  },
  eventImg: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 12,
    boxShadow: '0 2px 8px #b47cff44',
  },
  eventInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  eventName: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.1rem',
    marginBottom: 2,
    textShadow: '0 2px 8px #b47cff44',
  },
  eventDate: {
    color: '#ff7e3c',
    fontWeight: 600,
    fontSize: '0.98rem',
    marginBottom: 2,
  },
  eventDesc: {
    color: '#fff',
    opacity: 0.8,
    fontSize: '0.98rem',
    marginBottom: 2,
  },
  faqCard: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    boxShadow: '0 0 12px #b47cff22',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 520,
    position: 'relative',
  },
  faqQuestion: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'left',
  },
  faqAnswer: {
    color: '#fff',
    opacity: 0.85,
    fontSize: '1.01rem',
  },
}; 