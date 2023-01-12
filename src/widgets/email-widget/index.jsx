import React, {useState, useEffect} from 'react'

import api from 'api'
import {Button} from 'components/button/Button'

import './email-widget.scss'
import {Modal} from '/components/modal/Modal'
import {tracking, trackingReachGoal} from '../../modules/tracking'
import {FormGroup} from '../../components/form-group/FormGroup'
import {Email} from '../../components/email/Email'
import {emailValidator} from '../../validators'
import {withFormHook} from '../../hoc/withFormHook'
import {endLoadingAction, selectLoadingById, startLoadingAction} from '../../redux/loadingReducer'
import {connect, useSelector} from 'react-redux'
import useWidgetId from '../../hooks/useWidgetId'

const EmailWidget = ({
    register,
    handleSubmit,
    setValueAndClearError,
    errors,
    isFormValid
}) => {
    const [email, setEmail] = useState('')
    const [isShowPopup, setIsShowPopup] = useState(false)
    const {dispatchWidgetAction, selector} = useWidgetId(selectLoadingById)

    const loading = useSelector(selector)

    useEffect(() => {
        register(...emailValidator())
    }, [register])

    const onEmailChange = value => {
        setEmail(value)
        setValueAndClearError('email', value)
    }

    const subscribe = async () => {
        dispatchWidgetAction(startLoadingAction('emailWidgetSubmit'))

        const response = await api(
        '/lead/subscribe/email',
        'POST', {
            email,
            source: 'site=osago.mustins.ru&block=e-mail_subscription',
        })

        dispatchWidgetAction(endLoadingAction('emailWidgetSubmit'))

        if (response.status === 200) {
            setIsShowPopup(true)
        }
    }

    const onSubmit = () => {
        if (!isFormValid() || loading.emailWidgetSubmit) {
            return
        }

        trackingReachGoal(tracking.osagoSubscribe, email)

        subscribe()
    }

    const closePopup = () => {
        setIsShowPopup(false)
        setEmail('')
        setValueAndClearError('email', '');
    }

    return (
        <div className='email-widget'>
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
                    loading={loading.emailWidgetSubmit}
                    className='email-widget__button'
                    type='button'
                    landing={true}
            >Получать новости</Button>

            <Modal
                    isOpened={isShowPopup}
                    title={<span>Все готово! <br /> Благодарю за выбор MUSTINS.RU</span>}
                    description={<span>
                        я буду присылать тебе<br/>только актуальную<br/>информацию
                    </span>}
                    onClose={closePopup}>
                <Button onClick={closePopup}>Спасибо</Button>
            </Modal>
        </div>
    )
}


export default connect()(withFormHook(EmailWidget))
