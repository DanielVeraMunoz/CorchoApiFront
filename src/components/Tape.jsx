export default function Tape({ width = '44px', height = '16px', rotate = '-1.5deg', top = '-10px' }) {
  return (
    <div style={{
      position: 'absolute', top, left: '50%',
      transform: `translateX(-50%) rotate(${rotate})`,
      width, height,
      backgroundColor: 'rgba(255,235,140,0.88)',
      border: '1px solid rgba(180,150,30,0.2)',
      zIndex: 1,
    }} />
  );
}
