/**
 * Returns true if the current platform is macOS
 *
 * @returns {boolean}
 */
module.exports = function isMacOS() {
  return process.platform === 'darwin';
};
