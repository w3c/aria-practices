/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   popup-error.js
*
*   Desc:   Supports initialization and validation of the pizza ordering form
*/

var cardOptions = [
  {
    'id': 'InvalidCardType',
    'name': 'Choose Your Card Type',
    'digitFormat': '--',
    'digitLength': null,
    'secureFormat': '--',
    'secureLength': null,
    'numberMessage': 'You have not choose your card type yet!',
    'secureMessage': 'You have not choose your card type yet!',
    'numberLabel': '',
    'secureLabel': ''
  },
  {
    'id': 'masterCard',
    'name': 'MasterCard',
    'digitFormat': '0000 0000 0000 0000',
    'digitLength': 16,
    'secureFormat': '000',
    'secureLength': 3,
    'numberMessage': 'For MasterCard, the length of your card number should be 16 digit.',
    'secureMessage': 'For MasterCard, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'visa',
    'name': 'VISA',
    'digitFormat': '0000 0000 0000 0000',
    'digitLength': 16,
    'secureFormat': '000',
    'secureLength': 3,
    'numberMessage': 'For VISA, the length of your card number should be 16 digit.',
    'secureMessage': 'For VISA, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'americanExpress',
    'name': 'American Express',
    'digitFormat': '00000 00000 00000',
    'digitLength': 15,
    'secureFormat': '0000',
    'secureLength': 4,
    'numberMessage': 'For American Express, the length of your card number should be 15.',
    'secureMessage': 'For American Express, your secure code should be 4 digit numbers.',
    'numberLabel': '15 digit card numbers',
    'secureLabel': '4 digit secure codes'
  },
  {
    'id': 'diners',
    'name': 'Diner\'s Club',
    'digitFormat': '0000 0000 0000 00',
    'digitLength': 14,
    'secureFormat': '000',
    'secureLength': 3,
    'numberMessage': 'For Diner\'s Club, the length of your card number should be 14 digit.',
    'secureMessage': 'For Diner\'s Club, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  }
];

function initCreditCardOptions () {
  var select = document.getElementById('id-card');

  for (var i = 0; i < cardOptions.length; i++) {
    var option = document.createElement('option');

    option.text = cardOptions[i].name;
    option.id = cardOptions[i].id;
    select.add(option);
  }
}

function initRadioAndCheckboxFocusStyling () {
  var radios = document.querySelectorAll('[type="radio"]');
  var checkbox = document.querySelectorAll('[type="checkbox"]');

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

window.addEventListener('load', initRadioAndCheckboxFocusStyling);
window.addEventListener('load', initCreditCardOptions);


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

function validateName (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }
  var ei = document.getElementById('id-name');

  if (isItemEmpty) {
    return checkItem('id-name',(ei.value.length === 0), 'Name cannot be empty! Enter your name.');
  }

  return false;
}

function validateAddress (isItemEmpty) {
  if (typeof isItemEmpty !== 'boolean') {
    isItemEmpty = false;
  }
  var ei = document.getElementById('id-address');

  if (isItemEmpty) {
    return checkItem('id-address',(ei.value.length === 0), 'Address cannot be empty! Enter your address.');
  }

  return false;
}

function validatePhone (isItemEmpty) {
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

function validateDeliveryMethod (isItemEmpty) {
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

function validateSize (isItemEmpty) {
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

function validateCrust (isItemEmpty) {
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

function setCardType () {
  function setRequiredDisabled (id, flag) {
    var node = document.getElementById(id);

    if (flag) {
      node.setAttribute('required', 'required');
      node.removeAttribute('disabled');
    }
    else {
      node.setAttribute('disabled', 'disabled');
      node.removeAttribute('required');
    }
  }

  var ei = document.getElementById('id-card');
  var currentCard = ei.options[ei.selectedIndex].value;

  var cardNumberInst = document.getElementById('id-card-number-inst');
  var cardSecureInst = document.getElementById('id-card-secure-inst');

  for (var card in cardOptions) {
    if (currentCard === cardOptions[card].name) {
      cardNumberInst.innerHTML = cardOptions[card].digitFormat;
      cardSecureInst.innerHTML = cardOptions[card].secureFormat;
      cardNumberInst.setAttribute('aria-label', cardOptions[card].numberLabel);
      cardSecureInst.setAttribute('aria-label', cardOptions[card].secureLabel);
      if (document.getElementById('id-card-number-error').classList.contains('error')) {
        checkItem('id-number', (str === cardOptions[card].name), cardOptions[card].numberMessage);
      }
      if (document.getElementById('id-card-secure-error').classList.contains('error')) {
        checkItem('id-secure',(str === cardOptions[card].name), cardOptions[card].secureMessage);
      }

      var disable = ei.options[ei.selectedIndex].id !== 'InvalidCardType';

      console.log('[disable]: ' + disable + ' ' + ei.options[ei.selectedIndex].id + ' ' + ei.selectedIndex);

      setRequiredDisabled('id-card-name', disable);
      setRequiredDisabled('id-card-number', disable);
      setRequiredDisabled('id-card-secure', disable);
      setRequiredDisabled('id-card-date', disable);
      setRequiredDisabled('id-card-address', disable);
      setRequiredDisabled('id-card-zipcode', disable);
    }
  }
}

function validateCardType (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }

  var ei = document.getElementById('id-card');
  var str = ei.options[ei.selectedIndex].value;

  if (testForEmpty) {
    for (var card in cardOptions) {
      if (cardOptions[card].id === 'InvalidCardType') {
        return checkItem('id-card', (str === cardOptions[card].name), cardOptions[card].numberMessage);
      }
    }
  }
}

function validateCardName (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-card-name');

  if (testForEmpty) {
    return checkItem('id-card-name',(ei.value.length === 0), 'Name cannot be empty!');
  }
  if (ei.value.length !== 0) {
    return checkItem('id-card-name', false, '');
  }
}

function validateCardNumber (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-card-number');
  var cardType = document.getElementById('id-card').value;
  var number = ei.value;
  var cardOption = cardOptions[0];

  for (var card in cardOptions) {
    if (cardType === cardOptions[card].name) {
      cardOption = cardOptions[card];
      break;
    }
  }

  var str = '';
  var digitCount = 0;

  if (testForEmpty) {
    return checkItem('id-card-number', (number.length === 0), 'Card Number Cannot be Empty!');
  }
  if (number.length !== 0) {
    n = '';
    for (var i = 0; i < number.length; i++) {
      var c = number[i];

      if ((c >= '0') && (c <= '9')) {
        n += c;
        str += c;
        digitCount += 1;
        if ((cardOption.digitLength === 16 && digitCount === 4) ||
            (cardOption.digitLength === 15 && digitCount === 5) ||
            (cardOption.digitLength === 14 && digitCount === 4)) {
          str += ' ';
          digitCount = 0;
        }
      }
      ei.value = str;
    }

    return checkItem('id-card-number', (n.length !== cardOption.digitLength), cardOption.numberMessage);
  }
}

function validateCardSecure (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-card-secure');
  var cardType = document.getElementById('id-card').value;
  var secure = ei.value;

  s = '';
  if (testForEmpty) {
    return checkItem('id-card-secure', (secure.length === 0), 'Secure Code Cannot be Empty!');
  }
  if (secure.length !== 0) {
    for (var i = 0; i < secure.length; i++) {
      var c = secure[i];

      if ((c >= '0') && (c <= '9')) {
        s += c;
      }
    }
    for (var card in cardOptions) {
      if (cardType === cardOptions[card].name) {
        return checkItem('id-card-secure', (s.length !== cardOptions[card].secureLength), cardOptions[card].secureMessage);
      }
    }
  }
}

function validateCardDate (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }

  var ei = document.getElementById('id-card-date');
  var date = ei.value;

  if (date.length !== 0) {
    d = '';
    for (var i = 0; i < date.length; i++) {
      var c = date[i];

      if ((c >= '0') && (c <= '9')) {
        d += c;
      }
    }
    return checkItem('id-card-date', ((d.length !== 6)), 'The format of expiration date should be MM/YYYY');
  }
  if (testForEmpty) {
    return checkItem('id-card-date', date.length === 0, 'Expiration date cannot be empty!');
  }
}

function validateCardAddress (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-card-address');

  if (testForEmpty) {
    return checkItem('id-card-address',(ei.value.length === 0), 'Address cannot be empty! ');
  }
  if (ei.value.length !== 0) {
    return checkItem('id-card-address', false, '');
  }
}

function validateCardZipCode (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-card-zipcode');
  var zip = ei.value;

  if (zip.length !== 0) {
    return checkItem('id-card-zipcode', (zip.length !== 5), 'The format of Zip Code should be 5 digit numbers.');
  }
  if (testForEmpty) {
    return checkItem('id-card-zipcode', zip.length === 0, 'Please enter 5 digit zip code');
  }
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
  var nameInvalid    = validateName(true);
  var addressInvalid = validateAddress(true);
  var phoneInvalid   = validatePhone(true);
  var methodInvalid  = validateDeliveryMethod(true);
  var sizeInvalid    = validateSize(true);
  var crustInvalid   = validateCrust(true);

  var cardInvalid        = validateCardType(true);
  var cardNameInvalid    = validateCardName(true);
  var cardNumberInvalid  = validateCardNumber(true);
  var cardSecureInvalid  = validateCardSecure(true);
  var cardDateInvalid    = validateCardDate(true);
  var cardAddressInvalid = validateCardAddress(true);
  var cardZipCodeInvalid = validateCardZipCode(true);

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
  else if (cardInvalid) {
    document.getElementById('id-card').focus();
  }
  else if (cardNameInvalid) {
    document.getElementById('id-card-name').focus();
  }
  else if (cardNumberInvalid) {
    document.getElementById('id-card-number').focus();
  }
  else if (cardSecureInvalid) {
    document.getElementById('id-card-secure').focus();
  }
  else if (cardDateInvalid) {
    document.getElementById('id-card-date').focus();
  }
  else if (cardAddressInvalid) {
    document.getElementById('id-card-address').focus();
  }
  else if (cardZipCodeInvalid) {
    document.getElementById('id-card-zipcode').focus();
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

    str + '\nCredit Card Information\n\n';

    str += messageItem('Card', document.getElementById('id-card').value);
    str += messageItem('Name', document.getElementById('id-card-name').value);
    str += messageItem('Number', document.getElementById('id-card-number').value);
    str += messageItem('Security Code', document.getElementById('id-card-secure').value);
    str += messageItem('Expiration Date', document.getElementById('id-card-date').value);
    str += messageItem('Billing Address', document.getElementById('id-card-address').value);
    str += messageItem('Billing Zip Code', document.getElementById('id-card-zipcode').value);

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
