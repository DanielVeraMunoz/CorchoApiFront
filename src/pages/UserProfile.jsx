import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Pencil, Trash2, LogOut } from 'lucide-react';
import EditActions from '../components/EditActions';
import LoadingScreen from '../components/LoadingScreen';
import MenuBar from '../components/MenuBar';
import { timeAgo, formatMemberSince } from '../utils/helpers';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Tape from '../components/Tape';
import Avatar from '../components/Avatar';
import { CATEGORY_CONFIG, DEFAULT_CONFIG } from '../utils/categories';
import { useTypewriter, Cursor } from '../hooks/useTypewriter.jsx';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';


const NOTE_ROTATIONS = [-1.5, 0.8, -0.6];

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user: authUser, logout } = useAuth();
  const MY_USER_ID = authUser?.id;
  const IS_ADMIN = authUser?.role === 'admin';

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thanksCount, setThanksCount] = useState(0);

  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editEntered, setEditEntered] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editFloor, setEditFloor] = useState('');
  const [editDoor, setEditDoor] = useState('');
  const [editRole, setEditRole] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showToast, toastVisible, toastMessage, triggerToast } = useToast();

  useEffect(() => {
    api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfileUser(res.data.data);
        setLoading(false);
        setTimeout(() => setEntered(true), 0);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setLoading(false);
      });
  }, [id, token]
  )

  useEffect(() => {
    api.get(`/users/${id}/thanks`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setThanksCount(res.data.data?.length ?? 0))
      .catch(() => setThanksCount(0));
  }, [id, token]);

  const userNotes = [];
  const isOwnProfile = Number(id) === MY_USER_ID;

  const { displayed: nameDisplayed, done: nameDone } = useTypewriter(
    profileUser?.name || '', 42, 380
  );

  if (loading) return <LoadingScreen />;
  if (!profileUser) return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
        <Tape width="64px" height="22px" top="-11px" />
        <div style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', padding: '32px 28px 28px', boxShadow: '3px 5px 14px rgba(0,0,0,0.13)', marginTop: '12px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--color-accent)', lineHeight: 1, marginBottom: '12px' }}>404</p>
          <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Usuario no encontrado</p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>Este vecino no existe o fue eliminado.</p>
          <button onClick={() => navigate(-1)} style={{ width: '100%', height: '44px', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );

  const cardRotation = profileUser.id % 2 === 0 ? 0.8 : -1;

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px',
  };
  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1px solid var(--color-border-light)',
    backgroundColor: 'transparent', fontFamily: 'var(--font)',
    fontSize: '13px', fontWeight: '600', color: 'var(--color-text)',
    outline: 'none', padding: '0 0 4px', boxSizing: 'border-box',
  };
  const canEdit = isOwnProfile || IS_ADMIN;

  const startEdit = () => {
    setEditName(profileUser?.name);
    setEditEmail(profileUser?.email);
    setEditPassword('');
    setEditFloor(profileUser?.floor);
    setEditDoor(profileUser?.door);
    setEditRole(profileUser?.role);
    setIsEditing(true);
    setTimeout(() => setEditEntered(true), 20);
  };

  const cancelEdit = () => {
    setEditEntered(false);
    setTimeout(() => { setIsEditing(false); setShowDeleteConfirm(false); }, 250);
  };

  const handleSave = async () => {
    try {
      const body = {
        name: editName, email: editEmail, floor: editFloor, door: editDoor
      };
      if (editPassword) {
        body.password = editPassword;
        body.password_confirmation = editPassword;
      }
      if (IS_ADMIN) body.role = editRole;

      const response = await api.put(`/users/${id}`, body, { headers: { Authorization: `Bearer ${token}` } });
      setProfileUser(response.data.data);
      setEditEntered(false);
      setTimeout(() => setIsEditing(false), 250);
      triggerToast('Perfil actualizado');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Hubo un error al guardar los cambios. Por favor, intenta de nuevo.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.delete('/logout', { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      logout();
      navigate('/');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (isOwnProfile) {
        logout();
        navigate('/');
      } else {
        navigate ('/dashboard');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Hubo un error al eliminar el usuario. Por favor, intenta de nuevo.');
    }
  };

  return (
    <>
      <div style={{
        backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(30px)' : 'translateX(0)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>

        {/* Tarjeta principal del usuario */}
        <div style={{ padding: '0 24px', marginTop: '52px' }}>
          <div style={{
            position: 'relative',
            opacity: entered ? 1 : 0,
            transform: entered
              ? `translateY(${isEditing ? '-4px' : '0'}) rotate(${isEditing ? '0' : cardRotation}deg) scale(${isEditing ? '1.02' : '1'})`
              : `translateY(50px) rotate(${cardRotation - 4}deg)`,
            transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: isEditing ? '6px 12px 28px rgba(0,0,0,0.18)' : 'none',
          }}>

            {/* Tape */}
            <Tape width="64px" height="22px" rotate="-1deg" top="-11px" />

            <div style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              padding: '24px 20px 20px',
              boxShadow: '3px 5px 14px rgba(0,0,0,0.14)',
              marginTop: '12px',
              position: 'relative',
            }}>

              {/* Botón editar — solo en modo lectura */}
              {canEdit && !isEditing && (
                <button onClick={startEdit} style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'none', border: '1px solid var(--color-border)',
                  padding: '5px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--font)', fontSize: '11px', fontWeight: '700',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  <Pencil size={12} strokeWidth={2.5} />
                  Editar
                </button>
              )}

              {/* Avatar + nombre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <Avatar name={isEditing ? editName || profileUser.name : profileUser.name} size={52} fontSize={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      maxLength={50}
                      style={{
                        width: '100%', border: 'none', borderBottom: '1.5px solid var(--color-accent)',
                        backgroundColor: 'transparent', fontFamily: 'var(--font)',
                        fontSize: '18px', fontWeight: '700', color: 'var(--color-text)',
                        outline: 'none', padding: '0 0 4px', boxSizing: 'border-box',
                        opacity: editEntered ? 1 : 0,
                        transform: editEntered ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0, minHeight: '26px' }}>
                      {nameDisplayed}<Cursor visible={!nameDone} />
                    </h2>
                  )}
                  <p style={{
                    fontSize: '11px', fontWeight: '700', color: profileUser.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '3px',
                    opacity: nameDone ? 1 : 0, transition: 'opacity 0.3s ease',
                  }}>
                    {profileUser.role === 'admin' ? 'Presidente' : 'Vecino'}
                  </p>
                </div>
              </div>

              {/* Datos */}
              <div style={{ opacity: nameDone ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  {isEditing ? (
                    <>
                      {/* Email */}
                      <div style={{ animEntry: 0.06, opacity: editEntered ? 1 : 0, transform: editEntered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.25s ease 0.06s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.06s' }}>
                        <p style={labelStyle}>Email</p>
                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={inputStyle} />
                      </div>

                      {/* Contraseña */}
                      <div style={{ opacity: editEntered ? 1 : 0, transform: editEntered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.25s ease 0.1s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.1s' }}>
                        <p style={labelStyle}>Nueva contraseña <span style={{ fontWeight: '400', textTransform: 'none' }}>(opcional)</span></p>
                        <input type="password" placeholder="••••••••" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} style={inputStyle} />
                      </div>

                      {/* Piso y Puerta */}
                      <div style={{ display: 'flex', gap: '12px', opacity: editEntered ? 1 : 0, transform: editEntered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.25s ease 0.14s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.14s' }}>
                        <div style={{ flex: 1 }}>
                          <p style={labelStyle}>Piso</p>
                          <input value={editFloor} onChange={(e) => setEditFloor(e.target.value)} maxLength={3} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={labelStyle}>Puerta</p>
                          <input value={editDoor} onChange={(e) => setEditDoor(e.target.value)} maxLength={3} style={inputStyle} />
                        </div>
                      </div>

                      {/* Rol — solo admin puede cambiar */}
                      {IS_ADMIN && (
                        <div style={{ opacity: editEntered ? 1 : 0, transform: editEntered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.25s ease 0.18s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.18s' }}>
                          <p style={labelStyle}>Rol</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['user', 'admin'].map((r) => (
                              <button
                                key={r}
                                onClick={() => setEditRole(r)}
                                style={{
                                  padding: '5px 14px', border: `1px solid ${editRole === r ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                  backgroundColor: editRole === r ? 'var(--color-accent)' : 'transparent',
                                  color: editRole === r ? 'white' : 'var(--color-text-muted)',
                                  fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
                                }}
                              >
                                {r === 'admin' ? 'Presidente' : 'Vecino'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Botón eliminar */}
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                          color: '#DD686D', padding: '4px 0 0',
                          opacity: editEntered ? 1 : 0,
                          transform: editEntered ? 'translateY(0)' : 'translateY(8px)',
                          transition: 'opacity 0.25s ease 0.22s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.22s',
                        }}
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                        Eliminar cuenta
                      </button>
                    </>
                  ) : (
                    <>
                      {[
                        { label: 'Email', value: profileUser.email },
                        { label: 'Piso / Puerta', value: `${profileUser.floor}º ${profileUser.door}` },
                        { label: 'Comunidad', value: profileUser.community?.name },
                        { label: 'Vecino desde', value: formatMemberSince(profileUser.created_at) },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                            {label}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {isEditing ? (
                    <div style={{ marginLeft: 'auto' }}>
                      <EditActions
                        onSave={handleSave}
                        onCancel={cancelEdit}
                        disabled={!editName.trim()}
                      />
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Heart size={16} color="#DD686D" strokeWidth={2} fill="#DD686D" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
                          {thanksCount} agradecimientos
                        </span>
                      </div>
                      {profileUser.is_top_helper && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          backgroundColor: '#FEF9C3',
                          border: '1px solid rgba(180,160,0,0.3)',
                          padding: '4px 10px',
                        }}>
                          <Star size={12} color="#DDC068" fill="#DDC068" strokeWidth={2} />
                          <span style={{ fontSize: '10px', fontWeight: '700', color: '#92680A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Top del mes
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón logout */}
        {isOwnProfile && !isEditing && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none',
                fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
                color: 'var(--color-text-muted)', padding: '8px 12px',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px',
                opacity: 0.7,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              <LogOut size={14} strokeWidth={2.5} />
              Cerrar sesión
            </button>
          </div>
        )}

        {/* Notas recientes */}
        {userNotes.length > 0 && (
          <div style={{ padding: '0 24px', marginTop: '36px' }}>
            <p style={{
              fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px',
              opacity: entered ? 1 : 0,
              transition: 'opacity 0.3s ease 0.6s',
            }}>
              Últimas notas · {userNotes.length}
            </p>

            {userNotes.map((note, index) => {
              const delay = `${0.65 + index * 0.14}s`;
              const rotation = NOTE_ROTATIONS[index % NOTE_ROTATIONS.length];
              const color = (CATEGORY_CONFIG[note.category?.name] || DEFAULT_CONFIG).color;

              return (
                <div
                  key={note.id}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  style={{
                    position: 'relative',
                    marginTop: '16px', marginBottom: '20px',
                    cursor: 'pointer',
                    opacity: entered ? 1 : 0,
                    transform: entered
                      ? `rotate(${rotation}deg)`
                      : `translateY(30px) rotate(${rotation - 2}deg)`,
                    transition: `opacity 0.35s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                    transformOrigin: 'center top',
                  }}
                >
                  {/* Chincheta del color de categoría */}
                  <div style={{
                    position: 'absolute', top: '-16px', left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      backgroundColor: color,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
                    }} />
                    <div style={{ width: '3px', height: '8px', backgroundColor: '#9CA3AF', borderRadius: '0 0 2px 2px' }} />
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-border)',
                      padding: '16px 18px',
                      boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                      marginTop: '8px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '4px 6px 14px rgba(0,0,0,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.1)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', flex: 1 }}>
                        {note.title}
                      </p>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0, marginTop: '4px' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      {note.category?.name} · {timeAgo(note.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
      <MenuBar active="profile" />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="¿Eliminar cuenta?"
          message="Se borrará permanentemente y no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <Toast message={toastMessage} show={showToast} visible={toastVisible} />
    </>
  );
}
