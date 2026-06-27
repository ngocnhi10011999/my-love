import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

const STORAGE_KEY = 'secure-gallery:muted';
const SRC = '/audio.mp3';

export default function MusicPlayer() {
  const { t } = useI18n();
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = muted;

    const tryPlay = () => {
      audio.play().then(
        () => {
          setPlaying(true);
          setNeedsGesture(false);
        },
        () => {
          setNeedsGesture(true);
          const startOnGesture = () => {
            audio.play().then(() => {
              setPlaying(true);
              setNeedsGesture(false);
            }).catch(() => {});
            window.removeEventListener('pointerdown', startOnGesture);
            window.removeEventListener('keydown', startOnGesture);
          };
          window.addEventListener('pointerdown', startOnGesture, { once: true });
          window.addEventListener('keydown', startOnGesture, { once: true });
        },
      );
    };
    tryPlay();

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  }, [muted]);

  return (
    <>
      <audio ref={audioRef} src={SRC} preload="auto" />
      {needsGesture && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-20 max-w-[80vw] px-4 py-2.5 rounded-full bg-white/95 backdrop-blur border border-rose-200 text-sm text-rose-700 shadow-lg shadow-rose-200/60 flex items-center gap-2 animate-pulse"
        >
          <span aria-hidden="true">👆</span>
          <span>{t('music.tapToPlay')}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? t('music.unmute') : t('music.mute')}
        className="fixed bottom-5 right-5 z-20 grid place-items-center w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-rose-200 text-rose-500 hover:text-rose-700 hover:border-rose-300 shadow-lg shadow-rose-200/60 transition"
      >
        {muted ? <SpeakerOff /> : <Speaker animate={playing} />}
      </button>
    </>
  );
}

function Speaker({ animate }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className={animate ? 'origin-center animate-pulse' : ''} />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className={animate ? 'origin-center animate-pulse' : ''} />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
