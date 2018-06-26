var cardOptions = [
  {
    'id': 'InvalidCardType',
    'name': 'Choose Your Card Type',
    'digitFormat': '--',
    'digitLength': null,
    'secureCodeFormat': '--',
    'secureCodeLength': null,
    'numberMessage': 'You have not choose your card type yet!',
    'secureMessage': 'You have not choose your card type yet!',
    'numberLabel': '',
    'secureLabel': ''
  },
  {
    'id': 'masterCard',
    'name': 'MasterCard',
    'digitFormat': 'Ex. 0000 0000 0000 0000',
    'digitLength': 16,
    'secureCodeFormat': 'Example: 000',
    'secureCodeLength': 3,
    'numberMessage': 'For MasterCard, the length of your card number should be 16 digit.',
    'secureMessage': 'For MasterCard, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'visa',
    'name': 'VISA',
    'digitFormat': 'Example: 0000 0000 0000 0000',
    'digitLength': 16,
    'secureCodeFormat': 'Example: 000',
    'secureCodeLength': 3,
    'numberMessage': 'For VISA, the length of your card number should be 16 digit.',
    'secureMessage': 'For VISA, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'americanExpress',
    'name': 'American Express',
    'digitFormat': 'Example: 00000 00000 00000',
    'digitLength': 15,
    'secureCodeFormat': 'Example: 0000',
    'secureCodeLength': 4,
    'numberMessage': 'For American Express, the length of your card number should be 15.',
    'secureMessage': 'For American Express, your secure code should be 4 digit numbers.',
    'numberLabel': '15 digit card numbers',
    'secureLabel': '4 digit secure codes'
  },
  {
    'id': 'diners',
    'name': 'Diner\'s Club',
    'digitFormat': 'Example: 0000 0000 0000 00',
    'digitLength': 14,
    'secureCodeFormat': 'Example: 000',
    'secureCodeLength': 3,
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

    console.log(cardOptions[i]);
    option.text = cardOptions[i].name;
    option.id = cardOptions[i].id;
    select.add(option);
  }
}

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

function setCardType () {
  var ei = document.getElementById('id-card');
  var str = ei.options[ei.selectedIndex].value;
  var cardNumber = document.getElementById('id-card-number-inst');
  var secureCode = document.getElementById('id-secure-code-inst');

  for (var card in cardOptions) {
    if (str === cardOptions[card].name) {
      cardNumber.innerHTML = cardOptions[card].digitFormat;
      secureCode.innerHTML = cardOptions[card].secureCodeFormat;
      cardNumber.setAttribute('aria-label', cardOptions[card].numberLabel);
      secureCode.setAttribute('aria-label', cardOptions[card].secureLabel);
      if (document.getElementById('id-number-error').classList.contains('error')) {
        checkItem('id-number', (str === cardOptions[card].name), cardOptions[card].numberMessage);
      }
      if (document.getElementById('id-secure-error').classList.contains('error')) {
        checkItem('id-secure',(str === cardOptions[card].name), cardOptions[card].secureMessage);
      }
    }
  }
}

function validateCardType () {
  var ei = document.getElementById('id-card');
  var str = ei.options[ei.selectedIndex].value;

  for (var card in cardOptions) {
    if (cardOptions[card].id === 'InvalidCardType') {
      return checkItem('id-card', (str === cardOptions[card].name), cardOptions[card].numberMessage);
    }
  }
}

function validateName (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-name');

  if (testForEmpty) {
    return checkItem('id-name',(ei.value.length === 0), 'Name cannot be empty!');
  }
  if (ei.value.length !== 0) {
    return checkItem('id-name', false, '');
  }
}

function validateNumber (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-number');
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
    return checkItem('id-number', (number.length === 0), 'Card Number Cannot be Empty!');
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

    return checkItem('id-number', (n.length !== cardOption.digitLength), cardOption.numberMessage);
  }
}

function validateSecureCode (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-secure');
  var cardType = document.getElementById('id-card').value;
  var secure = ei.value;

  s = '';
  if (testForEmpty) {
    return checkItem('id-secure', (secure.length === 0), 'Secure Code Cannot be Empty!');
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
        return checkItem('id-secure', (s.length !== cardOptions[card].secureCodeLength), cardOptions[card].secureMessage);
      }
    }
  }
}

function validateDate (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }

  var ei = document.getElementById('id-date');
  var date = ei.value;

  if (date.length !== 0) {
    d = '';
    for (var i = 0; i < date.length; i++) {
      var c = date[i];

      if ((c >= '0') && (c <= '9')) {
        d += c;
      }
    }
    return checkItem('id-date', ((d.length !== 6)), 'The format of expiration date should be MM/YYYY');
  }
  if (testForEmpty) {
    return checkItem('id-date', date.length === 0, 'Expiration date cannot be empty!');
  }
}

function validateAddress (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-address');

  if (testForEmpty) {
    return checkItem('id-address',(ei.value.length === 0), 'Address cannot be empty! ');
  }
  if (ei.value.length !== 0) {
    return checkItem('id-address', false, '');
  }
}

function validateZipCode (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-zipcode');
  var zip = ei.value;

  if (zip.length !== 0) {
    return checkItem('id-zipcode', (zip.length !== 5), 'The format of Zip Code should be 5 digit numbers.');
  }
  if (testForEmpty) {
    return checkItem('id-zipcode', zip.length === 0, 'Please enter 5 digit zip code');
  }
}

function submitOrder () {
  function messageItem (label, value) {
    return label + ': ' + value + '\n';
  }

  var cardInvalid = validateCardType(true);
  var nameInvalid = validateName(true);
  var numberInvalid = validateNumber(true);
  var secureInvalid = validateSecureCode(true);
  var dateInvalid = validateDate(true);
  var addressInvalid = validateAddress(true);
  var zipInvalid = validateZipCode(true);

  if (cardInvalid) {
    document.getElementById('id-card').focus();
  }
  else if (nameInvalid) {
    document.getElementById('id-name').focus();
  }
  else if (numberInvalid) {
    document.getElementById('id-number').focus();
  }
  else if (secureInvalid) {
    document.getElementById('id-secure').focus();
  }
  else if (dateInvalid) {
    document.getElementById('id-date').focus();
  }
  else if (addressInvalid) {
    document.getElementById('id-address').focus();
  }
  else if (zipInvalid) {
    document.getElementById('id-zipcode').focus();
  }
  else {
    str = 'Payment Information\n\n';

    var card = document.getElementById('id-card');

    str += messageItem('Name', document.getElementById('id-name').value);
    str += messageItem('Card', card.options[card.selectedIndex].value);
    str += messageItem('Number', document.getElementById('id-number').value);
    str += messageItem('Security Code', document.getElementById('id-secure').value);
    str += '\n';
    str += messageItem('Address', document.getElementById('id-address').value);
    str += messageItem('Zip Code', document.getElementById('id-zipcode').value);

    alert(str);
  }
}
