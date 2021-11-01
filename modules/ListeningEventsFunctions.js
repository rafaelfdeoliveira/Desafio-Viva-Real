import { performSearch, eraseDisplayedData } from "./DataHandling.js"

// Add the Search logic to trigger the search (with the text typed by the user in the #cityInput input) when the user press Enter in the cityInput, stop typing for 3 seconds or remove the keyboard focus from it.
export const addSearchLogic = () => {
    const cityInput = document.querySelector('#cityInput')
    let scheduledSearch
    cityInput.addEventListener('keydown', (evt) => {
        clearTimeout(scheduledSearch)
        if (evt.key === "Enter") {
            performSearch(evt)
            return
        }
        scheduledSearch = setTimeout(performSearch, 3000, evt)
    })
    cityInput.addEventListener('blur', (evt) => {
        clearTimeout(scheduledSearch)
        performSearch(evt)
    })
}

// Make the click of any of the two selectedCityButtons cause all dynamic elements to be deleted.
// Add two Event Listeners. One to the resultsSection and the other to the .selectedCityDiv inside the searchSection.
export const addEraseResultsLogic = () => {
    const dynamicOuterElements = document.querySelectorAll('#searchSection .selectedCityDiv, #resultsSection')
    dynamicOuterElements.forEach((el) => {
        el.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('selectedCityButton')) eraseDisplayedData()
        })
    })
}

// Make all buttons, inside the same HTML element with class radioButtonsGroup, only accept one of them highlighted at any time, visually behaving like radio buttons of the same group. It is also possible to "deselect" the highlighted button, by clicking on it, so that no button remains highlighted.
export const addRadioButtonsGroupLogic = () => {
    const radioButtonsGroupsElements = document.querySelectorAll('.radioButtonsGroup')
    radioButtonsGroupsElements.forEach((groupElement) => {
        groupElement.addEventListener('click', (evt) => {
            if (evt.target.tagName === "BUTTON") {
                groupElement.childNodes.forEach((child) => {
                    if (child.tagName === "BUTTON" && child !== evt.target) child.classList.remove('buttonChecked')
                })
                evt.target.classList.toggle('buttonChecked')
            }
        })
    })
}