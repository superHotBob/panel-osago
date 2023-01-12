import React, {Component} from 'react';

import AppContext from "../../store/context";

import {selectAuth} from "../../redux/authReducer";
import {connect} from "react-redux";
import {Modal} from "/components/modal/Modal";
import {selectOsagoWizard} from "../../redux/osagoWizardReducer";
import {FORM_STEPS, STEPS_DESCRIPTION} from "../../constants/OSAGO_FORM";
import {isNil} from "lodash";
import './modal-form.scss'
import './get-policy.scss';
import './get-price.scss'
import {withWidgetId} from "../../hoc/withWidgetId";
import {Sprite} from "../sprite/Sprite";
import {PrescoringInitBackground} from "./PrescoringInitBackground";
import {selectMainPageUrl} from "../../redux/rootReducer";
import {SIGN_CONTRACT_LOADING_ACTION} from './steps/sign-contract-step/SignContractStep';

class InsuranceForm extends Component {

    constructor(props) {
        super(props);
    }

    getModalFormTitle = () => {
        const widget = this.props.osagoWizard[this.context.widgetId]
        if (!widget) return ''
        const {step, registrationData, loginData} = widget

        if (step === FORM_STEPS.REGISTRATION_STEP_SMS) {
            const {phoneNumber} = registrationData;
            return <span>Введи код из СМС, чтобы подтвердить<br/>данные своего личного кабинета <br/>для номера +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>
        }

        if (step === FORM_STEPS.LOGIN_STEP_SMS) {
            const {phoneNumber} = loginData;
            return <span>Введи код из СМС, чтобы войти<br/>в свой личный кабинет <br/>для номера +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>
        }

        if (step === FORM_STEPS.SIGN_CONTRACT_STEP) {
            const phoneNumber = this.props.user.phone;
            return <span>Введи код из СМС для номера<br/>+7({phoneNumber.substr(2, 3)})***-**-{phoneNumber.substr(10, 2)}, чтобы подписать<br/>заявление о страховании </span>
        }

        if (step && STEPS_DESCRIPTION[step].modalInnerComponent) return STEPS_DESCRIPTION[step].title
    }

    getModalFormDescription = () => {
        const widget = this.props.osagoWizard[this.context.widgetId]
        if (!widget) return ''
        const {step, registrationData, loginData} = widget

        const currentStep = STEPS_DESCRIPTION[step]

        if (currentStep) {
            // If isNil description, try to use a dynamic one
            if (isNil(currentStep.description)) {
                switch (step) {
                    // case FORM_STEPS.REGISTRATION_STEP_SMS: {
                    //     const {phoneNumber} = registrationData;
                    //     return <span>Я отправил СМС с кодом <br/>на номер +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>
                    // }
                    //
                    // case FORM_STEPS.LOGIN_STEP_SMS: {
                    //     const {phoneNumber} = loginData;
                    //     return <span>Я отправил СМС с кодом <br/>на номер +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>
                    // }
                    default:
                        return ''
                }
            }

            return currentStep.description
        }

        return null
    }

    closeModal = () => {
        const {mainPageUrl} = this.props;
        const widget = this.props.osagoWizard[this.context.widgetId];
        const {step} = widget;
        if (step === FORM_STEPS.FINISH_STEP || step === FORM_STEPS.UPLOAD_BILL) {
            window.location = mainPageUrl;
        }
        this.props.onClose();
    }

    render() {
        const {loading, isConfirmPaymentPage} = this.props
        const widget = this.props.osagoWizard[this.context.widgetId]
        if (!widget) return null

        const {step} = widget
        const currentStep = STEPS_DESCRIPTION[step]
        if (!currentStep) return <Sprite/>;

        const modalLoading =
            loading.osagoGetDocsForUpload || loading.osagoModalLoading || loading[SIGN_CONTRACT_LOADING_ACTION] ||
            loading.submitSmsCode || loading.resendCode || loading.finalizeOsago || loading.loadContractDataConfirmPage;

        const Component = currentStep.modalInnerComponent
        return (
            <>
                {!isConfirmPaymentPage &&
                <PrescoringInitBackground/>}
                <Modal
                    loading={modalLoading}
                    isOpened={!!currentStep}
                    onClose={currentStep ? this.closeModal : () => {
                    }}
                    activeStep={step.toLowerCase().replace('_', '-')}
                    title={this.getModalFormTitle()}
                    description={this.getModalFormDescription()}
                    color={currentStep && currentStep.color}
                    SvgIcon={currentStep.SvgIcon}
                >
                    {currentStep && <Component/>}
                </Modal>
                <Sprite/>
            </>
        )
    }
}

InsuranceForm.contextType = AppContext

const mapStateToProps = state => ({
    ...selectAuth(state),
    osagoWizard: selectOsagoWizard(state),
    mainPageUrl: selectMainPageUrl(state)
})

export default connect(mapStateToProps)(withWidgetId(InsuranceForm))
