/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   popup-error-1.js
*
*   Desc:   Supports initialization and validation of the pizza ordering form example
*/

function initPizzaForm () {
  var radios = document.querySelectorAll('[type=\'radio\']');
  var checkbox = document.querySelectorAll('[type=\'checkbox\']');

  console.log(radios.length);
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('focus', function () {
      this.parentNode.classList.add('focus');
    });

    radios[i].addEventListener('blur', function () {
      this.parentNode.classList.remove('focus');
    });
    radios[i].parentNode.addEventListener('mouseover', function () {
      this.parentNode.classList.add('hover');
    });
    radios[i].parentNode.addEventListener('mouseout', function () {
      this.parentNode.classList.remove('hover');
    });
  }

  for (var i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener('focus', function () {
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
}

window.addEventListener('load', initPizzaForm);

// Scripting for inline form validation
function checkItem (id, flag, message) {
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

function checkName (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }
  var ei = document.getElementById('id-name');

  if (isItemEmpty) {
    return checkItem('id-name',(ei.value.length === 0), 'Name cannot be empty! Enter your name.');
  }

  return false;
}

function checkAddress (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }
  var ei = document.getElementById('id-address');

  if (isItemEmpty) {
    return checkItem('id-address',(ei.value.length === 0), 'Address cannot be empty! Enter your address.');
  }

  return false;
}

function checkPhone (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }

  var ei = document.getElementById('id-phone');
  var phone = ei.value;

  if (isItemEmpty && (phone.length === 0)) {
    return checkItem('id-phone', true, 'Phone cannot be empty! Enter your phone number with <span aria-label=" a 10 digit number">(111) 222-3333 format</span>.');
  }

  if (phone.length !== 0) {
    p = '';
    for (var i = 0; i < phone.length; i++) {
      var c = phone[i];

      if ((c >= '0') && (c <= '9')) {
        p += c;
      }
    }
    return checkItem('id-phone', ((p.length !== 7) && (p.length !== 10)), 'Not a valid phone number, use this format (111) 222-3333.');
  }

  return false;
}

function checkDeliveryMethod (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }

  var select = document.getElementById('id-delivery');
  var id = select.options[select.selectedIndex].id;

  if (isItemEmpty) {
    return checkItem('id-delivery',(id === 'id-delivery-choose'), 'Choose the Delivery Method.');
  }

  return false;
}

function checkSize (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }

  var ei = document.getElementById('id-size');
  var small = document.getElementById('id-small').checked;
  var medium = document.getElementById('id-medium').checked;
  var large = document.getElementById('id-large').checked;

  if (isItemEmpty) {
    if (small || medium || large) {
      return checkItem('id-size', false, '');
    }
    else {
      return checkItem('id-size', true, 'Choose the size of your pizza');
    }
  }

  return false;
}

function checkCrust (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }

  var ei = document.getElementById('id-crust');
  var thin = document.getElementById('id-thin').checked;
  var classic = document.getElementById('id-classic').checked;
  var deep = document.getElementById('id-deep').checked;

  if (isItemEmpty) {
    if (thin || classic || deep) {
      return checkItem('id-crust', false, '');
    }
    else {
      return checkItem('id-crust', !(thin.checked || classic.checked || deep.checked), 'Choose your Crust.');
    }
  }

  return false;
}

function submitOrder () {
  function getRadioValue (name) {
    var radioes = document.getElementsByName(name);

    for (var i = 0; i < radioes.length; i++) {
      if (radioes[i].checked) {
        return radioes[i].value;
      }
    }
    return false;
  }

  function messageItem (label, value) {
    return label + ': ' + value + '\n';
  }

  // Check all fields
  var nameInvalid = checkName(true);
  var addressInvalid = checkAddress(true);
  var phoneInvalid = checkPhone(true);
  var methodInvalid = checkDeliveryMethod(true);
  var sizeInvalid = checkSize(true);
  var crustInvalid = checkCrust(true);

  if (nameInvalid) {
    document.getElementById('id-name').focus();
  }
  else if (addressInvalid) {
    document.getElementById('id-address').focus();
  }
  else if (phoneInvalid) {
    document.getElementById('id-phone').focus();
  }
  else if (methodInvalid) {
    document.getElementById('id-delivery').focus();
  }
  else if (sizeInvalid) {
    document.getElementById('id-small').focus();
  }
  else if (crustInvalid) {
    document.getElementById('id-thin').focus();
  }
  else {
    var str = 'Pizza Order Summary\n\n';

    var delivery = document.getElementById('id-delivery');

    var toppingCheckboxes = document.getElementsByName('topping');
    var toppings = '';
    var toppingCount = 0;

    for (var i = 0; i < toppingCheckboxes.length; i++) {
      if (toppingCheckboxes[i].checked) {
        if (toppingCount > 0) {
          toppings += ', ';
        }
        toppings += toppingCheckboxes[i].value;
        toppingCount += 1;
      }
    }

    str += messageItem('Name', document.getElementById('id-name').value);
    str += messageItem('Address', document.getElementById('id-address').value);
    str += messageItem('Phone', document.getElementById('id-phone').value);
    str += messageItem('Delivery Method', delivery.options[delivery.selectedIndex].value);
    str += messageItem('Size', getRadioValue('size'));
    str += messageItem('Crust', getRadioValue('crust'));
    if (toppingCount === 0) {
      str += messageItem('Toppings', 'no additional toppings selected');
    }
    else {
      if (toppingCount === 1) {
        str += messageItem('Topping', toppings);
      }
      else {
        str += messageItem('Toppings', toppings);
      }
    }
    str += messageItem('Cost', document.getElementById('id-total-cost').value);

    alert(str);
  }
}

function priceChange () {
  var sizePrice = [7, 8.5, 10];
  var deepDishPrice = 1.5;
  var toppingPrice = 1.25;
  var toppingPriceExtra = 2.00;

  var price = 0;
  var sizeRadio = document.getElementsByName('size');
  var crustRadio = document.getElementsByName('crust');
  var toppingCheckbox = document.getElementsByName('topping');

  if (document.getElementById('id-delivery').value === 'Home delivery') {
    price += 2;
  }
  for (var i = 0; i < sizeRadio.length; i++) {
    if (sizeRadio[i].checked) {
      price += sizePrice[i];
    }
  }
  for (var i = 0; i < crustRadio.length; i++) {
    if (crustRadio[i].checked && crustRadio[i].value === 'Deep Dish') {
      price += deepDishPrice;
    }
  }
  for (var i = 0; i < toppingCheckbox.length; i++) {
    if (toppingCheckbox[i].checked) {
      if (toppingCheckbox[i].id === 'id-x-cheese' || toppingCheckbox[i].id === 'id-black') {
        price += toppingPriceExtra;
      }
      else {
        price += toppingPrice;
      }
    }
  }
  document.getElementById('id-total-cost').value = '$' + price.toFixed(2);
}
