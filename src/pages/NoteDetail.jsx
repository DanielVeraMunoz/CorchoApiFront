import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, Users, Lightbulb, CalendarDays, HandHeart, ShoppingBag, AlertTriangle, Inbox, LayoutGrid } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Avisos oficiales': { Icon: Megaphone,    color: '#DD686D' },
  'Reuniones':        { Icon: Users,         color: '#68A7DD' },
  'Sugerencias':      { Icon: Lightbulb,     color: '#68DD9E' },
  'Eventos':          { Icon: CalendarDays,  color: '#DDC068' },
  'Favores':          { Icon: HandHeart,     color: '#68DD9E' },
  'Mercadillo':       { Icon: ShoppingBag,   color: '#F97316' },
  'Incidencias':      { Icon: AlertTriangle, color: '#A868DD' },
  'Cajón desastre':   { Icon: Inbox,         color: '#DD6899' },
};
const DEFAULT_CONFIG = { Icon: LayoutGrid, color: '#6B7280' };

const MOCK_NOTES = [
  {
    id: 1,
    title: 'Corte de agua el jueves',
    description: 'El jueves 17 habrá corte de agua de 9:00 a 14:00 por obras en la red principal. Se recomienda tener agua embotellada para ese período y llenar recipientes la noche anterior si es posible.',
    is_completed: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { name: 'Ana García' },
    category: { name: 'Avisos oficiales' },
  },
  {
    id: 2,
    title: 'Fiesta de vecinos en el patio',
    description: 'Este sábado organizamos una barbacoa en el patio. ¡Todos estáis invitados! Traed algo para compartir. Empezamos a las 13:00h. Los niños son bienvenidos.',
    is_completed: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    user: { name: 'Carlos M.' },
    category: { name: 'Eventos' },
  },
  {
    id: 3,
    title: 'Se vende bicicleta',
    description: 'Vendo bici de montaña en buen estado. 150€. Interesados contactar por el portal o dejar nota en el buzón del 3ºB.',
    is_completed: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    user: { name: 'Laura P.' },
    category: { name: 'Mercadillo' },
  },
];

const MOCK_COMMENTS = {
  1: [
    { id: 1, user: { name: 'Carlos M.' },  text: 'Gracias por avisar, justo me pillaba duchándome jaja',      created_at: new Date(Date.now() - 1.5 * 86400000).toISOString() },
    { id: 2, user: { name: 'Laura P.' },   text: '¿Sabes si afecta también al portal B?',                      created_at: new Date(Date.now() - 1.0 * 86400000).toISOString() },
    { id: 3, user: { name: 'Ana García' }, text: 'Sí, afecta a todo el edificio según el comunicado oficial.', created_at: new Date(Date.now() - 0.5 * 86400000).toISOString() },
  ],
  2: [
    { id: 4, user: { name: 'Ana García' }, text: '¡Me apunto! ¿Hay que traer algo en concreto?', created_at: new Date(Date.now() - 0.8 * 86400000).toISOString() },
    { id: 5, user: { name: 'Laura P.' },   text: 'Yo llevo ensalada :)',                          created_at: new Date(Date.now() - 0.4 * 86400000).toISOString() },
  ],
  3: [],
};

const COMMENT_ROTATIONS = [-1.5, 0.8, -0.6, 1.2, -1, 0.5];

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  if (diffDays < 7) return `hace ${diffDays}d`;
  return `hace ${Math.floor(diffDays / 7)}sem`;
}

// Escribe el texto carácter a carácter, con delay opcional de inicio
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
        if (i >= text.length) {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
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

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');

  // Controla toda la secuencia de animación de entrada
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => navigate('/dashboard'), 260);
  };

  const note = MOCK_NOTES.find((n) => n.id === Number(id));
  const comments = MOCK_COMMENTS[Number(id)] || [];

  if (!note) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p>Nota no encontrada.</p>
        <button onClick={() => navigate('/dashboard')}>Volver</button>
      </div>
    );
  }

  const { Icon: CategoryIcon, color: categoryColor } = CATEGORY_CONFIG[note.category?.name] || DEFAULT_CONFIG;
  const initial = note.user?.name?.charAt(0).toUpperCase() || '?';
  const noteRotation = note.id % 2 === 0 ? 0.8 : -1;

  // El título empieza a escribirse cuando la nota ya lleva 400ms en pantalla
  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(note.title, 36, 400);

  // Delay base para los comentarios — empiezan tras la nota + título
  const commentsBaseDelay = 0.65;

  return (
    <div style={{
      backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'translateX(30px)' : 'translateX(0)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
    }}>

      {/* Botón volver — desliza desde la izquierda */}
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

      {/* Nota principal — sube desde abajo y se "clava" con spring */}
      <div style={{ padding: '0 24px', marginTop: '20px' }}>
        <div style={{
          position: 'relative',
          opacity: entered ? 1 : 0,
          transform: entered
            ? `translateY(0) rotate(${noteRotation}deg)`
            : `translateY(50px) rotate(${noteRotation - 4}deg)`,
          // cubic-bezier spring: sube y rebota un poco al final, como al clavar una chincheta
          transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Tape */}
          <div style={{
            position: 'absolute', top: '-11px', left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '64px', height: '22px',
            backgroundColor: 'rgba(255,235,140,0.88)',
            border: '1px solid rgba(180,150,30,0.2)',
            zIndex: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }} />

          {/* Card */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            padding: '24px 20px 20px',
            boxShadow: '3px 5px 14px rgba(0,0,0,0.14)',
            marginTop: '12px',
          }}>

            {/* Título con typewriter + icono categoría */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.3', flex: 1, margin: 0, minHeight: '24px' }}>
                {titleDisplayed}<Cursor visible={!titleDone} />
              </h2>
              <CategoryIcon size={20} color={categoryColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
            </div>

            {/* Descripción — aparece cuando el título termina */}
            <p style={{
              fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '20px',
              opacity: titleDone ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}>
              {note.description}
            </p>

            {/* Separador */}
            <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '12px' }} />

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px', height: '30px',
                  backgroundColor: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-display)', fontSize: '16px',
                }}>
                  {initial}
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text)' }}>{note.user?.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{timeAgo(note.created_at)}</p>
                </div>
              </div>
              {note.is_completed && (
                <span style={{
                  border: '1.5px solid var(--color-border)', color: 'var(--color-text)',
                  fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  Completada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección comentarios */}
      <div style={{ padding: '0 24px', marginTop: '36px' }}>

        {/* Label "Respuestas" — aparece tras la nota */}
        <p style={{
          fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px',
          opacity: entered ? 1 : 0,
          transition: `opacity 0.3s ease ${commentsBaseDelay - 0.1}s`,
        }}>
          Respuestas · {comments.length}
        </p>

        {comments.length === 0 && (
          <p style={{
            fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '24px',
            opacity: entered ? 1 : 0,
            transition: `opacity 0.3s ease ${commentsBaseDelay}s`,
          }}>
            Sin respuestas todavía. ¡Sé el primero!
          </p>
        )}

        {/* Post-its de comentarios — cascada con delay incremental */}
        {comments.map((comment, index) => {
          const commentInitial = comment.user?.name?.charAt(0).toUpperCase() || '?';
          const rotation = COMMENT_ROTATIONS[index % COMMENT_ROTATIONS.length];
          const delay = `${commentsBaseDelay + index * 0.14}s`;

          return (
            <div
              key={comment.id}
              style={{
                position: 'relative',
                marginTop: '16px',
                marginBottom: '20px',
                opacity: entered ? 1 : 0,
                transform: entered
                  ? `rotate(${rotation}deg)`
                  : `translateY(30px) rotate(${rotation - 2}deg)`,
                transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                transformOrigin: 'center top',
              }}
            >
              {/* Tape */}
              <div style={{
                position: 'absolute', top: '-9px', left: '50%',
                transform: 'translateX(-50%) rotate(-1.5deg)',
                width: '44px', height: '16px',
                backgroundColor: 'rgba(255,235,140,0.88)',
                border: '1px solid rgba(180,150,30,0.2)',
                zIndex: 1,
              }} />

              {/* Post-it amarillo */}
              <div style={{
                backgroundColor: '#FEFCE8',
                border: '1px solid rgba(180,160,0,0.2)',
                padding: '16px 16px 14px',
                boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.55', marginBottom: '12px' }}>
                  {comment.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '22px', height: '22px', backgroundColor: '#DDC068',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'var(--font-display)', fontSize: '13px', flexShrink: 0,
                  }}>
                    {commentInitial}
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                    {comment.user?.name} · {timeAgo(comment.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Post-it para escribir — aparece el último */}
        {(() => {
          const delay = `${commentsBaseDelay + comments.length * 0.14 + 0.05}s`;
          return (
            <div style={{
              position: 'relative',
              marginTop: '24px',
              opacity: entered ? 1 : 0,
              transform: entered ? 'rotate(0.5deg)' : 'translateY(30px) rotate(-1.5deg)',
              transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
            }}>
              <div style={{
                position: 'absolute', top: '-9px', left: '50%',
                transform: 'translateX(-50%) rotate(-2deg)',
                width: '44px', height: '16px',
                backgroundColor: 'rgba(255,235,140,0.88)',
                border: '1px solid rgba(180,150,30,0.2)',
                zIndex: 1,
              }} />
              <div style={{
                backgroundColor: '#FEFCE8',
                border: '1px solid rgba(180,160,0,0.25)',
                padding: '16px',
                boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
              }}>
                <textarea
                  placeholder="Escribe tu respuesta..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', border: 'none',
                    borderBottom: '1px solid rgba(180,160,0,0.3)',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font)', fontSize: '13px',
                    color: 'var(--color-text)', resize: 'none', outline: 'none',
                    lineHeight: '1.6', paddingBottom: '8px', marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    disabled={!newComment.trim()}
                    style={{
                      backgroundColor: 'var(--color-accent)', color: 'white',
                      border: 'none', fontFamily: 'var(--font)',
                      fontSize: '12px', fontWeight: '700',
                      padding: '7px 18px', cursor: newComment.trim() ? 'pointer' : 'default',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      opacity: newComment.trim() ? 1 : 0.45,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </div>

    </div>
  );
}
