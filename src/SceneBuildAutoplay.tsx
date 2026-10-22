import { useEffect, useRef, useState } from 'react';

export function SceneBuildAutoplay() {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: .35 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={`scene-build-demo ${playing ? 'is-playing' : ''}`}>
    <div className="build-scene">
      <img className="build-backdrop" src="/art/Alleyway.png" alt=""/>
      <span className="build-scene-label">My scene <span>− &nbsp; 100% &nbsp; +</span></span>
      <img className="build-balloon" src="/art/balloon.svg" alt=""/>
    </div>
    <div className="build-drag-sticker"><img src="/art/astronaut.svg" alt=""/>
    </div>
    <div className="build-discover-sticker"><img src="/art/search.svg" alt=""/>
    </div>
    <svg className="scene-demo-cursor" viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2L20 16L12 17L8 25Z" fill="#fffef8" stroke="#38452a" strokeWidth="1.5" strokeLinejoin="round"/></svg>
    <div className="story-event-demo"><span className="story-event-title">Story Event <span>Scene Settings</span></span><div className="story-event-slots">
      {[['+ Who?', 'Astronaut'], ['+ Does what?', 'Discovers'], ['+ What?', 'Balloon']].map(([label,value],i) => <div className={`event-slot event-slot-${i}`} key={label}><span className="event-empty">{label}</span><span className="event-value">{value}</span></div>)}
    </div></div>
  </div>;
}
