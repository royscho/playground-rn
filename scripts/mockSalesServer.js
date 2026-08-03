// Plain Node script, not bundled into the app — RN's WebSocket global is
// client-only, so a real WebSocket server has to live here and run
// separately (`yarn mock:sales`) while the app connects to it as a client.
const { WebSocketServer } = require('ws');

const PORT = 8082;
const PRODUCTS = ['Hoodie', 'Sneakers', 'Tote Bag', 'Water Bottle', 'Cap2'];
const CUSTOMERS = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan'];

const generateSale = () => ({
  id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
  productName: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  amount: Math.round(Math.random() * 180 + 20),
  timestamp: Date.now(),
});

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', socket => {
  console.log('[mock-sales-server] client connected');

  const interval = setInterval(() => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(generateSale()));
    }
  }, 1500 + Math.random() * 1500);

  socket.on('close', () => {
    console.log('[mock-sales-server] client disconnected');
    clearInterval(interval);
  });
});

console.log(`[mock-sales-server] listening on ws://localhost:${PORT}`);
console.log(
  '[mock-sales-server] Android emulator: connect via ws://10.0.2.2:8082 (10.0.2.2 is the AVD alias for host localhost)',
);
