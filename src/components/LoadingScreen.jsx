import { Player } from '@lottiefiles/react-lottie-player';
import loadingJson from '../assets/loading.json';

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100svh',
      backgroundColor: 'var(--color-bg)',
    }}>
      <Player
        autoplay
        loop
        src={loadingJson}
        style={{ width: '120px', height: '120px' }}
      />
    </div>
  );
}
