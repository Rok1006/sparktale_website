export interface TeamMember { name: string; role: string; image?: string; url?: string }
export const siteConfig: { prototypeUrl: string; team: TeamMember[] } = {
  prototypeUrl: '',
  team: ['Darren', 'Hilary', 'Nina', 'Bryan'].map(name => ({ name, role: 'MHCI ’27 + Designer', image: `/art/${name.toLowerCase()}.png` })),
};
export const artwork = { dragon: '/art/dragon.png', cat: '/art/cat.png', robot: '/art/robot.png', crown: '/art/crown.png', potion: '/art/potion.png', treasure: '/art/treasurebox.png' };
export type StickerWord = 'dragon' | 'cat' | 'robot';
