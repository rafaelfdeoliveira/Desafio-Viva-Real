import { createErrorWrapElement, createElementByHTML, createSelectedCityDivElement, createSelectedCityWrapElement, createHomeAnchorElement } from "./FactoryFunctions.js"

// Make a GET HTTP request to the given url and returns a promise of the request response
export const requestData = async (url) => fetch(url)

// Convert the JSON response to a javascript object
export const getData = async (response) => response.json()

// Return the State Acronym where the given city is located according to the cityStateDict
export const findState = (city) => {
    const cityStateDict = {
        ['rio-de-janeiro']: "rj",
        ['sao-paulo']: "sp"
    }
    return cityStateDict[city]
}

// Normalize the rawCity string to the format of only lower case letters with no accents, and the words separated by a dash (eg: sao-paulo)
export const normalizeCityName = (rawcity) => {
    return rawcity.trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Convert the simpleCityName (obtained from the normalizeCityName function above) to the format of words separed by a space. Only if the word has 3 or more letters, its first letter is capitalized (eg: Rio de Janeiro)
export const getDefaultCityName = (simpleCityName) => {
    return simpleCityName.replace(/^.|(?<=-)[a-z](?=[a-z]{2})/g, (match) => match.toUpperCase()).replace(/-/g, " ")
}

// Convert all characters to Upper Case
export const getStringToUpperCase = (string) => string.toUpperCase()

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

// Erase all dynamic elements in the DOM, cleaning any data from a previous search still visible
export const eraseDisplayedResults = () => {
    const resultsSection = document.querySelector('#resultsSection')
    resultsSection.innerHTML = ""
    const selectedCityDivInSearchSection = document.querySelector('#searchSection .selectedCityDiv')
    selectedCityDivInSearchSection.innerHTML = ""
}

// Display a Message inside the resultsSection to indicate that an error happened during the HTTP request to the API to fetch the desired data
export const displayErrorMessage = (status="-") => {
    const errorWrapElement = createErrorWrapElement(status)
    const resultsSection = document.querySelector('#resultsSection')
    resultsSection.append(errorWrapElement)
}

// Erase search Input
const eraseSearchInput = () => {
    const cityInput = document.querySelector('#cityInput')
    cityInput.value = ""
}

// Display all Dynamic Elements on the screen with the given information
// resultsArray is an array of objects where each object contains all available data for the corresponding place to buy
// totalCount is the total number of received places to buy in the selected city.
export const displaySearchResults = ({city, state, search: {result: {listings: resultsArray}}, search: {totalCount}}) => {

    // Create totalCountElement
    const totalCountElement = createElementByHTML('h1', `<strong>${totalCount}</strong> Imóveis à venda em ${city} - ${state}`)
    
    // Create selectedCityDivElement
    const selectedCityDivElement = createSelectedCityDivElement(city, state)

    // Add the selectedCity button below the cityInput in the search Section
    const searchAreaSelectedCityDivElement = document.querySelector('#searchSection .selectedCityDiv')
    searchAreaSelectedCityDivElement.append(createSelectedCityWrapElement(city, state))


    // Add totalCountElement and selectedCityDivElement to the resultsSection
    const resultsSection = document.querySelector('#resultsSection')
    resultsSection.append(totalCountElement, selectedCityDivElement)

    // For each individual collection of Data a Card Element is created and inserted inside the resultsSection
    resultsArray.forEach(({link: {name: homeName}, listing, medias: {[0]: {url: imageURL}}}) => {
        const homeAnchorElement = createHomeAnchorElement({homeName, listing, imageURL})
        // Add the homeAnchorElement to the resultsSection
        resultsSection.append(homeAnchorElement)
    })

    eraseSearchInput()
}