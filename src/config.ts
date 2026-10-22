export interface TeamMember { name: string; cohort: string; role: string; image?: string; url?: string }
export const siteConfig: { prototypeUrl: string; team: TeamMember[] } = {
  prototypeUrl: 'https://storytelling-playground.vercel.app/',
  team: ['Darren', 'Hilary', 'Nina', 'Bryan'].map(name => ({ name, cohort: 'MHCI ’27', role: name === 'Hilary' ? 'Product Designer & Developer' : 'Product Designer', image: `/art/${name.toLowerCase()}.png` })),
};
export const artwork = { dog: '/art/dog.png', ghost: '/art/ghost.png', vampire: '/art/vampire.png', clownfish: '/art/clownfish_nemo.png', dragon: '/art/dragon.png', cat: '/art/cat.png', robot: '/art/robot.png', crown: '/art/crown.png', potion: '/art/potion.png', treasure: '/art/treasurebox.png' };
export type StickerWord = keyof typeof artwork;
