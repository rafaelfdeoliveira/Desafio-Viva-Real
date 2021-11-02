import { createErrorWrapElement, createElementByHTML, createSelectedCityDivElement, createSelectedCityWrapElement, createHomeAnchorElement } from "./FactoryFunctions.js"

// Make a GET HTTP request to the given url and returns a promise of the request response
const requestData = async (url) => fetch(url)

// Convert the data in the response to a javascript object
const getData = async (response) => response.json()

// Return the State Acronym where the given city is located according to the cityStateDict
const findState = (city) => {
    const cityStateDict = {
        ['rio-de-janeiro']: "rj",
        ['sao-paulo']: "sp"
    }
    return cityStateDict[city]
}

// Return the city Name of the Capital of the given state according to the stateCapitalDict
const findCapital = (state) => {
    const stateCapitalDict = {
        rj: 'rio-de-janeiro',
        sp: 'sao-paulo'
    }
    return stateCapitalDict[state]
}

// Return the city name (eg. sao-paulo) and state acronym (eg. sp) depending on the simplifiedInput.
// If the simplifiedInput has only 2 characters, it is considered the state acronym and it is used to find its capital city name. Otherwise it is considered the city name and it is used to find the state acronym
const getCityAndState = (simplifiedInput) => {
    if (simplifiedInput.length === 2) {
        const city = findCapital(simplifiedInput)
        const state = simplifiedInput
        return {city, state}
    }
    const city = simplifiedInput
    const state = findState(simplifiedInput)
    return {city, state}
}

// Normalize the input string to the format of only lower case letters with no accents, and the words separated by a dash (eg: sao-paulo)
const normalizeInput = (input) => input.trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '')

// Return the money number formated to the Brazilian Currency style with no cents: R$ 000.000 if the money valor exists. If it does not exists, it is set to a dash string
export const setMoneyFormat = (money) => {
    if (!money) return "-"
    return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}).format(money)
}

// Return the number formated to the Brazilian style: 000.000
const setNumberFormat = (number) => Intl.NumberFormat('pt-BR').format(number)

// Translate all English names in the amenitiesArray to an array of respective names in Portuguese according to the English-Portuguese dictionary below. If the english name is not found in the dictionary, it is adopted with all letters converted to lower case and _ converted to spaces.
export const translateAmenitiesArray = (amenitiesArray) => {
    const engPorDict = {
        PARTY_HALL: 'Salão de festas',
        FURNISHED: 'Mobiliado',
        FIREPLACE: 'Lareira',
        POOL: 'Piscina',
        BARBECUE_GRILL: 'Churrasqueira',
        AIR_CONDITIONING: 'Ar-condicionado',
        ELEVATOR: 'Elevador',
        BICYCLES_PLACE: 'Vaga de bicicleta',
        GATED_COMMUNITY: 'Condomínio fechado',
        PLAYGROUND: 'Playground',
        SPORTS_COURT: 'Quadra poliesportiva',
        PETS_ALLOWED: 'Aceita animais',
        AMERICAN_KITCHEN: 'Cozinha americana',
        TENNIS_COURT: 'Quadra de tennis',
        LAUNDRY: 'Lavanderia',
        GYM: 'Academia',
        ELECTRONIC_GATE: 'Portão eletrônico',
        CINEMA: 'Cinema',
        SAUNA: 'Sauna',
        GARDEN: 'Jardim'
    }
    return amenitiesArray.map((amenity) => {
        const portugueseAmenity = engPorDict[amenity]
        if (!portugueseAmenity) return amenity.toLowerCase().replace(/_/g, " ")
        return portugueseAmenity
    })
}

// If number is 0 (or any falsy value) it returns "--" otherwise, it returns the number unchanged
export const padronizeNumber = (number) => {
    if (!number) return "--"
    return number
}

// If number is plural (more than one), it returns the string "s", otherwise it returns an empty string ""
export const getSIfPlural = (number) => {
    if (number > 1) return "s"
    return ""
}

// Reset the page title (displayed at the top of the browser window) to its initial value
const resetPageTitle = () => {
    document.querySelector('head title').innerText = 'Imóveis, Casas e Apartamentos para Compra, Venda e Aluguel - Viva Real'
}

// Delete all HTML inside the element corresponding to the given CSS elementSelector
const deleteElementInnerHTML = (elementSelector) => {
    const element = document.querySelector(elementSelector)
    element.innerHTML = ""
}

// Delete the value attribute of the HTML element corresponding to the given CSS elementSelector
const deleteElementValue = (elementSelector) => {
    const cityInput = document.querySelector('#cityInput')
    cityInput.value = ""
}

// Erase all dynamic elements in the DOM, cleaning any data from a previous search still visible
export const eraseDisplayedData = () => {
    resetPageTitle()
    deleteElementInnerHTML('#resultsSection')
    deleteElementInnerHTML('#searchSection .selectedCityDiv')
    deleteElementValue('#cityInput')
}

// Change the page title (displayed at the top of the browser window) according to the searched city
const updatePageTitle = (city, state) => {
    document.querySelector('head title').innerText = `Imóveis à venda em ${city}, ${state} por Imobiliárias e Proprietários - Viva Real`
}

// Display the City - State button below the cityInput in the search Section
const displaySearchSectionCityStateButton = (city, state) => {
    const cityStateButtonWrap = createSelectedCityWrapElement(city, state)
    document.querySelector('#searchSection .selectedCityDiv').append(cityStateButtonWrap)
}

// Display the number of obtained places in the resultsSection
const displayPlacesTotalCount = (city, state, totalCount) => {
    const totalCountElement = createElementByHTML('h1', `<strong>${setNumberFormat(totalCount)}</strong> Imóveis à venda em ${city} - ${state}`)
    document.querySelector('#resultsSection').append(totalCountElement)
}

// Display the City - State button in the resultsSection
const displayResultsSectionCityStateButton = (city, state) => {
    const cityStateButtonDiv = createSelectedCityDivElement(city, state)
    document.querySelector('#resultsSection').append(cityStateButtonDiv)
}

// Display a Card inside the resultsSection for each individual place in the resultsArray
const displayPlacesResults = (resultsArray) => {
    const resultsSection = document.querySelector('#resultsSection')
    resultsArray.forEach(({link: {name: homeName}, listing, medias: {[0]: {url: imageURL}}}) => {
        const homeAnchorElement = createHomeAnchorElement({homeName, listing, imageURL})
        resultsSection.append(homeAnchorElement)
    })
}

// Display all Dynamic Elements on the screen with the given information
// resultsArray is an array of objects where each object contains all available data for the corresponding place to buy in the searched city
// totalCount is the total number of received places to buy in the searched city.
const displaySearchResults = ({search: {result: {listings: resultsArray}}, search: {totalCount}}) => {
    eraseDisplayedData()
    const city = resultsArray[0].listing.address.city
    const state = resultsArray[0].listing.address.stateAcronym
    updatePageTitle(city, state)
    displaySearchSectionCityStateButton(city, state)
    displayPlacesTotalCount(city, state, totalCount)
    displayResultsSectionCityStateButton(city, state)
    displayPlacesResults(resultsArray)
}

// Display a Message inside the resultsSection to indicate that an error happened during the HTTP request to fetch the desired data
const displayErrorMessage = (status) => {
    eraseDisplayedData()
    const errorWrapElement = createErrorWrapElement(status)
    document.querySelector('#resultsSection').append(errorWrapElement)
}

// Perform the entire search for places to buy in the city provided by the userInput.
// It goes through all steps to process the received userInput string, get data from the endpoint and display the results or the error message, accordingly
export const performSearch = async ({target: {value: userInput}}) => {
    const simplifiedInput = normalizeInput(userInput)
    // If the user Input is empty (not counting whitespaces), no search is performed
    if (!simplifiedInput) return
    const {city, state} = getCityAndState(simplifiedInput)
    try {
        const response = await requestData(`https://private-9e061d-piweb.apiary-mock.com/venda?state=${state}&city=${city}`)
        // If the the HTTP request returned a failure status, it displays the error message instead of the results.
        if (!response.ok) {
            displayErrorMessage(response.status)
            return
        }
        const rawData = await getData(response)
        displaySearchResults(rawData)
    } catch (error) {
        // This error will occur only if there is a network connection error such as no available internet connection to send the HTTP request and receive a response, or if there is an unlikely error in the DNS
        displayErrorMessage('-')
    }
}