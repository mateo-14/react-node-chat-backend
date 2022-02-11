const { WebSocketServer } = require('ws');
const jwt = require('./jwt');

module.exports.init = (server) => {
  console.log('Instance WebSocketServer');
  const wss = new WebSocketServer({ server });
  const onlineUsers = new Map();

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const { type, payload } = JSON.parse(data);
        if (type === 'auth') {
          jwt
            .verify(payload)
            .then(({ username }) => {
              onlineUsers.set(username, ws);
              console.log(`${username} ws auth with token`);
              ws.on('close', () => onlineUsers.delete(username));
            })
            .catch(() => {});
        }
      } catch {}
    });
  });

  module.exports.wss = wss;
  module.exports.onlineUsers = onlineUsers;
};
