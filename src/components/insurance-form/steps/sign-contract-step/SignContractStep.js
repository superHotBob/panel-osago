import {useDispatch, useSelector} from 'react-redux';
import {
    goToNextStepAction,
    setLoadingAction
} from '../../../../pages/accident-prediction/components/accident-flow/AccidentFlowModel';
import {profileSignAction, selectAuth, selectAuthUser} from '../../../../redux/authReducer';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getTimeLeft} from '../../../../modules/sms';
import errorCodes from '../../../../utils/errorCodes';
import useEffectWithSkipDidMount from '../../../../hooks/useEffectWithSkipDidMount';
import api from '../../../../api';
import size from 'lodash/size';
import {SMS_CODE_SIZE} from '../../../auth/AuthContainer';
import EnterSms from '../../../auth/EnterSms';
import useWidgetId from '../../../../hooks/useWidgetId';
import {moveNext, selectOsagoWizardById} from '../../../../redux/osagoWizardReducer';
import {endLoadingAction, selectLoadingById, startLoadingAction} from '../../../../redux/loadingReducer';
import {trackEvent, TrackingEventName} from '../../../../modules/tracking';

const context = 'osago';
export const SIGN_CONTRACT_LOADING_ACTION = 'SIGN_CONTRACT_LOADING_ACTION'

export const SignContractStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById)
    const user = useSelector(selectAuthUser);
    const {scoringResponseJson} = useSelector(selector)
    const dispatch = useDispatch();
    const {otpState, errorCode} = useSelector(selectAuth)
    const [smsCode, setSmsCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(user.phone))
    const [countdown, setCountdown] = useState(1)
    const [loginErrorCode, setLoginErrorCode] = useState(null)
    const contextDetails = JSON.stringify(scoringResponseJson);

    const sendCode = useCallback(async () => {
        const timeLeftLs = getTimeLeft(user.phone)
        if (timeLeftLs) return
        setTimeLeft(timeLeftLs)
        setLoginErrorCode(null)
        await dispatch(profileSignAction(user.phone, context, contextDetails))
    }, [timeLeft])

    const otpErrorText = useMemo(() => {
        if (loginErrorCode || errorCode) return errorCodes(loginErrorCode || errorCode)
        return ''
    }, [errorCode, loginErrorCode, timeLeft])

    const onCountdownEnd = useCallback(() => {
        setCountdown(0)
    }, [])

    useEffect(() => {
        dispatch(profileSignAction(user.phone, context, contextDetails))
    }, [])

    useEffectWithSkipDidMount(() => {
        setCountdown(1)
    }, [otpState])

    const signConfirm = useCallback(async () => {
        setLoginErrorCode(null)
        dispatchWidgetLoadingAction(startLoadingAction(SIGN_CONTRACT_LOADING_ACTION))

        const response = await api('/profile/sign/confirm', 'POST',
            {
                context,
                contextDetails,
                otpState,
                otp: smsCode
            });

        if (response.status === 400) {
            const data = await response.json()
            if (data && data.errorCode) {
                setLoginErrorCode(data.errorCode)
                setSmsCode('')
            }
        } else {
            trackEvent(TrackingEventName.SCREEN_CHECKINFO_APPROVED)
            dispatchWidgetAction(moveNext())
        }

        dispatchWidgetLoadingAction(endLoadingAction(SIGN_CONTRACT_LOADING_ACTION))

    }, [smsCode, otpState])

    useEffect(() => {
        if (size(smsCode) === SMS_CODE_SIZE) {
            signConfirm()
        }
    }, [smsCode])

    return (
        <div>
            <EnterSms
                smsCode={smsCode}
                onChangeSmsCode={setSmsCode}
                otpErrorText={otpErrorText}
                onRequestCode={sendCode}
                onTimeIsOver={onCountdownEnd}
                timeLeft={timeLeft}
                countdown={countdown}
                smsLabelStep={'Введи код из СМС'}
                onUnmount={() => {
                }}
            />
        </div>
    )
}