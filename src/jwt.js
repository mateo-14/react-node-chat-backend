const jwt = require('jsonwebtoken');

const SECRET = process.env.TOKEN_SECRET;
function sign(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: '2d' }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}
module.exports = { sign, verify };
