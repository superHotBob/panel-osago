import {ChooseRoleStep} from "../components/insurance-form/steps/choose-role-step/ChooseRoleStep";
import React from 'react'
import {ChooseOwnerTypeStep} from "../components/insurance-form/steps/choose-owner-step/ChooseOwnerTypeStep";
import PrescoringErrorStep from "../components/insurance-form/PrescoringErrorStep";
import {LoadingInitialInfoProgressStep} from "../components/insurance-form/steps/loading-initial-info-progress-step/LoadingInitialInfoProgressStep"
import {LoadingScoringInfoProgressStep} from "../components/insurance-form/steps/loading-initial-info-progress-step/LoadingScoringInfoProgressStep"
import MainOsagoForm from "../components/insurance-form/MainOsagoForm";
import {HELP_TYPE_OPERATOR, ORGANIZATION_TYPE_LEGAL, PAYMENT_TYPE_BILL, ROLE_TYPE_AGENT} from "./osago";
import {ChooseHelpStepAgent} from "../components/insurance-form/ChooseHelpStepAgent";
import {ChooseHelpStepOwner} from "../components/insurance-form/ChooseHelpStepOwner";
import SubscribeModal from "../components/insurance-form/SubscribeModal";
import AwaitingOperatorCall from "../components/insurance-form/steps/awaiting-operator-call/AwaitingOperatorCall";
import ApplyStep from "../components/insurance-form/ApplyStep";
import RegistrationStepPhoneConnected from "../components/insurance-form/RegistrationStepPhoneConnected";
import RegistrationStepSmsConnected from "../components/insurance-form/RegistrationStepSmsConnected";
import LoginPhoneStepConnected from "../components/insurance-form/LoginPhoneStepConnected";
import LoginStepSmsConnected from "../components/insurance-form/LoginStepSmsConnected";
import {UploadDocumentsStep} from "../components/insurance-form/UploadDocumentsStep";
import {FillContractDataStep} from "../components/insurance-form/FillContractDataStep";
import {ShowScoringInfo} from "../components/insurance-form/ShowScoringInfo"
import SelectPaymentMethodStep
    from "../components/insurance-form/steps/select-payment-method-step/SelectPaymentMethodStep";
import GoPayStep from "../components/insurance-form/steps/go-pay-step/GoPayStep";
import GoUploadBillStep from "../components/insurance-form/steps/go-upload-bill-step/GoUploadBillStep";
import GetBillStep from "../components/insurance-form/steps/get-bill-step/GetBillStep";
import {UploadBillStep} from "../components/insurance-form/steps/upload-bill-step/UploadBillStep";
import FinishStep from "../components/insurance-form/steps/finish-step/FinishStep";
import {UploadOrganizationDocumentsStep} from "../components/insurance-form/steps/upload-organization-documents/UploadOrganizationDocumentsStep";
import {ChooseInsuranceCompanyStep} from "../components/insurance-form/steps/choose-insurance-company-step/ChooseInsuranceCompanyStep";
import {selectHelpType, selectRole} from '../redux/osagoWizardReducer';
import {SignContractStep} from '../components/insurance-form/steps/sign-contract-step/SignContractStep';
import ShturmanUnhappySvg from '../svg/shturman-unhappy.svg';
import { BenefitDetailsStep } from "../components/insurance-form/steps/benefit-details-step/BenefitDetailsStep";

export const FORM_STEPS = {
    ROLE: 'ROLE',
    OWNER_TYPE: 'OWNER_TYPE',
    WAIT_FOR_PRESCORING: 'WAIT_FOR_PRESCORING',
    PRESCORING_FAILURE_1: 'PRESCORING_FAILURE_1',
    PRESCORING_FAILURE_2: 'PRESCORING_FAILURE_2',
    PRESCORING_FAILURE_3: 'PRESCORING_FAILURE_3',
    PRESCORING_FAILURE_4: 'PRESCORING_FAILURE_4',
    BENEFIT_DETAILS_STEP: 'BENEFIT_DETAILS_STEP',
    MAIN_OSAGO_FORM: 'MAIN_OSAGO_FORM',
    PRICE: 'PRICE',
    HELP_OWNER: 'HELP_OWNER',
    HELP_AGENT: 'HELP_AGENT',
    SUBSCRIBE: 'SUBSCRIBE',
    SUCCESS_AGENT: 'SUCCESS_AGENT',
    SUCCESS_OWNER: 'SUCCESS_OWNER',
    UPLOAD_DOCS: 'UPLOAD_DOCS',
    UPLOAD_ORGANIZATION_DOCUMENTS: 'UPLOAD_ORGANIZATION_DOCUMENTS',
    UPLOAD_BILL: 'UPLOAD_BILL',
    FILL_CONTRACT_DATA: 'FILL_CONTRACT_DATA',
    WAIT_FOR_SCORING: 'WAIT_FOR_SCORING',
    SCORING_INFO: 'SCORING_INFO',
    CHOOSE_INSURANCE_COMPANY: 'CHOOSE_INSURANCE_COMPANY',
    NO_INSURANCE_COMPANY: 'NO_INSURANCE_COMPANY',
    PAYMENT_METHOD: 'PAYMENT_METHOD',
    GO_PAY: 'GO_PAY',
    GO_UPLOAD_BILL: 'GO_UPLOAD_BILL',
    GET_BILL: 'GET_BILL',
    APPLY: 'APPLY',
    REGISTRATION_STEP_PHONE: 'REGISTRATION_STEP_PHONE',
    REGISTRATION_STEP_SMS: 'REGISTRATION_STEP_SMS',
    LOGIN_STEP_PHONE: 'LOGIN_STEP_PHONE',
    LOGIN_STEP_SMS: 'LOGIN_STEP_SMS',
    FINISH_STEP: 'FINISH_STEP',
    SIGN_CONTRACT_STEP: 'SIGN_CONTRACT_STEP',
}

const getErrorScreenByCode = (errorCode) => {
    switch (errorCode) {
        case 1102:
        case 1103:
        case 1201:
        case 1203:
        case 1204:
        case 1208:
        case 1406:
        case 1415:
            return FORM_STEPS.PRESCORING_FAILURE_1;
        case 1202:
        case 1301:
        case 1401:
        case 1901:
            return FORM_STEPS.PRESCORING_FAILURE_2;
        case 1206:
        case 1207:
            return FORM_STEPS.PRESCORING_FAILURE_3;
        case 1407:
        case 1408:
        case 1409:
        case 1410:
        case 1411:
        case 1412:
        case 1413:
        case 1420:
            return FORM_STEPS.PRESCORING_FAILURE_4;
        default:
            return FORM_STEPS.PRESCORING_FAILURE_2;

    }
}

const getAfterPrescoringRoute = (errorCode) => {
    if (errorCode) {
        return getErrorScreenByCode(errorCode);
    } else {
        return FORM_STEPS.BENEFIT_DETAILS_STEP
    }
}

const getAfterScoringRoute = ({errorCode}) => {
    if (errorCode) {
        return FORM_STEPS.PRESCORING_FAILURE_2;
    } else {
        return FORM_STEPS.CHOOSE_INSURANCE_COMPANY
    }
}

export const STEPS_DESCRIPTION = {
    [FORM_STEPS.ROLE]: {
        title: <span>Привет, я Штурман, <br/> твой электронный помощник.<br/>Выбери подходящий вариант</span>,
        description: '',
        color: '',
        modalInnerComponent: ChooseRoleStep,
        nextStep: (data, widgetId, getState) => {
            const role = selectRole(widgetId, getState());
            if (role === ROLE_TYPE_AGENT) {
                return FORM_STEPS.WAIT_FOR_PRESCORING;
            } else {
                return FORM_STEPS.HELP_AGENT;
            }
        },
    },
    [FORM_STEPS.HELP_AGENT]: {
        title: <span>Хочешь, чтобы полис<br/>за тебя оформил Оператор<br/>или сделаешь все сам?</span>,
        modalInnerComponent: ChooseHelpStepAgent,
        nextStep: (data, widgetId, getState) => {
            const helpType = selectHelpType(widgetId, getState());
            if (helpType === HELP_TYPE_OPERATOR) {
                return FORM_STEPS.SUCCESS_AGENT;
            } else {
                return FORM_STEPS.WAIT_FOR_PRESCORING;
            }
        },
    },
    [FORM_STEPS.SUCCESS_AGENT]: {
        title: <span>Сейчас все организую,<br/>Помощь уже рядом!</span>,
        modalInnerComponent: AwaitingOperatorCall,
        nextStep: () => FORM_STEPS.WAIT_FOR_PRESCORING
    },
    [FORM_STEPS.OWNER_TYPE]: {
        title: <span>Кто собственник<br/>транспортного средства?</span>,
        description: '',
        color: '',
        modalInnerComponent: ChooseOwnerTypeStep,
        nextStep: () => FORM_STEPS.WAIT_FOR_PRESCORING
    },
    [FORM_STEPS.WAIT_FOR_PRESCORING]: {
        title: <>Анализирую информацию<br/> о твоем Грузовике</>,
        color: '',
        modalInnerComponent: LoadingInitialInfoProgressStep,
        nextStep: getAfterPrescoringRoute
    },
    [FORM_STEPS.PRESCORING_FAILURE_1]: {
        description: '',
        title: <span>Гос.номер или VIN содержат ошибки<br/>или принадлежат легковому авто...</span>,
        color: 'yellow',
        SvgIcon: ShturmanUnhappySvg,
        modalInnerComponent: PrescoringErrorStep,
        nextStep: () => null,
    },
    [FORM_STEPS.PRESCORING_FAILURE_2]: {
        title: <span>Произошла системная ошибка,<br/>наши инженеры уже все исправляют</span>,
        description: '',
        color: 'yellow',
        SvgIcon: ShturmanUnhappySvg,
        modalInnerComponent: PrescoringErrorStep,
        nextStep: () => null,
    },
    [FORM_STEPS.PRESCORING_FAILURE_3]: {
        description: '',
        title: <span>Сейчас доступно оформление<br/>только для Юридических лиц</span>,
        color: 'yellow',
        SvgIcon: ShturmanUnhappySvg,
        modalInnerComponent: PrescoringErrorStep,
        nextStep: () => null
    },
    [FORM_STEPS.PRESCORING_FAILURE_4]: {
        description: '',
        title: <span>Расчет стоимости полиса <br/>для данного транспортного средства<br/>на данный момент не доступен...</span>,
        color: 'red',
        SvgIcon: ShturmanUnhappySvg,
        modalInnerComponent: PrescoringErrorStep,
        nextStep: () => null,
    },
    [FORM_STEPS.BENEFIT_DETAILS_STEP]: {
        title: <>Оформи ОСАГО с Выгодой<br/>по Справедливой цене</>,
        color: '',
        modalInnerComponent: BenefitDetailsStep,
        nextStep: () => FORM_STEPS.MAIN_OSAGO_FORM
    },
    [FORM_STEPS.MAIN_OSAGO_FORM]: {
        title: <span>Выбери параметры страхования,<br/>чтобы рассчитать стоимость полиса</span>,
        modalInnerComponent: MainOsagoForm,
        nextStep: (data) => {
            if (data) {
                if (data.errorCode) return getErrorScreenByCode(data.errorCode);
                if (data.needRecalculate) return FORM_STEPS.WAIT_FOR_PRESCORING
                if (data.ownerType && data.ownerType === ORGANIZATION_TYPE_LEGAL) {
                    if (!data.isLoggedIn) return FORM_STEPS.REGISTRATION_STEP_PHONE
                    return FORM_STEPS.WAIT_FOR_SCORING;
                    // if (data.role) {
                    //     if (data.role === ROLE_TYPE_AGENT) return FORM_STEPS.HELP_AGENT
                    //     return FORM_STEPS.HELP_OWNER
                    // }
                }
                return FORM_STEPS.APPLY
            }
        },
    },
    [FORM_STEPS.HELP_OWNER]: {
        title: <span>Хочешь, чтобы Агент<br/>помог оформить полис<br/>или сделаешь все сам?</span>,
        modalInnerComponent: ChooseHelpStepOwner,
        nextStep: (isSuccess) => {
            return FORM_STEPS.UPLOAD_ORGANIZATION_DOCUMENTS;
        },
    },
    [FORM_STEPS.SUBSCRIBE]: {
        title: <span>Я только учусь и умею не все, <br/> но я стараюсь...</span>,
        color: 'grey',
        description: <span>расчет стоимости еОСАГО <br/> для твоего грузовика <br/> очень скоро будет доступен</span>,
        modalInnerComponent: SubscribeModal,
        nextStep: () => null
    },
    [FORM_STEPS.SUCCESS_OWNER]: {
        title: <span>Сейчас все организую,<br/>Помощь уже рядом!</span>,
        description: <span>я назначил тебе агента,<br/>он позвонит<br/>в ближайшее время</span>,
        modalInnerComponent: AwaitingOperatorCall,
        nextStep: () => null
    },
    [FORM_STEPS.UPLOAD_ORGANIZATION_DOCUMENTS]: {
        title: <span>Самое время загрузить документы</span>,
        description: <span>Чтобы ускорить процесс <br/> оформления, загрузи фото <br/> или копии всех документов</span>,
        color: '',
        modalInnerComponent: UploadOrganizationDocumentsStep,
        nextStep: () => FORM_STEPS.FILL_CONTRACT_DATA,
    },
    [FORM_STEPS.UPLOAD_DOCS]: {
        title: <span>Самое время загрузить документы</span>,
        description: <span>Чтобы ускорить процесс<br/>оформления, загрузи фото документов</span>,
        modalInnerComponent: UploadDocumentsStep,
        nextStep: () => FORM_STEPS.FILL_CONTRACT_DATA
    },
    [FORM_STEPS.FILL_CONTRACT_DATA]: {
        title: <span>Тут данные по твоему полису, <br/> Проверь и подтверди</span>,
        modalInnerComponent: FillContractDataStep,
        nextStep: (data) => {
            if (data.ownerType === ORGANIZATION_TYPE_LEGAL) {
                return FORM_STEPS.SIGN_CONTRACT_STEP;
            }
            if (data.role === ROLE_TYPE_AGENT) {
                return FORM_STEPS.SUCCESS_AGENT
            }
            return FORM_STEPS.SUCCESS_OWNER
        },
    },
    [FORM_STEPS.SIGN_CONTRACT_STEP]: {
        title: '',
        modalInnerComponent: SignContractStep,
        nextStep: () => {
            return FORM_STEPS.PAYMENT_METHOD
        },
    },
    [FORM_STEPS.WAIT_FOR_SCORING]: {
        title: <span>Рассчитываю Справедливую<br/>цену полиса</span>,
        modalInnerComponent: LoadingScoringInfoProgressStep,
        nextStep: getAfterScoringRoute
    },
    [FORM_STEPS.SCORING_INFO]: {
        title: <span>Я рассчитал для тебя<br/>Справедливую цену полиса</span>,
        modalInnerComponent: ShowScoringInfo,
        nextStep: ({role}) => {
            return FORM_STEPS.FILL_CONTRACT_DATA;
        }
    },
    [FORM_STEPS.CHOOSE_INSURANCE_COMPANY]: {
        title: <>Сделай выбор, что бы оформить<br/> полис ОСАГО по Справедливой цене</>,
        modalInnerComponent: ChooseInsuranceCompanyStep,
        nextStep: (success) => {
            return success ? FORM_STEPS.SCORING_INFO : FORM_STEPS.NO_INSURANCE_COMPANY
        }
    },
    [FORM_STEPS.NO_INSURANCE_COMPANY]: {
        title: <span>Для указанного транспортного<br/>средства пока нет предложений</span>,
        description: '',
        modalInnerComponent: ChooseInsuranceCompanyStep,
        SvgIcon: ShturmanUnhappySvg,
        color: 'red',
        nextStep: () => null
    },
    [FORM_STEPS.PAYMENT_METHOD]: {
        title: <span>Выбери удобный способ оплаты.<br/>После оплаты, на твою почту придет<br/>полис ОСАГО и ссылка в СМС</span>,
        description: '',
        modalInnerComponent: SelectPaymentMethodStep,
        nextStep({paymentType, isSuccess}) {
            if (!isSuccess) {
                return FORM_STEPS.PRESCORING_FAILURE_2
            }
            if (paymentType === PAYMENT_TYPE_BILL) return FORM_STEPS.GET_BILL
            return FORM_STEPS.GO_PAY
        },
    },
    [FORM_STEPS.GO_PAY]: {
        title: <span>Полис ОСАГО придет на твою почту<br/>сразу после оплаты</span>,
        description: '',
        modalInnerComponent: GoPayStep,
        nextStep: () => null,
    },
    [FORM_STEPS.GET_BILL]: {
        title: <span>Проверь данные и скачай счет,<br/>или отправь его своему Бухгалтеру</span>,
        description: '',
        modalInnerComponent: GetBillStep,
        nextStep: () => {
            return FORM_STEPS.GO_UPLOAD_BILL
        },
    },
    [FORM_STEPS.APPLY]: {
        title: <span>Я рассчитал для тебя <br/> Справедливую цену полиса</span>,
        description: '',
        modalInnerComponent: ApplyStep,
        nextStep: ({isLoggedIn, role}) => {
            if (!isLoggedIn) return FORM_STEPS.REGISTRATION_STEP_PHONE
            if (role === ROLE_TYPE_AGENT) {
                return FORM_STEPS.HELP_AGENT;
            } else {
                return FORM_STEPS.HELP_OWNER;
            }
        }
    },
    [FORM_STEPS.REGISTRATION_STEP_PHONE]: {
        title: <span>Мы на финишной прямой! <br/> Заполни данные для связи, <br/> если возникнут вопросы</span>,
        modalInnerComponent: RegistrationStepPhoneConnected,
        nextStep: (goLogin) => {
            if (goLogin) return FORM_STEPS.LOGIN_STEP_PHONE
            return FORM_STEPS.REGISTRATION_STEP_SMS
        }
    },
    [FORM_STEPS.REGISTRATION_STEP_SMS]: {
        title: <span>Нужно подтвердить <br/> твой номер телефона</span>,
        description: null,
        modalInnerComponent: RegistrationStepSmsConnected,
        nextStep: ({isSuccess, role}) => {
            if (!isSuccess) {
                return FORM_STEPS.REGISTRATION_STEP_PHONE
            }
            return FORM_STEPS.WAIT_FOR_SCORING;
        }
    },
    [FORM_STEPS.LOGIN_STEP_PHONE]: {
        title: <span>Введи свой телефон,<br/>чтобы авторизоваться</span>,
        description: '',
        modalInnerComponent: LoginPhoneStepConnected,
        nextStep: (goRegister) => {
            if (goRegister) return FORM_STEPS.REGISTRATION_STEP_PHONE
            return FORM_STEPS.LOGIN_STEP_SMS
        }
    },
    [FORM_STEPS.LOGIN_STEP_SMS]: {
        title: <span>Нужно подтвердить <br/> твой номер телефона</span>,
        description: null,
        modalInnerComponent: LoginStepSmsConnected,
        nextStep: ({isSuccess, role}) => {
            if (!isSuccess) {
                return FORM_STEPS.REGISTRATION_STEP_PHONE
            }
            return FORM_STEPS.WAIT_FOR_SCORING;
        }
    },
    [FORM_STEPS.GO_UPLOAD_BILL]: {
        title: <span>Здорово!<br/>Счет для оплаты полиса уже у тебя</span>,
        description: '',
        modalInnerComponent: GoUploadBillStep,
        nextStep: () => null
    },
    [FORM_STEPS.UPLOAD_BILL]: {
        title: <span>Прикрепи подтверждение оплаты,<br/>я отправлю тебе полис</span>,
        description: '',
        modalInnerComponent: UploadBillStep,
        nextStep: () => FORM_STEPS.FINISH_STEP,
    },
    [FORM_STEPS.FINISH_STEP]: {
        title: <span>Все готово!<br/>Благодарю, за выбор MUSTINS.RU</span>,
        description: '',
        modalInnerComponent: FinishStep,
        nextStep: () => null,
    }
}
