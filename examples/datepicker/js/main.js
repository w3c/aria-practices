window.addEventListener('load' , function () {


  var datepickers = document.getElementsByClassName('datepicker');

  for (var i = 0; i < datepickers.length; i++) {
    console.log(datepickers[i].firstElementChild);
    var dp = new DatePicker(datepickers[i].firstElementChild, datepickers[i]);
    dp.init();
  }
});
