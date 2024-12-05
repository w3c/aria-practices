const { Key } = require('selenium-webdriver');
const isMacOS = require('./isMacOS');

const MAC_KEY_MAPPINGS = {
  [Key.CONTROL]: Key.META,
};

/**
 * Translates a key or key combination for the current OS
 *
 * @param {string|string[]} keys - The key(s) to translate
 * @returns {string[]} - The translated key(s) as a flat array ready for spreading
 */
function translatePlatformKey(keys) {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  if (!isMacOS()) {
    return keyArray;
  }

  return keyArray.reduce((acc, key) => {
    const mappedKey = MAC_KEY_MAPPINGS[key] || key;
    return acc.concat(mappedKey);
  }, []);
}

module.exports = translatePlatformKey;
