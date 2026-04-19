export default function DeleteConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translateX(-50%) translateY(-50%) rotate(-0.5deg)',
        width: 'calc(100% - 80px)', maxWidth: '300px',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        padding: '28px 20px 24px',
        zIndex: 201,
        boxShadow: '4px 8px 24px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          position: 'absolute', top: '-10px', left: '50%',
          transform: 'translateX(-50%) rotate(-1.5deg)',
          width: '44px', height: '16px',
          backgroundColor: 'rgba(255,235,140,0.88)',
          border: '1px solid rgba(180,150,30,0.2)',
        }} />
        <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>
          {title}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, height: '40px', background: 'none',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font)', fontSize: '12px', fontWeight: '700',
              color: 'var(--color-text-muted)', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, height: '40px',
              backgroundColor: '#DD686D', color: 'white',
              border: 'none', fontFamily: 'var(--font)',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
}
