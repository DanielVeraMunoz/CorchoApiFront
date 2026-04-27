import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import Tape from '../components/Tape';
import { CATEGORY_CONFIG, DEFAULT_CONFIG } from '../utils/categories';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';



export default function CreateNote() {
  const navigate = useNavigate();

  const { token } = useAuth();
  const { showToast, toastVisible, toastMessage, triggerToast } = useToast();
  const [categories, setCategories] = useState([]);

  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    api.get('/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const canSubmit = title.trim().length > 0 && categoryId !== null;

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--color-accent)'; };
  const handleBlur = (e) => { e.target.style.borderColor = 'transparent'; };

  const handleSubmit = async () => {
    try {
      await api.post('/notes',
        { title, description, event_date: eventDate || null, category_id: categoryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      triggerToast('Nota creada');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };
  return (
    <>
      <div style={{
        backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(30px)' : 'translateX(0)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>


        
        <div style={{ padding: '48px 24px 0' }}>
          <div style={{
            position: 'relative',
            opacity: entered ? 1 : 0,
            transform: entered
              ? 'translateY(0) rotate(-1deg)'
              : 'translateY(50px) rotate(-4deg)',
            transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>

            
            <Tape width="64px" height="22px" top="-11px" />

            <div style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              padding: '24px 20px 20px',
              boxShadow: '3px 5px 14px rgba(0,0,0,0.13)',
              marginTop: '12px',
            }}>

              
              <input
                type="text"
                placeholder="Título de la nota..."
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%', border: 'none',
                  borderBottom: '1px solid var(--color-border-light)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font)', fontSize: '17px', fontWeight: '700',
                  color: 'var(--color-text)', outline: 'none',
                  padding: '0 0 10px', marginBottom: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              
              <textarea
                placeholder="Describe tu nota... (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%', border: 'none',
                  borderBottom: '1px solid var(--color-border-light)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font)', fontSize: '14px',
                  color: 'var(--color-text)', outline: 'none', resize: 'none',
                  lineHeight: '1.6', padding: '0 0 10px', marginBottom: '20px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              
              <p style={{
                fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
              }}>
                Fecha (opcional)
              </p>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: '100%', border: 'none',
                  borderBottom: '1px solid var(--color-border-light)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font)', fontSize: '14px',
                  color: eventDate ? 'var(--color-text)' : 'var(--color-text-muted)',
                  outline: 'none', padding: '0 0 10px', marginBottom: '20px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              
              <p style={{
                fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px',
              }}>
                Categoría
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {categories.map((cat) => {
                  const { Icon, color } = CATEGORY_CONFIG[cat.name] || DEFAULT_CONFIG;
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryId(isSelected ? null : cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px',
                        border: `1px solid ${isSelected ? color : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? color : 'transparent',
                        color: isSelected ? 'white' : 'var(--color-text)',
                        fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                        cursor: 'pointer', borderRadius: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icon size={13} strokeWidth={2} color={isSelected ? 'white' : color} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              
              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                style={{
                  width: '100%', height: '46px',
                  backgroundColor: canSubmit ? 'var(--color-accent)' : 'var(--color-border-light)',
                  color: canSubmit ? 'white' : 'var(--color-text-muted)',
                  border: 'none', fontFamily: 'var(--font)',
                  fontSize: '14px', fontWeight: '700',
                  cursor: canSubmit ? 'pointer' : 'default',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Publicar nota
              </button>

            </div>
          </div>
        </div>

      </div>
      <MenuBar active="create" />
      <Toast message={toastMessage} show={showToast} visible={toastVisible} />
    </>
  );
}
