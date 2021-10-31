import { normalizeCityName, findState, eraseDisplayedResults, requestData, displayErrorMessage, getData, getDefaultCityName, getStringToUpperCase, displaySearchResults} from "./DataHandling.js"

// Add the search Logic to trigger all steps to display the desired data when the cityInput element loses focus.
export const addSearchLogic = () => {
    const cityInput = document.querySelector('#cityInput')
    cityInput.addEventListener('focusout', async (evt) => {
        let city = evt.target.value
        city = normalizeCityName(city)

        // If the cityInput is empty (not counting whitespaces), no search is performed
        if (!city) return

        eraseDisplayedResults()
        
        let state = findState(city)
        try {
            const response = await requestData(`https://private-9e061d-piweb.apiary-mock.com/venda?state=${state}&city=${city}`)
        
            // If the the HTTP request returned a failure status, it displays the error page instead of the results.
            if (!response.ok) {
                displayErrorMessage(response.status)
                return
            }
    
            const rawData = await getData(response)
            city = getDefaultCityName(city)
            state = getStringToUpperCase(state)
            displaySearchResults({...rawData, city, state})
        } catch (error) {
            // This error will occur only if there is no available internet connection to send the HTTP request and receive a response, or if there is an unlikely error in the DNS system.
            displayErrorMessage()
        }
    })
}


// Make the click of any of the two selectedCityButtons cause all dynamic elements to be deleted.
// Add two Event Listeners. One to the resultsSection and the other to the .selectedCityDiv inside the searchSection.
export const addEraseResultsLogic = () => {
    const dynamicOuterElements = document.querySelectorAll('#searchSection .selectedCityDiv, #resultsSection')
    dynamicOuterElements.forEach((el) => {
        el.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('selectedCityButton')) eraseDisplayedResults()
        })
    })
}

// Make the inputs that represent numerical values only accept digits.
export const makeNumericInputsOnlyAcceptDigits = () => {
    const numericalInputs = document.querySelectorAll(".jointInputsGroup input")
    numericalInputs.forEach((input) => {
        input.setAttribute('onkeypress', 'return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))')
    })
}

// Make all buttons, inside the same HTML element with class radioButtonsGroup, only accept one of them highlighted at any time, visually behaving like radio buttons of the same group. It is also possible to "deselect" the highlighted button, by clicking on it, so that no button remains highlighted.
export const applyRadioButtonsGroupLogic = () => {
    const radioButtonsGroupsElements = document.querySelectorAll('.radioButtonsGroup')
    radioButtonsGroupsElements.forEach((groupElement) => {
        groupElement.addEventListener('click', (evt) => {
            groupElement.childNodes.forEach((child) => {
                if (child.tagName === "BUTTON" && child !== evt.target) {
                    child.classList.remove('buttonChecked')
                }
                evt.target.classList.toggle('buttonChecked')
            })
        })
    })
}