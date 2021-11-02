import { padronizeNumber, getSIfPlural, translateAmenitiesArray, setMoneyFormat } from "./DataHandling.js"

// Create HTML element of elementType with with the given text inside
const createElementByText = (elementType, text) => {
    const element = document.createElement(elementType)
    element.innerText = text
    return element
}

// Create HTML element of elementType with the given html inside
export const createElementByHTML = (elementType, html) => {
    const element = document.createElement(elementType)
    element.innerHTML = html
    return element
}

// Create the errorWrapElement, a div element with the error message and status inside.
export const createErrorWrapElement = (status) => {
    const opsElement = createElementByText('h1', 'OOOOPS!')
    const wrongSearchElement = createElementByText('h1', 'ALGO DEU ERRADO NA SUA BUSCA.')
    const errorStatusElement = createElementByText('h2', `status ${status}`)
    const tryAgainElement = createElementByText('h1', 'POR FAVOR, TENTE NOVAMENTE.')
    const errorWrapElement = document.createElement('div')
    errorWrapElement.id = 'errorDiv'
    errorWrapElement.append(opsElement, wrongSearchElement, errorStatusElement, tryAgainElement)
    return errorWrapElement
}

// Create a div element that contains a button with inner text set to city - state
export const createSelectedCityWrapElement = (city, state) => {
    const selectedCityButton = createElementByText('button', `${city} - ${state}`)
    selectedCityButton.type = 'button'
    selectedCityButton.classList.add('selectedCityButton')
    const selectedCityWrapElement = document.createElement('div')
    selectedCityWrapElement.append(selectedCityButton)
    return selectedCityWrapElement
}


// Create the .selectedCityDiv Element that contains the selectedCityWrapElement
export const createSelectedCityDivElement = (city, state) => {
    const selectedCityWrapElement = createSelectedCityWrapElement(city, state)
    const selectedCityDivElement = document.createElement('div')
    selectedCityDivElement.classList.add('selectedCityDiv')
    selectedCityDivElement.append(selectedCityWrapElement)
    return selectedCityDivElement
}

// Create image element setting src and alt attributes
const createImageElement = (imageURL, alt) => {
    const imageElement = document.createElement('img')
    imageElement.setAttribute('src', imageURL)
    imageElement.setAttribute('alt', alt)
    return imageElement
}

// Create homeSpacesElement: a div element with nested p elements with the numbers inside strong elements
const createHomeSpacesElement = ({totalArea, bedrooms, bathrooms, parkingSpaces}) => {
    const totalAreasElement = createElementByHTML('p', `<strong>${totalArea}</strong> m²`)
    const bedroomsElement = createElementByHTML('p', `<strong>${padronizeNumber(bedrooms)}</strong> Quarto${getSIfPlural(bedrooms)}`)
    const bathroomsElement = createElementByHTML('p', `<strong>${padronizeNumber(bathrooms)}</strong> Banheiro${getSIfPlural(bathrooms)}`)
    const parkingSpacesElement = createElementByHTML('p', `<strong>${padronizeNumber(parkingSpaces)}</strong> Vaga${getSIfPlural(parkingSpaces)}`)
    const homeSpacesElement = document.createElement('div')
    homeSpacesElement.classList.add('homeSpaces')
    homeSpacesElement.append(totalAreasElement, bedroomsElement, bathroomsElement, parkingSpacesElement)
    return homeSpacesElement
}

// Create a div element (class amenities) with all amenities names (translated to Portuguese) in a p element wraped by a div element
const createAmenitiesDivElement = (amenitiesArray) => {
    const amenitiesDivElement = document.createElement('div')
    amenitiesDivElement.classList.add('amenities')
    const portugueseAmenitiesArray = translateAmenitiesArray(amenitiesArray)
    portugueseAmenitiesArray.forEach((amenity) => {
        const amenityTextElement = createElementByText('p', amenity)
        const amenityElement = document.createElement('div')
        amenityElement.append(amenityTextElement)
        amenitiesDivElement.append(amenityElement)
    })
    return amenitiesDivElement
}

// Create a div element (class cardTopDiv) with all home data except pricing
const createCardTopDivElement = ({homeName, street, streetNumber, neighborhood, city, stateAcronym, amenitiesArray, bathrooms, bedrooms, parkingSpaces, totalArea}) => {
    const addressElement = createElementByText('p', `${street}, ${streetNumber} - ${neighborhood}, ${city} - ${stateAcronym}`)
    const homeNameElement = createElementByText('h3', homeName)
    const homeSpacesElement = createHomeSpacesElement({totalArea, bedrooms, bathrooms, parkingSpaces})
    const amenitiesDivElement = createAmenitiesDivElement(amenitiesArray)
    const cardTopDivElement = document.createElement('div')
    cardTopDivElement.classList.add('cardTopDiv')
    cardTopDivElement.append(addressElement, homeNameElement, homeSpacesElement, amenitiesDivElement)
    return cardTopDivElement
}

// Create a div element in the format: <div><strong>R$000.000</strong><p>Condomínio: <strong>R$000.000</strong></p></div>. The p element is only created if homeType is APARTMENT OR CONDOMINIUM
const createPricingInfosElement = ({price, monthlyCondoFee, homeType}) => {
    const pricingElement = createElementByText('strong', setMoneyFormat(price))
    const pricingInfosElement = document.createElement('div')
    pricingInfosElement.append(pricingElement)
    if (homeType === "APARTMENT" || homeType === "CONDOMINIUM") {
        const condoFeeElement = createElementByHTML('p', `Condomínio: <strong>${setMoneyFormat(monthlyCondoFee)}</strong>`)
        pricingInfosElement.append(condoFeeElement)
    }
    return pricingInfosElement
}

// Create a div element with two buttons (type button) inside with text TELEFONE and ENVIAR MENSAGEM, respectively
const createContactsElement = () => {
    const phoneButtonElement = createElementByText('button', 'TELEFONE')
    phoneButtonElement.type = 'button'
    const messageButtonElement = createElementByText('button', 'ENVIAR MENSAGEM')
    messageButtonElement.type = 'button'
    const contactsELement = document.createElement('div')
    contactsELement.append(phoneButtonElement, messageButtonElement)
    return contactsELement
}

// Create the div element (class cardBottomDiv) that contains both pricingInfosElement and contactsElement
const createCardBottomDivElement = ({price, monthlyCondoFee, homeType}) => {
    const pricingInfosElement = createPricingInfosElement({price, monthlyCondoFee, homeType})
    const contactsELement = createContactsElement()
    const cardBottomDivElement = document.createElement('div')
    cardBottomDivElement.classList.add('cardBottomDiv')
    cardBottomDivElement.append(pricingInfosElement, contactsELement)
    return cardBottomDivElement
}

// Create div element with all the information of place presented to the right of the image in the Home Card
const createHomeInfoElement = ({
    homeName,
    address: {street, streetNumber, neighborhood, city, stateAcronym},
    amenities: amenitiesArray,
    bathrooms: {[0]: bathrooms},
    bedrooms: {[0]: bedrooms},
    parkingSpaces: {[0]: parkingSpaces},
    pricingInfos: {[0]: {price, monthlyCondoFee}},
    usableAreas: {[0]: totalArea},
    unitTypes: {[0]: homeType}
}) => {
    const cardTopDivElement = createCardTopDivElement({homeName, street, streetNumber, neighborhood, city, stateAcronym, amenitiesArray, bathrooms, bedrooms, parkingSpaces, totalArea})
    const cardBottomDivElement = createCardBottomDivElement({price, monthlyCondoFee, homeType})
    const homeInfoElement = document.createElement('div')
    homeInfoElement.append(cardTopDivElement, cardBottomDivElement)
    return homeInfoElement
}

// Create article element (Home Card) with the imageElement and homeInfoElement inside
const createHomeCardElement = ({homeName, listing, imageURL}) => {
    const imageElement = createImageElement(imageURL, 'Home Image')
    const homeInfoElement = createHomeInfoElement({...listing, homeName})
    const homeCardElement = document.createElement('article')
    homeCardElement.append(imageElement, homeInfoElement)
    return homeCardElement
}

// Create an anchor tag around the homeCardElement
export const createHomeAnchorElement = (homeData) => {
    const homeCardElement = createHomeCardElement(homeData)
    const homeAnchorElement = document.createElement('a')
    homeAnchorElement.append(homeCardElement)
    return homeAnchorElement
}