const assert = require('assert');
const { start } = require('geckodriver');
const find = require('find-process');

const getJSON = require('./get-json');
const forceSerial = require('./force-serial');
const waitPort = require('wait-port');
const SERIES_LOCK = 8432;

const startOnPort = async (port, timeout) => {
  if (timeout < 0) {
    return Promise.reject(
      new Error('Timed out while locating free port for WebDriver server')
    );
  }

  const startTime = Date.now();
  // Start Geckodriver
  const cp = await start({ port, log: 'fatal' });
  await waitPort({ port });

  return new Promise((resolve, reject) => {
    let stopPolling = false;
    const giveUp = () => {
      stopPolling = true;
      resolve(null);
    };

    find('port', port).then(function (list) {
      if (list.length) {
        giveUp();
      }
    });

    (function poll() {
      if (stopPolling) {
        return;
      }

      if (timeout - (Date.now() - startTime) < 0) {
        reject(new Error('Timed out while waiting for WebDriver server'));
        return;
      }

      getJSON('http://127.0.0.1:' + port + '/status')
        .then((data) => {
          assert(data.value.ready);
          find('port', port).then(function (list) {
            if (!list.length) {
              stopPolling = true;
            }
          });
          resolve(() => cp.kill());
        })
        .catch(() => setTimeout(poll, 500));
    })();
  });
};

const startOnAnyPort = (port, timeout) => {
  const start = Date.now();

  return startOnPort(port, timeout).then(function (stop) {
    if (!stop) {
      return startOnAnyPort(port + 1, timeout - (Date.now() - start));
    }
    return { stop, port };
  });
};

/**
 * Start a GeckoDriver server using a dynamically-determined available TCP/IP
 * port.
 *
 * @param {number} port - the TCP/IP port from which to begin search
 * @param {number} timeout - the number of milliseconds to attempt to create a
 *                           server before reporting a failure
 * @returns {Promise<object>} - an eventual value for interfacing with the
 *                               server. The `port` property is the numeric
 *                               TCP/IP port to which the server is bound. The
 *                               `stop` property is a function for destroying
 *                               the server.
 */
module.exports = (port, timeout) => {
  return forceSerial(SERIES_LOCK, () => startOnAnyPort(port, timeout));
};
