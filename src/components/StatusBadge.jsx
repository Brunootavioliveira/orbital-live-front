import styles from './StatusBadge.module.css';

const STATUS_CONFIG = {
  connecting: { label: 'Conectando...', dot: 'pulse-yellow' },
  live:       { label: 'LIVE',          dot: 'pulse-green'  },
  polling:    { label: 'Atualizando',   dot: 'pulse-blue'   },
  error:      { label: 'Reconectando', dot: 'pulse-yellow'  },
  offline:    { label: 'Backend offline', dot: 'red'        },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.connecting;
  return (
    <div className={styles.badge}>
      <span className={`${styles.dot} ${styles[cfg.dot]}`} />
      <span className={styles.label}>{cfg.label}</span>
    </div>
  );
}
