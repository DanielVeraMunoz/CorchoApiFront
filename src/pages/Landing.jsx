import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tape from '../components/Tape';

export default function Landing() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [noteEntered, setNoteEntered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setNoteEntered(true), 260);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
      gap: '40px',
    }}>

      
      <div style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '72px',
          color: 'var(--color-accent)',
          lineHeight: 1,
          marginBottom: '12px',
        }}>
          CORCHO
        </p>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-text-muted)',
          lineHeight: '1.5',
          maxWidth: '260px',
          margin: '0 auto',
        }}>
          El tablón digital <br/>de tu comunidad de vecinos
        </p>
      </div>

      
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '300px',
        opacity: noteEntered ? 1 : 0,
        transform: noteEntered
          ? 'translateY(0) rotate(1.2deg)'
          : 'translateY(40px) rotate(-3deg)',
        transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <Tape width="54px" height="20px" top="0px" rotate="2deg" />
        <div style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          padding: '24px 20px',
          boxShadow: '3px 5px 14px rgba(0,0,0,0.13)',
          marginTop: '10px',
        }}>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}>
            Publica avisos, pide ayuda a tus vecinos y da las gracias a quien te echa una mano.
          </p>

          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', height: '44px',
              backgroundColor: 'var(--color-accent)',
              color: 'white', border: 'none',
              fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Entrar
          </button>

          <button
            onClick={() => navigate('/login?mode=register')}
            style={{
              width: '100%', height: '44px',
              backgroundColor: 'transparent',
              color: 'var(--color-text)', border: '1px solid var(--color-border)',
              fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            Crear cuenta
          </button>
        </div>
      </div>

    </div>
  );
}
