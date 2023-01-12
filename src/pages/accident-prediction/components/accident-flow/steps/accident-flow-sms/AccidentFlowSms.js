import React, {useCallback, useEffect, useMemo, useState} from 'react';
import EnterSms from '../../../../../../components/auth/EnterSms';
import errorCodes from '../../../../../../utils/errorCodes';
import {getTimeLeft} from '../../../../../../modules/sms';
import {profileSignAction, selectAuth} from '../../../../../../redux/authReducer';
import {useDispatch, useSelector} from 'react-redux';
import {goToNextStepAction, selectProfileData, setLoadingAction} from '../../AccidentFlowModel';
import size from 'lodash/size';
import {SMS_CODE_SIZE} from '../../../../../../components/auth/AuthContainer';
import api from '../../../../../../api';
import useEffectWithSkipDidMount from '../../../../../../hooks/useEffectWithSkipDidMount';

const context = 'profile';

export const AccidentFlowSms = () => {

    const profileData = useSelector(selectProfileData);
    const dispatch = useDispatch();
    const {otpState, errorCode} = useSelector(selectAuth)
    const [smsCode, setSmsCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(profileData.phone))
    const [countdown, setCountdown] = useState(1)
    const [loginErrorCode, setLoginErrorCode] = useState(null)
    const contextDetails = JSON.stringify(profileData);

    const sendCode = useCallback(async () => {
        const timeLeftLs = getTimeLeft(profileData.phone)
        if (timeLeftLs) return
        setTimeLeft(timeLeftLs)
        setLoginErrorCode(null)
        await dispatch(profileSignAction(profileData.phone, context, contextDetails))
    }, [timeLeft])

    const otpErrorText = useMemo(() => {
        if (loginErrorCode || errorCode) return errorCodes(loginErrorCode || errorCode)
        return ''
    }, [errorCode, loginErrorCode, timeLeft])

    const onCountdownEnd = useCallback(() => {
        setCountdown(0)
    }, [])

    useEffect(() => {
        dispatch(profileSignAction(profileData.phone, context, contextDetails))
    }, [])

    useEffectWithSkipDidMount(() => {
        setCountdown(1)
    }, [otpState])

    const signConfirm = useCallback(async () => {
        setLoginErrorCode(null)
        dispatch(setLoadingAction(true))

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
            dispatch(goToNextStepAction())
        }

        dispatch(setLoadingAction(false))

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