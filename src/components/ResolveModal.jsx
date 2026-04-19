import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Tape from './Tape';
import Avatar from './Avatar';

export default function ResolveModal({ commenters, allUsers, onClose, onResolve }) {
  const [modalEntered, setModalEntered]   = useState(false);
  const [thankedUsers, setThankedUsers]   = useState([]);
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setModalEntered(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setModalEntered(false);
    setTimeout(onClose, 300);
  };

  const toggleThanks = (userId) => {
    setThankedUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    );
  };

  const modalUsers = showCommunity
    ? allUsers
    : commenters;

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: modalEntered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
          transition: 'background-color 0.3s ease',
          zIndex: 200,
        }}
      />

      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: `translateX(-50%) translateY(-50%) scale(${modalEntered ? '1' : '0.82'}) rotate(${modalEntered ? '-0.8' : '-3'}deg)`,
        width: 'calc(100% - 48px)', maxWidth: '360px',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        padding: '28px 20px 32px',
        zIndex: 201,
        opacity: modalEntered ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
        boxShadow: '4px 8px 24px rgba(0,0,0,0.18)',
      }}>
        <Tape width="54px" height="18px" rotate="-1deg" />

        <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>
          ¿Quieres agradecer a alguien?
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
          Pulsa el corazón para dar las gracias
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {modalUsers.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>
              Nadie ha comentado todavía
            </p>
          )}
          {modalUsers.map((user) => {
            const isLiked = thankedUsers.includes(user.id);
            return (
              <div key={user.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: isLiked ? '#FFF1F2' : 'var(--color-bg)',
                border: `1px solid ${isLiked ? '#DD686D' : 'var(--color-border)'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar name={user.name} size={32} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>{user.name}</p>
                    {user.floor && (
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{user.floor}º{user.door}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => toggleThanks(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <Heart size={22} strokeWidth={2} color="#DD686D" fill={isLiked ? '#DD686D' : 'none'} />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowCommunity((s) => !s)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
            color: 'var(--color-accent)', padding: 0,
            textDecoration: 'underline', marginBottom: '24px', display: 'block',
          }}
        >
          {showCommunity ? '← Solo comentadores' : 'Buscar en comunidad →'}
        </button>

        <button
          onClick={() => onResolve(thankedUsers)}
          style={{
            width: '100%', height: '46px',
            backgroundColor: 'var(--color-accent)', color: 'white',
            border: 'none', fontFamily: 'var(--font)',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {thankedUsers.length > 0 ? 'Resolver y agradecer' : 'Resolver'}
        </button>
      </div>
    </>
  );
}
