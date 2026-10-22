import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { artwork, siteConfig, type StickerWord } from './config';
import './styles.css';
import { FallingStickers } from './FallingStickers';

function Brand() { return <a className="brand" href="#" aria-label="SPARKTALE home"><img className="brand-logo" src="/art/Logo.svg" alt=""/> Sparktale</a>; }
function PrototypeButton({ small = false }: { small?: boolean }) { return siteConfig.prototypeUrl ? <a className={`button ${small ? 'small' : ''}`} href={siteConfig.prototypeUrl} target="_blank" rel="noreferrer">Start Creating <span>↗</span></a> : <span className="cta-wrap"><button className={`button ${small ? 'small' : ''}`} disabled>Start Creating <span>↗</span></button>{<small>Prototype link coming soon</small>}</span>; }
function Sticker({ name, className = '' }: { name: keyof typeof artwork; className?: string }) { return <img className={`sticker ${className}`} src={artwork[name]} alt="" draggable="false"/>; }
interface CanvasSticker { id: number; word: StickerWord; x: number; y: number; rotation: number }
function QuickCreate() {
  const [stickers, setStickers] = useState<CanvasSticker[]>([]);
  const [typed, setTyped] = useState('');
  const [run, setRun] = useState(0);
  const [message, setMessage] = useState('');
  const canvas = useRef<HTMLDivElement>(null);
  const counter = useRef(0);
  const timersRef = useRef<number[]>([]);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const add = (word: StickerWord) => {
    setStickers(old => old.length >= 6 ? old : [...old, { id: ++counter.current, word, x: 22 + (old.length * 23) % 57, y: 20 + (old.length * 19) % 45, rotation: old.length % 2 ? 11 : -9 }]);
    setMessage(`${word} sticker added. Drag it or use arrow keys to move it.`);
  };
  useEffect(() => {
    setStickers([]); setTyped(''); setMessage('');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped('dragon'); add('dragon'); return; }
    const timers = [...'dragon'].map((_, i) => window.setTimeout(() => setTyped('dragon'.slice(0, i + 1)), 550 + i * 140));
    timers.push(window.setTimeout(() => add('dragon'), 1550));
    timersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, [run]);
  const move = (id: number, x: number, y: number) => setStickers(old => old.map(s => s.id === id ? { ...s, x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) } : s));
  return <div className="hero-playground"><div className="canvas-top"><span><i/> YOUR IMAGINATION, IN PLAY</span><span>✧</span></div>
    <div className="canvas" ref={canvas}><span className="canvas-note">Every story starts<br/>with a little spark.</span><svg className="canvas-arrow" viewBox="0 0 120 90" aria-hidden="true"><path d="M5 5 Q100 -5 80 65 M64 48 L80 67 L96 52"/></svg>
      <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
      <Sticker name="cat" className="canvas-cat"/><Sticker name="crown" className="canvas-crown"/><Sticker name="potion" className="canvas-potion"/>
      <span className="little-star star-one">✳</span><span className="little-star star-two">✦</span>
      <div className="drag-area">{stickers.map(s => <button key={s.id} className="movable-sticker" style={{ left: `${s.x}%`, top: `${s.y}%`, '--rotation': `${s.rotation}deg` } as React.CSSProperties} aria-label={`${s.word} sticker. Drag or use arrow keys to move.`}
        onPointerDown={e => { const r = canvas.current!.querySelector('.drag-area')!.getBoundingClientRect(); drag.current = { id: s.id, dx: e.clientX - r.left - r.width * s.x / 100, dy: e.clientY - r.top - r.height * s.y / 100 }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (drag.current?.id !== s.id) return; const r = canvas.current!.querySelector('.drag-area')!.getBoundingClientRect(); move(s.id, (e.clientX - r.left - drag.current.dx) / r.width * 100, (e.clientY - r.top - drag.current.dy) / r.height * 100); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
        onKeyDown={e => { const delta: Record<string, number[]> = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }; if (delta[e.key]) { e.preventDefault(); move(s.id, s.x + delta[e.key][0], s.y + delta[e.key][1]); } }}><Sticker name={s.word}/></button>)}</div>
      <span className="drag-note">↖ drag a little. dream a lot.</span>
    </div>
    <div className="quick-create"><div className="quick-label"><span>✳ Quick Create</span><button className="text-button" onClick={() => setRun(v => v + 1)} aria-label="Replay Quick Create">↻ Replay</button></div><div className="word-input"><span>{typed}<i className="cursor"/></span><span className="create-icon" aria-hidden="true">↵</span></div><div className="presets"><span>Try a little idea:</span>{(['dragon', 'cat', 'robot'] as StickerWord[]).map(word => <button key={word} disabled={stickers.length >= 6} onClick={() => { timersRef.current.forEach(clearTimeout); setTyped(word); add(word); }}>{word} <span>+</span></button>)}</div><div className="canvas-controls"><span>{stickers.length}/6 stickers{stickers.length >= 6 ? ' · Canvas full' : ''}</span><button className="text-button" onClick={() => { timersRef.current.forEach(clearTimeout); setStickers([]); setTyped(''); setMessage('Canvas reset.'); }}>Reset canvas</button></div></div><p className="sr-only" role="status">{message}</p><div className="demo-tag">A tiny interactive demo. A whole world of possibility.</div>
  </div>;
}
const storySteps = [
  { title: 'Start with a spark.', text: 'A word becomes a sticker. A character, a treasure, a little what if.', art: 'dragon' as const },
  { title: 'Make a world.', text: 'Bring your ideas together. Move them around. See what belongs.', art: 'cat' as const },
  { title: 'See where it goes.', text: 'Connect the moments. Try another possibility. Tell it your way.', art: 'treasure' as const },
];
function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .16 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <><a className="skip-link" href="#main">Skip to content</a>
    <header className="header"><Brand/><nav aria-label="Main navigation"><a href="#idea">The idea</a><a href="#demo">Try it</a><a href="#team">The team</a></nav></header>
    <main id="main">
      <section className="hero" id="top"><FallingStickers/><div className="hero-copy"><img className="hero-logo" src="/art/Logo.svg" alt=""/><h1>Helping little ideas<br/>grow into <em>big stories.</em></h1><p>A visual storytelling sandbox for young creators.</p><a className="scroll-indicator" href="#idea" aria-label="Scroll to discover SparkTale"><span>SCROLL</span><i aria-hidden="true"/></a></div></section>
      <section className="idea chapter" id="idea"><div className="reveal"><p className="eyebrow">THE IDEA</p><h2>Every story starts<br/>with a little <em>what if.</em></h2><p className="section-copy">SPARKTALE is a space for young imaginations to play.<br className="desktop-break"/> Turn characters, worlds, and unexpected ideas into<br className="desktop-break"/> visual stories that are entirely your own.</p><span className="idea-doodle" aria-hidden="true">✧</span></div></section>
      <section className="how chapter" id="how"><div className="section-title reveal"><p className="eyebrow">HOW IT WORKS</p><h2>From a little spark<br/>to <em>“and then…”</em></h2></div><div className="story-steps">{storySteps.map((step,i) => <article className="story-step reveal" key={step.title}><div className={`step-visual visual-${i}`} aria-hidden="true">{i === 0 && <span className="word-chip">dragon <span>↗</span></span>}<Sticker name={step.art}/>{i === 1 && <><Sticker name="crown" className="world-crown"/><Sticker name="potion" className="world-potion"/><span className="world-line"/></>}{i === 2 && <><Sticker name="dragon" className="story-dragon"/><span className="story-path">· · · · · ↗</span></>}</div><span className="step-number">0{i+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
      <section className="philosophy chapter" id="philosophy"><div className="reveal"><p className="eyebrow">OUR PHILOSOPHY</p><h2>AI asks.<br/><em>You create.</em></h2><p className="section-copy">A nudge of inspiration. Never a script to follow.<br/>Optional questions open doors.<br/>You decide which ones to walk through.</p><div className="principles"><span>Start simple.</span><span>Stay curious.</span><span>Make it yours.</span></div><small>A design concept for optional guidance, without a live AI system.</small></div><span className="philosophy-flower" aria-hidden="true">✳</span></section>
      <section className="demo-section chapter" id="demo"><div className="demo-intro reveal"><p className="eyebrow">A LITTLE PREVIEW</p><h2>Let’s start<br/>with <em>one idea.</em></h2><p className="section-copy">Try a word. Move a sticker.<br/>See where your imagination takes you.</p><PrototypeButton/></div><div className="demo-container reveal"><QuickCreate/></div></section>
      <section className="team chapter" id="team"><div className="reveal"><p className="eyebrow">THE PEOPLE BEHIND THE PLAY</p><h2>A few minds.<br/>One shared <em>spark.</em></h2></div><div className="team-grid">{siteConfig.team.map((member,i) => <article className="team-member reveal" key={member.name}><div className={`polaroid polaroid-${i}`}><div className="polaroid-photo">{member.image && <img src={member.image} alt={`Portrait of ${member.name}`} loading="lazy"/>}</div><div className="polaroid-caption"><h3>{member.name}</h3><p>{member.role}</p>{member.url && <a href={member.url} target="_blank" rel="noreferrer">Portfolio ↗</a>}</div><Sticker name={(['dragon','cat','robot','potion'] as const)[i]} className="polaroid-sticker"/></div></article>)}</div></section>
    </main><footer><Brand/><p>A project for the SVSD Design Competition</p><a href="#top">Back to the beginning ↑</a></footer></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
