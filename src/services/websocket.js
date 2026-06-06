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
        const received = Date.now();
        const data = JSON.parse(msg.body);
        console.log("Payload:", JSON.stringify(data[0]));
        const sent = new Date(data[0].timestamp).getTime();
        console.log("Latência WebSocket:", received - sent, "ms");
        onPlanets(data);
      });
    },
    onDisconnect: () => onDisconnect?.(),
    onStompError: (frame) => onError?.(frame),
    onWebSocketError: (err) => onError?.(err),
  });
  return client;
}
