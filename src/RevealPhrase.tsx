import { useEffect, useRef, useState } from 'react';

export function RevealPhrase({ children, green = false, underline = false }: { children: string; green?: boolean; underline?: boolean }) {
  const phrase = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const reveal = () => { setRevealed(true); observer?.disconnect(); };
    if (motion.matches) { reveal(); return; }
    const update = () => { if (motion.matches) reveal(); };
    observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) reveal(); }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    observer.observe(phrase.current!.closest('h1, h2')!);
    motion.addEventListener('change', update);
    return () => { observer?.disconnect(); motion.removeEventListener('change', update); };
  }, []);
  return <em ref={phrase} data-text={children} className={`philosophy-line reveal-phrase ${green ? 'phrase-green' : ''} ${underline ? 'draw-underline' : ''} ${revealed ? 'is-revealed' : ''}`}>{children}</em>;
}
