import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import Tape from '../components/Tape';
import Avatar from '../components/Avatar';
import { useTypewriter, Cursor } from '../hooks/useTypewriter.jsx';
import { formatMemberSince } from '../utils/helpers';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios';
import LoadingScreen from '../components/LoadingScreen';


const MEDAL_COLORS = ['#DDC068', '#9CA3AF', '#C2844A'];
const STAT_ROTATIONS = [-1.5, 1, -0.8, 1.2];

export default function Community() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [communityStats, setCommunityStats] = useState(null);
  const [topHelpers, setTopHelpers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setEntered(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    Promise.all([
      api.get('/stats/community', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/stats/top-helpers', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/users', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([statsRes, helpersRes, usersRes]) => {

      setCommunityStats(statsRes.data.data);
      setTopHelpers(helpersRes.data.data);
      setUsers(usersRes.data.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching community data:', err);
      setLoading(false);
    });
    }, [token]);

  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(
    communityStats?.community_name || 'Mi comunidad', 42, 300
  );

  const stats = communityStats ? [
    { label: 'Vecinos',      value: communityStats.total_users },
    { label: 'Notas',        value: communityStats.total_notes },
    { label: 'Comentarios',  value: communityStats.total_comments },
    { label: 'Gracias',      value: communityStats.total_thanks },
  ] : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100svh' }}>
        <LoadingScreen />
      </div>
    );
  }

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
                <Tape width="36px" height="14px" rotate="-1deg" top="-9px" />

                <div style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  padding: '16px 14px 14px',
                  boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
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

        {topHelpers.map((helper, index) => {
          const delay = `${0.75 + index * 0.12}s`;
          const rotation = [-1.2, 0.7, -0.5][index];
          const medalColor = MEDAL_COLORS[index];

          return (
            <div
              key={helper.user_id}
              onClick={() => navigate(`/users/${helper.user_id}`)}
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
                  <Avatar name={helper.name} size={32} color={medalColor} />
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
          transition: `opacity 0.3s ease ${0.75 + topHelpers.length * 0.12 + 0.1}s`,
        }}>
          Vecinos · {users.length}
        </p>

        {users.map((user, index) => {
          const delay = `${0.75 + topHelpers.length * 0.12 + 0.15 + index * 0.08}s`;

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
                <Avatar name={user.name} size={36} fontSize={18} color={user.role === 'admin' ? 'var(--color-accent)' : '#6B7280'} />
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
