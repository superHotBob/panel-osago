import React, { useState, useRef, useEffect, Fragment } from 'react'

import {Button} from 'components/button/Button'

import './phone-widget.scss'
import AuthContainer from "../../components/auth/AuthContainer";
import {Modal} from '../../components/modal/Modal'
import useApiData from "../../hooks/useApiData";
import useApiWithWidgetId from "../../hooks/useApiWithWidgetId";
import {tracking, trackingReachGoal} from '../../modules/tracking'
import {phoneValidator} from '../../validators'
import {FormGroup} from '../../components/form-group/FormGroup'
import {PhoneNumber} from '../../components/phone-number/PhoneNumber'
import {withFormHook} from '../../hoc/withFormHook'
import {withWidgetId} from '../../hoc/withWidgetId'
import {sendSmsCodeAction} from '../../redux/authReducer'
import {useDispatch} from 'react-redux'
import { createLeadPhoneApiPostKey, leadPhoneAction } from "./phoneWidgetActions";

const PhoneWidget = ({
    register,
    handleSubmit,
    errors,
    setValueAndClearError,
    loading,
    startLoading,
    endLoading,
    isFormValid
}) => {
    const dispatch = useDispatch()

    const [phone, setPhone] = useState('')
    const [isShowPopup, setIsShowPopup] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const phoneInput = useRef(null)
    const leadPhoneWrappedAction = useApiWithWidgetId(leadPhoneAction)
    const leadPhoneData = useApiData(createLeadPhoneApiPostKey)

    useEffect(() => {
        register(...phoneValidator())
    }, [register])

    const handlePhoneChange = value => {
        setPhone(value)
        setValueAndClearError('phone', value)
    }

    const handleClick = async () => {
        // Focus - если ничего не ввели и нажимаем на кнопку
        if (!isFormValid() && phoneInput.current) {
            phoneInput.current.getInputDOMNode().focus()

            return
        }

        // Если ответ от сервера не пришел, отменяем действия
        if (loading.phoneWidgetRequestCode) {
            return false
        }

        trackingReachGoal(tracking.osagoCallback)

        startLoading('requestSmsCode')
        await dispatch(sendSmsCodeAction(phone))
        endLoading('requestSmsCode')

        setIsShowPopup(true)
    }

    const closePopup = () => {
        if (isSuccess) {
            setPhone('')
            setValueAndClearError('phone', '')
        }
        setIsShowPopup(false)
        setIsSuccess(false)
    }

    const leadPhone = async () => {
        const leadPhoneSuccess = await dispatch(leadPhoneWrappedAction({
            phone: '+7' + phone,
            source: 'site=osago.mustins.ru&block=e-mail_subscription',
        }))

        trackingReachGoal(tracking.osagoCallbackValid)
        setIsSuccess(leadPhoneSuccess)
    }


    const formatPhone = () => {
        return `+7(${phone.substring(0, 3)}) ***-**-${phone.substr(-2)}`
    }

    const headerText = phone
            ? <span>мы отправили СМС с кодом<br/>на номер {formatPhone()}</span>
            : ''
    const successText = <span>я назначил тебе страхового <br/>агента, он позвонит<br/>в ближайшее время</span>

    return (
            <Fragment>
                <div className='phone-widget'>
                    <FormGroup
                            error={errors.phone}
                            bubblePosition='left'
                            bubblePositionMobile='top'>
                        <PhoneNumber
                                onNumberChange={handlePhoneChange}
                                onEnter={handleSubmit(handleClick)}
                                number={phone}
                        />
                    </FormGroup>
                    <Button
                            loading={loading.requestSmsCode}
                            onClick={handleSubmit(handleClick)}
                            landing={true}
                            className='phone-widget__button'
                    >Перезвоните мне</Button>
                </div>
                <Modal
                        isOpened={isShowPopup}
                        title={<span>Нужно подтвердить <br/> твой номер телефона</span>}
                        description={isSuccess ? successText : headerText}
                        loading={loading.requestSmsCode || loading.submitSmsCode || leadPhoneData.isLoading}
                        onClose={closePopup}>
                    {
                        isSuccess
                                ? (<Button onClick={closePopup}>Спасибо, ожидаю</Button>)
                                : (
                                        <AuthContainer
                                                shouldLoginAfterConfirmation={false}
                                                initialStep='sms'
                                                initialPhoneNumber={phone}
                                                onPhoneConfirmed={leadPhone}
                                                smsLabelStep='01'
                                        />
                                )
                    }
                </Modal>
            </Fragment>
    )
}


export default withWidgetId(withFormHook(PhoneWidget))
