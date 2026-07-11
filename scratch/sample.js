const j = require('./storyboard.json');
const scenes = j.storyboard.scenes;
const randoms = [];
for (let i = 0; i < 12; i++) {
  let idx;
  do { idx = Math.floor(Math.random() * scenes.length); } while (randoms.includes(idx));
  randoms.push(idx);
}
randoms.sort((a,b) => a-b).forEach(i => {
  const s = scenes[i];
  const entries = Object.entries(s.props).filter(([k]) => k !== 'startDelay').slice(0, 2);
  const parts = entries.map(([k, v]) => {
    if (typeof v === 'string') return k + '="' + v.slice(0, 55) + '"';
    if (Array.isArray(v)) return k + '=[' + v.length + ' items]';
    return k + '=' + v;
  });
  console.log(String(i + 1).padStart(3) + '. ' + s.type.padEnd(32) + parts.join(', '));
});
