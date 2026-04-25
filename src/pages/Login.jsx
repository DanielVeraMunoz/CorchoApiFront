import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypewriter, Cursor } from '../hooks/useTypewriter.jsx';
import Tape from '../components/Tape';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const MOCK_COMMUNITIES = [
  { id: 1, name: 'Calle Mayor 42, Madrid' },
  { id: 2, name: 'Paseo del Prado 18, Madrid' },
  { id: 3, name: 'Calle Luna 7, Barcelona' },
  { id: 4, name: 'Av. Diagonal 55, Barcelona' },
];

const fieldStyle = {
  width: '100%',
  height: '44px',
  border: '1px solid var(--color-border)',
  borderRadius: 0,
  backgroundColor: 'var(--color-white)',
  padding: '0 14px',
  fontSize: '14px',
  fontFamily: 'var(--font)',
  color: 'var(--color-text)',
  outline: 'none',
  boxSizing: 'border-box',
  display: 'block',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--color-text)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '6px',
};

// Truco CSS moderno: grid-template-rows 0fr → 1fr anima altura desde/hasta 0
// sin necesitar conocer la altura exacta del contenido
function AnimatedField({ visible, children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: visible ? '1fr' : '0fr',
      transition: 'grid-template-rows 0.38s ease',
    }}>
      <div style={{
        overflow: 'hidden',
        minHeight: 0,
        opacity: visible ? 1 : 0,
        // Al abrir: espera 0.2s (el hueco se abre primero) y luego aparece el contenido
        // Al cerrar: desaparece inmediatamente antes de que el hueco se cierre
        transition: visible
          ? 'opacity 0.22s ease 0.18s'
          : 'opacity 0.12s ease',
      }}>
        {children}
      </div>
    </div>
  );
}



export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [wobble, setWobble] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [floor, setFloor] = useState('');
  const [door, setDoor] = useState('');

  const modeText = isLogin ? 'Iniciar sesión' : 'Crear cuenta';
  const { displayed, done } = useTypewriter(modeText);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const switchMode = () => {
    setWobble(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setWobble(false);
    }, 160);
  };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--color-accent)'; };
  const handleBlur = (e) => { e.target.style.borderColor = 'var(--color-border)'; };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const response = await api.post('/login', { email, password });
        login(response.data.access_token, response.data.data);
        navigate('/dashboard');
      } else {
        const response = await api.post('/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          community_id: communityId,
          floor,
          door,
        });
        login(response.data.access_token, response.data.data);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const first = errors ? Object.values(errors)[0][0] : 'Datos inválidos';
        setError(first);
      } else {
        setError(isLogin ? 'Email o contraseña incorrectos' : 'Error al crear la cuenta');
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#C8956C',
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
      backgroundSize: '6px 6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px 40px',
      overflowY: 'auto',
    }}>

      {/* Post-its decorativos repartidos por todo el fondo */}
      {[
        { top: '5%',  left: '3%',   w: 110, h: 88,  color: '#FFF7ED', rot: -9,  tape: true  },
        { top: '8%',  right: '4%',  w: 95,  h: 75,  color: '#FEF3C7', rot: 7,   pin: true   },
        { top: '30%', left: '1%',   w: 85,  h: 68,  color: '#EDE9FE', rot: 5,   tape: false },
        { top: '35%', right: '2%',  w: 100, h: 80,  color: '#DCFCE7', rot: -6,  tape: true  },
        { top: '60%', left: '4%',   w: 90,  h: 72,  color: '#FEF3C7', rot: 8,   tape: false },
        { top: '62%', right: '3%',  w: 105, h: 84,  color: '#FFF7ED', rot: -4,  pin: true   },
        { bottom: '8%', left: '2%', w: 88,  h: 70,  color: '#EDE9FE', rot: -7,  tape: true  },
        { bottom: '6%', right: '5%',w: 100, h: 78,  color: '#DCFCE7', rot: 6,   tape: false },
        { top: '18%', left: '20%',  w: 80,  h: 64,  color: '#FEF3C7', rot: -5,  tape: false },
        { top: '75%', right: '20%', w: 85,  h: 68,  color: '#FFF7ED', rot: 9,   pin: true   },
      ].map((n, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: n.top, bottom: n.bottom, left: n.left, right: n.right,
          width: n.w, height: n.h,
          backgroundColor: n.color,
          border: '1px solid rgba(0,0,0,0.12)',
          transform: `rotate(${n.rot}deg)`,
          boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
        }}>
          {n.tape && <Tape width="40px" top="-9px" rotate="2deg" />}
          {n.pin && <>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#DD686D', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '6px', backgroundColor: '#9CA3AF', borderRadius: '0 0 2px 2px' }} />
          </>}
        </div>
      ))}

      {/* Formulario principal */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '340px', zIndex: 10 }}>

        <Tape width="64px" height="22px" top="-11px" />

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          padding: '32px 28px 28px',
          transform: `rotate(${wobble ? -2.5 : -1}deg)`,
          transition: 'transform 0.16s ease',
          boxShadow: '4px 6px 18px rgba(0,0,0,0.22)',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '46px',
              fontWeight: '400',
              color: 'var(--color-accent)',
              letterSpacing: '3px',
              lineHeight: 1,
            }}>
              CORCHO
            </h1>
            <p style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '4px',
            }}>
              tablón de tu comunidad
            </p>
          </div>

          {/* Título de modo con typewriter */}
          <p style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: '24px',
            marginTop: '16px',
            minHeight: '24px',
            letterSpacing: '0.3px',
          }}>
            {displayed}<Cursor visible={!done} />
          </p>

          {/* Campo: Nombre — solo registro, animado */}
          <AnimatedField visible={!isLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={fieldStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </AnimatedField>

          {/* Campo: Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={fieldStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Campo: Contraseña */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={fieldStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Campo: Comunidad — solo registro, animado */}
          <AnimatedField visible={!isLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Comunidad</label>
              <select
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Selecciona tu comunidad</option>
                {MOCK_COMMUNITIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </AnimatedField>

          {/* Campos: Piso y Puerta — solo registro */}
          <AnimatedField visible={!isLogin}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Piso</label>
                <input
                  type="text"
                  placeholder="3"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Puerta</label>
                <input
                  type="text"
                  placeholder="B"
                  value={door}
                  onChange={(e) => setDoor(e.target.value)}
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </AnimatedField>

          {/* Campo: Confirmar contraseña — solo registro */}
          <AnimatedField visible={!isLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                style={fieldStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </AnimatedField>

          {/* Error */}
          {error && <p style={{ color: '#DD686D', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>{error}</p>}

          {/* Botón */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font)',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '6px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>

          {/* Toggle */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '20px' }}>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={switchMode}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font)',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}
