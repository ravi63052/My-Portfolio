// Section anchors map native scrolling to the shared WebGL scene.
export const chapters = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];
export const roles = ['Full Stack Developer', 'AI Application Builder', 'Java & React Developer'];

export function chapterAt(scroll, anchors) {
  if (!anchors.length) return 0;
  for (let i = anchors.length - 1; i >= 0; i--) {
    if (scroll >= anchors[i]) {
      const next = anchors[i + 1];
      return next === undefined ? i : i + Math.min(1, (scroll - anchors[i]) / Math.max(1, next - anchors[i]));
    }
  }
  return 0;
}

export const orbitSkills = [
  { name: 'React', label: 'React.js', symbol: 'react', group: 0, color: '#72d9f6' },
  { name: 'JavaScript', label: 'JavaScript', symbol: 'JS', group: 0, color: '#e5d878' },
  { name: 'Node.js', label: 'Node.js', symbol: 'node', group: 1, color: '#94d598' },
  { name: 'Java', label: 'Java', symbol: 'java', group: 4, color: '#edb38e' },
  { name: 'MongoDB', label: 'MongoDB', symbol: 'mongo', group: 2, color: '#78c99b' },
  { name: 'MySQL', label: 'MySQL', symbol: 'SQL', group: 2, color: '#8cbce4' },
  { name: 'Gemini', label: 'Gemini API', symbol: 'gemini', group: 3, color: '#c3aff9' },
  { name: 'Python', label: 'Python', symbol: 'Py', group: 4, color: '#aec9f5' },
  { name: 'Spring Boot', label: 'Learning', symbol: '+', group: 5, color: '#a7c0ad' },
];
