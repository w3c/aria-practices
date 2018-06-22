'use strict';
const http = require('http');

function makeServer(port) {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end();
  });
  const release = () => {
    return new Promise((resolve, reject) => {
      server.close((err) => err ? reject(err) : resolve());
    });
  };

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(release));
    server.on('error', () => resolve(false));
  });
}

module.exports = function isolate(port, safe) {
  return makeServer(port)
    .then((release) => {
      if (!release) {
        return new Promise((resolve) => setTimeout(resolve, 300))
          .then(() => isolate(port, safe));
      }
      const operation = new Promise((resolve) => resolve(operation()));

      return operation
        .then(release, release)
        .then(() => operation);
    });
};
