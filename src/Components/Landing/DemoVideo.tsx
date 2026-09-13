import { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import sentraMotion from '../../assets/images/sentra-motion.mp4';
import videoPoster from '../../assets/images/hero-port-poster.jpg';

export default function DemoVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);
  const [userStarted, setUserStarted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const isSlowOrSaveData = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
    setCanAutoplay(!prefersReducedMotion && !isSlowOrSaveData);
  }, []);

  const shouldLoadVideo = isNearViewport && (canAutoplay || userStarted);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black">
      {shouldLoadVideo ? (
        <video
          src={sentraMotion}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        >
          Sorry, your browser doesn't support embedded videos.
        </video>
      ) : (
        <>
          <img
            src={videoPoster}
            alt="Preview of the Sentra platform in action"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isNearViewport && (
            <button
              type="button"
              onClick={() => setUserStarted(true)}
              aria-label="Play video: Sentra in action"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <FaPlay className="text-teal-600 text-xl ml-1" />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
