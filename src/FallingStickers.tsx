import { useEffect, useRef } from 'react';
import { artwork } from './config';

const names: (keyof typeof artwork)[] = ['dragon','crown','cat','potion','robot','treasure','cat','dragon','crown','potion'];
interface Body { x: number; y: number; vx: number; vy: number; angle: number; spin: number; r: number; delay: number }
/** Lightweight circle collisions keep the original artwork untouched. */
export function FallingStickers() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current!;
    const images = Array.from(element.children) as HTMLImageElement[];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const initialize = () => {
      cancelAnimationFrame(frame);
      const width = element.clientWidth, height = element.clientHeight;
      const size = Math.min(160, Math.max(76, width * .115));
      const count = width < 600 ? 7 : names.length;
      const bodies: Body[] = images.slice(0,count).map((image,i) => {
        image.style.width = `${size}px`; image.style.height = `${size}px`; image.style.display = 'block';
        return { x: size / 2 + ((i * .273 + .09) % 1) * (width-size), y: -size * (1+i*.7), vx: (i%2 ? 1 : -1)*28, vy: 0, angle: (i%2 ? 1 : -1)*.24, spin: (i%2 ? -.6 : .6), r: size*.39, delay: i*.22 };
      });
      images.slice(count).forEach(image => { image.style.display = 'none'; });
      const paint = () => bodies.forEach((b,i) => { images[i].style.transform = `translate(${b.x-size/2}px,${b.y-size/2}px) rotate(${b.angle}rad)`; });
      if (preference.matches) {
        bodies.forEach((b,i) => { b.x = size*.5 + i/(count-1)*(width-size); b.y = height-size*.43-(i%3===1 ? size*.28 : 0); }); paint(); return;
      }
      let last = 0, elapsed = 0;
      const tick = (now: number) => {
        if (!last) last=now;
        const dt=Math.min((now-last)/1000,1/30); last=now; elapsed+=dt;
        for(let sub=0;sub<3;sub++) {
          const step=dt/3;
          bodies.forEach(b => {
            if(elapsed < b.delay) return;
            b.vy+=1100*step; b.x+=b.vx*step; b.y+=b.vy*step; b.angle+=b.spin*step;
            if(b.y+b.r>height-size*.12-5) { b.y=height-size*.12-5-b.r; b.vy=Math.abs(b.vy)<30 ? 0 : -Math.abs(b.vy)*.32; b.vx*=.96; b.spin*=.93; }
            if(b.x-b.r<0 || b.x+b.r>width) { b.x=Math.max(b.r,Math.min(width-b.r,b.x)); b.vx*=-.45; }
          });
          for(let i=0;i<bodies.length;i++) for(let j=i+1;j<bodies.length;j++) {
            const a=bodies[i], b=bodies[j]; if(elapsed<a.delay || elapsed<b.delay) continue;
            const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),min=a.r+b.r;
            if(dist<min && dist>.001) {
              const nx=dx/dist,ny=dy/dist,overlap=(min-dist)*.5; a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;
              const speed=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
              if(speed<0) { const impulse=-speed*.62; a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny;a.spin*=.85;b.spin*=.85; }
            }
          }
          bodies.forEach(b => { b.x=Math.max(b.r,Math.min(width-b.r,b.x));b.y=Math.min(height-size*.12-5-b.r,b.y); });
        }
        paint();
        if(elapsed<14) frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    };
    const observer=new ResizeObserver(initialize); observer.observe(element);
    preference.addEventListener('change',initialize);
    return () => { cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',initialize); };
  },[]);
  return <div ref={stage} className="falling-stickers" aria-hidden="true">{names.map((name,i)=><img key={i} src={artwork[name]} alt="" draggable="false"/>)}</div>;
}
