import { useEffect, useRef, useState } from 'react';

/** Scripted illustration of selection-based questions; no AI or chat integration. */
export function ExploreIdeaAutoplay() {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: .35 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);
  return <div className={`explore-demo ${playing ? 'explore-playing' : ''}`} ref={root}>
    <div className="explore-scene">
      <img className="explore-backdrop" src="/art/Alleyway.png" alt=""/>
      <img className="explore-astronaut" src="/art/astronaut.svg" alt=""/>
      <div className="explore-balloon"><img src="/art/balloon.svg" alt=""/><span className="explore-click-ring"/></div>
      <svg className="explore-cursor" viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2L20 16L12 17L8 25Z" fill="#fffef8" stroke="#38452a" strokeWidth="1.5" strokeLinejoin="round"/></svg>
    </div>
    <div className="explore-panel"><span className="explore-panel-label">EXPLORE IDEA</span>
      <strong className="explore-companion">✳ Spark — Your Creative Companion</strong>
      <div className="explore-question"><span>Exploring Red Balloon</span><p>What could make Red Balloon important in this scene?</p></div>
      <span className="explore-hint">Select something to explore.</span>
    </div>
  </div>;
}
