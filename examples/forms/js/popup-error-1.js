document.addEventListener('DOMContentLoaded', function () {

  var radios = document.querySelectorAll('[type=\'radio\']');
  var checkbox = document.querySelectorAll('[type=\'checkbox\']');
  console.log(radios.length);
  for (var i = 0;i < radios.length;i++) {
    radios[i].addEventListener('focus',function () {
      this.parentNode.classList.add('focus');
    });

    radios[i].addEventListener('blur',function () {
      this.parentNode.classList.remove('focus');
    });
    radios[i].parentNode.addEventListener('mouseover', function () {
      this.parentNode.classList.add('hover');
    });
    radios[i].parentNode.addEventListener('mouseout', function () {
      this.parentNode.classList.remove('hover');
    });
  }

  for (var i = 0;i < checkbox.length;i++) {
    checkbox[i].addEventListener('focus',function () {
      this.parentNode.classList.add('focus');
    });
    checkbox[i].addEventListener('blur', function () {
      this.parentNode.classList.remove('focus');
    });
    checkbox[i].parentNode.addEventListener('mouseover', function () {
      this.parentNode.classList.add('hover');
    });
    checkbox[i].parentNode.addEventListener('mouseout', function () {
      this.parentNode.classList.remove('hover');
    });
  }
});
var clicked = false;
// Scripting for inline form validation
function checkItem (id, flag,message) {
  var em = document.getElementById(id + '-error');
  em.innerHTML = '';
  var ei = document.getElementById(id);

  if (flag) {
    ei.setAttribute('aria-invalid', true);
    em.innerHTML = message;
    em.classList.remove('noerror');
    em.classList.add('error');
  }
  else {
    ei.setAttribute('aria-invalid', false);
    em.classList.add('noerror');
    em.classList.remove('error');
  }
  return flag;
}

function checkName () {
  var ei = document.getElementById('id-name');
  if (clicked) {
    return checkItem('id-name',(ei.value.length === 0),'Name cannot be empty! Enter your name.');
  }
}

function checkAddress () {
  var ei = document.getElementById('id-address');
  if (clicked) {
    return checkItem('id-address',(ei.value.length === 0),'Address cannot be empty! Enter your address.');
  }
}

function checkPhone () {
  var ei = document.getElementById('id-phone');
  var phone = ei.value;
  if (clicked) {
    if (phone.length !== 0) {
      p = '';
      for (var i = 0;i < phone.length;i++) {
        var c = phone[i];
        if ((c >= '0') && (c <= '9')) {
          p += c;
        }
      }
      return checkItem('id-phone', ((p.length !== 7) && (p.length !== 10)),'Not a valid phone number, use this format (111) 222-3333.');
    }
    else {
      return checkItem('id-phone', ((phone.length === 0)), 'Phone Cannot be emprt! Enter your phone number with (111) 222-3333 format.');
    }
  }
}

function checkMethod () {
  var val = document.getElementById('id-delivery');
  var str = val.options[val.selectedIndex].value;
  if (clicked) {
    return checkItem('id-delivery',(str === 'Choose your Method'), 'Choose the Delivery Method.');
  }
}

function checkSize () {
  var ei = document.getElementById('id-size');
  var small = document.getElementById('id-small').checked;
  var medium = document.getElementById('id-medium').checked;
  var large = document.getElementById('id-large').checked;
  if (clicked) {
    if (!(small || medium || large)) {
      return checkItem('id-size', !(small || medium || large), 'Choose the size of your pizza');
    }
    else {
      return checkItem('id-size', false, '');
    }
  }
}

function checkCrust () {
  var ei = document.getElementById('id-crust');
  var thin = document.getElementById('id-thin');
  var classic = document.getElementById('id-classic');
  var deep = document.getElementById('id-deep');
  if (clicked) {
    if (!(thin.checked || classic.checked || deep.checked)) {
      return checkItem('id-crust',!(thin.checked || classic.checked || deep.checked), 'Choose your Crust.');

    }
    else {
      return checkItem('id-crust',false, '');
    }
  }
}
function submitOrder () {
  clicked = true;
  var nameFlag = checkName();
  var addressFlag = checkAddress();
  var phoneFlag = checkPhone();
  var methodFlag = checkMethod();
  var sizeFlag = checkSize();
  var crustFlag = checkCrust();
  if (nameFlag) {
    document.getElementById('id-name').focus();
  }
  else if (addressFlag) {
    document.getElementById('id-address').focus();
  }
  else if (phoneFlag) {
    document.getElementById('id-phone').focus();
  }
  else if (methodFlag) {
    document.getElementById('id-delivery').focus();
  }
  else if (sizeFlag) {
    document.getElementById('id-small').focus();
  }
  else if (crustFlag) {
    document.getElementById('id-thin').focus();
  }
  else {
    var price = 0;
    var str = '';

    if (window.confirm('Are you sure to submit')) {
      var sizeRadio = document.getElementsByName('size');
      var crustRadio = document.getElementsByName('crust');
      var toppingCheckbox = document.getElementsByName('topping');
      var toppingFlag = false;
      if (document.getElementById('id-delivery').value === 'Home delivery') {
        str += 'Delivery to Address: ' + document.getElementById('id-address').value + '\n';
        price += 2;
      }
      else {
        str += 'Delivery Method: N/A ' + '\n';
      }
      for (var i = 0; i < sizeRadio.length;i++) {
        if (sizeRadio[i].checked) {
          str += 'Pizza Size: ' + sizeRadio[i].value + '\n';
          price += parseInt(sizeRadio[i].getAttribute('price'));
        }
      }

      for (var i = 0; i < crustRadio.length; i++) {
        if (crustRadio[i].checked) {
          str += 'Pizze Crust: ' + crustRadio[i].value + '\n';
          if (crustRadio[i].value === 'Deep Dish') {
            price += 1;
          }
        }
      }

      str += 'Topping: ';
      for (var i = 0; i < toppingCheckbox.length; i++) {
        if (toppingCheckbox[i].checked) {
          toppingFlag = true;
          str += toppingCheckbox[i].value + '\n';
        }
      }
      if (!toppingFlag) {
        str += 'None' + '\n';
      }
      window.alert(str);
    }
    else {
      window.alert('Your order has been cancelled');
    }
  }
}

function priceChange () {
  var price = 0;
  var sizeRadio = document.getElementsByName('size');
  var crustRadio = document.getElementsByName('crust');
  var toppingCheckbox = document.getElementsByName('topping');
  if (document.getElementById('id-delivery').value === 'Home delivery') {
    price += 2;
  }
  for (var i = 0;i < sizeRadio.length;i++) {
    if (sizeRadio[i].checked) {
      price += parseFloat(sizeRadio[i].getAttribute('price'));
    }
  }
  for (var i = 0; i < crustRadio.length; i++) {
    if (crustRadio[i].checked && crustRadio[i].value === 'Deep Dish') {
      price += 1.50;
    }
  }
  for (var i = 0; i < toppingCheckbox.length; i++) {
    if (toppingCheckbox[i].checked) {
      if (toppingCheckbox[i].value === 'Extra Cheese' || toppingCheckbox[i].value === 'Black Olives') {
        price += 2.00;
      }
      else {
        price += 1.25;
      }
    }
  }
  document.getElementById('id-total-cost').value = '$' + price.toFixed(2);
}
