export interface StorySnapshot {
  id: string;
  screenshot?: string;
  imageDescription: string;
  caption: string;
  placeholder: boolean;
}

// Chronological scenes from the team's supplied vampire adventure screenshots.
const vampireScenes = [
  ['One morning, a vampire takes a stroll along the beach.', 'A vampire walks along a sunny beach.'],
  ['There, he discovers a curious fox.', 'The vampire discovers a curious fox on the beach.'],
  ['The fox gives him an old compass.', 'The curious fox gives an old compass to the vampire on the beach.'],
  ['Later, the vampire discovers a dog in the Secret Forest.', 'The vampire discovers a dog in the secret forest.'],
  ['He passes the old compass to the dog.', 'The vampire gives the old compass to the dog in the forest.'],
  ['The dog walks through the Secret Forest.', 'The dog walks through the forest beside the vampire.'],
  ['Soon after, the dog discovers a mysterious key.', 'The dog discovers a mystery key in the forest while the vampire watches.'],
  ['The dog gives the key to the vampire.', 'The dog gives the mystery key to the vampire.'],
  ['At a purple castle, the vampire puts his key to use.', 'The vampire uses his key at a purple castle.'],
  ['Happy at last, the vampire says, "Shiettt that was close... I thought I was cooked lmao."', 'The happy vampire stands in front of the purple castle.'],
];
export const storySnapshots: StorySnapshot[] = vampireScenes.map(([caption, imageDescription], index) => ({
  id: `vampire-adventure-${index + 1}`,
  screenshot: `/stories/vampire-adventure/scene-${String(index + 1).padStart(2, '0')}.png`,
  imageDescription,
  caption,
  placeholder: false,
}));
