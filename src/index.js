const { WebSocketServer } = require('ws');
const app = require('./app');

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log(`Ws connected ${ws}`);
});
