import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Pencil, Megaphone, CalendarDays, ShoppingBag, LayoutGrid } from 'lucide-react';

// En producción esto vendrá del contexto de autenticación
const MY_USER_ID = 2;

const MOCK_USERS = [
  { id: 1, name: 'Ana García', role: 'admin', floor: '1', door: 'A', community: { name: 'Los Pinos 42' }, created_at: '2024-01-15', thanks_count: 12, is_top_helper: true },
  { id: 2, name: 'Carlos M.',  role: 'user',  floor: '3', door: 'B', community: { name: 'Los Pinos 42' }, created_at: '2024-02-20', thanks_count: 5,  is_top_helper: false },
  { id: 3, name: 'Laura P.',   role: 'user',  floor: '2', door: 'C', community: { name: 'Los Pinos 42' }, created_at: '2024-03-10', thanks_count: 8,  is_top_helper: true },
  { id: 4, name: 'John Doe',   role: 'user',  floor: '4', door: 'A', community: { name: 'Los Pinos 42' }, created_at: '2024-04-05', thanks_count: 3,  is_top_helper: false },
];

const MOCK_USER_NOTES = {
  1: [
    { id: 1, title: 'Corte de agua el jueves',      category: { name: 'Avisos oficiales' }, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  ],
  2: [
    { id: 2, title: 'Fiesta de vecinos en el patio', category: { name: 'Eventos' },          created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  ],
  3: [
    { id: 3, title: 'Se vende bicicleta',            category: { name: 'Mercadillo' },        created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  ],
  4: [],
};

const CATEGORY_COLORS = {
  'Avisos oficiales': '#DD686D',
  'Reuniones':        '#68A7DD',
  'Sugerencias':      '#68DD9E',
  'Eventos':          '#DDC068',
  'Favores':          '#68DD9E',
  'Mercadillo':       '#F97316',
  'Incidencias':      '#A868DD',
  'Cajón desastre':   '#DD6899',
};

const NOTE_ROTATIONS = [-1.5, 0.8, -0.6];

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

function formatMemberSince(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function timeAgo(dateString) {
  const diffDays = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  if (diffDays < 7) return `hace ${diffDays}d`;
  return `hace ${Math.floor(diffDays / 7)}sem`;
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => navigate(-1), 260);
  };

  const user = MOCK_USERS.find((u) => u.id === Number(id));
  const userNotes = MOCK_USER_NOTES[Number(id)] || [];
  const isOwnProfile = Number(id) === MY_USER_ID;

  const { displayed: nameDisplayed, done: nameDone } = useTypewriter(
    user?.name || '', 42, 380
  );

  if (!user) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p>Usuario no encontrado.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const cardRotation = user.id % 2 === 0 ? 0.8 : -1;

  return (
    <div style={{
      backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '60px',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'translateX(30px)' : 'translateX(0)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
    }}>

      {/* Botón volver */}
      <div style={{
        padding: '52px 20px 0',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
            color: 'var(--color-text-muted)', padding: 0,
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Volver
        </button>
      </div>

      {/* Tarjeta principal del usuario */}
      <div style={{ padding: '0 24px', marginTop: '20px' }}>
        <div style={{
          position: 'relative',
          opacity: entered ? 1 : 0,
          transform: entered
            ? `translateY(0) rotate(${cardRotation}deg)`
            : `translateY(50px) rotate(${cardRotation - 4}deg)`,
          transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Tape */}
          <div style={{
            position: 'absolute', top: '-11px', left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '64px', height: '22px',
            backgroundColor: 'rgba(255,235,140,0.88)',
            border: '1px solid rgba(180,150,30,0.2)',
            zIndex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }} />

          <div style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            padding: '24px 20px 20px',
            boxShadow: '3px 5px 14px rgba(0,0,0,0.14)',
            marginTop: '12px',
            position: 'relative',
          }}>

            {/* Botón editar — solo en perfil propio */}
            {isOwnProfile && (
              <button
                onClick={() => {}}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'none', border: '1px solid var(--color-border)',
                  padding: '5px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--font)', fontSize: '11px', fontWeight: '700',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}
              >
                <Pencil size={12} strokeWidth={2.5} />
                Editar
              </button>
            )}

            {/* Avatar + nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                width: '52px', height: '52px', flexShrink: 0,
                backgroundColor: 'var(--color-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-display)', fontSize: '28px',
              }}>
                {initial}
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0, minHeight: '26px' }}>
                  {nameDisplayed}<Cursor visible={!nameDone} />
                </h2>
                <p style={{
                  fontSize: '11px', fontWeight: '700', color: user.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '3px',
                  opacity: nameDone ? 1 : 0, transition: 'opacity 0.3s ease',
                }}>
                  {user.role === 'admin' ? 'Presidente' : 'Vecino'}
                </p>
              </div>
            </div>

            {/* Datos */}
            <div style={{
              opacity: nameDone ? 1 : 0, transition: 'opacity 0.4s ease 0.1s',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {[
                  { label: 'Piso / Puerta', value: `${user.floor}º ${user.door}` },
                  { label: 'Comunidad',     value: user.community.name },
                  { label: 'Vecino desde',  value: formatMemberSince(user.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Agradecimientos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} color="#DD686D" strokeWidth={2} fill="#DD686D" />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
                    {user.thanks_count} agradecimientos
                  </span>
                </div>

                {/* Badge top helper */}
                {user.is_top_helper && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    backgroundColor: '#FEF9C3',
                    border: '1px solid rgba(180,160,0,0.3)',
                    padding: '4px 10px',
                  }}>
                    <Star size={12} color="#DDC068" fill="#DDC068" strokeWidth={2} />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#92680A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Top del mes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas recientes */}
      {userNotes.length > 0 && (
        <div style={{ padding: '0 24px', marginTop: '36px' }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px',
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.3s ease 0.6s',
          }}>
            Últimas notas · {userNotes.length}
          </p>

          {userNotes.map((note, index) => {
            const delay = `${0.65 + index * 0.14}s`;
            const rotation = NOTE_ROTATIONS[index % NOTE_ROTATIONS.length];
            const color = CATEGORY_COLORS[note.category?.name] || '#6B7280';

            return (
              <div
                key={note.id}
                onClick={() => navigate(`/notes/${note.id}`)}
                style={{
                  position: 'relative',
                  marginTop: '16px', marginBottom: '20px',
                  cursor: 'pointer',
                  opacity: entered ? 1 : 0,
                  transform: entered
                    ? `rotate(${rotation}deg)`
                    : `translateY(30px) rotate(${rotation - 2}deg)`,
                  transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                  transformOrigin: 'center top',
                }}
              >
                {/* Chincheta del color de categoría */}
                <div style={{
                  position: 'absolute', top: '-16px', left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
                  }} />
                  <div style={{ width: '3px', height: '8px', backgroundColor: '#9CA3AF', borderRadius: '0 0 2px 2px' }} />
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    padding: '16px 18px',
                    boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                    marginTop: '8px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '4px 6px 14px rgba(0,0,0,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.1)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', flex: 1 }}>
                      {note.title}
                    </p>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0, marginTop: '4px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                    {note.category?.name} · {timeAgo(note.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
