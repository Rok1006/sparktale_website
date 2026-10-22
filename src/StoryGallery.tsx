import { useEffect, useRef, useState } from 'react';
import { storySnapshots, type StorySnapshot } from './storyGalleryData';
import { RevealPhrase } from './RevealPhrase';

function SceneImage({ item }: { item: StorySnapshot }) {
  return item.screenshot && !item.placeholder ? <img src={item.screenshot} alt={item.imageDescription} draggable="false"/> : <div className="story-placeholder"><span aria-hidden="true">✳</span><span>Story screenshot<br/>coming soon</span><small>TEAM SNAPSHOT PLACEHOLDER</small></div>;
}
export function StoryGallery() {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const suppressionTimer = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    if (selected !== null) {
      if (!dialog.current!.open) dialog.current!.showModal();
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = oldOverflow; };
  }, [selected]);
  useEffect(() => () => window.clearTimeout(suppressionTimer.current), []);
  const close = () => {
    dialog.current?.close(); setSelected(null);
    origin.current?.focus({ preventScroll: true });
  };
  const browse = (direction: number) => {
    const node = track.current!;
    const first = node.querySelector<HTMLElement>('.story-snapshot')!;
    node.scrollBy({ left: direction * (first.offsetWidth + 28), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const changeScene = (direction: number) => setSelected(index => index === null ? null : (index + direction + storySnapshots.length) % storySnapshots.length);
  return <section className="story-gallery chapter" id="stories" aria-labelledby="story-gallery-title">
    <div className="gallery-heading reveal"><p className="eyebrow">MADE WITH SPARKTALE</p><h2 id="story-gallery-title">Things got a little <RevealPhrase green>weird.</RevealPhrase></h2><p className="section-copy">A few unexpected moments from our storytelling sandbox.</p></div>
    <div className="gallery-controls"><span aria-live="polite" className="gallery-position">Snapshot {position + 1} of {storySnapshots.length}</span><div><button type="button" aria-label="Previous story snapshots" disabled={position === 0} onClick={() => browse(-1)}>←</button><button type="button" aria-label="Next story snapshots" disabled={atEnd} onClick={() => browse(1)}>→</button></div></div>
    <div className={`story-gallery-track ${dragging ? 'is-dragging' : ''}`} ref={track} role="region" aria-label="Story snapshots. Swipe, drag, or use Left and Right arrow keys to browse." tabIndex={0}
      onScroll={event => {
        const node = event.currentTarget;
        const max = node.scrollWidth - node.clientWidth;
        const card = node.querySelector<HTMLElement>('.story-snapshot')!;
        setPosition(Math.min(storySnapshots.length - 1, Math.round(node.scrollLeft / (card.offsetWidth + 28))));
        setAtEnd(node.scrollLeft >= max - 3);
      }}
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); browse(event.key === 'ArrowRight' ? 1 : -1); } }}
      onPointerDown={event => { if (event.pointerType === 'mouse' && event.button === 0) { drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false }; suppressClick.current = false; } }}
      onPointerMove={event => {
        if (!drag.current) return;
        const delta = event.clientX - drag.current.x;
        if (Math.abs(delta) > 6 && !drag.current.moved) { drag.current.moved = true; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }
        if (drag.current.moved) { event.preventDefault(); event.currentTarget.scrollLeft = drag.current.scroll - delta; }
      }}
      onPointerUp={event => {
        if (drag.current?.moved) { suppressClick.current = true; window.clearTimeout(suppressionTimer.current); suppressionTimer.current = window.setTimeout(() => { suppressClick.current = false; }, 250); }
        drag.current = null; setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}>
      {storySnapshots.map((item, index) => <button className={`story-snapshot snapshot-${index % 4}`} key={item.id} type="button" aria-label={`Open story snapshot ${index + 1}${item.placeholder ? ', placeholder' : ''}`} aria-haspopup="dialog" onClick={event => { origin.current = event.currentTarget; setSelected(index); }}><SceneImage item={item}/><span className="snapshot-caption"><small>STORY EVENT / {String(index + 1).padStart(2, '0')}</small><span>{item.caption}</span></span></button>)}
    </div>
    <p className="gallery-footnote">A vampire’s unexpected adventure — made by our team in SPARKTALE.</p>
    <dialog className="story-lightbox" ref={dialog} aria-labelledby="story-lightbox-title" aria-describedby="story-lightbox-caption" onCancel={event => { event.preventDefault(); close(); }} onClose={() => { setSelected(null); origin.current?.focus({ preventScroll: true }); }}
      onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); changeScene(event.key === 'ArrowRight' ? 1 : -1); } }}>
      {selected !== null && <><div className="lightbox-toolbar"><h3 id="story-lightbox-title">Story snapshot {selected + 1}{storySnapshots[selected].placeholder ? ' · Preview placeholder' : ''}</h3><button type="button" onClick={close} aria-label="Close story preview" autoFocus>×</button></div><div className="lightbox-scene"><SceneImage item={storySnapshots[selected]}/></div><p id="story-lightbox-caption">{storySnapshots[selected].caption}</p><div className="lightbox-controls"><button type="button" onClick={() => changeScene(-1)} aria-label="Previous story scene">←</button><span aria-live="polite">{selected + 1} / {storySnapshots.length}</span><button type="button" onClick={() => changeScene(1)} aria-label="Next story scene">→</button></div></>}
    </dialog>
  </section>;
}
