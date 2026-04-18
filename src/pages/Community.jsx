import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import MenuBar from '../components/MenuBar';

// Mock que replica la estructura real de GET /api/stats/community
const MOCK_COMMUNITY_STATS = {
  name:          'Los Pinos 42',
  neighborhood:  'Lavapiés, Madrid',
  created_at:    '2024-01-15',
  users_count:   24,
  notes_count:   156,
};

// Mock que replica la estructura real de GET /api/stats/top-helpers
const MOCK_TOP_HELPERS = [
  { id: 1, name: 'Ana García', thanks_count: 12, role: 'admin' },
  { id: 3, name: 'Laura P.',   thanks_count: 8,  role: 'user'  },
  { id: 2, name: 'Carlos M.',  thanks_count: 5,  role: 'user'  },
];

// Mock que replica la estructura real de GET /api/users
const MOCK_USERS = [
  { id: 1, name: 'Ana García', role: 'admin', floor: '1', door: 'A' },
  { id: 2, name: 'Carlos M.',  role: 'user',  floor: '3', door: 'B' },
  { id: 3, name: 'Laura P.',   role: 'user',  floor: '2', door: 'C' },
  { id: 4, name: 'John Doe',   role: 'user',  floor: '4', door: 'A' },
  { id: 5, name: 'Jane Smith', role: 'user',  floor: '1', door: 'B' },
];

const MEDAL_COLORS = ['#DDC068', '#9CA3AF', '#C2844A'];
const STAT_ROTATIONS = [-1.5, 1, -0.8, 1.2];

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

function formatSince(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

export default function Community() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(
    MOCK_COMMUNITY_STATS.name, 42, 300
  );

  const stats = [
    { label: 'Vecinos',  value: MOCK_COMMUNITY_STATS.users_count },
    { label: 'Notas',    value: MOCK_COMMUNITY_STATS.notes_count },
    { label: 'Barrio',   value: MOCK_COMMUNITY_STATS.neighborhood },
    { label: 'Activa desde', value: formatSince(MOCK_COMMUNITY_STATS.created_at) },
  ];

  return (
    <>
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '48px 18px 16px',
        textAlign: 'center',
        marginBottom: '28px',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
          Tu comunidad
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px', fontWeight: '400',
          color: 'var(--color-accent)', letterSpacing: '2px', lineHeight: 1,
          minHeight: '38px',
        }}>
          {titleDisplayed}<Cursor visible={!titleDone} />
        </h1>
      </div>

      {/* Stats — 4 mini notas en grid 2x2 */}
      <div style={{ padding: '0 24px', marginBottom: '36px' }}>
        <p style={{
          fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px',
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.3s ease 0.3s',
        }}>
          Estadísticas
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
          {stats.map((stat, index) => {
            const delay = `${0.35 + index * 0.1}s`;
            const rotation = STAT_ROTATIONS[index];

            return (
              <div
                key={stat.label}
                style={{
                  position: 'relative',
                  opacity: entered ? 1 : 0,
                  transform: entered
                    ? `rotate(${rotation}deg)`
                    : `translateY(20px) rotate(${rotation - 2}deg)`,
                  transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                }}
              >
                {/* Tape */}
                <div style={{
                  position: 'absolute', top: '-9px', left: '50%',
                  transform: 'translateX(-50%) rotate(-1deg)',
                  width: '36px', height: '14px',
                  backgroundColor: 'rgba(255,235,140,0.88)',
                  border: '1px solid rgba(180,150,30,0.2)',
                  zIndex: 1,
                }} />

                <div style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  padding: '16px 14px 14px',
                  boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                  marginTop: '6px',
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: typeof stat.value === 'number' ? 'var(--font-display)' : 'var(--font)',
                    fontSize: typeof stat.value === 'number' ? '36px' : '13px',
                    fontWeight: typeof stat.value === 'number' ? '400' : '700',
                    color: 'var(--color-text)',
                    lineHeight: 1.1,
                    marginBottom: '6px',
                  }}>
                    {stat.value}
                  </p>
                  <p style={{
                    fontSize: '10px', fontWeight: '700',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                  }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top helpers */}
      <div style={{ padding: '0 24px', marginBottom: '36px' }}>
        <p style={{
          fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px',
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.3s ease 0.7s',
        }}>
          Top helpers del mes
        </p>

        {MOCK_TOP_HELPERS.map((helper, index) => {
          const delay = `${0.75 + index * 0.12}s`;
          const rotation = [-1.2, 0.7, -0.5][index];
          const medalColor = MEDAL_COLORS[index];

          return (
            <div
              key={helper.id}
              onClick={() => navigate(`/users/${helper.id}`)}
              style={{
                position: 'relative',
                marginTop: '14px', marginBottom: '18px',
                cursor: 'pointer',
                opacity: entered ? 1 : 0,
                transform: entered
                  ? `rotate(${rotation}deg)`
                  : `translateY(25px) rotate(${rotation - 2}deg)`,
                transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                transformOrigin: 'center top',
              }}
            >
              {/* Chincheta con color de medalla */}
              <div style={{
                position: 'absolute', top: '-14px', left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: medalColor,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {index === 0 && <Star size={9} color="white" fill="white" />}
                </div>
                <div style={{ width: '3px', height: '8px', backgroundColor: '#9CA3AF', borderRadius: '0 0 2px 2px' }} />
              </div>

              <div
                style={{
                  backgroundColor: '#FEFCE8',
                  border: '1px solid rgba(180,160,0,0.2)',
                  padding: '14px 16px',
                  boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '4px 6px 14px rgba(0,0,0,0.16)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.1)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '20px',
                    color: medalColor, width: '24px', textAlign: 'center',
                  }}>
                    {index + 1}
                  </span>
                  <div style={{
                    width: '32px', height: '32px',
                    backgroundColor: medalColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'var(--font-display)', fontSize: '16px',
                  }}>
                    {helper.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
                      {helper.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      {helper.role === 'admin' ? 'Presidente' : 'Vecino'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={14} color="#DD686D" fill="#DD686D" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
                    {helper.thanks_count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de vecinos */}
      <div style={{ padding: '0 24px' }}>
        <p style={{
          fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
          opacity: entered ? 1 : 0,
          transition: `opacity 0.3s ease ${0.75 + MOCK_TOP_HELPERS.length * 0.12 + 0.1}s`,
        }}>
          Vecinos · {MOCK_USERS.length}
        </p>

        {MOCK_USERS.map((user, index) => {
          const delay = `${0.75 + MOCK_TOP_HELPERS.length * 0.12 + 0.15 + index * 0.08}s`;

          return (
            <div
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                marginBottom: '8px',
                cursor: 'pointer',
                opacity: entered ? 1 : 0,
                transform: entered ? 'translateX(0)' : 'translateX(16px)',
                transition: `opacity 0.3s ease ${delay}, transform 0.3s ease ${delay}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  backgroundColor: user.role === 'admin' ? 'var(--color-accent)' : 'var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: user.role === 'admin' ? 'white' : 'var(--color-text)',
                  fontFamily: 'var(--font-display)', fontSize: '18px',
                }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    {user.role === 'admin' ? 'Presidente' : 'Vecino'} · {user.floor}º{user.door}
                  </p>
                </div>
              </div>

              <span style={{
                fontSize: '11px', fontWeight: '700',
                color: 'var(--color-text-muted)',
              }}>
                →
              </span>
            </div>
          );
        })}
      </div>

    </div>

    <MenuBar active="community" />
    </>
  );
}
