import { useEffect, useRef, useState } from 'react';

export function PhilosophyHeadline() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const reveal = () => { setRevealed(true); observer?.disconnect(); };
    if (preference.matches) { reveal(); return; }
    const updateMotion = () => { if (preference.matches) reveal(); };
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    observer.observe(heading.current!.closest('section')!);
    preference.addEventListener('change', updateMotion);
    return () => { observer?.disconnect(); preference.removeEventListener('change', updateMotion); };
  }, []);
  return <h2 ref={heading} className={`philosophy-headline ${revealed ? 'is-revealed' : ''}`}><span className="philosophy-line" data-text="AI asks.">AI asks.</span><br/><em className="philosophy-line" data-text="You create.">You create.</em></h2>;
}
