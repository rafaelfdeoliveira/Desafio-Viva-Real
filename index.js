
// Make the inputs that represent numerical values only accept digits.
const numericalInputs = document.querySelectorAll(".jointInputsGroup input")
numericalInputs.forEach((input) => {
    input.setAttribute('onkeypress', 'return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))')
})

// Make all buttons, inside the same HTML element with class radioButtonsGroup, only accept one of them highlighted at any time, visually behaving like radio buttons of the same group. It is also possible to "deselect" the highlighted button, by clicking, so that no button remains highlited.
const customRadioButtons = document.querySelectorAll(".radioButtonsGroup button")
customRadioButtons.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
        evt.target.parentNode.childNodes.forEach((eachSibling) => {
            if (eachSibling.tagName === 'BUTTON' && eachSibling !== evt.target) {
                eachSibling.classList.remove('buttonChecked')
            }
        })
        evt.target.classList.toggle('buttonChecked')
    })
})