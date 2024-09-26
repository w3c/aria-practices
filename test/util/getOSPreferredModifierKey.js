const { Key } = require('selenium-webdriver');
const isMacOS = require('./isMacOS');

module.exports = function getOSPreferredModifierKey() {
  return isMacOS() ? Key.META : Key.CONTROL;
};
