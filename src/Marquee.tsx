import type { CSSProperties } from 'react';

interface MarqueeProps {
  phrases: readonly string[];
  duration?: number;
}

export function Marquee({ phrases, duration = 100 }: MarqueeProps) {
  const repeated = Array.from({ length: 3 }, () => phrases).flat();
  return <div className="marquee" style={{ '--marquee-duration': `${duration}s` } as CSSProperties}>
    <p className="sr-only">{phrases.join('. ')}.</p>
    <div className="marquee-track" aria-hidden="true">
      {[0, 1].map(copy => <div className="marquee-group" key={copy}>
        {repeated.map((phrase, index) => <span className={`marquee-item ${index >= phrases.length ? 'marquee-repeat' : ''}`} key={index}>
          <span>{phrase}</span><span className="marquee-spark">✳</span>
        </span>)}
      </div>)}
    </div>
  </div>;
}
