var DateInput = function (domNode) {
  this.domNode = domNode;

};

DateInput.prototype.init = function () {
  console.log(this.domNode);
  console.log(document.activeElement);
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));

};
DateInput.prototype.handleFocus = function () {
  this.open();
};
DateInput.prototype.open = function () {
  var cal = document.getElementsByClassName('datepicker')[0];
  cal.style.display = 'block';
  this.domNode.setAttribute('aria-expanded', true);

};
DateInput.prototype.close = function () {
  var cal = document.getElementsByClassName('datepicker')[0];
  cal.style.display = 'none';
  this.domNode.removeAttribute('aria-expanded');

};
