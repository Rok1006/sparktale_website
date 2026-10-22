import { useEffect, useRef, useState } from 'react';
import { artwork } from './config';

const demoWords = ['dragon', 'ghost', 'cat', 'potion'] as const;
export function QuickCreateAutoplay() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sticker, setSticker] = useState<(typeof demoWords)[number] | null>(null);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(motion.matches);
    updateMotion(); motion.addEventListener('change', updateMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    observer.observe(root.current!);
    return () => { observer.disconnect(); motion.removeEventListener('change', updateMotion); };
  }, []);
  useEffect(() => {
    if (reduced) { setText('dragon'); setSticker('dragon'); setSubmitting(false); return; }
    if (!visible) return;
    let timer = 0, cancelled = false;
    const schedule = (callback: () => void, delay: number) => {
      timer = window.setTimeout(() => { if (!cancelled) callback(); }, delay);
    };
    const cycle = (index: number) => {
      const word = demoWords[index];
      setText(''); setSticker(null); setSubmitting(false);
      const type = (length: number) => {
        setText(word.slice(0, length));
        if (length < word.length) schedule(() => type(length + 1), 85);
        else schedule(() => {
          setSubmitting(true);
          schedule(() => {
            setSticker(word); setSubmitting(false);
            schedule(() => { setText(''); schedule(() => cycle((index + 1) % demoWords.length), 250); }, 1900);
          }, 240);
        }, 600);
      };
      schedule(() => type(1), 250);
    };
    cycle(0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [visible, reduced]);
  return <div className="quick-autoplay" ref={root}>
    <div className="autoplay-pill"><span>{text}<i className="autoplay-caret"/></span><span className={`autoplay-submit ${submitting ? 'is-submitting' : ''}`}>→</span></div>
    <div className="autoplay-preview">{sticker && <img className="autoplay-sticker" key={sticker} src={artwork[sticker]} alt=""/>}</div>
  </div>;
}
