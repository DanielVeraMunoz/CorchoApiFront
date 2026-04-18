export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ padding: '0 18px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Buscar en el tablón..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '46px',
          border: '1px solid var(--color-border)',
          borderRadius: 0,
          backgroundColor: 'var(--color-white)',
          padding: '0 16px',
          fontSize: '14px',
          fontFamily: 'var(--font)',
          color: 'var(--color-text)',
          outline: 'none',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
      />
    </div>
  );
}
