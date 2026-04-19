import { MessageCircle } from 'lucide-react';
import Tape from './Tape';
import { CATEGORY_CONFIG, DEFAULT_CONFIG } from '../utils/categories';
import { timeAgo } from '../utils/helpers';

// Rotaciones suaves — 5 valores distintos, se asignan por id % 5
const ROTATIONS = [-2, -0.8, 1.2, -1.5, 0.5];

// Tipo de decoración — se asigna por id % 2
const DECORATION_TYPES = ['pin', 'tape'];

export default function NoteCard({ note, onClick }) {
  const initial = note.user?.name?.charAt(0).toUpperCase() || '?';
  const categoryName = note.category?.name;
  const { Icon: CategoryIcon, color: categoryColor } = CATEGORY_CONFIG[categoryName] || DEFAULT_CONFIG;

  const rotation = ROTATIONS[note.id % ROTATIONS.length];
  const decorationType = DECORATION_TYPES[note.id % DECORATION_TYPES.length];

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        marginTop: '18px',
        marginBottom: '28px',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center top',
        cursor: 'pointer',
      }}
    >

      {/* Chincheta */}
      {decorationType === 'pin' && (
        <div style={{
          position: 'absolute',
          top: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Cabeza de la chincheta */}
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: categoryColor,
            boxShadow: `0 2px 5px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.35)`,
          }} />
          {/* Vástago */}
          <div style={{
            width: '3px',
            height: '9px',
            backgroundColor: '#9CA3AF',
            borderRadius: '0 0 2px 2px',
          }} />
        </div>
      )}

      {decorationType === 'tape' && (
        <Tape width="54px" height="20px" rotate="-2deg" />
      )}

      {/* Tarjeta */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          padding: '18px 18px 16px',
          boxShadow: '3px 5px 12px rgba(0,0,0,0.13)',
          transition: 'box-shadow 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '5px 7px 16px rgba(0,0,0,0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '3px 5px 12px rgba(0,0,0,0.13)'}
      >

        {/* Título + icono categoría */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
          <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.3', flex: 1 }}>
            {note.title}
          </p>
          <CategoryIcon size={18} color={categoryColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
        </div>

        {/* Descripción */}
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '14px',
        }}>
          {note.description}
        </p>

        {/* Separador */}
        <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '10px' }} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              flexShrink: 0,
            }}>
              {initial}
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text)' }}>
                {note.user?.name || 'Usuario'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {timeAgo(note.created_at)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {note.is_completed && (
              <span style={{
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Completada
              </span>
            )}
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MessageCircle size={14} strokeWidth={1.8} />
              {note.comments_count || 0}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
