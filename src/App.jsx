import { useState } from 'react';
import { usePlanetPositions } from './hooks/usePlanetPositions';
import { SolarCanvas } from './components/SolarCanvas';
import { PlanetPanel } from './components/PlanetPanel';
import { PlanetList } from './components/PlanetList';
import { StatusBadge } from './components/StatusBadge';
import { OfflineBanner } from './components/OfflineBanner';
import styles from './App.module.css';

export default function App() {
  const { planets, status, lastUpdate } = usePlanetPositions();
  const [selected, setSelected] = useState(null);

  const planetMap = {};
  for (const p of planets) {
    const key = p.planet?.name || p.planet;
    planetMap[key] = p;
  }

  const handleSelect = (key) => setSelected(prev => prev === key ? null : key);

  return (
    <div className={styles.root}>
      {status === 'offline' && <OfflineBanner />}

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◉</span>
          <span className={styles.logoText}>ORBITAL<span className={styles.logoDim}>.LIVE</span></span>
        </div>
        <div className={styles.headerRight}>
          {lastUpdate && (
            <span className={styles.updateTime}>
              {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
          <StatusBadge status={status} />
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidePanel}>
          <PlanetPanel
            planetKey={selected}
            data={selected ? planetMap[selected] : null}
          />
        </aside>

        <section className={styles.canvasSection}>
          <SolarCanvas
            planets={planets}
            selected={selected}
            onSelect={handleSelect}
          />
          <p className={styles.canvasHint}>
            Posições reais · NASA JPL Horizons · WebSocket live
          </p>
        </section>

        <aside className={styles.rightPanel}>
          <div className={styles.rightTitle}>Sistema Solar</div>
          <div className={styles.rightSub}>Coordenadas eclípticas em UA</div>
        </aside>
      </main>

      <section className={styles.listSection}>
        <PlanetList
          planets={planets}
          selected={selected}
          onSelect={handleSelect}
        />
      </section>

      <footer className={styles.footer}>
        <span>Dados © NASA JPL Horizons</span>
        <span className={styles.sep}>·</span>
        <span>Spring Boot + Redis + WebSocket</span>
        <span className={styles.sep}>·</span>
        <span>React + Vite</span>
      </footer>
    </div>
  );
}
