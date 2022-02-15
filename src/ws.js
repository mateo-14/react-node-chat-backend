const { WebSocketServer } = require('ws');
const jwt = require('./jwt');

function send(ws, type, payload) {
  ws.send(JSON.stringify({ type, payload }));
}

module.exports.init = (server) => {
  const wss = new WebSocketServer({ server });
  const onlineUsers = new Map();

  function sendAll(type, payload) {
    onlineUsers.forEach((ws) => send(ws, type, payload));
  }

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const { type, payload } = JSON.parse(data);
        if (type === 'auth') {
          jwt
            .verify(payload)
            .then(({ user }) => {
              sendAll('user_connected', { user });
              onlineUsers.set(user, ws);
              send(ws, 'auth', {
                users: Array.from(onlineUsers.keys()).filter((_user) => _user !== user),
              });
              console.log(`${user} ws auth with token`);
              ws.on('close', () => {
                onlineUsers.delete(user);
                sendAll('user_disconnected', { user });
                console.log(`${user} disconnected`);
              });
            })
            .catch(() => {
              send(ws, 'auth', { authenticated: false });
              ws.close();
            });
        } else if (type === 'ping') {
          send(ws, 'pong'); //Avoid heroku timeout
        }
      } catch {}
    });
  });

  module.exports.wss = wss;
  module.exports.onlineUsers = onlineUsers;
};
