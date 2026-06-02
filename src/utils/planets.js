export const PLANET_META = {
  MERCURY: { color: '#b5b5b5', glow: '#c8c8c8', radius: 4,   orbitAU: 0.387, label: 'Mercúrio', emoji: '☿' },
  VENUS:   { color: '#e8c56e', glow: '#f5d980', radius: 7,   orbitAU: 0.723, label: 'Vênus',    emoji: '♀' },
  EARTH:   { color: '#4b9eff', glow: '#7ab8ff', radius: 7.5, orbitAU: 1.000, label: 'Terra',    emoji: '🜨' },
  MARS:    { color: '#e05c3a', glow: '#ff7a57', radius: 5.5, orbitAU: 1.524, label: 'Marte',    emoji: '♂' },
  JUPITER: { color: '#c8956a', glow: '#e0a878', radius: 16,  orbitAU: 5.203, label: 'Júpiter',  emoji: '♃' },
  SATURN:  { color: '#d4b483', glow: '#e8c88a', radius: 13,  orbitAU: 9.537, label: 'Saturno',  emoji: '♄' },
  URANUS:  { color: '#7de8e8', glow: '#9fffff', radius: 10,  orbitAU: 19.19, label: 'Urano',    emoji: '⛢' },
  NEPTUNE: { color: '#4060ff', glow: '#6080ff', radius: 10,  orbitAU: 30.07, label: 'Netuno',   emoji: '♆' },
};

export function auToPixels(au, maxPx = 340) {
  const minAU = Math.log(0.3);
  const maxAU = Math.log(35);
  const t = (Math.log(au) - minAU) / (maxAU - minAU);
  return t * maxPx;
}


export function projectCoords(x, y, canvasSize = 700) {
  const scale = auToPixels(1) / 1; 
  const center = canvasSize / 2;
  return {
    cx: center + x * scale,
    cy: center - y * scale, 
  };
}

export function distanceFromSun(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z).toFixed(3);
}

export function formatTimestamp(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
