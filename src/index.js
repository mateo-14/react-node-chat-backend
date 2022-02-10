const app = require('./app');
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

require('./ws')(server);

const router = require('./router');
app.use('/ruta', router);