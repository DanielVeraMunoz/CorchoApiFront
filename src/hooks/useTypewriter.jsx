import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 38, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { setDone(true); clearInterval(interval); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export function Cursor({ visible }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setShow((s) => !s), 500);
    return () => clearInterval(t);
  }, [visible]);
  if (!visible) return null;
  return <span style={{ opacity: show ? 1 : 0, fontWeight: 400 }}>|</span>;
}
