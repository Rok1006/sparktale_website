export interface TeamMember { name: string; cohort: string; role: string; image?: string; url?: string; linkedinUrl?: string }
export const siteConfig: { prototypeUrl: string; team: TeamMember[] } = {
  prototypeUrl: 'https://storytelling-playground.vercel.app/',
  team: ['Darren', 'Hilary', 'Nina', 'Bryan'].map(name => ({ name, linkedinUrl: ({ Darren: 'https://www.linkedin.com/in/darrenyao1/', Hilary: 'https://www.linkedin.com/in/hiu-lam-hilary-chan-2b9369205/', Nina: 'https://www.linkedin.com/in/ninayux/', Bryan: 'https://www.linkedin.com/in/bryan-nguyen-son-0b95aa23b/' } as Record<string, string>)[name], cohort: 'MHCI ’27', role: name === 'Hilary' ? 'Product Designer & Developer' : 'Product Designer', image: `/art/${name.toLowerCase()}.png` })),
};
export const artwork = { dog: '/art/dog.png', ghost: '/art/ghost.png', vampire: '/art/vampire.png', clownfish: '/art/clownfish_nemo.png', dragon: '/art/dragon.png', cat: '/art/cat.png', robot: '/art/robot.png', crown: '/art/crown.png', potion: '/art/potion.png', treasure: '/art/treasurebox.png' };
export type StickerWord = keyof typeof artwork;
