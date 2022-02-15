const { WebSocketServer } = require('ws');
const jwt = require('./jwt');

function send(ws, type, payload) {
  ws.send(JSON.stringify({ type, payload }));
}

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
            .then(({ user }) => {
              onlineUsers.set(user, ws);
              console.log(`${user} ws auth with token`);
              send(ws, 'auth', {
                authenticated: true,
                users: Array.from(onlineUsers.keys()).filter((_user) => _user !== user),
              });
              ws.on('close', () => {
                console.log(`${user} disconnect`);
                onlineUsers.delete(user);
                onlineUsers.forEach((wsUser) => send(wsUser, 'user_disconnect', { user }));
              });
            })
            .catch(() => {
              send(ws, 'auth', { authenticated: false });
              ws.close();
            });
        } else if (type === 'ping') {
          send(ws, 'ping'); //Avoid heroku timeout
        }
      } catch {}
    });
  });

  module.exports.wss = wss;
  module.exports.onlineUsers = onlineUsers;
};
