import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Heart, CheckCircle, Pencil, Trash2, RotateCcw } from 'lucide-react';
import BackButton from '../components/BackButton';
import LoadingScreen from '../components/LoadingScreen';
import MenuBar from '../components/MenuBar';
import Tape from '../components/Tape';
import { timeAgo } from '../utils/helpers';
import EditActions from '../components/EditActions';
import Avatar from '../components/Avatar';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ResolveModal from '../components/ResolveModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { CATEGORY_CONFIG, DEFAULT_CONFIG } from '../utils/categories';
import { useTypewriter, Cursor } from '../hooks/useTypewriter.jsx';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const COMMENT_ROTATIONS = [-1.5, 0.8, -0.6, 1.2, -1, 0.5];

export default function NoteDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const MY_USER_ID = user?.id;
  const IS_ADMIN = user?.role === 'admin';

  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();

  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [isCompleted, setIsCompleted] = useState(false);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const { showToast, toastVisible, toastMessage, triggerToast } = useToast();


  const [isEditing, setIsEditing] = useState(false);
  const [editEntered, setEditEntered] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setEntered(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    Promise.all([
      api.get(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/notes/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([noteResponse, commentsResponse]) => {
        setNote(noteResponse.data.data);
        setComments(commentsResponse.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching note or comments:', error);
        setLoading(false);
      });
  }, [id, token]);

  const handleBack = () => {
    setExiting(true);
    setTimeout(() => navigate('/dashboard'), 260);
  };

  const openModal = () => {
    setShowModal(true);
    if (users.length === 0) {
      api.get('/users', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUsers(res.data.data))
        .catch((err) => console.error('Error fetching users:', err));
    }
  };

  const closeModal = () => setShowModal(false);

  const handleResolve = async (thankedUserIds) => {
    try {
      const response = await api.patch(`/notes/${id}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNote(response.data.data);
    } catch (err) {
      console.error('Error completing note:', err);
    }

    if (thankedUserIds.length > 0) {
      await Promise.allSettled(
        thankedUserIds.map((userId) =>
          api.post(`/users/${userId}/thanks`, { note_id: Number(id) }, { headers: { Authorization: `Bearer ${token}` } })
        )
      );
    }

    setIsCompleted(true);
    setShowModal(false);
    setTimeout(() => triggerToast('Nota resuelta'), 320);
  };



  const { Icon: CategoryIcon, color: categoryColor } = note
    ? CATEGORY_CONFIG[note.category?.name] || DEFAULT_CONFIG
    : DEFAULT_CONFIG;
  const initial = note?.user?.name?.charAt(0).toUpperCase() || '?';
  const noteRotation = note?.id % 2 === 0 ? 0.8 : -1;
  const isAuthor = note?.user?.id === MY_USER_ID;
  const completed = isCompleted || note?.is_completed;
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

  const handleSave = async () => {
    try {
      const response = await api.put(
        `/notes/${id}`,
        { title: editTitle, description: editDescription, event_date: editDate || null, category_id: note.category_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNote(response.data.data);
      setEditEntered(false);
      setTimeout(() => setIsEditing(false), 250);
      triggerToast('Nota guardada');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleReopen = async () => {
    try {
      const response = await api.patch(`/notes/${id}/reopen`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNote(response.data.data);
      setIsCompleted(false);
    } catch (err) {
      console.error('Error reopening note:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `/notes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Quieres eliminar este comentario?')) return;
    try {
      await api.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      triggerToast('Comentario eliminado');
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleComment = async () => {
    try {
      const response = await api.post(`/notes/${id}/comments`, { content: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setComments([...comments, response.data.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);

    }
  };

  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(note?.title || '', 36, 400);
  const commentsBaseDelay = 0.65;

  const commenters = comments
    .map((c) => c.user)
    .filter((u, i, arr) => u.id !== note.user?.id && arr.findIndex((x) => x.id === u.id) === i);

  if (loading) return <LoadingScreen />;
  if (!note) return <div style={{ padding: '40px 24px', textAlign: 'center' }}><p>Nota no encontrada.</p><button onClick={() => navigate('/dashboard')}>Volver</button></div>;

  return (
    <>
      <div style={{
        backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(30px)' : 'translateX(0)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>

        
        <div style={{
          padding: '52px 20px 0',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateX(0)' : 'translateX(-16px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          <BackButton onClick={handleBack} />
        </div>

        
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
            <Tape width="64px" height="22px" rotate="-1deg" top="-11px" />

            <div style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              padding: '24px 20px 20px',
              boxShadow: '3px 5px 14px rgba(0,0,0,0.14)',
              marginTop: '12px',
              position: 'relative',
            }}>
              {completed && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, pointerEvents: 'none',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px', fontWeight: '400',
                    color: '#68DD9E',
                    border: '3px solid #68DD9E',
                    padding: '6px 18px',
                    marginBottom: '50px',
                    letterSpacing: '4px',
                    transform: 'rotate(-12deg)',
                    display: 'block',
                  }}>
                    COMPLETADA
                  </span>
                </div>
              )}

              <div style={{ opacity: completed ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
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

              </div>

              <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '12px' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar name={note.user?.name} size={30} />
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
                  {isEditing ? (
                    <EditActions
                      onSave={handleSave}
                      onCancel={cancelEdit}
                      disabled={!editTitle.trim()}
                    />
                  ) : (
                    <>
                      {canEdit && !completed && (
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
                      {canEdit && completed && (
                        <button
                          onClick={handleReopen}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            backgroundColor: 'var(--color-accent)', color: 'white',
                            border: 'none', fontFamily: 'var(--font)',
                            fontSize: '11px', fontWeight: '700',
                            padding: '5px 12px', cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}
                        >
                          <RotateCcw size={13} strokeWidth={2.5} />
                          Reabrir
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        
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
                <Tape top="-9px" />
                <div style={{
                  backgroundColor: '#FEFCE8', border: '1px solid rgba(180,160,0,0.2)',
                  padding: '16px 16px 14px', boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                  position: 'relative',
                }}>
                  {(comment.user?.id === MY_USER_ID || IS_ADMIN) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = '#DD686D';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#DD686D';
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#92680A';
                        e.currentTarget.style.borderColor = 'rgba(180,160,0,0.3)';
                      }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        width: '20px', height: '20px',
                        backgroundColor: 'transparent', color: '#92680A',
                        border: '1px solid rgba(180,160,0,0.3)', cursor: 'pointer',
                        fontSize: '11px', fontWeight: '700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      ✕
                    </button>
                  )}
                  <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.55', marginBottom: '12px' }}>
                    {comment.content}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Avatar name={comment.user?.name} size={22} color="#DDC068" fontSize={13} />
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

          
          {(() => {
            const delay = `${commentsBaseDelay + comments.length * 0.14 + 0.05}s`;
            return (
              <div style={{
                position: 'relative', marginTop: '24px',
                opacity: entered ? 1 : 0,
                transform: entered ? 'rotate(0.5deg)' : 'translateY(30px) rotate(-1.5deg)',
                transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
              }}>
                <Tape top="-9px" rotate="-2deg" />
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
                    <button disabled={!newComment.trim()}
                      onClick={handleComment} style={{

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

      {showModal && (
        <ResolveModal
          commenters={commenters}
          allUsers={users}
          onClose={closeModal}
          onResolve={handleResolve}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="¿Eliminar esta nota?"
          message="Se borrará permanentemente y no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <Toast message={toastMessage} show={showToast} visible={toastVisible} />
    </>
  );
}
