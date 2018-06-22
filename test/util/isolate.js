'use strict';
const http = require('http');

function makeServer(port) {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end();
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(() => server.close()));
    server.on('error', () => resolve(false));
  });
}

module.exports = function isolate(port, safe) {
  return makeServer(port)
    .then((close) => {
	  if (!close) {
		return new Promise((resolve) => setTimeout(resolve, 300))
		  .then(() => isolate(port, safe));
	  }
      let result, error, rejected;

      return Promise.resolve(safe())
        .then((r) => result = r, (e) => { rejected = true; error = e; })
		.then(close)
        .then(() => {
          if (rejected) {
            throw error;
          }
		  return result;
        });
    }, () => isolate(port, safe));
};
