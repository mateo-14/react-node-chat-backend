const express = require('express');
const app = express();

app.use(express.json());

function handleRoutes() {
  const authController = require('./controllers/auth');
  const chatsController = require('./controllers/chats');

  app.use('/auth', authController);
  app.use('/chats', chatsController);
}

module.exports = { app, handleRoutes };
