import { useRef } from 'react';
import { Megaphone, Users, Lightbulb, CalendarDays, HandHeart, ShoppingBag, AlertTriangle, Inbox, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Avisos oficiales': { Icon: Megaphone,     color: '#DD686D' },
  'Reuniones':        { Icon: Users,          color: '#68A7DD' },
  'Sugerencias':      { Icon: Lightbulb,      color: '#68DD9E' },
  'Eventos':          { Icon: CalendarDays,   color: '#DDC068' },
  'Favores':          { Icon: HandHeart,      color: '#68DD9E' },
  'Mercadillo':       { Icon: ShoppingBag,    color: '#F97316' },
  'Incidencias':      { Icon: AlertTriangle,  color: '#A868DD' },
  'Cajón desastre':   { Icon: Inbox,          color: '#DD6899' },
};

const DEFAULT_CONFIG = { Icon: LayoutGrid, color: '#6B7280' };

export default function CategoryScrollableRow({ categories, selected, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 150, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 18px', marginBottom: '14px' }}>

      {/* Flecha izquierda */}
      <button
        onClick={() => scroll(-1)}
        style={{
          flexShrink: 0,
          background: 'var(--color-white)', border: '1px solid var(--color-border)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '50%', padding: 0,
        }}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '4px 0',
          scrollbarWidth: 'none',
          flex: 1,
        }}
      >
        <button
          onClick={() => onSelect(null)}
          style={{
            flexShrink: 0, padding: '6px 14px',
            border: '1px solid var(--color-border)',
            backgroundColor: selected === null ? 'var(--color-border)' : 'var(--color-white)',
            color: selected === null ? 'var(--color-white)' : 'var(--color-text)',
            fontSize: '12px', fontFamily: 'var(--font)', fontWeight: '700',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
            borderRadius: 0, transition: 'all 0.15s',
          }}
        >
          <LayoutGrid size={14} />
          Todas
        </button>

        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat.name] || DEFAULT_CONFIG;
          const { Icon } = config;
          const isSelected = selected === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0, padding: '6px 14px',
                border: '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-border)' : 'var(--color-white)',
                color: isSelected ? 'var(--color-white)' : 'var(--color-text)',
                fontSize: '12px', fontFamily: 'var(--font)', fontWeight: '700',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                borderRadius: 0, transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll(1)}
        style={{
          flexShrink: 0,
          background: 'var(--color-white)', border: '1px solid var(--color-border)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '50%', padding: 0,
        }}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

    </div>
  );
}
