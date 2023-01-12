import {ORGANIZATION_TYPE_INDIVIDUAL, ORGANIZATION_TYPE_LEGAL} from "/constants/osago";
import {
    getCargoUrl,
    getCurrentUrl,
    getInjuryUrl,
    getLiabilityUrl,
    getProDriveUrl,
    isEqualWithoutProtocol
} from "../utils/urls";

const doGTagTrack = (eventName, data) => {
    try {
        if (window.hasOwnProperty('gtagMust')) {
            gtagMust('event', eventName, data);
        }
    } catch (e) {

    }
}
let allResourcesLoaded = false
const beforeAllResourcesLoaded = [];
const partnerEventsBeforeAllResourcesLoaded = [];
window.addEventListener('load', (event) => {
    allResourcesLoaded = true;
    for (const partnerEvent of partnerEventsBeforeAllResourcesLoaded) {
        doPartnerTrack(partnerEvent);
    }
    for (let {clickType, reachGoal} of beforeAllResourcesLoaded) {
        AddTrack(clickType, reachGoal);
    }
});

const doPartnerTrack = (event) => {
    if (!allResourcesLoaded) {
        partnerEventsBeforeAllResourcesLoaded.push(event);
    } else {
        try {
            if (getYaCounterId()) ym(getYaCounterId(), 'reachGoal', event)
            if (window.google_tag_manager) dataLayer.push({
                event: 'autoEvent',
                eventCategory: 'Mustins',
                eventAction: event
            })
        } catch (e) {

        }
    }
}

const carrotQuestTrack = target => {
    try {
        // console.log('carrotQuestTrack', target)
        if (window.hasOwnProperty('carrotquest')) {
            carrotquest.track(target);
        }
    } catch (e) {

    }
}
const carrotQuestIdentify = (name, value) => {
    try {
        // console.log('carrotQuestIdentify', name, value)
        if (window.hasOwnProperty('carrotquest')) {
            carrotquest.identify([
                {op: 'update_or_create', key: `$${name}`, value}
            ]);
        }
    } catch (e) {

    }
}

export const calculatorTrack = (carCounter, moneyCounter) => {
    try {
        if (window.hasOwnProperty('gtagMust')) {
            trackEvent('click', { type: 'calculator', vehicles: carCounter, av_revenue: moneyCounter });
        }
    } catch (e) {

    }
}

export const AddTrack = clickType => {
    const reachGoal = `click_${clickType}`;
    if (!allResourcesLoaded) {
        beforeAllResourcesLoaded.push({ clickType, reachGoal });
        return;
    }

    try {
        if (getYaCounterId()) {
            ym(getYaCounterId(), 'reachGoal', reachGoal);
        }

        if (window.google_tag_manager) {
            dataLayer.push({
                event: 'autoEvent',
                eventCategory: 'clicks',
                eventAction: clickType,
                clickType
            });

            dataLayer.push({ event: 'autoEventGA4', clickType });
        }
        // console.log(clickType, reachGoal)
    } catch (e) {}
};

export const tracking = {
    osagoPriceButton: evt => {
        if (evt.target.closest('#must-eosago-insurance-form')) {
            carrotQuestTrack('Нажал кнопку узнать цену на стартовой главной')
        }
        if (evt.target.closest('#must-eosago-insurance-form-bottom')) {
            carrotQuestTrack('Нажал кнопку узнать цену внизу страницы')
        }
    },
    osagoPersonStatus: status => {
        if (status === ORGANIZATION_TYPE_INDIVIDUAL) {
            carrotQuestTrack('Выбрал физ. лицо')
        }
        if (status === ORGANIZATION_TYPE_LEGAL) {
            carrotQuestTrack('Выбрал юр. лицо')
        }
    },
    osagoCalcCost: status => {
        carrotQuestTrack('Нажал кнопку рассчитать стоимость (попап калькулятора)')
    },
    osagoIssuePolicy: status => {
        carrotQuestTrack('Нажал кнопку оформить полис (попап с предварительной стоимостью)')
    },
    osagoRegister: status => {
        carrotQuestTrack('Нажал кнопку оформить ОСАГО (попап регистрации)')
    },
    osagoConfirmPhone: status => {
    },
    osagoFinished: status => {
        let event = 'thanks_fiz_osago';
        if (status === ORGANIZATION_TYPE_LEGAL) {
            event = 'find_price_legal_osago_success'
        }
        carrotQuestTrack('Нажал кнопку Спасибо, ожидаю')
    },
    osagoCallbackValid: () => {
    },
    osagoCallbackValidSuccess: () => {
    },
    osagoCallback: () => {
        carrotQuestTrack('Нажал кнопку Перезвоните мне (заказ обратного звонка)')
    },
    osagoSubscribe: email => {
        carrotQuestTrack('Нажал кнопку получать новости (в разделе подписки)')
        carrotQuestIdentify('email', email)
    },
    osagoStatusPersonAgent: () => {
    },
    osagoStatusPersonOwnerTruck: () => {
    },
    osagoOperatorAssistanceAgent: () => {
    },
    osagoArrangeAloneAgent: () => {
    },
    osagoOperatorAssistanceOwner: () => {
    },
    osagoArrangeAloneOwner: () => {
    },
    reconstructionSubscribe: email => {
        const currentUrl = getCurrentUrl();

        if (isEqualWithoutProtocol(currentUrl, getLiabilityUrl())) {
            carrotQuestTrack('Подписка на реконструкции ГОП');
        } else if (isEqualWithoutProtocol(currentUrl, getInjuryUrl())) {
            carrotQuestTrack('Подписка на реконструкции НС');
        } else if (isEqualWithoutProtocol(currentUrl, getCargoUrl())) {
            carrotQuestTrack('Подписка на реконструкции Грузы');
        } else if (isEqualWithoutProtocol(currentUrl, getProDriveUrl())) {
            carrotQuestTrack('Подписка на реконструкции Турнир');
        }

        carrotQuestIdentify('email', email)
    },

}

export const trackingReachGoal = (fn, ...args) => {
    try {
        fn(...args)
    } catch (e) {
        console.error('event tracking error', e.message)
    }
}

export const trackEvent = (eventName, eventData) => {
    doGTagTrack(eventName, eventData)
}

export const trackPartnerEvent = eventName => doPartnerTrack(eventName)

export const TrackingEventName = {
    ACTIONS_WIGETLOADED: 'actions.wigetLoaded',

    SCREEN_GETNUMBER_PUTIN: 'screen.getNumber.putIn',
    SCREEN_GETNUMBER_SELECTED: 'screen.getNumber.selected',
    SCREEN_GETNUMBER_SUBMIT: 'screen.getNumber.submit',

    SCREEN_CUSTOMERTYPE_LOADED: 'screen.customerType.loaded',
    SCREEN_CUSTOMERTYPE_SELECTED: 'screen.customerType.selected',
    SCREEN_CUSTOMERTYPE_SUBMIT: 'screen.customerType.submit',

    SCREEN_DATACOLLECTION_STARTED: 'screen.dataCollection.started',
    SCREEN_DATACOLLECTION_FINISHED: 'screen.dataCollection.finished',

    SCREEN_ERROR_LOADED: 'screen.error.loaded',
    SCREEN_ERROR_TRYAGAIN: 'screen.error.tryAgain',

    SCREEN_POLICYINFO_LOADED: 'screen.policyInfo.loaded',
    SCREEN_POLICYINFO_SELECTED: 'screen.policyInfo.selected',
    SCREEN_POLICYINFO_SUBMIT: 'screen.policyInfo.submit',
    SCREEN_POLICYINFO_PUTIN: 'screen.policyInfo.putIn',
    SCREEN_POLICYINFO_CONFIRMED: 'screen.policyInfo.confirmed',

    SCREEN_REGISTRATIONDATA_LOADED: 'screen.registrationData.loaded',
    SCREEN_REGISTRATIONDATA_PUTIN: 'screen.registrationData.putIn',
    SCREEN_REGISTRATIONDATA_SELECTED: 'screen.registrationData.selected',
    SCREEN_REGISTRATIONDATA_CLICKED: 'screen.registrationData.clicked',
    SCREEN_REGISTRATIONDATA_SUBMIT: 'screen.registrationData.submit',
    SCREEN_REGISTRATIONDATA_APPROVED: 'screen.registrationData.approved',

    SCREEN_SCORING_STARTED: 'screen.scoring.started',
    SCREEN_SCORING_FINISHED: 'screen.scoring.finished',

    SCREEN_BENEFIT_LOADED: 'screen.benefit.loaded',
    SCREEN_BENEFIT_SUBMIT: 'screen.benefit.submit',

    SCREEN_INSURANCETYPE_LOADED: 'screen.insuranceType.loaded',
    SCREEN_INSURANCETYPE_SELECTED: 'screen.insuranceType.selected',
    SCREEN_INSURANCETYPE_SUBMIT: 'screen.insuranceType.submit',

    SCREEN_NEEDHELP_LOADED: 'screen.needHelp.loaded',
    SCREEN_NEEDHELP_SELECTED: 'screen.needHelp.selected',
    SCREEN_NEEDHELP_SUBMIT: 'screen.needHelp.submit',

    SCREEN_CHECKINFO_LOADED: 'screen.checkInfo.loaded',
    SCREEN_CHECKINFO_SUBMIT: 'screen.checkInfo.submit',
    SCREEN_CHECKINFO_APPROVED: 'screen.checkInfo.approved',

    SCREEN_COVEROFFER_LOADED: 'screen.coverOffer.loaded',
    SCREEN_COVEROFFER_SUBMIT: 'screen.coverOffer.submit',
    SCREEN_COVEROFFER_CLICKED: 'screen.coverOffer.clicked',

    SCREEN_PAYMENTMETHOD_LOADED: 'screen.paymentMethod.loaded',
    SCREEN_PAYMENTMETHOD_SELECTED: 'screen.paymentMethod.selected',
    SCREEN_PAYMENTMETHOD_SUBMIT: 'screen.paymentMethod.submit',

    SCREEN_POLICYLINK_LOADED: 'screen.policyLink.loaded',
    SCREEN_POLICYLINK_SUBMIT: 'screen.policyLink.submit',

    ACTIONS_SUCCESSPAYMENT: 'actions.successPayment',

    SCREEN_INVOICE_LOADED: 'screen.invoice.loaded',
    SCREEN_INVOICE_PUTIN: 'screen.invoice.putIn',
    SCREEN_INVOICE_SUBMIT: 'screen.invoice.submit',
    SCREEN_INVOICE_DOWNLOAD: 'screen.invoice.download',

    SCREEN_THANKS_LOADED: 'screen.thanks.loaded',
    SCREEN_THANKS_CLICKED: 'screen.thanks.clicked',

    SCREEN_PAYMENTPROOF_LOADED: 'screen.paymentProof.loaded',
    SCREEN_PAYMENTPROOF_UPLOADED: 'screen.paymentProof.uploaded',
    SCREEN_PAYMENTPROOF_SUBMIT: 'screen.paymentProof.submit',
}

export const PartnerEventName = {
    STEP_1_GET_NUMBER: '1_getNumber',
    STEP_2_CUSTOMER_TYPE: '2_customerType',
    // STEP_3_ENTERPRENEUER_INFO: '3_enterpreneuerInfo',
    STEP_3_PERSONAL_DATA: '3_personalData',
    STEP_4_PREDICTED_PRICE: '4_predictedPrice',
    STEP_5_NEED_HELP: '5_needHelp',
    STEP_6_DOCUMENTS: '6_documents',
    STEP_7_CHECK_INFO: '7_checkInfo',
    STEP_8_PAYMENT_METHOD: '8_paymentMethod',
    STEP_9_INVOICE: '9_invoice',
    STEP_ERROR1: 'error1',
    STEP_ERROR2: 'error2',
}

export const CustomEventName = {
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    ADD_CAR: 'add_car',
    REQUEST_HISTORY: 'request_history',
    REFRESH_CARD: 'refresh_card',
    SHOW_CARD: 'show_card',
    ISSUE_BUTTON: 'issue_button',
    REDUCE_ACCIDENT: 'reduce_accident',
    SiX_MONTHS: '6months',
    ISSUE_BUTTON2: 'issue_button2',
    ONE_YEAR: '1year',
    PLUS_PRO: 'plus_pro',
    ADD_ITEM: 'add_item',
    PRICE_199_PER_MONTH: 'price_199_per_month',
    PRICE_599_PER_MONTH: 'price_599_per_month',
    PROFILE: 'profile',
    MY_VEHICLES: 'my_vehicles',
    MY_HISTORY: 'my_history',
    SUBSCRIPTONS: 'subscriptons',
    SEND_SPECIAL_CONDS: 'send_special_conds',
}
