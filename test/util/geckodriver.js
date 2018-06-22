'use strict';
const assert = require('assert');
const { path: binaryPath } = require('geckodriver');
const { spawn } = require('child_process');
const http = require('http');
const isolate = require('./isolate');


function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      let error;

      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }

      if (error) {
        reject(error);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

module.exports = (port, timeout) => isolate(8432, () => _thing(port, timeout));

const _thing = (port, timeout) => {
  if (timeout < 0) {
    return Promise.reject(new Error(
      'Timed out while locating free port for WebDriver server'
    ));
  }

  const start = Date.now();
  const child = spawn(binaryPath, ['--port', port]);

  return new Promise((resolve, reject) => {
    let stopPolling = false;
    function tryNext() {
      stopPolling = true;
      _thing(port + 1, timeout - (Date.now() - start))
        .then(resolve, reject);
    }

    child.on('close', tryNext);

    (function poll() {
      if (stopPolling) {
        return;
      }

      if (timeout - (Date.now() - start) < 0) {
        reject(new Error('Timed out while waiting for WebDriver server'));
        return;
      }

      getJSON('http://localhost:' + port + '/status')
        .then((data) => {
          assert(data.value.ready);

          child.removeListener('close', tryNext);
          resolve({
            port: port,
            stop: () => child.kill()
          });
        })
        .catch(() => setTimeout(poll, 500));
    }());
  });
};
