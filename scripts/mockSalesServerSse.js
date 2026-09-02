// Plain Node script, not bundled into the app — mirrors mockSalesServer.js
// but speaks Server-Sent Events (plain HTTP, `text/event-stream`) instead
// of WebSocket, so the SSE client can be exercised against a real stream.
const http = require('http');

const PORT = 8083;
const PRODUCTS = ['Hoodie', 'Sneakers', 'Tote Bag', 'Water Bottle', 'Cap2'];
const CUSTOMERS = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan'];

const generateSale = () => ({
  id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
  productName: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  amount: Math.round(Math.random() * 180 + 20),
  timestamp: Date.now(),
});

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  console.log('[mock-sales-sse-server] client connected');

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(generateSale())}\n\n`);
  }, 1500 + Math.random() * 1500);

  req.on('close', () => {
    console.log('[mock-sales-sse-server] client disconnected');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`[mock-sales-sse-server] listening on http://localhost:${PORT}`);
  console.log(
    '[mock-sales-sse-server] Android emulator: connect via http://10.0.2.2:8083 (10.0.2.2 is the AVD alias for host localhost)',
  );
});
