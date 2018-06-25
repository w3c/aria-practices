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
    'secureCodeFormat': 'Ex. 000',
    'secureCodeLength': 3,
    'numberMessage': 'For MasterCard, the length of your card number should be 16 digit.',
    'secureMessage': 'For VISA, Discover, MasterCard, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'visa',
    'name': 'VISA',
    'digitFormat': 'Ex. 0000 0000 0000 0000',
    'digitLength': 16,
    'secureCodeFormat': 'Ex. 000',
    'secureCodeLength': 3,
    'numberMessage': 'For VISA, the length of your card number should be 16 digit.',
    'secureMessage': 'For VISA, Discover, MasterCard, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  },
  {
    'id': 'americanExpress',
    'name': 'American Express',
    'digitFormat': 'Ex. 0000 000000 00000',
    'digitLength': 15,
    'secureCodeFormat': 'Ex. 0000',
    'secureCodeLength': 4,
    'numberMessage': 'For American Express, the length of your card number should be 15.',
    'secureMessage': 'For American Express, your secure code should be 4 digit numbers.',
    'numberLabel': '15 digit card numbers',
    'secureLabel': '4 digit secure codes'
  },
  {
    'id': 'discover',
    'name': 'Discover',
    'digitFormat': 'Ex. 0000 0000 0000 0000',
    'digitLength': 15,
    'secureCodeFormat': 'Ex. 000',
    'secureCodeLength': 3,
    'numberMessage': 'For Discover, the length of your card number should be 16 digit.',
    'secureMessage': 'For VISA, Discover, MasterCard, your secure code should be 3 digit numbers.',
    'numberLabel': '16 digit card numbers',
    'secureLabel': '3 digit secure codes'
  }
];

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
    return checkItem('id-name',(ei.value.length === 0),'Name cannot be empty!');
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
  if (testForEmpty) {
    return checkItem('id-number', (number.length === 0), 'Card Number Cannot be Empty!');
  }
  if (number.length !== 0) {
    n = '';
    for (var i = 0;i < number.length;i++) {
      var c = number[i];
      if ((c >= '0') && (c <= '9')) {
        n += c;
      }
    }
    for (var card in cardOptions) {
      if (cardType === cardOptions[card].name) {
        return checkItem('id-number', (n.length !== cardOptions[card].digitLength), cardOptions[card].numberMessage);
      }
    }
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
    for (var i = 0; i < secure.length;i++) {
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
    for (var i = 0;i < date.length;i++) {
      var c = date[i];
      if ((c >= '0') && (c <= '9')) {
        d += c;
      }
    }
    return checkItem('id-date', ((d.length !== 6)), 'The format of expiration date should be MM/YYYY');
  }
  if (testForEmpty) {
    return checkItem('id-date',date.length === 0, 'Expiration date cannot be empty!');
  }
}

function validateAddress (testForEmpty) {
  if (typeof testForEmpty !== 'boolean') {
    testForEmpty = false;
  }
  var ei = document.getElementById('id-address');
  if (testForEmpty) {
    return checkItem('id-address',(ei.value.length === 0),'Address cannot be empty! ');
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
  var cardFlag = validateCardType(true);
  var nameFlag = validateName(true);
  var numberFlag = validateNumber(true);
  var secureFlag = validateSecureCode(true);
  var dateFlag = validateDate(true);
  var addressFlag = validateAddress(true);
  var zipFlag = validateZipCode(true);
  if (cardFlag) {
    document.getElementById('id-card').focus();
  }
  else if (nameFlag) {
    document.getElementById('id-name').focus();
  }
  else if (numberFlag) {
    document.getElementById('id-number').focus();
  }
  else if (secureFlag) {
    document.getElementById('id-secure').focus();
  }
  else if (dateFlag) {
    document.getElementById('id-date').focus();
  }
  else if (addressFlag) {
    document.getElementById('id-address').focus();
  }
  else if (zipFlag) {
    document.getElementById('id-zipcode').focus();
  }
  else {
    if (window.confirm('Are you sure to submit payment?')) {
      alert('Thanks');
    }
    else {
      alert('Your payment has been cancelled');
    }
  }
}
