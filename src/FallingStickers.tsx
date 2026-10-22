import { useEffect, useRef } from 'react';

// Two mixed waves give the floor a loose pile of original sticker artwork.
const stickers = ['dragon', 'dog', 'ghost', 'clownfish_nemo', 'cat', 'vampire', 'robot', 'crown', 'potion', 'treasurebox', 'ghost', 'cat', 'potion', 'dragon', 'robot', 'dog', 'treasurebox', 'vampire', 'crown', 'clownfish_nemo', 'dog', 'ghost', 'dragon', 'cat', 'robot', 'potion', 'crown', 'treasurebox'];
interface Body { x: number; y: number; vx: number; vy: number; angle: number; spin: number; r: number; delay: number }
interface Grab { index: number; pointerId: number; dx: number; dy: number; time: number }
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function FallingStickers() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current!;
    const buttons = Array.from(element.children) as HTMLButtonElement[];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, width = 0, height = 0, size = 0, elapsed = 0, last = 0, awakeUntil = 0;
    let bodies: Body[] = [], grab: Grab | null = null;
    const paint = () => bodies.forEach((body, i) => {
      buttons[i].style.transform = `translate(${body.x - size / 2}px,${body.y - size / 2}px) rotate(${body.angle}rad)`;
    });
    const bounds = (body: Body) => {
      const edge = size * .55;
      body.x = clamp(body.x, edge, width - edge);
      body.y = clamp(body.y, edge, height - edge);
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now; elapsed += dt;
      for (let sub = 0; sub < 4; sub++) {
        const step = dt / 4;
        bodies.forEach((body, index) => {
          if (elapsed < body.delay || grab?.index === index) return;
          body.vy += 1100 * step;
          body.x += body.vx * step; body.y += body.vy * step;
          body.angle += body.spin * step;
          const edge = size * .55;
          if (body.y > height - edge) {
            body.y = height - edge;
            body.vy = Math.abs(body.vy) < 35 ? 0 : -Math.abs(body.vy) * .36;
            body.vx *= .96; body.spin *= .93;
          }
          if (body.x < edge || body.x > width - edge) {
            body.x = clamp(body.x, edge, width - edge); body.vx *= -.5;
          }
          if (body.y < edge && body.vy < 0) { body.y = edge; body.vy *= -.35; }
        });
        for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i], b = bodies[j];
          if (elapsed < a.delay || elapsed < b.delay) continue;
          const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy), minimum = a.r + b.r;
          if (distance >= minimum || distance < .001) continue;
          const nx = dx / distance, ny = dy / distance;
          const ma = grab?.index === i ? 0 : 1, mb = grab?.index === j ? 0 : 1, total = ma + mb;
          const overlap = minimum - distance;
          a.x -= nx * overlap * ma / total; a.y -= ny * overlap * ma / total;
          b.x += nx * overlap * mb / total; b.y += ny * overlap * mb / total;
          const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (speed < 0) {
            const impulse = -speed * 1.28 / total;
            a.vx -= impulse * nx * ma; a.vy -= impulse * ny * ma;
            b.vx += impulse * nx * mb; b.vy += impulse * ny * mb;
            if (ma) a.spin *= .9;
            if (mb) b.spin *= .9;
          }
        }
      }
      paint();
      if (grab || now < awakeUntil) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (preference.matches) { paint(); return; }
      awakeUntil = performance.now() + 6500;
      if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
    };
    const initialize = () => {
      cancelAnimationFrame(frame); frame = 0; grab = null; last = 0; elapsed = 0;
      buttons.forEach(button => button.classList.remove('is-grabbed'));
      width = element.clientWidth; height = element.clientHeight;
      // Fill roughly two rows, with fewer bodies on small screens.
      size = Math.min(132, Math.max(62, width * .085));
      const columns = Math.max(3, Math.floor(width / (size * 1.05)));
      const count = Math.min(stickers.length, Math.ceil(columns * 2.1));
      bodies = buttons.slice(0, count).map((button, i) => {
        button.style.width = `${size}px`; button.style.height = `${size}px`; button.hidden = false;
        const row = Math.floor(i / columns);
        const x = clamp(width / columns * ((i % columns) + .5 + (row % 2 ? .2 : 0)), size * .55, width - size * .55);
        return { x, y: preference.matches ? height - size * (.55 + row * .82) : -size * (1 + row * .7), vx: preference.matches ? 0 : (i % 2 ? 12 : -12), vy: 0, angle: (i % 2 ? 1 : -1) * .2, spin: (i % 2 ? -.22 : .22), r: size * .46, delay: preference.matches ? 0 : i * .08 };
      });
      buttons.slice(count).forEach(button => { button.hidden = true; });
      paint(); wake();
    };
    const down = (event: PointerEvent) => {
      if (grab || (event.pointerType === 'mouse' && event.button !== 0)) return;
      const button = (event.target as HTMLElement).closest('button');
      const index = buttons.indexOf(button as HTMLButtonElement);
      if (index < 0 || !bodies[index]) return;
      const rect = element.getBoundingClientRect(), body = bodies[index];
      grab = { index, pointerId: event.pointerId, dx: event.clientX - rect.left - body.x, dy: event.clientY - rect.top - body.y, time: event.timeStamp };
      body.delay = 0; body.vx = 0; body.vy = 0; body.spin = 0;
      button!.classList.add('is-grabbed'); button!.setPointerCapture(event.pointerId); wake();
    };
    const move = (event: PointerEvent) => {
      if (!grab || event.pointerId !== grab.pointerId) return;
      const rect = element.getBoundingClientRect(), body = bodies[grab.index];
      const oldX = body.x, oldY = body.y;
      body.x = event.clientX - rect.left - grab.dx; body.y = event.clientY - rect.top - grab.dy; bounds(body);
      const dt = Math.max((event.timeStamp - grab.time) / 1000, .008);
      body.vx = clamp((body.x - oldX) / dt, -1600, 1600);
      body.vy = clamp((body.y - oldY) / dt, -1600, 1600);
      grab.time = event.timeStamp; paint();
    };
    const release = (event: PointerEvent) => {
      if (!grab || event.pointerId !== grab.pointerId) return;
      const body = bodies[grab.index], button = buttons[grab.index];
      if (event.type === 'pointercancel' || event.timeStamp - grab.time > 100) { body.vx = 0; body.vy = 0; }
      body.spin = clamp(body.vx / 280, -4, 4);
      button.classList.remove('is-grabbed');
      grab = null;
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      wake();
    };
    const keydown = (event: KeyboardEvent) => {
      const index = buttons.indexOf(event.target as HTMLButtonElement), body = bodies[index];
      if (!body) return;
      const directions: Record<string, number[]> = { ArrowLeft: [-25, 0], ArrowRight: [25, 0], ArrowUp: [0, -25], ArrowDown: [0, 25] };
      if (directions[event.key]) {
        event.preventDefault(); body.delay = 0; body.x += directions[event.key][0]; body.y += directions[event.key][1]; bounds(body); wake();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); body.delay = 0;
        if (!preference.matches) { body.vy = -700; body.vx = index % 2 ? 160 : -160; body.spin = body.vx / 100; }
        wake();
      }
    };
    element.addEventListener('pointerdown', down); element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', release); element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', release); element.addEventListener('keydown', keydown);
    const observer = new ResizeObserver(initialize); observer.observe(element);
    preference.addEventListener('change', initialize);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); preference.removeEventListener('change', initialize);
      element.removeEventListener('pointerdown', down); element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', release); element.removeEventListener('pointercancel', release);
      element.removeEventListener('lostpointercapture', release); element.removeEventListener('keydown', keydown);
    };
  }, []);
  return <div ref={stage} className="falling-stickers" role="group" aria-label="Play with the stickers. Grab and throw, or use arrow keys to move and Space to toss.">{stickers.map((name, index) => <button type="button" className="physics-sticker" key={`${name}-${index}`} aria-label={`${name.replaceAll('_', ' ')} sticker. Drag to throw, arrows to move, Space to toss.`}><img src={`/art/${name}.png`} alt="" draggable="false"/></button>)}</div>;
}
