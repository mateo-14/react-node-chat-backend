const { Router } = require('express');
const { onlineUsers } = require('../ws');
const jwt = require('../jwt');
const router = Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization?.split(' ');
  if (authHeader?.length !== 2) return res.sendStatus(401);

  jwt
    .verify(authHeader[1])
    .then(({ username }) => {
      req.username = username;
      next();
    })
    .catch(() => res.sendStatus(401));
}

router.post('/:username/messages', authMiddleware, (req, res) => {
  const { username } = req.params;
  if (req.username === username) return res.sendStatus(400);

  const userWS = onlineUsers.get(username);
  if (!userWS) return res.sendStatus(404);

  const { message } = req.body;
  const data = { message, date: new Date(), username: req.username };
  userWS.send(JSON.stringify(data));
  res.json(data);
});

module.exports = router;
