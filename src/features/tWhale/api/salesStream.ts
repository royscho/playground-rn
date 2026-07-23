import { Platform } from 'react-native';
import { Sale, SaleStreamClient } from '../types';

const WS_PORT = 8082;

// Android emulator can't reach the host machine's `localhost` — 10.0.2.2 is
// the AVD's special alias back to it. iOS simulator shares the host's
// network stack, so `localhost` works directly. A physical device would
// need the machine's LAN IP instead of either of these.
const getWsHost = () => (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

// Real WebSocket client (RN's built-in global, no library needed) against
// scripts/mockSalesServer.js — run `yarn mock:sales` in a separate terminal
// before connecting. Deliberately kept behind the same connect/disconnect
// interface as the setInterval-based tickerStream.ts, so the store doesn't
// know or care which transport is underneath.
export const createMockSaleStreamClient = (): SaleStreamClient => {
  let ws: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let shouldReconnect = false;

  const openSocket = (onSale: (sale: Sale) => void) => {
    ws = new WebSocket(`ws://${getWsHost()}:${WS_PORT}`);

    ws.onmessage = event => {
      try {
        const sale: Sale = JSON.parse(event.data);
        onSale(sale);
      } catch {
        // Malformed message from the mock server — drop it, don't crash the stream.
      }
    };

    // onclose fires after onerror too (RN's WebSocket implementation), so
    // reconnect logic only needs to live in one place.
    ws.onclose = () => {
      if (shouldReconnect) {
        reconnectTimeout = setTimeout(() => openSocket(onSale), 2000);
      }
    };
  };

  return {
    connect(onSale: (sale: Sale) => void) {
      shouldReconnect = true;
      openSocket(onSale);
    },
    disconnect() {
      shouldReconnect = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
      ws = null;
    },
  };
};
