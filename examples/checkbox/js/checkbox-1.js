/*
* @function toggleCheckBox
*
* @desc Toogles the state of a checkbox and updates image indicating state based on aria-checked values
*
* @param   {Object}  event  -  Standard W3C event object
*
*/

function toggleCheckbox(event) {

  var node = event.currentTarget
  var image = node.getElementsByTagName('img')[0]

  var state = node.getAttribute('aria-checked').toLowerCase()

  if (event.type === 'click' || 
      (event.type === 'keydown' && event.keyCode === 32)
      ) {
          if (state === 'true') {
            node.setAttribute('aria-checked', 'false')
            image.src = './images/checkbox-unchecked-black.png'
          }
          else {
            node.setAttribute('aria-checked', 'true')
            image.src = './images/checkbox-checked-black.png'
          }  

    event.preventDefault()
    event.stopPropagation()
  }

}

/*
* @function focusCheckBox
*
* @desc Adds focus to the class name of the checkbox
*
* @param   {Object}  event  -  Standard W3C event object
*/

function focusCheckbox(event) {
  event.currentTarget.className += ' focus'
}

/*
* @function blurCheckBox
*
* @desc Adds focus to the class name of the checkbox
*
* @param   {Object}  event  -  Standard W3C event object
*/

function blurCheckbox(event) {
  event.currentTarget.className = event.currentTarget.className .replace(' focus','')
}