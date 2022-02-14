const { Router } = require('express');
const jwt = require('../jwt');

const router = Router();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

router.post('/', (req, res) => {
  if (!req.body.username) return res.sendStatus(400);

  const username = `${req.body.username}#${getRandomInt(1000, 10000)}`;
  jwt
    .sign({ user: username })
    .then((token) => res.json({ username, token }))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
