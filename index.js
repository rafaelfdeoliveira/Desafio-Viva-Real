import { addSearchLogic, addEraseResultsLogic, makeNumericInputsOnlyAcceptDigits, applyRadioButtonsGroupLogic } from "./modules/ListeningEventsFunctions.js"

// Apply all Page javascript logic
const applyDynamicLogic = () => {
    addSearchLogic()
    addEraseResultsLogic()
    makeNumericInputsOnlyAcceptDigits()
    applyRadioButtonsGroupLogic()
}

applyDynamicLogic()