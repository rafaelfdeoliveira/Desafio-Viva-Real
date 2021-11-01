import { createErrorWrapElement, createElementByHTML, createSelectedCityDivElement, createSelectedCityWrapElement, createHomeAnchorElement } from "./FactoryFunctions.js"

// Make a GET HTTP request to the given url and returns a promise of the request response
const requestData = async (url) => fetch(url)

// Convert the JSON response to a javascript object
const getData = async (response) => response.json()

// Return the State Acronym where the given city is located according to the cityStateDict
const findState = (city) => {
    const cityStateDict = {
        ['rio-de-janeiro']: "rj",
        ['sao-paulo']: "sp"
    }
    return cityStateDict[city]
}

// Normalize the rawCity string to the format of only lower case letters with no accents, and the words separated by a dash (eg: sao-paulo)
const normalizeCityName = (rawcity) => {
    return rawcity.trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Convert the simpleCityName (obtained from the normalizeCityName function above) to the format of words separed by a space. Only if the word has 3 or more letters, its first letter is capitalized (eg: Rio de Janeiro)
const getDefaultCityName = (simpleCityName) => {
    return simpleCityName.replace(/^.|(?<=-)[a-z](?=[a-z]{2})/g, (match) => match.toUpperCase()).replace(/-/g, " ")
}

// Convert all characters to Upper Case
const getStringToUpperCase = (string) => string.toUpperCase()

// Return the money number formated to the Brazilian Currency style with no cents: R$ 000.000 if the money valor exists. If it does not exists, it is set to a dash string
export const setMoneyFormat = (money) => {
    if (money) return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}).format(money)
    return "-"
}

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
    deleteElementInnerHTML('#resultsSection')
    deleteElementInnerHTML('#searchSection .selectedCityDiv')
    deleteElementValue('#cityInput')
}

// Display the City - State button below the cityInput in the search Section
const displaySearchSectionCityStateButton = (city, state) => {
    const cityStateButtonWrap = createSelectedCityWrapElement(city, state)
    document.querySelector('#searchSection .selectedCityDiv').append(cityStateButtonWrap)
}

// Display the number of obtained places in the resultsSection
const displayPlacesTotalCount = (city, state, totalCount) => {
    const totalCountElement = createElementByHTML('h1', `<strong>${totalCount}</strong> Imóveis à venda em ${city} - ${state}`)
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
const displaySearchResults = ({city, state, search: {result: {listings: resultsArray}}, search: {totalCount}}) => {
// city is the city name provided by the user already formated in Pascal Case (eg. Rio de Janeiro) (First letter os words smaller than 3 characters are not capitalized)
// state is the state acronym of the given city in upper case (eg. SP)
// resultsArray is an array of objects where each object contains all available data for the corresponding place to buy in the searched city
// totalCount is the total number of received places to buy in the searched city.
    eraseDisplayedData()
    displaySearchSectionCityStateButton(city, state)
    displayPlacesTotalCount(city, state, totalCount)
    displayResultsSectionCityStateButton(city, state)
    displayPlacesResults(resultsArray)
}

// Display a Message inside the resultsSection to indicate that an error happened during the HTTP request to the API to fetch the desired data
const displayErrorMessage = (status) => {
    eraseDisplayedData()
    const errorWrapElement = createErrorWrapElement(status)
    document.querySelector('#resultsSection').append(errorWrapElement)
}

// Perform the entire search for places to buy in the city provided by the userInput.
// It goes through all steps to process the received userInput string, get data from endpoint and display the results or the error message, accordingly
export const performSearch = async ({target: {value: userInput}}) => {
    let city = userInput
    city = normalizeCityName(city)
    // If the cityInput is empty (not counting whitespaces), no search is performed
    if (!city) return
    let state = findState(city)
    try {
        const response = await requestData(`https://private-9e061d-piweb.apiary-mock.com/venda?state=${state}&city=${city}`)
        // If the the HTTP request returned a failure status, it displays the error message instead of the results.
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
        displayErrorMessage('-')
    }
}