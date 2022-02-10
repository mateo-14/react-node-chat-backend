const { WebSocketServer } = require('ws');

let wss;

module.exports =
  wss ||
  ((server) => {
    console.log('Instance WebSocketServer');
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
      ws.send('nashe');
    });
  });
