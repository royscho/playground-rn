import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Sale, SaleStreamClient } from '../types';
import { createMockSaleStreamClientSse } from '../api/salesStreamSse';
import { MAX_SALES } from './salesFeedStore';

// Same shape as salesFeedStore.ts, swapped to the SSE transport — kept as
// its own store (rather than a transport flag on the WS one) to match how
// the ticker variants each get their own store for side-by-side comparison.
let streamClient: SaleStreamClient | null = null;

interface SalesFeedSseState {
  sales: Sale[]; // newest first
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  _applySale: (sale: Sale) => void;
}

export const useSalesFeedSseStore = create<SalesFeedSseState>()(
  devtools(
    immer((set, get) => ({
      sales: [],
      isConnected: false,

      connect: () => {
        if (get().isConnected) return; // idempotent guard
        streamClient = createMockSaleStreamClientSse();
        streamClient.connect(sale => get()._applySale(sale));
        set(state => {
          state.isConnected = true;
        }, false, 'salesFeedSse/connect');
      },

      disconnect: () => {
        streamClient?.disconnect();
        streamClient = null;
        set(state => {
          state.isConnected = false;
        }, false, 'salesFeedSse/disconnect');
      },

      _applySale: (sale: Sale) =>
        set(state => {
          state.sales.unshift(sale);
          if (state.sales.length > MAX_SALES) {
            state.sales.length = MAX_SALES; // drop the oldest, keep the array bounded
          }
        }, false, 'salesFeedSse/applySale'),
    })),
    { name: 'SalesFeedSseStore' },
  ),
);
