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
 *
 * @example
 * // On macOS, translates CONTROL to META (Command key)
 * translatePlatformKey(Key.CONTROL)
 * // Returns: [Key.META]
 *
 * // On non-macOS systems, returns key unchanged
 * translatePlatformKey(Key.CONTROL)
 * // Returns: [Key.CONTROL]
 *
 * // Works with arrays of keys for key combinations
 * translatePlatformKey([Key.CONTROL, 'a'])
 * // Returns on macOS: [Key.META, 'a']
 * // Returns on Windows/Linux: [Key.CONTROL, 'a']
 *
 * // Usage with Selenium WebDriver:
 * const selectAllKeys = translatePlatformKey([Key.CONTROL, 'a']);
 * const selectAllChord = Key.chord(...selectAllKeys);
 * await element.sendKeys(selectAllChord);
 */
function translatePlatformKeys(keys) {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  if (!isMacOS()) {
    return keyArray;
  }

  return keyArray.reduce((acc, key) => {
    const mappedKey = MAC_KEY_MAPPINGS[key] || key;
    return acc.concat(mappedKey);
  }, []);
}

module.exports = translatePlatformKeys;
