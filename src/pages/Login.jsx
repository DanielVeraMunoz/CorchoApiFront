import { useState, useEffect } from 'react';

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

// Escribe el texto carácter a carácter
function useTypewriter(text, speed = 38) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

// Cursor parpadeante que desaparece al terminar de escribir
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

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [wobble, setWobble] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityId, setCommunityId] = useState('');

  const modeText = isLogin ? 'Iniciar sesión' : 'Crear cuenta';
  const { displayed, done } = useTypewriter(modeText);

  const switchMode = () => {
    setWobble(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setWobble(false);
    }, 160);
  };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--color-accent)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'var(--color-border)'; };

  return (
    <div style={{
      minHeight: '100svh',
      backgroundColor: '#C8956C',
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
      backgroundSize: '6px 6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Nota decorativa — arriba izquierda */}
      <div style={{
        position: 'absolute', top: '6%', left: '-18px',
        width: '110px', height: '90px',
        backgroundColor: '#FFF7ED',
        border: '1px solid rgba(0,0,0,0.12)',
        transform: 'rotate(-9deg)',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          position: 'absolute', top: '-9px', left: '50%',
          transform: 'translateX(-50%) rotate(2deg)',
          width: '40px', height: '16px',
          backgroundColor: 'rgba(255,235,140,0.85)',
          border: '1px solid rgba(180,150,30,0.2)',
        }} />
      </div>

      {/* Nota decorativa — arriba derecha */}
      <div style={{
        position: 'absolute', top: '10%', right: '-12px',
        width: '95px', height: '75px',
        backgroundColor: '#FEF3C7',
        border: '1px solid rgba(0,0,0,0.12)',
        transform: 'rotate(7deg)',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          position: 'absolute', top: '-10px', left: '50%',
          transform: 'translateX(-50%)',
          width: '16px', height: '16px',
          borderRadius: '50%',
          backgroundColor: '#DD686D',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }} />
        <div style={{
          position: 'absolute', top: '6px', left: '50%',
          transform: 'translateX(-50%)',
          width: '3px', height: '7px',
          backgroundColor: '#9CA3AF',
          borderRadius: '0 0 2px 2px',
        }} />
      </div>

      {/* Nota decorativa — abajo izquierda */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '-8px',
        width: '85px', height: '68px',
        backgroundColor: '#EDE9FE',
        border: '1px solid rgba(0,0,0,0.12)',
        transform: 'rotate(5deg)',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
      }} />

      {/* Nota decorativa — abajo derecha */}
      <div style={{
        position: 'absolute', bottom: '6%', right: '8px',
        width: '105px', height: '82px',
        backgroundColor: '#DCFCE7',
        border: '1px solid rgba(0,0,0,0.12)',
        transform: 'rotate(-5deg)',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          position: 'absolute', top: '-9px', left: '50%',
          transform: 'translateX(-50%) rotate(3deg)',
          width: '40px', height: '16px',
          backgroundColor: 'rgba(255,235,140,0.85)',
          border: '1px solid rgba(180,150,30,0.2)',
        }} />
      </div>

      {/* Formulario principal */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '340px', zIndex: 10 }}>

        {/* Tape */}
        <div style={{
          position: 'absolute', top: '-11px', left: '50%',
          transform: 'translateX(-50%) rotate(-1.5deg)',
          width: '64px', height: '22px',
          backgroundColor: 'rgba(255,235,140,0.88)',
          border: '1px solid rgba(180,150,30,0.2)',
          zIndex: 11,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }} />

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

          {/* Botón */}
          <button
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
