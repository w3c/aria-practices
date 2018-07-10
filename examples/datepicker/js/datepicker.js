var DatePicker  = function (domNode) {

  this.calender= domNode;
  this.date = null;
  this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

};

DatePicker.prototype.init = function() {
  console.log(this.calender);
  this.calender.find("#prev").addEventListener('click', this.handlePrevClick(this));
};

