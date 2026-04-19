import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
  );
}
