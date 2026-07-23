import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Sale, SaleStreamClient } from '../types';
import { createMockSaleStreamClient } from '../api/salesStream';

// Genuinely append-only, unlike tickerStore.immer.ts's upsert-by-campaignId
// (see the earlier "how do you control a real-time list" discussion) — each
// sale is a new, distinct event, there's no id to overwrite. The cap here
// IS the control mechanism: drop the oldest once the feed exceeds MAX_SALES,
// so the list stays bounded no matter how long the stream's been open.
const MAX_SALES = 25;

let streamClient: SaleStreamClient | null = null;

interface SalesFeedState {
  sales: Sale[]; // newest first
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  _applySale: (sale: Sale) => void;
}

export const useSalesFeedStore = create<SalesFeedState>()(
  devtools(
    immer((set, get) => ({
      sales: [],
      isConnected: false,

      connect: () => {
        if (get().isConnected) return; // idempotent guard
        streamClient = createMockSaleStreamClient();
        streamClient.connect(sale => get()._applySale(sale));
        set(state => {
          state.isConnected = true;
        }, false, 'salesFeed/connect');
      },

      disconnect: () => {
        streamClient?.disconnect();
        streamClient = null;
        set(state => {
          state.isConnected = false;
        }, false, 'salesFeed/disconnect');
      },

      _applySale: (sale: Sale) =>
        set(state => {
          state.sales.unshift(sale);
          if (state.sales.length > MAX_SALES) {
            state.sales.length = MAX_SALES; // drop the oldest, keep the array bounded
          }
        }, false, 'salesFeed/applySale'),
    })),
    { name: 'SalesFeedStore' },
  ),
);
