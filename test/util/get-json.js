const http = require('http');

module.exports = function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, resolve).on('error', reject);
  })
    .then((response) => {
      const { statusCode } = response;
      const contentType = response.headers['content-type'];

      if (statusCode !== 200) {
        // consume response data to free up memory
        response.resume();
        throw new Error(`Request Failed.\nStatus Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        // consume response data to free up memory
        response.resume();
        throw new Error(
          'Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`
        );
      }

      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => {
        rawData += chunk;
      });

      return new Promise((resolve) => {
        response.on('end', () => resolve(rawData));
      });
    })
    .then((rawData) => JSON.parse(rawData));
};
