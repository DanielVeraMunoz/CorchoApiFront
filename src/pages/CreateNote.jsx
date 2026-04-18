import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Users, Lightbulb, CalendarDays, HandHeart, ShoppingBag, AlertTriangle, Inbox } from 'lucide-react';
import MenuBar from '../components/MenuBar';

const CATEGORIES = [
  { id: 1, name: 'Avisos oficiales', Icon: Megaphone,    color: '#DD686D' },
  { id: 2, name: 'Reuniones',        Icon: Users,         color: '#68A7DD' },
  { id: 3, name: 'Sugerencias',      Icon: Lightbulb,     color: '#68DD9E' },
  { id: 4, name: 'Eventos',          Icon: CalendarDays,  color: '#DDC068' },
  { id: 5, name: 'Favores',          Icon: HandHeart,     color: '#68DD9E' },
  { id: 6, name: 'Mercadillo',       Icon: ShoppingBag,   color: '#F97316' },
  { id: 7, name: 'Incidencias',      Icon: AlertTriangle, color: '#A868DD' },
  { id: 8, name: 'Cajón desastre',   Icon: Inbox,         color: '#DD6899' },
];

function useTypewriter(text, speed = 38, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { setDone(true); clearInterval(interval); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function Cursor({ visible }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setShow((s) => !s), 500);
    return () => clearInterval(t);
  }, [visible]);
  if (!visible) return null;
  return <span style={{ opacity: show ? 1 : 0, fontWeight: 400 }}>|</span>;
}

export default function CreateNote() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId]   = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => navigate('/dashboard'), 260);
  };

  const canSubmit = title.trim().length > 0 && categoryId !== null;

  const { displayed, done } = useTypewriter('Nueva nota', 42, 300);

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--color-accent)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'transparent'; };

  return (
    <>
    <div style={{
      backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'translateX(30px)' : 'translateX(0)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
    }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '52px 20px 16px',
        marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '16px',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
            color: 'var(--color-text-muted)', flexShrink: 0,
          }}
        >
          ← Volver
        </button>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '400',
          color: 'var(--color-accent)', letterSpacing: '2px', margin: 0, minHeight: '34px',
        }}>
          {displayed}<Cursor visible={!done} />
        </h1>
      </div>

      {/* Nota / Formulario */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          position: 'relative',
          opacity: entered ? 1 : 0,
          transform: entered
            ? 'translateY(0) rotate(-1deg)'
            : 'translateY(50px) rotate(-4deg)',
          transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Tape */}
          <div style={{
            position: 'absolute', top: '-11px', left: '50%',
            transform: 'translateX(-50%) rotate(-1.5deg)',
            width: '64px', height: '22px',
            backgroundColor: 'rgba(255,235,140,0.88)',
            border: '1px solid rgba(180,150,30,0.2)',
            zIndex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }} />

          <div style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            padding: '24px 20px 20px',
            boxShadow: '3px 5px 14px rgba(0,0,0,0.13)',
            marginTop: '12px',
          }}>

            {/* Título */}
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

            {/* Descripción */}
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

            {/* Selector de categoría */}
            <p style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px',
            }}>
              Categoría
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {CATEGORIES.map(({ id, name, Icon, color }) => {
                const isSelected = categoryId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setCategoryId(isSelected ? null : id)}
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
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Botón publicar */}
            <button
              disabled={!canSubmit}
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
    </>
  );
}
