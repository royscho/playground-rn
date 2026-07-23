import { Sale, SaleStreamClient } from '../types';

const PRODUCTS = ['Hoodie', 'Sneakers', 'Tote Bag', 'Water Bottle', 'Cap'];
const CUSTOMERS = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan'];

const generateFakeSale = (): Sale => ({
  id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
  productName: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  amount: Math.round(Math.random() * 180 + 20),
  timestamp: Date.now(),
});

// Deliberately different shape from tickerStream.ts: each event is a NEW
// discrete sale, not an update to an existing entity — there's no key to
// upsert on. This is the genuinely append-only case; the store is what
// caps growth (ring buffer), not the stream itself.
export const createMockSaleStreamClient = (): SaleStreamClient => {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    connect(onSale: (sale: Sale) => void) {
      intervalId = setInterval(
        () => onSale(generateFakeSale()),
        1500 + Math.random() * 1500,
      );
    },
    disconnect() {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    },
  };
};
