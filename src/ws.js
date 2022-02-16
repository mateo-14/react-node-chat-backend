const { WebSocketServer } = require('ws');
const jwt = require('./jwt');

function send(ws, type, payload) {
  ws.send(JSON.stringify({ type, payload }));
}

module.exports.init = (server) => {
  const wss = new WebSocketServer({ server });

  function sendAll(type, payload) {
    wss.clients.forEach((ws) => send(ws, type, payload));
  }

  wss.on('connection', (ws) => {
    console.log('New ws');
    ws.on('message', (data) => {
      try {
        const { type, payload } = JSON.parse(data);
        if (type === 'auth') {
          jwt
            .verify(payload)
            .then(({ user }) => {
              sendAll('user_connected', { user });
              ws.user = user;

              send(ws, 'auth', {
                users: Array.from(wss.clients.values())
                  .map(({ user }) => user)
                  .filter((_user) => _user && _user !== user),
              });

              console.log(`${user} ws auth with token`);

              ws.on('close', () => {
                if (!Array.from(wss.clients.values()).some(({ user }) => user === ws.user)) {
                  sendAll('user_disconnected', { user });
                  console.log(`${user} disconnected`);
                }
              });
            })
            .catch(() => {
              ws.close();
            });
        } else if (type === 'ping') {
          send(ws, 'pong'); //Avoid heroku timeout
        }
      } catch {}
    });
  });

  module.exports.wss = wss;
};
