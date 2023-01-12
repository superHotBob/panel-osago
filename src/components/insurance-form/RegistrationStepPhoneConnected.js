import React, {useEffect} from 'react'
import {moveNext, selectOsagoWizardById, setRegistrationDataAction} from "../../redux/osagoWizardReducer";
import {
    PartnerEventName,
    trackEvent,
    tracking,
    TrackingEventName,
    trackingReachGoal,
    trackPartnerEvent
} from "../../modules/tracking";
import {ORGANIZATION_TYPE_INDIVIDUAL} from "../../constants/osago";
import useWidgetId from "../../hooks/useWidgetId";
import AuthContainer from "../auth/AuthContainer";
import {useSelector} from "react-redux";

const RegistrationStepPhoneConnected = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {phoneNumber} = useSelector(selector)

    const onWaitCode = (phoneNumber, name, email, lastName, patronymic, position, bornOn) => {
        dispatchWidgetAction(setRegistrationDataAction({
            phoneNumber,
            name,
            email,
            lastName,
            patronymic,
            position,
            bornOn
        }))

        dispatchWidgetAction(moveNext())
    }

    const onRegister = (phoneNumber, name, email, lastName, patronymic, position, bornOn) => {
        trackingReachGoal(tracking.osagoRegister, ORGANIZATION_TYPE_INDIVIDUAL);
        onWaitCode(phoneNumber, name, email, lastName, patronymic, position, bornOn)
    }

    const toggleAuthForm = () => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_CLICKED, {
            type: 'login'
        })
        dispatchWidgetAction(moveNext(true))
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_LOADED)
    }, [])

    const onBlurEmailInput = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'email'
            })
        }
    }

    const onBlurPhoneNumberInput = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'phone'
            })
        }

    }

    const onBlurNameInput = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'name'
            })
        }
    }

    const onBlurPosition = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'position'
            })
        }
    }

    const onBlurLastName = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'second name'
            })
        }
    }

    const onBlurPatronymic = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'patronymic'
            })
        }
    }

    const trackIsConfirmedAgreement = bool => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_SELECTED, {
            agree_gdpr: bool ? 'yes' : 'no'
        })
    }

    const trackIsConfirmedCondition = bool => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_SELECTED, {
            agree_websiterules: bool ? 'yes' : 'no'
        })
    }

    const trackSubmission = () => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_SUBMIT, {
            loged: true,
        })
        trackPartnerEvent(PartnerEventName.STEP_3_PERSONAL_DATA)
    }


    return (
        <AuthContainer
            initialStep='registration'
            initialPhoneNumber={phoneNumber}
            onSwitchedForm={toggleAuthForm}
            onCodeSent={onRegister}
            buttonRegistrationText='ПОЛУЧИТЬ ОСАГО'
            registrationLabelTexts={{
                1: 'Как к тебе обращаться',
                2: 'Еmail для получения расчета',
                3: 'Контактный телефон',
            }}
            onBlurEmailInput={onBlurEmailInput}
            onBlurPhoneNumberInput={onBlurPhoneNumberInput}
            onBlurNameInput={onBlurNameInput}
            onBlurPosition={onBlurPosition}
            onBlurLastName={onBlurLastName}
            onBlurPatronymic={onBlurPatronymic}
            trackIsConfirmedAgreement={trackIsConfirmedAgreement}
            trackIsConfirmedCondition={trackIsConfirmedCondition}
            trackSubmission={trackSubmission}
        />
    )
}

export default RegistrationStepPhoneConnected
