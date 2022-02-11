require('dotenv').config();
const http = require('./http');

const PORT = process.env.PORT || 8080;
const server = http.app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

require('./ws').init(server);
http.handleRoutes();
