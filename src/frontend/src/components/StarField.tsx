import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  opacity: number;
}

export function StarField() {
  const stars = useMemo<Star[]>(() => {
    const result: Star[] = [];
    const sizes = ["star-sm", "star-md", "star-lg"];
    for (let i = 0; i < 120; i++) {
      result.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 4}s`,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.size}`}
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
