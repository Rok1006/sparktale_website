export interface TeamMember { name: string; role: string; image?: string; url?: string }
export const siteConfig: { prototypeUrl: string; team: TeamMember[] } = {
  prototypeUrl: '',
  team: Array.from({ length: 4 }, (_, i) => ({ name: `Team member ${String(i + 1).padStart(2, '0')}`, role: 'Role coming soon' })),
};
export const artwork = { dragon: '/art/dragon.png', cat: '/art/cat.png', robot: '/art/robot.png', crown: '/art/crown.png', potion: '/art/potion.png', treasure: '/art/treasurebox.png' };
export type StickerWord = 'dragon' | 'cat' | 'robot';
export const steps = [
  { title: 'Quick Create', subtitle: 'A little word. A new possibility.', body: 'Start with a character, an object, or a wild little idea. Turn a word into a sticker you can play with.' },
  { title: 'Build Your World', subtitle: 'Make room for your imagination.', body: 'Bring characters and objects together. Move things around, try a new setting, and make the scene your own.' },
  { title: 'Shape Your Story', subtitle: 'Something happens. Then what?', body: 'Give your characters something to do. Define events and connect the moments that make your story move.' },
  { title: 'Explore Possibilities', subtitle: 'A question can open a door.', body: 'Optional, contextual questions invite you to explore. Follow a spark, take a different path, or keep going your way.' },
  { title: 'Watch It Unfold', subtitle: 'See your little ideas come together.', body: 'Preview your developing story, revisit a moment, and discover what you want to try next.' },
];
