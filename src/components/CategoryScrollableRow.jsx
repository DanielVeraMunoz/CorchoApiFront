import { Megaphone, CalendarDays, HandHeart, ShoppingBag, Wrench, PawPrint, LayoutGrid } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Avisos oficiales': { Icon: Megaphone, color: '#DD686D' },
  'Eventos':          { Icon: CalendarDays, color: '#68A7DD' },
  'Favores':          { Icon: HandHeart, color: '#68DD9E' },
  'Mercadillo':       { Icon: ShoppingBag, color: '#F97316' },
  'Mantenimiento':    { Icon: Wrench, color: '#A868DD' },
  'Mascotas':         { Icon: PawPrint, color: '#DDC068' },
};

const DEFAULT_CONFIG = { Icon: LayoutGrid, color: '#6B7280' };

export default function CategoryScrollableRow({ categories, selected, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '4px 18px 14px 18px',
      scrollbarWidth: 'none',
      marginBottom: '8px',
    }}>
      {/* Chip "Todas" */}
      <button
        onClick={() => onSelect(null)}
        style={{
          flexShrink: 0,
          padding: '6px 14px',
          border: '1px solid var(--color-border)',
          backgroundColor: selected === null ? 'var(--color-border)' : 'var(--color-white)',
          color: selected === null ? 'var(--color-white)' : 'var(--color-text)',
          fontSize: '12px',
          fontFamily: 'var(--font)',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          borderRadius: 0,
          transition: 'all 0.15s',
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
              flexShrink: 0,
              padding: '6px 14px',
              border: '1px solid var(--color-border)',
              backgroundColor: isSelected ? 'var(--color-border)' : 'var(--color-white)',
              color: isSelected ? 'var(--color-white)' : 'var(--color-text)',
              fontSize: '12px',
              fontFamily: 'var(--font)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: 0,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon size={14} />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
