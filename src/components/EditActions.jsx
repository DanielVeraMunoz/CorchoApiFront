export default function EditActions({ onSave, onCancel, disabled }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={onCancel}
        style={{
          background: 'none', border: '1px solid var(--color-border)',
          fontFamily: 'var(--font)', fontSize: '11px', fontWeight: '700',
          color: 'var(--color-text-muted)', padding: '5px 12px', cursor: 'pointer',
        }}
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        disabled={disabled}
        style={{
          backgroundColor: !disabled ? 'var(--color-accent)' : 'var(--color-border-light)',
          color: !disabled ? 'white' : 'var(--color-text-muted)',
          border: 'none', fontFamily: 'var(--font)',
          fontSize: '11px', fontWeight: '700',
          padding: '5px 12px', cursor: !disabled ? 'pointer' : 'default',
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}
      >
        Guardar
      </button>
    </div>
  );
}
