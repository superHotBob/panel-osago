import {STEPS_DESCRIPTION} from "../constants/OSAGO_FORM";
import update from 'immutability-helper'
import {dispatchWithWidgetId, selectByWidgetId} from "./widgetIdHelper";
import {REDUCER_TYPE_OSAGO_WIZARD} from "./reducers";
import {OSAGO_NUMBER_TYPE_GOV, OsagoDocs} from "../constants/osago";
import {
    getContractDataInitialState,
    VEHICLE_DOC_TYPE_TAB_RELATION
} from "../components/insurance-form/contract-fields-map";
import {getDocTypes, saveDocs} from "../api/modules/docs";
import {omit} from "lodash/object";
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import {osagoDocumentsMap} from "../utils/osago-documents-map";
import {buildTree} from "../utils/build-tree";
import docPreviews from '../assets/images/docs-preview/*.jpg'
import {getContractData} from "../api/modules/contractData";

const widgetInitialState = {
    step: null,
    ownerType: null,
    role: null,
    formData: {
        inn: '',
        hasTrailer: false,
        driverNumber: {value: null, label: 'Выбери нужный вариант'},
        policyStartOn: null,
        ownerRegistrationCity: {
            fiasId: '',
            fullTitle: ''
        }
    },
    numberType: OSAGO_NUMBER_TYPE_GOV,
    carNumber: '',
    carRegion: '',
    vin: '',
    insuredIsOwner: false,
    documents: {},
    scoringId: null,
    prescoringId: null,
    prescoringErrorCode: null,
    prescoringInfo: null,
    helpType: null,
    price: '',
    scoringResponseJson: {},
    registrationData: {
        phoneNumber: '',
        otpState: '',
        name: '',
        email: ''
    },
    loginData: {
        phoneNumber: '',
        otpState: '',
    },
    contractData: {},
    paymentType: null,
    paymentLink: null,
    paymentInvoiceDownloadKey: null,
    scoringResults: {
        insuranceCompany: '',
        isApproved: '',
        writtenPremium: '',
        baseTariff: '',
        bonusMalusRate: '',
        ageExperienceRate: '',
        cbTerritoryRate: '',
        trailerRate: '',
        restrictionRate: ''
    },
    vehicleDocumentTypeTab: {1: OsagoDocs.sts},
    docsTree: [],
    docTypes: [],
    insuranceCompany: ''
}

const REDUCER_TYPE = 'OSAGO_WIZARD'

const OsagoWizardActionType = {
    RESET: `${REDUCER_TYPE}/RESET`,
    RESET_NUMBER: `${REDUCER_TYPE}/RESET_NUMBER`,
    SET_CAR_NUMBER: `${REDUCER_TYPE}/SET_CAR_NUMBER`,
    SET_CAR_REGION: `${REDUCER_TYPE}/SET_CAR_REGION`,
    SET_VIN: `${REDUCER_TYPE}/SET_VIN`,
    SET_NUMBER_TYPE: `${REDUCER_TYPE}/SET_NUMBER_TYPE`,
    SET_PHONE_NUMBER: `${REDUCER_TYPE}/SET_PHONE_NUMBER`,
    SET_STEP: `${REDUCER_TYPE}/SET_STEP`,
    SET_INSURED_IS_OWNER: `${REDUCER_TYPE}/SET_INSURED_IS_OWNER`,
    SET_DOCUMENT: `${REDUCER_TYPE}/SET_DOCUMENT`,
    MOVE_NEXT: `${REDUCER_TYPE}/MOVE_NEXT`,
    SET_FORM_DATA: `${REDUCER_TYPE}/SET_FORM_DATA`,
    SET_SCORING_ID: `${REDUCER_TYPE}/SET_SCORING_ID`,
    SET_PRESCORING_ID: `${REDUCER_TYPE}/SET_PRESCORING`,
    SET_PRESCORING_INFO: `${REDUCER_TYPE}/SET_PRESCORING_INFO`,
    SET_PRESCORING_ERROR_CODE: `${REDUCER_TYPE}/SET_PRESCORING_ERROR`,
    SET_ROLE: `${REDUCER_TYPE}/SET_ROLE`,
    SET_TYPE: `${REDUCER_TYPE}/SET_TYPE`,
    SET_INSURANCE_COMPANY: `${REDUCER_TYPE}/SET_INSURANCE_COMPANY`,
    SET_HELP_TYPE: `${REDUCER_TYPE}/SET_HELP_TYPE`,
    SET_PRICE: `${REDUCER_TYPE}/SET_PRICE`,
    SET_REGISTRATION_DATA: `${REDUCER_TYPE}/SET_REGISTRATION_DATA`,
    SET_LOGIN_DATA: `${REDUCER_TYPE}/SET_LOGIN_DATA`,
    SET_CURRENT_WIDGET: `${REDUCER_TYPE}/SET_CURRENT_WIDGET`,
    SET_INITIAL_WIDGET: `${REDUCER_TYPE}/SET_INITIAL_WIDGET`,
    SET_CONTRACT_DATA: `${REDUCER_TYPE}/SET_CONTRACT_DATA`,
    SET_SCORING_RESPONSE_JSON: `${REDUCER_TYPE}/SET_SCORING_RESPONSE_JSON`,
    SET_INITIAL_CONTRACT_DATA: `${REDUCER_TYPE}/SET_INITIAL_CONTRACT_DATA`,
    SET_PAYMENT_TYPE: `${REDUCER_TYPE}/SET_PAYMENT_TYPE`,
    SET_PAYMENT_LINK: `${REDUCER_TYPE}/SET_PAYMENT_LINK`,
    SET_SCORING_RESULTS: `${REDUCER_TYPE}/SET_SCORING_RESULTS`,
    SET_PAYMENT_INVOICE_DOWNLOAD_KEY: `${REDUCER_TYPE}/SET_PAYMENT_INVOICE_DOWNLOAD_KEY`,
    SET_DOC_TREE: `${REDUCER_TYPE}/SET_DOCS_TREE`,
    SET_DOC_TYPES: `${REDUCER_TYPE}/SET_DOCS_TYPES`,
    SET_DOC_TAB: `${REDUCER_TYPE}/SET_DOC_TAB`
}

// ACTION CREATORS
export const setInitialWidgetAction = () => {
    return {type: OsagoWizardActionType.SET_INITIAL_WIDGET, payload: {}}
}

export const setInitialContractDataAction = () => {
    return {type: OsagoWizardActionType.SET_INITIAL_CONTRACT_DATA, payload: {}}
}

export const resetWizardAction = () => {
    return {type: OsagoWizardActionType.RESET, payload: {}};
}

export const resetNumberAction = () => {
    return {type: OsagoWizardActionType.RESET_NUMBER, payload: {}};
}

export const setNumberTypeAction = type => {
    return {type: OsagoWizardActionType.SET_NUMBER_TYPE, payload: {type}};
}

export const setPhoneNumberAction = phoneNumber => {
    return {type: OsagoWizardActionType.SET_PHONE_NUMBER, payload: {phoneNumber}};
}

export const setStepAction = step => {
    return {type: OsagoWizardActionType.SET_STEP, payload: {step}};
}

export const setDocumentAction = ({id, file, blobId, preview, completed}) => {
    return {type: OsagoWizardActionType.SET_DOCUMENT, payload: {[id]: {file, blobId, preview, completed}}}
}

export const setInsuredIsOwnerAction = value => {
    return {type: OsagoWizardActionType.SET_INSURED_IS_OWNER, payload: {value}};
}

export const setRoleAction = role => {
    return {type: OsagoWizardActionType.SET_ROLE, payload: {role}};
}

export const setOwnerTypeAction = type => {
    return {type: OsagoWizardActionType.SET_TYPE, payload: {type}};
}

export const setInsuranceCompanyAction = insuranceCompany => {
    return {type: OsagoWizardActionType.SET_INSURANCE_COMPANY, payload: {insuranceCompany}};
}

export const setCarNumberAction = carNumber => {
    return {type: OsagoWizardActionType.SET_CAR_NUMBER, payload: {carNumber}};
}

export const setCarRegionAction = carRegion => {
    return {type: OsagoWizardActionType.SET_CAR_REGION, payload: {carRegion}};
}

export const setVinAction = vin => {
    return {type: OsagoWizardActionType.SET_VIN, payload: {vin}};
}

export const setFormDataAction = formData => {
    return {type: OsagoWizardActionType.SET_FORM_DATA, payload: formData};
}

export const setScoringIdAction = scoringId => {
    return {type: OsagoWizardActionType.SET_SCORING_ID, payload: {scoringId}};
}

export const setPrescoringIdAction = prescoringId => {
    return {type: OsagoWizardActionType.SET_PRESCORING_ID, payload: {prescoringId}};
}

export const setPrescoringInfoAction = prescoringInfo => {
    return {type: OsagoWizardActionType.SET_PRESCORING_INFO, payload: {prescoringInfo}};
}

export const setPrescoringErrorAction = prescoringErrorCode => {
    return {type: OsagoWizardActionType.SET_PRESCORING_ERROR_CODE, payload: {prescoringErrorCode}};
}

export const setHelpTypeAction = helpType => {
    return {type: OsagoWizardActionType.SET_HELP_TYPE, payload: {helpType}};
}

export const setPriceAction = price => {
    return {type: OsagoWizardActionType.SET_PRICE, payload: {price}};
}

export const setRegistrationDataAction = data => {
    return {type: OsagoWizardActionType.SET_REGISTRATION_DATA, payload: data};
}

export const setLoginDataAction = data => {
    return {type: OsagoWizardActionType.SET_LOGIN_DATA, payload: data};
}

export const setContractDataAction = ({field, data}) => {
    return {type: OsagoWizardActionType.SET_CONTRACT_DATA, payload: {field, data}};
}

export const setScoringResponseJsonAction = (scoringResponseJson) => {
    return {type: OsagoWizardActionType.SET_SCORING_RESPONSE_JSON, payload: {scoringResponseJson}};
}

export const setPaymentTypeAction = (paymentType) => {
    return {type: OsagoWizardActionType.SET_PAYMENT_TYPE, payload: {paymentType}};
}

export const setPaymentLinkAction = (paymentLink) => {
    return {type: OsagoWizardActionType.SET_PAYMENT_LINK, payload: {paymentLink}};
}

export const setPaymentInvoiceDownloadKeyAction = (paymentInvoiceDownloadKey) => {
    return {type: OsagoWizardActionType.SET_PAYMENT_INVOICE_DOWNLOAD_KEY, payload: {paymentInvoiceDownloadKey}};
}

export const setScoringResultsAction = (scoringResults) => {
    return {type: OsagoWizardActionType.SET_SCORING_RESULTS, payload: {scoringResults}};
}

export const setDocsTabAction = tab => (widgetId) => {
    return {type: OsagoWizardActionType.SET_DOC_TAB, payload: {data: {tab}, widgetId}};
}

export const setDocsTypeAction = (docTypes, widgetId) => {
    return {type: OsagoWizardActionType.SET_DOC_TYPES, payload: {data: {docTypes}, widgetId}};
}

export const setDocsTreeAction = (widgetId) => async (dispatch, getState) => {
    const {formData, scoringId, vehicleDocumentTypeTab, documents, ownerType} = selectOsagoWizardById(widgetId)(getState())
    const driverCount = formData?.driverNumber?.value

    // load required docs
    let response = await getDocTypes({
        scoringId,
        driverCount,
        vehicleDocumentType: VEHICLE_DOC_TYPE_TAB_RELATION[vehicleDocumentTypeTab[1]]
    })

    const buildTreeAction = widgetId => {
        dispatch(setDocsTypeAction(types, widgetId))

        // add extra fields to types response
        const mappedTypes = osagoDocumentsMap(types, docPreviews, ownerType)
        const docsTree = buildTree(mappedTypes, 'parentTypeId', 'order')
        dispatch({type: OsagoWizardActionType.SET_DOC_TREE, payload: {data: {docsTree}, widgetId}})
    }

    let {types} = await response.json()
    const driversAmount = driverCount === 'no-restriction' ? 0 : driverCount
    if (driversAmount < Object.keys(documents).length) {
        const keysToOmit = OsagoDocs.driverLicense
            .slice(driversAmount * 2, OsagoDocs.driverLicense.length)
            .map(v => `${v}`)
        const newDocuments = omit(documents, keysToOmit)
        await saveDocs(scoringId, newDocuments)
        buildTreeAction(widgetId)
    } else {
        await saveDocs(scoringId, documents)
        buildTreeAction(widgetId)
    }
    return true;
}

export const moveNext = data => (widgetId, dispatch, getState) => {
    const state = getState();
    const {step} = selectOsagoWizardById(widgetId)(state)
    if (step) {
        return dispatchWithWidgetId(
            widgetId,
            setStepAction(STEPS_DESCRIPTION[step].nextStep(data, widgetId, getState))
        )
    } else {
        return dispatchWithWidgetId(
            widgetId,
            setStepAction(null)
        )
    }
}

export const getContractDataUntil = (condition, interval = 1000) => async (widgetId, dispatch, getState) => {
    const {scoringId} = selectOsagoWizardById(widgetId)(getState());
    let contractData = null;
    let conditionResult = null
    do {
        const response = await getContractData(scoringId);
        contractData = await response.json();
        conditionResult = condition(contractData)
        await new Promise(r => setTimeout(r, interval));
    } while (!conditionResult);
}

export const waitAllScoringResults = () => async (widgetId, dispatch, getState) => {
     dispatch(dispatchWithWidgetId(
        widgetId,
        getContractDataUntil(contractData => {
            const wizardData = selectOsagoWizardById(widgetId)(getState());
            const {scoringResults} = contractData;
            if (!isEqual(scoringResults, wizardData.scoringResults)) {
                dispatch(dispatchWithWidgetId(widgetId, setScoringResultsAction(scoringResults)));
            }
            const approvedScoringResult = find(scoringResults, result => result.isApproved)
            if (!wizardData.insuranceCompany && approvedScoringResult) {
                dispatch(dispatchWithWidgetId(widgetId, setInsuranceCompanyAction(approvedScoringResult.insuranceCompany)));
            }
            return !find(scoringResults, result => result.isPending);
        })
    ))
}


// REDUCER
export const reduceOsagoWizard = (state = {}, {type, payload}) => {
    const widgetId = payload ? payload.widgetId : null;

    switch (type) {
        case OsagoWizardActionType.SET_INITIAL_WIDGET: {
            return update(state, {
                [widgetId]: {
                    $set: widgetInitialState
                }
            })
        }

        case OsagoWizardActionType.SET_INITIAL_CONTRACT_DATA: {

            const driversCount =
                (!state[widgetId].formData.driverNumber.value || state[widgetId].formData.driverNumber.value === 'no-restrictions') ?
                    1 : state[widgetId].formData.driverNumber.value
            return update(state, {
                [widgetId]: {
                    contractData: {
                        $merge: getContractDataInitialState(driversCount, state[widgetId].ownerType)
                    }
                }
            })
        }

        case OsagoWizardActionType.SET_STEP: {
            return update(state, {
                [widgetId]: {
                    $merge: {step: payload.data.step}
                }
            })
        }

        case OsagoWizardActionType.SET_NUMBER_TYPE: {
            return update(state, {
                [widgetId]: {
                    $merge: {numberType: payload.data.type}
                }
            })
        }

        case OsagoWizardActionType.SET_PHONE_NUMBER: {
            return update(state, {
                [widgetId]: {
                    $merge: {phoneNumber: payload.data.phoneNumber}
                }
            })
        }

        case OsagoWizardActionType.SET_SCORING_RESPONSE_JSON: {
            return update(state, {
                [widgetId]: {
                    $merge: {scoringResponseJson: payload.data.scoringResponseJson}
                }
            })
        }

        case OsagoWizardActionType.SET_ROLE: {
            return update(state, {
                [widgetId]: {
                    $merge: {role: payload.data.role}
                }
            })
        }

        case OsagoWizardActionType.SET_TYPE: {
            return update(state, {
                [widgetId]: {
                    $merge: {ownerType: payload.data.type}
                }
            })
        }

        case OsagoWizardActionType.SET_INSURANCE_COMPANY: {
            return update(state, {
                [widgetId]: {
                    $merge: {insuranceCompany: payload.data.insuranceCompany}
                }
            })
        }

        case OsagoWizardActionType.SET_CAR_NUMBER: {
            return update(state, {
                [widgetId]: {
                    $merge: {carNumber: payload.data.carNumber}
                }
            })
        }

        case OsagoWizardActionType.SET_CAR_REGION: {
            return update(state, {
                [widgetId]: {
                    $merge: {carRegion: payload.data.carRegion}
                }
            })
        }

        case OsagoWizardActionType.SET_VIN: {
            return update(state, {
                [widgetId]: {
                    $merge: {vin: payload.data.vin}
                }
            })
        }

        case OsagoWizardActionType.SET_SCORING_ID: {
            return update(state, {
                [widgetId]: {
                    $merge: {scoringId: payload.data.scoringId}
                }
            })
        }

        case OsagoWizardActionType.SET_PRESCORING_ID: {
            return update(state, {
                [widgetId]: {
                    $merge: {prescoringId: payload.data.prescoringId}
                }
            })
        }

        case OsagoWizardActionType.SET_PRESCORING_INFO: {
            return update(state, {
                [widgetId]: {
                    $merge: {prescoringInfo: payload.data.prescoringInfo}
                }
            })
        }

        case OsagoWizardActionType.SET_PRESCORING_ERROR_CODE: {
            return update(state, {
                [widgetId]: {
                    $merge: {prescoringErrorCode: payload.data.prescoringErrorCode}
                }
            })
        }

        case OsagoWizardActionType.SET_HELP_TYPE: {
            return update(state, {
                [widgetId]: {
                    $merge: {helpType: payload.data.helpType}
                }
            })
        }

        case OsagoWizardActionType.SET_PRICE: {
            return update(state, {
                [widgetId]: {
                    $merge: {price: payload.data.price}
                }
            })
        }

        case OsagoWizardActionType.SET_INSURED_IS_OWNER: {
            return update(state, {
                [widgetId]: {
                    $merge: {insuredIsOwner: payload.data.value}
                }
            })
        }

        case OsagoWizardActionType.SET_DOCUMENT: {
            return update(state, {
                [widgetId]: {
                    documents: {
                        $merge: payload.data
                    }
                }
            })
        }

        case OsagoWizardActionType.SET_REGISTRATION_DATA: {
            return update(state, {
                [widgetId]: {
                    $merge: {registrationData: payload.data}
                }
            })
        }

        case OsagoWizardActionType.SET_LOGIN_DATA: {
            return update(state, {
                [widgetId]: {
                    $merge: {loginData: payload.data}
                }
            })
        }

        case OsagoWizardActionType.SET_FORM_DATA: {
            return update(state, {
                [widgetId]: {
                    formData: {
                        $merge: payload.data
                    }
                }
            })
        }

        case OsagoWizardActionType.SET_DOC_TREE: {
            return update(state, {
                [widgetId]: {
                    $merge: {docsTree: payload.data.docsTree}
                }
            })
        }

        case OsagoWizardActionType.SET_DOC_TYPES: {
            return update(state, {
                [widgetId]: {
                    $merge: {docTypes: payload.data.docTypes}
                }
            })
        }

        case OsagoWizardActionType.SET_DOC_TAB: {
            return update(state, {
                [widgetId]: {
                    $merge: {vehicleDocumentTypeTab: payload.data.tab}
                }
            })
        }

        case OsagoWizardActionType.SET_CONTRACT_DATA: {
            return update(state, {
                [widgetId]: {
                    contractData: {
                        [payload.data.field]: {
                            $merge: payload.data.data
                        }
                    }
                }
            })
        }

        case OsagoWizardActionType.SET_PAYMENT_TYPE: {
            return update(state, {
                [widgetId]: {
                    $merge: {paymentType: payload.data.paymentType}
                }
            })
        }

        case OsagoWizardActionType.SET_PAYMENT_LINK: {
            return update(state, {
                [widgetId]: {
                    $merge: {paymentLink: payload.data.paymentLink}
                }
            })
        }

        case OsagoWizardActionType.SET_PAYMENT_INVOICE_DOWNLOAD_KEY: {
            return update(state, {
                [widgetId]: {
                    $merge: {paymentInvoiceDownloadKey: payload.data.paymentInvoiceDownloadKey}
                }
            })
        }

        case OsagoWizardActionType.RESET: {
            return update(state, {
                [widgetId]: {
                    $merge: {
                        ...widgetInitialState,
                        carNumber: state[widgetId].carNumber,
                        carRegion: state[widgetId].carRegion,
                        vin: state[widgetId].vin,
                        numberType: state[widgetId].numberType,
                    }
                }
            })
        }

        case OsagoWizardActionType.RESET_NUMBER: {
            return update(state, {
                [widgetId]: {
                    $merge: {
                        ...widgetInitialState,
                        numberType: state[widgetId].numberType,
                        carNumber: '',
                        carRegion: '',
                        vin: '',
                    }
                }
            })
        }

        case OsagoWizardActionType.SET_SCORING_RESULTS: {
            return update(state, {
                [widgetId]: {
                    $merge: {scoringResults: payload.data.scoringResults}
                }
            })
        }

        default:
            return state
    }
}

// SELECTORS
export const selectOsagoWizard = state => state.OsagoWizard;

export const selectOsagoWizardById = widgetId => selectByWidgetId(widgetId, REDUCER_TYPE_OSAGO_WIZARD);

export const selectOsagoWizardByIdState = (widgetId, state) => selectOsagoWizardById(widgetId)(state);

export const selectStep = (widgetId, state) => selectOsagoWizardByIdState(widgetId, state).step;

export const selectRole = (widgetId, state) => selectOsagoWizardByIdState(widgetId, state).role;

export const selectHelpType = (widgetId, state) => selectOsagoWizardByIdState(widgetId, state).helpType;
