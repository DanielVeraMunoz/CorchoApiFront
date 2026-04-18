import { Home, PenLine, UserCircle } from 'lucide-react';

const items = [
  { key: 'home', label: 'Inicio', Icon: Home },
  { key: 'create', label: 'Crear', Icon: PenLine },
  { key: 'profile', label: 'Perfil', Icon: UserCircle },
];

export default function MenuBar({ active }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--color-white)',
      border: '1px solid var(--color-border)',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 28px',
      gap: '36px',
      zIndex: 100,
    }}>
      {items.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              color={isActive ? 'var(--color-accent)' : 'var(--color-text-muted)'}
            />
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font)',
              fontWeight: isActive ? '800' : '500',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
