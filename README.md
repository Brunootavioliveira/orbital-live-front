# orbital-live-front

Interface web em tempo real das posições dos planetas do sistema solar, usando dados da NASA JPL Horizons.

**Live:** https://orbital-live-front.brunootavioliveira.workers.dev

---

## Tecnologias

- React 19 + Vite
- CSS Modules
- STOMP / SockJS (WebSocket)
- Hospedado no Cloudflare Pages (Workers)

---

## Funcionalidades

- Mapa heliocêntrico SVG com posições reais dos planetas (plano XY eclíptico)
- Zoom com scroll do mouse e slider; pan arrastando o canvas
- Tooltip com coordenadas X, Y e distância do Sol ao passar o mouse sobre um planeta
- Painel lateral com detalhes do planeta selecionado
- Atualização em tempo real via WebSocket (fallback para polling REST a cada 30s)
- Badge de status da conexão (live / polling / offline)

---

## Estrutura

```
src/
├── components/
│   ├── SolarCanvas.jsx       # Mapa SVG interativo
│   ├── PlanetPanel.jsx       # Painel lateral de detalhes
│   ├── PlanetList.jsx        # Lista de planetas no rodapé
│   ├── StatusBadge.jsx       # Indicador de conexão
│   └── OfflineBanner.jsx     # Banner de modo offline
├── hooks/
│   └── usePlanetPositions.js # Hook de dados (WebSocket + REST)
├── services/
│   ├── api.js                # Chamadas REST
│   └── websocket.js          # Cliente STOMP
└── utils/
    └── planets.js            # Metadados e utilitários dos planetas
```

---

## Instalação

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

---

## Build

```bash
npm run build
```

O output é gerado em `dist/`.

---

## Configuração

A URL do backend está definida em `src/services/api.js`:

```js
const BASE_URL = 'https://orbital-live-production.up.railway.app';
```

Para apontar para um backend local, altere para `http://localhost:8080`.

---

## Backend

O backend que alimenta este frontend está em:
https://github.com/Brunootavioliveira/orbital-live