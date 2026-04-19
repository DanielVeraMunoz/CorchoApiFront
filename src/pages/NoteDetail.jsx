import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Heart, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import { timeAgo } from '../utils/helpers';
import { CATEGORY_CONFIG, DEFAULT_CONFIG } from '../utils/categories';
import { useTypewriter, Cursor } from '../hooks/useTypewriter.jsx';

const MY_USER_ID = 2;
const IS_ADMIN = false;

const MOCK_NOTES = [
  {
    id: 1, title: 'Corte de agua el jueves',
    description: 'El jueves 17 habrá corte de agua de 9:00 a 14:00 por obras en la red principal. Se recomienda tener agua embotellada para ese período y llenar recipientes la noche anterior si es posible.',
    is_completed: false, created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { id: 1, name: 'Ana García' }, category: { name: 'Avisos oficiales' },
  },
  {
    id: 2, title: 'Fiesta de vecinos en el patio',
    description: 'Este sábado organizamos una barbacoa en el patio. ¡Todos estáis invitados! Traed algo para compartir. Empezamos a las 13:00h. Los niños son bienvenidos.',
    is_completed: false, created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    event_date: '2026-04-26',
    user: { id: 2, name: 'Carlos M.' }, category: { name: 'Eventos' },
  },
  {
    id: 3, title: 'Se vende bicicleta',
    description: 'Vendo bici de montaña en buen estado. 150€. Interesados contactar por el portal o dejar nota en el buzón del 3ºB.',
    is_completed: true, created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    user: { id: 3, name: 'Laura P.' }, category: { name: 'Mercadillo' },
  },
];

const MOCK_COMMENTS = {
  1: [
    { id: 1, user: { id: 2, name: 'Carlos M.' },  text: 'Gracias por avisar, justo me pillaba duchándome jaja',      created_at: new Date(Date.now() - 1.5 * 86400000).toISOString() },
    { id: 2, user: { id: 3, name: 'Laura P.' },   text: '¿Sabes si afecta también al portal B?',                      created_at: new Date(Date.now() - 1.0 * 86400000).toISOString() },
    { id: 3, user: { id: 1, name: 'Ana García' }, text: 'Sí, afecta a todo el edificio según el comunicado oficial.', created_at: new Date(Date.now() - 0.5 * 86400000).toISOString() },
  ],
  2: [
    { id: 4, user: { id: 1, name: 'Ana García' }, text: '¡Me apunto! ¿Hay que traer algo en concreto?', created_at: new Date(Date.now() - 0.8 * 86400000).toISOString() },
    { id: 5, user: { id: 3, name: 'Laura P.' },   text: 'Yo llevo ensalada :)',                          created_at: new Date(Date.now() - 0.4 * 86400000).toISOString() },
  ],
  3: [],
};

const MOCK_ALL_USERS = [
  { id: 1, name: 'Ana García', floor: '1', door: 'A' },
  { id: 2, name: 'Carlos M.',  floor: '3', door: 'B' },
  { id: 3, name: 'Laura P.',   floor: '2', door: 'C' },
  { id: 4, name: 'John Doe',   floor: '4', door: 'A' },
  { id: 5, name: 'Jane Smith', floor: '1', door: 'B' },
];

const COMMENT_ROTATIONS = [-1.5, 0.8, -0.6, 1.2, -1, 0.5];

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entered, setEntered]       = useState(false);
  const [exiting, setExiting]       = useState(false);
  const [newComment, setNewComment] = useState('');

  // Estado local de completado (hasta conectar API)
  const [isCompleted, setIsCompleted] = useState(false);

  // Modal de resolución
  const [showModal, setShowModal]         = useState(false);
  const [modalEntered, setModalEntered]   = useState(false);
  const [thankedUsers, setThankedUsers]   = useState([]);
  const [showCommunity, setShowCommunity] = useState(false);

  // Toast
  const [showToast, setShowToast]       = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Edición inline
  const [isEditing, setIsEditing]               = useState(false);
  const [editEntered, setEditEntered]           = useState(false);
  const [editTitle, setEditTitle]               = useState('');
  const [editDescription, setEditDescription]   = useState('');
  const [editDate, setEditDate]                 = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => navigate('/dashboard'), 260);
  };

  const openModal = () => {
    setShowModal(true);
    setThankedUsers([]);
    setShowCommunity(false);
    setTimeout(() => setModalEntered(true), 20);
  };

  const closeModal = () => {
    setModalEntered(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const toggleThanks = (userId) => {
    setThankedUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    );
  };

  const handleResolve = () => {
    setIsCompleted(true);
    closeModal();
    // Toast
    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setToastVisible(true), 30);
      setTimeout(() => setToastVisible(false), 2500);
      setTimeout(() => setShowToast(false), 3000);
    }, 320);
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
  const isAuthor = note.user?.id === MY_USER_ID;
  const completed = isCompleted || note.is_completed;
  const canEdit = isAuthor || IS_ADMIN;

  const startEdit = () => {
    setEditTitle(note.title);
    setEditDescription(note.description || '');
    setEditDate(note.event_date || '');
    setIsEditing(true);
    setTimeout(() => setEditEntered(true), 20);
  };

  const cancelEdit = () => {
    setEditEntered(false);
    setTimeout(() => { setIsEditing(false); setShowDeleteConfirm(false); }, 250);
  };

  const handleSave = () => {
    // TODO: llamada PUT /api/notes/:id
    note.title = editTitle;
    note.description = editDescription;
    note.event_date = editDate || null;
    setEditEntered(false);
    setTimeout(() => setIsEditing(false), 250);
  };

  const handleDelete = () => {
    // TODO: llamada DELETE /api/notes/:id
    navigate('/dashboard');
  };

  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(note.title, 36, 400);
  const commentsBaseDelay = 0.65;

  // Usuarios únicos que comentaron (sin el autor)
  const commenters = comments
    .map((c) => c.user)
    .filter((u, i, arr) => u.id !== note.user?.id && arr.findIndex((x) => x.id === u.id) === i);

  // Lista a mostrar en el modal
  const modalUsers = showCommunity
    ? MOCK_ALL_USERS.filter((u) => u.id !== note.user?.id)
    : commenters;

  return (
    <>
    <div style={{
      backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
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
        <button onClick={handleBack} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
          color: 'var(--color-text-muted)', padding: 0,
        }}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
      </div>

      {/* Nota principal */}
      <div style={{ padding: '0 24px', marginTop: '20px' }}>
        <div style={{
          position: 'relative',
          opacity: entered ? 1 : 0,
          transform: entered
            ? `translateY(${isEditing ? '-4px' : '0'}) rotate(${isEditing ? '0' : noteRotation}deg) scale(${isEditing ? '1.02' : '1'})`
            : `translateY(50px) rotate(${noteRotation - 4}deg)`,
          transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: isEditing ? '6px 12px 28px rgba(0,0,0,0.18)' : 'none',
        }}>
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
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
              {isEditing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={100}
                  autoFocus
                  style={{
                    flex: 1, border: 'none', borderBottom: '1.5px solid var(--color-accent)',
                    backgroundColor: 'transparent', fontFamily: 'var(--font)',
                    fontSize: '18px', fontWeight: '700', color: 'var(--color-text)',
                    outline: 'none', padding: '0 0 4px',
                    opacity: editEntered ? 1 : 0,
                    transform: editEntered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              ) : (
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.3', flex: 1, margin: 0, minHeight: '24px' }}>
                  {titleDisplayed}<Cursor visible={!titleDone} />
                </h2>
              )}
              <CategoryIcon size={20} color={categoryColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
            </div>

            {!isEditing && note.event_date && (
              <p style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontWeight: '700', color: 'var(--color-accent)',
                marginBottom: '10px', marginTop: '-4px',
              }}>
                <CalendarDays size={11} strokeWidth={2.5} color="var(--color-accent)" />
                {new Date(note.event_date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </p>
            )}

            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%', border: 'none',
                  borderBottom: '1px solid var(--color-border-light)',
                  backgroundColor: 'transparent', fontFamily: 'var(--font)',
                  fontSize: '14px', color: 'var(--color-text)', resize: 'none',
                  outline: 'none', lineHeight: '1.6', padding: '0 0 10px',
                  marginBottom: '16px', boxSizing: 'border-box',
                  opacity: editEntered ? 1 : 0,
                  transform: editEntered ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.25s ease 0.06s, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.06s',
                }}
              />
            ) : (
              <p style={{
                fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '20px',
                opacity: titleDone ? 1 : 0, transition: 'opacity 0.4s ease',
              }}>
                {note.description}
              </p>
            )}

            {/* Campo fecha — solo en modo edición */}
            {isEditing && (
              <div style={{
                marginBottom: '16px',
                opacity: editEntered ? 1 : 0,
                transform: editEntered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.25s ease 0.12s, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.12s',
              }}>
                <p style={{
                  fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
                }}>
                  Fecha del evento <span style={{ fontWeight: '400', textTransform: 'none' }}>(opcional)</span>
                </p>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{
                    border: 'none', borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: 'transparent', fontFamily: 'var(--font)',
                    fontSize: '13px', color: 'var(--color-text)', outline: 'none',
                    padding: '0 0 6px', width: '100%', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Botón eliminar — solo visible en modo edición */}
            {isEditing && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                  color: '#DD686D', padding: '0 0 16px',
                }}
              >
                <Trash2 size={13} strokeWidth={2.5} />
                Eliminar nota
              </button>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '12px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px', height: '30px', backgroundColor: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-display)', fontSize: '16px',
                }}>
                  {initial}
                </div>
                <div>
                  <p
                    onClick={() => navigate(`/users/${note.user?.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', cursor: 'pointer' }}
                  >{note.user?.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{timeAgo(note.created_at)}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {completed && !isEditing && (
                  <span style={{
                    border: '1.5px solid var(--color-border)', color: 'var(--color-text)',
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    Completada
                  </span>
                )}

                {/* Modo edición: Guardar + Cancelar */}
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={cancelEdit}
                      style={{
                        background: 'none', border: '1px solid var(--color-border)',
                        fontFamily: 'var(--font)', fontSize: '11px', fontWeight: '700',
                        color: 'var(--color-text-muted)', padding: '5px 12px', cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!editTitle.trim()}
                      style={{
                        backgroundColor: editTitle.trim() ? 'var(--color-accent)' : 'var(--color-border-light)',
                        color: editTitle.trim() ? 'white' : 'var(--color-text-muted)',
                        border: 'none', fontFamily: 'var(--font)',
                        fontSize: '11px', fontWeight: '700',
                        padding: '5px 12px', cursor: editTitle.trim() ? 'pointer' : 'default',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Botón Editar — autor o admin */}
                    {canEdit && (
                      <button
                        onClick={startEdit}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: 'none', border: '1px solid var(--color-border)',
                          fontFamily: 'var(--font)', fontSize: '11px', fontWeight: '700',
                          color: 'var(--color-text-muted)', padding: '5px 10px', cursor: 'pointer',
                        }}
                      >
                        <Pencil size={12} strokeWidth={2.5} />
                        Editar
                      </button>
                    )}
                    {/* Botón Resolver — solo autor, solo si no está completada */}
                    {isAuthor && !completed && (
                      <button
                        onClick={openModal}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          backgroundColor: 'var(--color-accent)', color: 'white',
                          border: 'none', fontFamily: 'var(--font)',
                          fontSize: '11px', fontWeight: '700',
                          padding: '5px 12px', cursor: 'pointer',
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}
                      >
                        <CheckCircle size={13} strokeWidth={2.5} />
                        Resolver
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div style={{ padding: '0 24px', marginTop: '36px' }}>
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
            opacity: entered ? 1 : 0, transition: `opacity 0.3s ease ${commentsBaseDelay}s`,
          }}>
            Sin respuestas todavía. ¡Sé el primero!
          </p>
        )}

        {comments.map((comment, index) => {
          const commentInitial = comment.user?.name?.charAt(0).toUpperCase() || '?';
          const rotation = COMMENT_ROTATIONS[index % COMMENT_ROTATIONS.length];
          const delay = `${commentsBaseDelay + index * 0.14}s`;
          return (
            <div key={comment.id} style={{
              position: 'relative', marginTop: '16px', marginBottom: '20px',
              opacity: entered ? 1 : 0,
              transform: entered ? `rotate(${rotation}deg)` : `translateY(30px) rotate(${rotation - 2}deg)`,
              transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
              transformOrigin: 'center top',
            }}>
              <div style={{
                position: 'absolute', top: '-9px', left: '50%',
                transform: 'translateX(-50%) rotate(-1.5deg)',
                width: '44px', height: '16px',
                backgroundColor: 'rgba(255,235,140,0.88)',
                border: '1px solid rgba(180,150,30,0.2)', zIndex: 1,
              }} />
              <div style={{
                backgroundColor: '#FEFCE8', border: '1px solid rgba(180,160,0,0.2)',
                padding: '16px 16px 14px', boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
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
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate(`/users/${comment.user?.id}`); }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      style={{ cursor: 'pointer' }}
                    >{comment.user?.name}</span> · {timeAgo(comment.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Post-it escribir comentario */}
        {(() => {
          const delay = `${commentsBaseDelay + comments.length * 0.14 + 0.05}s`;
          return (
            <div style={{
              position: 'relative', marginTop: '24px',
              opacity: entered ? 1 : 0,
              transform: entered ? 'rotate(0.5deg)' : 'translateY(30px) rotate(-1.5deg)',
              transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
            }}>
              <div style={{
                position: 'absolute', top: '-9px', left: '50%',
                transform: 'translateX(-50%) rotate(-2deg)',
                width: '44px', height: '16px',
                backgroundColor: 'rgba(255,235,140,0.88)',
                border: '1px solid rgba(180,150,30,0.2)', zIndex: 1,
              }} />
              <div style={{
                backgroundColor: '#FEFCE8', border: '1px solid rgba(180,160,0,0.25)',
                padding: '16px', boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
              }}>
                <textarea
                  placeholder="Escribe tu respuesta..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', border: 'none',
                    borderBottom: '1px solid rgba(180,160,0,0.3)',
                    backgroundColor: 'transparent', fontFamily: 'var(--font)',
                    fontSize: '13px', color: 'var(--color-text)', resize: 'none',
                    outline: 'none', lineHeight: '1.6', paddingBottom: '8px',
                    marginBottom: '12px', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button disabled={!newComment.trim()} style={{
                    backgroundColor: 'var(--color-accent)', color: 'white',
                    border: 'none', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                    padding: '7px 18px', cursor: newComment.trim() ? 'pointer' : 'default',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    opacity: newComment.trim() ? 1 : 0.45, transition: 'opacity 0.2s',
                  }}>
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>

    <MenuBar active="home" />

    {/* Modal resolver nota */}
    {showModal && (
      <>
        {/* Overlay */}
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: modalEntered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.3s ease',
            zIndex: 200,
          }}
        />

        {/* Panel */}
        <div style={{
          position: 'fixed', top: '50%',
          left: '50%',
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

          {/* Tape */}
          <div style={{
            position: 'absolute', top: '-10px', left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '54px', height: '18px',
            backgroundColor: 'rgba(255,235,140,0.88)',
            border: '1px solid rgba(180,150,30,0.2)',
          }} />

          <p style={{
            fontSize: '16px', fontWeight: '700', color: 'var(--color-text)',
            marginBottom: '6px',
          }}>
            ¿Quieres agradecer a alguien?
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Pulsa el corazón para dar las gracias
          </p>

          {/* Lista de usuarios */}
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
                    <div style={{
                      width: '32px', height: '32px', backgroundColor: 'var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontFamily: 'var(--font-display)', fontSize: '16px',
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>{user.name}</p>
                      {user.floor && (
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{user.floor}º{user.door}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleThanks(user.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    }}
                  >
                    <Heart
                      size={22} strokeWidth={2}
                      color="#DD686D"
                      fill={isLiked ? '#DD686D' : 'none'}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Toggle buscar en comunidad */}
          <button
            onClick={() => setShowCommunity((s) => !s)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
              color: 'var(--color-accent)', padding: 0,
              textDecoration: 'underline', marginBottom: '24px',
              display: 'block',
            }}
          >
            {showCommunity ? '← Solo comentadores' : 'Buscar en comunidad →'}
          </button>

          {/* Botón resolver */}
          <button
            onClick={handleResolve}
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
    )}

    {/* Confirmación eliminar nota */}
    {showDeleteConfirm && (
      <>
        <div
          onClick={() => setShowDeleteConfirm(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 200,
          }}
        />
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translateX(-50%) translateY(-50%) rotate(-0.5deg)',
          width: 'calc(100% - 80px)', maxWidth: '300px',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          padding: '28px 20px 24px',
          zIndex: 201,
          boxShadow: '4px 8px 24px rgba(0,0,0,0.18)',
        }}>
          {/* Tape */}
          <div style={{
            position: 'absolute', top: '-10px', left: '50%',
            transform: 'translateX(-50%) rotate(-1.5deg)',
            width: '44px', height: '16px',
            backgroundColor: 'rgba(255,235,140,0.88)',
            border: '1px solid rgba(180,150,30,0.2)',
          }} />
          <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>
            ¿Eliminar esta nota?
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
            Se borrará permanentemente y no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                flex: 1, height: '40px', background: 'none',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                color: 'var(--color-text-muted)', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1, height: '40px',
                backgroundColor: '#DD686D', color: 'white',
                border: 'none', fontFamily: 'var(--font)',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </>
    )}

    {/* Toast */}
    {showToast && (
      <div style={{
        position: 'fixed', top: '24px', left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--color-text)', color: 'white',
        padding: '10px 20px',
        fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
        zIndex: 300,
        opacity: toastVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', alignItems: 'center', gap: '8px',
        whiteSpace: 'nowrap',
      }}>
        <CheckCircle size={15} strokeWidth={2.5} color="#68DD9E" />
        Nota resuelta
      </div>
    )}
    </>
  );
}
