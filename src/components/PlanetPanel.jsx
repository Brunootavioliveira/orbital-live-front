import { PLANET_META, distanceFromSun, formatTimestamp } from '../utils/planets';
import styles from './PlanetPanel.module.css';

const DESCRIPTIONS = {
  MERCURY: 'O planeta mais próximo do Sol. Temperaturas extremas, de -180°C a 430°C.',
  VENUS:   'O planeta mais quente do sistema solar por efeito estufa. Densa atmosfera de CO₂.',
  EARTH:   'Nosso lar. O único planeta conhecido a abrigar vida.',
  MARS:    'O Planeta Vermelho. Candidato à colonização humana e missões Mars 2020.',
  JUPITER: 'O maior planeta. A Grande Mancha Vermelha existe há mais de 350 anos.',
  SATURN:  'Famoso por seus anéis de gelo e rocha. Densidade menor que a da água.',
  URANUS:  'Gira de lado, com inclinação axial de 97,77°. Descoberto em 1781.',
  NEPTUNE: 'O planeta mais distante. Ventos de até 2.100 km/h.',
};

export function PlanetPanel({ planetKey, data }) {
  if (!planetKey || !data) {
    return (
      <div className={styles.empty}>
        <p>Clique em um planeta no mapa para ver seus dados em tempo real.</p>
      </div>
    );
  }

  const meta = PLANET_META[planetKey];
  const dist = distanceFromSun(data.x, data.y, data.z);

  return (
    <div className={styles.panel}>
      <div className={styles.header} style={{ '--planet-color': meta.color }}>
        <div className={styles.dot} style={{ background: meta.color, boxShadow: `0 0 12px ${meta.color}` }} />
        <div>
          <h2 className={styles.name}>{meta.label}</h2>
          <p className={styles.key}>{planetKey}</p>
        </div>
      </div>

      <p className={styles.desc}>{DESCRIPTIONS[planetKey]}</p>

      <div className={styles.coords}>
        <div className={styles.coord}>
          <span className={styles.axis}>X</span>
          <span className={styles.val}>{data.x.toFixed(4)}</span>
          <span className={styles.unit}>AU</span>
        </div>
        <div className={styles.coord}>
          <span className={styles.axis}>Y</span>
          <span className={styles.val}>{data.y.toFixed(4)}</span>
          <span className={styles.unit}>AU</span>
        </div>
        <div className={styles.coord}>
          <span className={styles.axis}>Z</span>
          <span className={styles.val}>{data.z.toFixed(4)}</span>
          <span className={styles.unit}>AU</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Dist. do Sol</span>
          <span className={styles.statVal} style={{ color: meta.color }}>{dist} AU</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Órbita real</span>
          <span className={styles.statVal}>{meta.orbitAU} AU</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Atualizado</span>
          <span className={styles.statVal}>{formatTimestamp(data.timestamp)}</span>
        </div>
      </div>

      <div className={styles.source}>
        Dados via NASA JPL Horizons System
      </div>
    </div>
  );
}
