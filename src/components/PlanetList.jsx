import { PLANET_META, distanceFromSun } from '../utils/planets';
import styles from './PlanetList.module.css';

export function PlanetList({ planets, selected, onSelect }) {
  const planetMap = {};
  for (const p of planets) {
    const key = p.planet?.name || p.planet;
    planetMap[key] = p;
  }

  return (
    <div className={styles.grid}>
      {Object.entries(PLANET_META).map(([key, meta]) => {
        const data = planetMap[key];
        const dist = data ? distanceFromSun(data.x, data.y, data.z) : '—';
        const isActive = selected === key;

        return (
          <button
            key={key}
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            style={{ '--c': meta.color }}
            onClick={() => onSelect(key)}
          >
            <div className={styles.colorDot} style={{ background: meta.color, boxShadow: isActive ? `0 0 8px ${meta.color}` : 'none' }} />
            <div className={styles.info}>
              <span className={styles.name}>{meta.label}</span>
              <span className={styles.dist}>{dist} AU</span>
            </div>
            {isActive && <span className={styles.activeMark} />}
          </button>
        );
      })}
    </div>
  );
}
