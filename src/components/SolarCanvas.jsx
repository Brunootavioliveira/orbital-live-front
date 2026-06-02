import { useMemo, useState, useRef, useCallback } from 'react';
import { PLANET_META } from '../utils/planets';
import styles from './SolarCanvas.module.css';

const SIZE = 700;
const CENTER = SIZE / 2;

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 60;

function getRingPath(cx, cy, r) {
  return `M ${cx - r * 1.8} ${cy} Q ${cx} ${cy - r * 0.4} ${cx + r * 1.8} ${cy} Q ${cx} ${cy + r * 0.4} ${cx - r * 1.8} ${cy}`;
}

export function SolarCanvas({ planets, selected, onSelect }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const planetMap = useMemo(() => {
    const m = {};
    for (const p of planets) {
      const key = p.planet?.name || p.planet;
      m[key] = p;
    }
    return m;
  }, [planets]);

  const KM_PER_AU = 149597871;
  const AU_TO_PX = 14;

  function toCanvas(xKm, yKm) {
    const xAU = xKm / KM_PER_AU;
    const yAU = yKm / KM_PER_AU;
    return {
      cx: CENTER + (xAU * AU_TO_PX * zoom) + pan.x,
      cy: CENTER - (yAU * AU_TO_PX * zoom) + pan.y,
    };
  }

  const orbitRadii = useMemo(() =>
    Object.entries(PLANET_META).map(([key, meta]) => ({
      key,
      r: meta.orbitAU * AU_TO_PX,
    })), []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const visibleAU = (SIZE / 2 / (AU_TO_PX * zoom)).toFixed(1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.zoomBar}>
        <span className={styles.zoomLabel}>Zoom</span>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.05}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className={styles.zoomSlider}
        />
        <span className={styles.zoomValue}>{zoom.toFixed(1)}×</span>
        <span className={styles.visibleAU}>{visibleAU} AU visíveis</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={styles.svg}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => { dragging.current = false; }}
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        aria-label="Posições em tempo real dos planetas do sistema solar"
      >
        <defs>
          {Object.entries(PLANET_META).map(([key, meta]) => (
            <radialGradient key={key} id={`glow-${key}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={meta.glow} stopOpacity="0.9" />
              <stop offset="60%"  stopColor={meta.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8d0" stopOpacity="1" />
            <stop offset="40%"  stopColor="#ffcc00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
          </radialGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="canvas-clip">
            <rect x="0" y="0" width={SIZE} height={SIZE} />
          </clipPath>
        </defs>

        {useMemo(() => Array.from({ length: 120 }, (_, i) => {
          const x = (i * 137.508) % SIZE;
          const y = (i * 97.317 + 50) % SIZE;
          const r = i % 5 === 0 ? 1.2 : 0.7;
          const op = 0.3 + (i % 7) * 0.1;
          return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={op} />;
        }), [])}

        <g clipPath="url(#canvas-clip)">
          {orbitRadii.map(({ key, r }) => (
            <circle
              key={key}
              cx={CENTER + pan.x}
              cy={CENTER + pan.y}
              r={r * zoom}
              fill="none"
              stroke={selected === key ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)'}
              strokeWidth={selected === key ? 0.8 : 0.4}
              strokeDasharray={selected === key ? '4 4' : '2 4'}
            />
          ))}

          <circle cx={CENTER + pan.x} cy={CENTER + pan.y} r={40 * Math.min(zoom, 2)} fill="url(#sun-glow)" />
          <circle cx={CENTER + pan.x} cy={CENTER + pan.y} r={16 * Math.min(zoom, 2)} fill="#fff7c0" filter="url(#blur-glow)" />
          <circle cx={CENTER + pan.x} cy={CENTER + pan.y} r={12 * Math.min(zoom, 2)} fill="#ffdd00" />

          {Object.entries(PLANET_META).map(([key, meta]) => {
            const data = planetMap[key];
            if (!data) return null;
            const { cx, cy } = toCanvas(data.x, data.y);
            const isSelected = selected === key;
            const r = Math.max(2.5, meta.radius * Math.min(zoom * 0.5, 1.8));
            const glowR = r * 3.5;
            const showLabel = zoom > 0.7;

            return (
              <g
                key={key}
                onClick={() => { onSelect(key); setTooltip(null); }}
                onMouseEnter={() => setTooltip({ key, cx, cy, data })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
                className={styles.planetGroup}
              >
                <circle cx={cx} cy={cy} r={glowR} fill={`url(#glow-${key})`} opacity={isSelected ? 1 : 0.6} />

                {isSelected && (
                  <circle
                    cx={cx} cy={cy}
                    r={r + 7}
                    fill="none"
                    stroke={meta.color}
                    strokeWidth={1.5}
                    opacity={0.8}
                    className={styles.selectionRing}
                  />
                )}

                {key === 'SATURN' && (
                  <path
                    d={getRingPath(cx, cy, r)}
                    fill="none"
                    stroke={meta.color}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={0.6}
                  />
                )}

                <circle cx={cx} cy={cy} r={r} fill={meta.color} />

                {showLabel && (
                  <text
                    x={cx}
                    y={cy - r - 7}
                    textAnchor="middle"
                    fontSize={isSelected ? 11 : 9.5}
                    fill={isSelected ? meta.color : 'rgba(255,255,255,0.55)'}
                    fontFamily="'Space Mono', monospace"
                    fontWeight={isSelected ? 700 : 400}
                    letterSpacing="0.05em"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {meta.label.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}

          {tooltip && (() => {
            const { key, cx, cy, data } = tooltip;
            const meta = PLANET_META[key];
            const KM_PER_AU = 149597871;
            const dist = (Math.sqrt(data.x * data.x + data.y * data.y + (data.z || 0) * (data.z || 0)) / KM_PER_AU).toFixed(3);            const bw = 160;
            const bh = 80;
            const bx = cx + 14;
            const by = cy - 10;
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={bx} y={by}
                  width={bw} height={bh}
                  rx={6} ry={6}
                  fill="rgba(10,14,28,0.92)"
                  stroke={meta.color}
                  strokeWidth={1}
                  opacity={0.97}
                />
                <text x={bx + 12} y={by + 20} fontSize={11} fill={meta.color} fontFamily="'Space Mono', monospace" fontWeight={700}>{meta.label.toUpperCase()}</text>
                <text x={bx + 12} y={by + 36} fontSize={9.5} fill="rgba(255,255,255,0.7)" fontFamily="'Space Mono', monospace">X: {(data.x / 149597871).toFixed(3)} AU</text>
                <text x={bx + 12} y={by + 50} fontSize={9.5} fill="rgba(255,255,255,0.7)" fontFamily="'Space Mono', monospace">Y: {(data.y / 149597871).toFixed(3)} AU</text>
                <text x={bx + 12} y={by + 65} fontSize={9.5} fill="rgba(255,255,255,0.7)" fontFamily="'Space Mono', monospace">Dist. Sol: {dist} AU</text>
              </g>
            );
          })()}
        </g>

        <text x={12} y={SIZE - 10} fontSize={9} fill="rgba(255,255,255,0.25)" fontFamily="'Space Mono', monospace">
          VISTA HELIOCÊNTRICA · PLANO XY
        </text>
      </svg>
    </div>
  );
}