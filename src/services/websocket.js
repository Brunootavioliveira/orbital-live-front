import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'https://orbital-live-production.up.railway.app/ws';

export function createSolarClient({ onPlanets, onConnect, onDisconnect, onError }) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      onConnect?.();
      client.subscribe('/topic/planets', (msg) => {
        const data = JSON.parse(msg.body);
        onPlanets(data);
      });
    },
    onDisconnect: () => onDisconnect?.(),
    onStompError: (frame) => onError?.(frame),
    onWebSocketError: (err) => onError?.(err),
  });
  return client;
}
