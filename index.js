import { addSearchLogic, addEraseResultsLogic, addRadioButtonsGroupLogic } from "./modules/ListeningEventsFunctions.js"

// Apply all Page javascript logic
const applyDynamicLogic = () => {
    addSearchLogic()
    addEraseResultsLogic()
    addRadioButtonsGroupLogic()
}

applyDynamicLogic()