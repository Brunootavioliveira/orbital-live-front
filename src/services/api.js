const BASE_URL = 'https://orbital-live-production.up.railway.app';

export async function fetchAllPlanets() {
  const res = await fetch(`${BASE_URL}/api/v1/planets`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchPlanet(name) {
  const res = await fetch(`${BASE_URL}/api/v1/planets/${name}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
