import { useMemo } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function Bubbles() {
  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 16,
        left: Math.random() * 100,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 8,
        opacity: 0.04 + Math.random() * 0.1,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full border border-cyan-400"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: '-20px',
            opacity: b.opacity,
            animation: `rise ${b.duration}s ${b.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}
