import { Megaphone, CalendarDays, HandHeart, ShoppingBag, Wrench, PawPrint, LayoutGrid, MessageCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Avisos oficiales': { Icon: Megaphone, color: '#DD686D' },
  'Eventos':          { Icon: CalendarDays, color: '#68A7DD' },
  'Favores':          { Icon: HandHeart, color: '#68DD9E' },
  'Mercadillo':       { Icon: ShoppingBag, color: '#F97316' },
  'Mantenimiento':    { Icon: Wrench, color: '#A868DD' },
  'Mascotas':         { Icon: PawPrint, color: '#DDC068' },
};

const DEFAULT_CONFIG = { Icon: LayoutGrid, color: '#6B7280' };

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

export default function NoteCard({ note, onClick }) {
  const initial = note.user?.name?.charAt(0).toUpperCase() || '?';
  const categoryName = note.category?.name;
  const { Icon: CategoryIcon, color: categoryColor } = CATEGORY_CONFIG[categoryName] || DEFAULT_CONFIG;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        padding: '16px 18px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      {/* Title row + category icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
        <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.3', flex: 1 }}>
          {note.title}
        </p>
        <CategoryIcon size={18} color={categoryColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
      </div>

      {/* Description */}
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

      {/* Divider */}
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
            fontWeight: '700',
            fontSize: '13px',
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
  );
}
