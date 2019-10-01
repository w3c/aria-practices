/** @type {!Element} Meter element. */
let meterEl;
/** @type {!Element} Element visually filling the meter. */
let visualFillEl;
/** @type {number} Minimum value. */
let minUsage;
/** @type {number} Maximum value. */
let maxUsage;
/** @type {number} Current value. */
let usage;

/** Set the value randomly between the minimum and maximum. */
function randomizeUsage() {
  const range = maxUsage - minUsage;
  usage = Math.floor((Math.random() * range) + minUsage);
  meterEl.setAttribute('aria-valuenow', usage);
  render();
}
function render() {
  const asPercentage = (100 * usage) / (maxUsage - minUsage);
  visualFillEl.style.width = asPercentage + '%';
}
function init() {
  meterEl = document.querySelector('[role=meter]');
  visualFillEl = document.getElementById('fill');
  minUsage = Number(meterEl.getAttribute('aria-valuemin'));
  maxUsage = Number(meterEl.getAttribute('aria-valuemax'));
  usage = Number(meterEl.getAttribute('aria-valuenow'));
  render();
  setInterval(randomizeUsage, 5000);
}
window.addEventListener('load', init, false);
