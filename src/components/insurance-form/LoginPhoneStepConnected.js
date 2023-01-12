import React, {useEffect} from 'react';
import {moveNext, selectOsagoWizardById, setLoginDataAction} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";
import AuthContainer from "../auth/AuthContainer";
import {trackEvent, TrackingEventName} from "../../modules/tracking";
import {useSelector} from "react-redux";

const LoginPhoneStepConnected = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {phoneNumber} = useSelector(selector)

    const onWaitLoginCode = (phoneNumber) => {
        dispatchWidgetAction(setLoginDataAction({
            phoneNumber,
        }))

        dispatchWidgetAction(moveNext(false))
    }

    const toggleAuthForm = () => {
        dispatchWidgetAction(moveNext(true))
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_CLICKED, {
            type: 'newUser'
        })
    }

    const onBlurPhoneNumberInput = (data) => {
        if (data) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                type: 'phone'
            })
        }
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_LOADED)
    }, [])

    return (
        <AuthContainer
            initialStep='login'
            initialPhoneNumber={phoneNumber}
            onSwitchedForm={toggleAuthForm}
            onCodeSent={onWaitLoginCode}
            onBlurPhoneNumberInput={onBlurPhoneNumberInput}
        />
    );
};

export default LoginPhoneStepConnected;
