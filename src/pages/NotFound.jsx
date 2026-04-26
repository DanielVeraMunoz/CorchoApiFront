import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tape from '../components/Tape';

export default function NotFound() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      backgroundColor: 'var(--color-bg)',
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        opacity: entered ? 1 : 0,
        transform: entered
          ? 'translateY(0) rotate(-1.5deg)'
          : 'translateY(60px) rotate(-5deg)',
        transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>

        <Tape width="64px" height="22px" top="2px" />

        <div style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          padding: '32px 28px 28px',
          boxShadow: '3px 5px 14px rgba(0,0,0,0.13)',
          marginTop: '12px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '64px',
            fontWeight: '400',
            color: 'var(--color-accent)',
            lineHeight: 1,
            marginBottom: '12px',
            fontFamily: 'var(--font-display)',
          }}>
            404
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--color-text)',
            marginBottom: '8px',
          }}>
            Esta página no existe
          </p>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            lineHeight: '1.5',
            marginBottom: '24px',
          }}>
            La nota que buscas se cayó del tablón.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Volver al tablón
          </button>
        </div>
      </div>
    </div>
  );
}
