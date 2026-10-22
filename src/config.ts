export interface TeamMember { name: string; role: string; image?: string; url?: string }
export const siteConfig: { prototypeUrl: string; team: TeamMember[] } = {
  prototypeUrl: '',
  team: Array.from({ length: 4 }, (_, i) => ({ name: `Team member ${String(i + 1).padStart(2, '0')}`, role: 'Role coming soon' })),
};
export const artwork = { dragon: '/art/dragon.png', cat: '/art/cat.png', robot: '/art/robot.png', crown: '/art/crown.png', potion: '/art/potion.png', treasure: '/art/treasurebox.png' };
export type StickerWord = 'dragon' | 'cat' | 'robot';
