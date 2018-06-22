'use strict';
const http = require('http');

function bindPort(port) {
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

/**
 * Exceute an asynchronous operation in isolation of any similarly-scheduled
 * operations across processes.
 *
 * @param {Number} port - TCP/IP port to use as a resource lock
 * @param {Function} safe - function that will be executed in isolation
 *
 * @returns {Promise} eventual value which shares the resolution of the
 *                    provided operation
 */
module.exports = function forceSerial(port, safe) {
  return bindPort(port)
    .then((release) => {
      if (!release) {
        return new Promise((resolve) => setTimeout(resolve, 300))
          .then(() => forceSerial(port, safe));
      }
      const operation = new Promise((resolve) => resolve(safe()));

      return operation
        .then(release, release)
        .then(() => operation);
    });
};
