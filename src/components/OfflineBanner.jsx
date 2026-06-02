import styles from './OfflineBanner.module.css';

export function OfflineBanner() {
  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠</span>
      <span>
        Backend fora do ar. Tentando reconectar automaticamente…
        <span className={styles.dots}><span /><span /><span /></span>
      </span>
    </div>
  );
}
