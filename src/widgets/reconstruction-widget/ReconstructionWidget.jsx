import React, {useEffect, useRef, useState} from 'react'

import {Button} from 'components/button/Button'

import './reconstruction-widget.scss'
import {Email} from '/components/email/Email'
import {Modal} from '../../components/modal/Modal'
import {tracking, trackingReachGoal} from '../../modules/tracking'
import {FormGroup} from '../../components/form-group/FormGroup'
import {emailValidator} from '../../validators'
import {withFormHook} from '../../hoc/withFormHook'

const ReconstructionWidgetComponent = ({
    register, handleSubmit, setValueAndClearError, errors, isFormValid, getValues
}) => {
    const [isShowPopup, setIsShowPopup] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        register(...emailValidator())
    }, [register])

    const onEmailChange = value => {
        setEmail(value)
        setValueAndClearError('email', value)
    }

    const onSubmit = () => {
        if (!isFormValid()) {
            return
        }

        trackingReachGoal(tracking.reconstructionSubscribe, email)

        setIsShowPopup(true)
    }

    const closePopup = () => {
        setIsShowPopup(false)
        setEmail('')
        setValueAndClearError('email', '');
    }

    return (
            <div className='reconstruction-widget'>
                <FormGroup
                        error={errors.email}
                        bubblePosition='bottom'
                        bubblePositionMobile='top'>
                    <Email
                            bordered={false}
                            email={email}
                            placeholder="Введи почту"
                            onEmailChange={onEmailChange}
                    />
                </FormGroup>

                <Button onClick={handleSubmit(onSubmit)}
                        landing={true}
                        type='button'
                >Сообщить</Button>

                <Modal
                        isOpened={isShowPopup}
                        title={<span>я сообщу тебе<br/>как только мы закончим<br/>работы</span>}
                        onClose={closePopup}>
                    <Button onClick={closePopup}>Спасибо</Button>
                </Modal>

            </div>
    )
}

const ReconstructionWidget = withFormHook(ReconstructionWidgetComponent)

export {ReconstructionWidget}
