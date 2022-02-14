const { Router } = require('express');
const { onlineUsers } = require('../ws');
const jwt = require('../jwt');
const { nanoid } = require('nanoid');
const router = Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization?.split(' ');
  if (authHeader?.length !== 2) return res.sendStatus(401);

  jwt
    .verify(authHeader[1])
    .then(({ user }) => {
      req.user = user;
      next();
    })
    .catch(() => res.sendStatus(401));
}

router.get('/users', authMiddleware, (req, res) => {
  res.json(Array.from(onlineUsers.keys()).filter((user) => user !== req.user));
});

router.post('/:to/messages', authMiddleware, (req, res) => {
  const { to } = req.params;
  if (req.user === to) return res.sendStatus(400);

  const userWS = onlineUsers.get(to);
  if (!userWS) return res.sendStatus(404);

  const { message } = req.body;

  if (!message.trim().length) return res.sendStatus(400);
  
  const payload = {
    message: message.trim(),
    timestamp: Date.now(),
    author: req.user,
    to,
    id: nanoid(),
  };

  userWS.send(JSON.stringify({ type: 'new_message', payload }));
  res.json(payload);
});

module.exports = router;
