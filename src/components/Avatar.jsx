export default function Avatar({ name, size = 32, color = 'var(--color-accent)', fontSize = 16 }) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, flexShrink: 0,
      backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'var(--font-display)', fontSize: `${fontSize}px`,
    }}>
      {initial}
    </div>
  );
}
