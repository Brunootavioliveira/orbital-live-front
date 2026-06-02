import { useState, useEffect, useRef, useCallback } from 'react';
import { createSolarClient } from '../services/websocket';
import { fetchAllPlanets } from '../services/api';

export function usePlanetPositions() {
  const [planets, setPlanets] = useState([]);
  const [status, setStatus] = useState('connecting'); // connecting | live | polling | error | offline
  const [lastUpdate, setLastUpdate] = useState(null);
  const clientRef = useRef(null);
  const pollRef = useRef(null);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    setStatus('polling');
    const poll = async () => {
      try {
        const data = await fetchAllPlanets();
        setPlanets(data);
        setLastUpdate(new Date());
        setStatus('polling');
      } catch {
        setStatus('offline');
      }
    };
    poll();
    pollRef.current = setInterval(poll, 30000);
  }, []);

  useEffect(() => {
    // Try REST first for instant data
    fetchAllPlanets()
      .then((data) => {
        setPlanets(data);
        setLastUpdate(new Date());
      })
      .catch(() => {});

    // Then connect WebSocket
    const client = createSolarClient({
      onConnect: () => {
        setStatus('live');
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      },
      onPlanets: (data) => {
        setPlanets(data);
        setLastUpdate(new Date());
      },
      onDisconnect: () => {
        setStatus('connecting');
        startPolling();
      },
      onError: () => {
        setStatus('error');
        startPolling();
      },
    });

    clientRef.current = client;
    client.activate();

    // If WS doesn't connect in 8s, fall back to polling
    const fallbackTimer = setTimeout(() => {
      if (status === 'connecting') startPolling();
    }, 8000);

    return () => {
      clearTimeout(fallbackTimer);
      if (pollRef.current) clearInterval(pollRef.current);
      client.deactivate();
    };
  }, []);

  return { planets, status, lastUpdate };
}
