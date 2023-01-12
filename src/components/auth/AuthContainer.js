import React, {useCallback, useEffect, useMemo, useState} from 'react';
import LoginPhoneFC from "./Login";
import PropTypes from 'prop-types'
import {getTimeLeft} from "../../modules/sms";
import {login} from "../../api/modules/auth";
import {withWidgetId} from "../../hoc/withWidgetId";
import size from "lodash/size";
import EnterSms from "./EnterSms";
import errorCodes from "../../utils/errorCodes";
import {saveToken} from "../../modules/auth";
import {useDispatch, useSelector} from "react-redux";
import {isProfileInfoValid, selectAuth, sendSmsCodeAction, setAuthTokenAction, setErrorCodeAction} from "../../redux/authReducer";
import RegistrationPhoneFC from "./Registration";
import AuthModal from "./AuthModal";
import useEffectWithSkipDidMount from "../../hooks/useEffectWithSkipDidMount";
import api from "../../api";
import {noop} from "lodash";
import {DateTime} from 'luxon';
import {trackEvent, TrackingEventName} from '../../modules/tracking';

export const SMS_CODE_SIZE = 4

export const AuthInitialStep = {
    REGISTRATION: 'registration',
    LOGIN: 'login'
}

const AuthContainer = ({
                           titles,
                           descriptions,
                           initialStep,
                           initialPhoneNumber,
                           type = 'login',
                           onCodeSent,
                           startLoading,
                           endLoading,
                           loading,
                           initialLabelStep,
                           smsLabelStep,
                           onPhoneConfirmed,
                           onClose,
                           shouldLoginAfterConfirmation,
                           shouldGetProfileAfterConfirmation,
                           resetToInitialStepAfterClosed,
                           buttonText,
                           loginLabelText,
                           buttonRegistrationText,
                           isOpened,
                           renderModal,
                           shortRegistrationMode,
                           onSwitchedForm,
                           canSwitchForm,
                           registrationLabelTexts,
                           onBlurEmailInput,
                           onBlurPhoneNumberInput,
                           onBlurNameInput,
                           onBlurPositionInput,
                           onBlurLastNameInput,
                           onBlurPatronymicInput,
                           trackIsConfirmedAgreement,
                           trackIsConfirmedCondition,
                           trackSubmission,
                           handleRegistrationClick,
                           hidePosition
                       }) => {
    const dispatch = useDispatch()
    const {otpState, errorCode, user} = useSelector(selectAuth)
    const [prevStep, setPrevStep] = useState(null)
    const [currentStep, setCurrentStep] = useState(initialStep)
    const [actionType, setActionType] = useState("login")
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
    const [savePhone, setSavePhone] = useState(false)
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [position, setPosition] = useState('')
    const [bornOn, setBornOn] = useState(null)
    const [email, setEmail] = useState('')
    const [smsCode, setSmsCode] = useState('')
    const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false)
    const [isConfirmedCondition, setIsConfirmedCondition] = useState(false)
    const [loginErrorCode, setLoginErrorCode] = useState(null)
    const [countdown, setCountdown] = useState(1)
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(phoneNumber))
    const [hideLoginBtn, setHideLoginBtn] = useState(false)

    const onChangeIsConfirmedAgreement = useCallback(() => {
        trackIsConfirmedAgreement(!isConfirmedAgreement)
        setIsConfirmedAgreement(bool => !bool)
    }, [isConfirmedAgreement])

    const onChangeIsConfirmedCondition = useCallback(() => {
        trackIsConfirmedCondition(!isConfirmedCondition)
        setIsConfirmedCondition(bool => !bool)
    }, [isConfirmedCondition])

    const onCountdownEnd = useCallback(() => {
        setCountdown(0)
    }, [])

    const sendCode = useCallback(async () => {
        const isSmsStep = currentStep === 'sms'
        if (!isSmsStep) {
            trackSubmission()
        }
        const timeLeftLs = getTimeLeft(phoneNumber)
        if (timeLeftLs) return
        setTimeLeft(timeLeftLs)
        setLoginErrorCode(null)
        startLoading(isSmsStep ? 'resendCode' : 'sendCode')
        await dispatch(sendSmsCodeAction(phoneNumber))
        endLoading(isSmsStep ? 'resendCode' : 'sendCode')
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_APPROVED, {
            newAttempt: true
        })
    }, [phoneNumber, timeLeft, currentStep])

    const tryConfirmPhone = useCallback(async () => {
        setLoginErrorCode(null)
        startLoading('submitSmsCode')
        let response;

        if (type === 'migratePhone') {
            response = await api('/auth/migrate-phone', 'POST', {
                phone: `+7${phoneNumber}`,
                otp: smsCode,
                otpState,
            })
        } else {
            response = await login('+7' + phoneNumber, otpState, smsCode)
        }

        const data = await response.json()

        if (response.status === 400) {
            if (data && data.errorCode) {
                setLoginErrorCode(data.errorCode)
                setSmsCode('')
            }
            endLoading('submitSmsCode');
            return;
        }

        if (
            initialStep === 'login'
            && prevStep === 'login'
            && currentStep === 'sms'
            && shouldGetProfileAfterConfirmation
        ) {
            const {isValid, info} = await isProfileInfoValid(data.token);

            if (!isValid) {
                setSmsCode('');
                setPhoneNumber(info.phone.slice(2));
                setSavePhone(true);
                setHideLoginBtn(true)
                setCurrentStep(prevState => {
                    setPrevStep(prevState);
                    return 'registration';
                });
                endLoading('submitSmsCode');
                return;
            }
        }

        saveToken(data.token);
        if (shouldLoginAfterConfirmation) dispatch(setAuthTokenAction(data.token))
        onPhoneConfirmed();
        endLoading('submitSmsCode');

    }, [smsCode, phoneNumber, otpState, initialStep, prevStep, currentStep, shouldGetProfileAfterConfirmation])

    const otpErrorText = useMemo(() => {
        if (loginErrorCode || errorCode) return errorCodes(loginErrorCode || errorCode)
        return ''
    }, [errorCode, loginErrorCode, timeLeft])

    useEffect(() => {
        if (size(smsCode) === SMS_CODE_SIZE) {
            tryConfirmPhone()
        }
    }, [smsCode])

    useEffectWithSkipDidMount(() => {
        if (!errorCode && phoneNumber) {
            setSmsCode('')
            setCurrentStep(prevState => {
                setPrevStep(prevState);
                return 'sms';
            });
            onCodeSent(phoneNumber, name, email, lastName, patronymic, position, bornOn)
        }
    }, [errorCode, loginErrorCode, otpState])

    useEffectWithSkipDidMount(() => {
        setCountdown(1)
    }, [otpState])

    useEffectWithSkipDidMount(() => {
        setEmail('')
        setName('')
        setLastName('')
        setPatronymic('')
        setPosition('')
        if (currentStep === 'sms' || savePhone) {
            return;
        }
        // TODO FOR WHICH CASE WE NEED IT ????????
        // setPhoneNumber(initialPhoneNumber)
    }, [currentStep, actionType])

    const onStepUnmount = useCallback(() => {
        dispatch(setErrorCodeAction(null))
    }, [])

    useEffect(() => {
        if(currentStep === "login" || currentStep === "registration") {
            setActionType(currentStep)
        }
    }, [currentStep]);

    useEffect(() => {
        if(user && user.phone ) {
            const formatPhone = user.phone.substring(2)
            setPhoneNumber(formatPhone);
        }

    }, [user])

    const renderSteps = () => (
        <>
            {currentStep === 'login' && (
                <LoginPhoneFC
                    onChangePhoneNumber={setPhoneNumber}
                    phoneNumber={phoneNumber}
                    onChangeIsConfirmedAgreement={onChangeIsConfirmedAgreement}
                    isConfirmedAgreement={isConfirmedAgreement}
                    onSubmit={sendCode}
                    otpErrorText={otpErrorText}
                    labelNumber={initialLabelStep}
                    buttonText={buttonText}
                    switchForm={() => {
                        if (onSwitchedForm) return onSwitchedForm()
                        setCurrentStep(prevState => {
                            setPrevStep(prevState);
                            return 'registration';
                        });
                    }}
                    canSwitchForm={canSwitchForm}
                    loginLabelText={loginLabelText}
                    isLoading={loading.sendCode}
                    onUnmount={onStepUnmount}
                    onBlurPhoneNumberInput={onBlurPhoneNumberInput}
                />
            )}
            {currentStep === 'registration' && (
                <RegistrationPhoneFC
                    onChangeName={e => {
                        const {value} = e.target;
                        setName(value)
                    }}
                    onChangeLastName={e => {
                        const {value} = e.target;
                        setLastName(value)
                    }}
                    onChangePatronymic={e => {
                        const {value} = e.target;
                        setPatronymic(value)
                    }}
                    onChangePosition={e => {
                        const {value} = e.target;
                        setPosition(value)
                    }}
                    bornOn={bornOn}
                    onBornOnChange={date => {
                        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_PUTIN, {
                            type: 'birthday'
                        })
                        setBornOn(DateTime.fromJSDate(date).toISO())
                    }}
                    name={name}
                    lastName={lastName}
                    position={position}
                    patronymic={patronymic}
                    email={email}
                    onChangeEmail={setEmail}
                    onChangePhoneNumber={setPhoneNumber}
                    phoneNumber={phoneNumber}
                    onChangeIsConfirmedAgreement={onChangeIsConfirmedAgreement}
                    isConfirmedAgreement={isConfirmedAgreement}
                    onChangeIsConfirmedCondition={onChangeIsConfirmedCondition}
                    isConfirmedCondition={isConfirmedCondition}
                    onSubmit={sendCode}
                    otpErrorText={otpErrorText}
                    labelNumber={initialLabelStep}
                    buttonText={buttonRegistrationText}
                    switchForm={() => {
                        if (onSwitchedForm) return onSwitchedForm()
                        setCurrentStep(prevState => {
                            setPrevStep(prevState);
                            return 'login';
                        });
                    }}
                    shortMode={shortRegistrationMode}
                    canSwitchForm={canSwitchForm}
                    isLoading={loading.sendCode}
                    registrationLabelTexts={registrationLabelTexts}
                    onUnmount={onStepUnmount}
                    onBlurEmailInput={onBlurEmailInput}
                    onBlurPhoneNumberInput={onBlurPhoneNumberInput}
                    onBlurNameInput={onBlurNameInput}
                    onBlurLastNameInput={onBlurLastNameInput}
                    onBlurPatromymicInput={onBlurPatronymicInput}
                    onBlurPositionInput={onBlurPositionInput}
                    hidePosition={hidePosition}
                    hideLoginBtn={hideLoginBtn}
                />
            )}
            {currentStep === 'sms' && (
                <EnterSms
                    smsCode={smsCode}
                    onChangeSmsCode={setSmsCode}
                    otpErrorText={otpErrorText}
                    onRequestCode={sendCode}
                    onTimeIsOver={onCountdownEnd}
                    timeLeft={timeLeft}
                    countdown={countdown}
                    smsLabelStep={smsLabelStep}
                    onUnmount={onStepUnmount}
                />
            )}
        </>
    )

    if (renderModal) {
        return (
            <AuthModal
                isOpened={isOpened}
                onClose={onClose}
                currentStep={currentStep}
                phoneNumber={phoneNumber}
                titles={titles}
                descriptions={descriptions}
                loading={loading.submitSmsCode}
                resetToInitialStepAfterClosed={resetToInitialStepAfterClosed}
                setCurrentStep={e =>
                    setCurrentStep(prevState => {
                        setPrevStep(prevState);
                        return e;
                    })
                }
                initialStep={initialStep}
            >
                {renderSteps()}
            </AuthModal>
        )
    }
    return renderSteps()
};

AuthContainer.defaultProps = {
    onPhoneConfirmed: () => {
    },
    onCodeSent: () => {
    },
    onClose: () => {
    },
    resetToInitialStepAfterClosed: false,
    shouldLoginAfterConfirmation: true,
    shouldGetProfileAfterConfirmation: false,
    initialPhoneNumber: '',
    initialStep: 'login',
    type: 'login',
    isDefaultOpened: false,
    renderModal: false,
    buttonRegistrationText: 'СОЗДАТЬ АККАУНТ',
    canSwitchForm: true,
    loginLabelText: 'Телефон, если есть личный кабинет',
    buttonText: 'ВОЙТИ В ЛИЧНЫЙ КАБИНЕТ',
    registrationLabelTexts: {
        1: 'Как к тебе обращаться',
        2: 'Email для получения расчетов',
        3: 'Контактный телефон',
    },
    onBlurEmailInput: noop,
    onBlurPhoneNumberInput: noop,
    onBlurNameInput: noop,
    onBlurPositionInput: noop,
    onBlurLastNameInput: noop,
    onBlurPatronymicInput: noop,
    trackIsConfirmedAgreement: noop,
    trackIsConfirmedCondition: noop,
    trackSubmission: noop,
    handleRegistrationClick: noop,
    hidePosition: false
}

AuthContainer.propTypes = {
    type: PropTypes.oneOf(['login', 'migratePhone']),
    initialStep: PropTypes.oneOf(['sms', 'registration', 'login'])
}

export default withWidgetId(AuthContainer);
