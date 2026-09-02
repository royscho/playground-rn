import { Platform } from 'react-native';
import { Sale, SaleStreamClient } from '../types';

const SSE_PORT = 8083;

// Same Android-emulator-vs-iOS-simulator host quirk as salesStream.ts.
const getSseHost = () => (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

// RN's `fetch` has no ReadableStream/streaming-body support (no
// `response.body.getReader()`), so a manual EventSource can't be built on
// top of it. `XMLHttpRequest` — RN's other built-in global, no library
// needed — fires `onprogress` with the response text accumulated so far,
// which is enough to parse SSE frames as they arrive. This is the same
// technique dedicated RN SSE libraries use internally.
export const createMockSaleStreamClientSse = (): SaleStreamClient => {
  let xhr: XMLHttpRequest | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let shouldReconnect = false;

  const openStream = (onSale: (sale: Sale) => void) => {
    xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${getSseHost()}:${SSE_PORT}`);

    let processedLength = 0;

    xhr.onprogress = () => {
      const chunk = xhr!.responseText.slice(processedLength);
      processedLength = xhr!.responseText.length;

      // SSE frames are separated by a blank line; each frame here is a
      // single `data: {...}` line (no multi-line data, no event/id fields).
      chunk
        .split('\n\n')
        .map(frame => frame.trim())
        .filter(frame => frame.startsWith('data: '))
        .forEach(frame => {
          try {
            const sale: Sale = JSON.parse(frame.slice('data: '.length));
            onSale(sale);
          } catch {
            // Malformed/partial frame — drop it, don't crash the stream.
          }
        });
    };

    // Fires on both a real network error and the server closing the
    // connection — reconnect logic only needs to live in one place.
    xhr.onloadend = () => {
      if (shouldReconnect) {
        reconnectTimeout = setTimeout(() => openStream(onSale), 2000);
      }
    };

    xhr.send();
  };

  return {
    connect(onSale: (sale: Sale) => void) {
      shouldReconnect = true;
      openStream(onSale);
    },
    disconnect() {
      shouldReconnect = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      xhr?.abort();
      xhr = null;
    },
  };
};
