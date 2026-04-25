import { CheckCircle } from 'lucide-react';

export default function Toast({ message, visible, show }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', top: '24px', left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--color-text)', color: 'white',
      padding: '10px 20px',
      fontFamily: 'var(--font)', fontSize: '13px', fontWeight: '700',
      zIndex: 300,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      display: 'flex', alignItems: 'center', gap: '8px',
      whiteSpace: 'nowrap',
    }}>
      <CheckCircle size={15} strokeWidth={2.5} color="#68DD9E" />
      {message}
    </div>
  );
}
