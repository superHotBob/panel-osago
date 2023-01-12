import React, {useEffect, useState} from 'react'
import {Text, TextColor, TextFont, TextSize} from "/components/text/Text"

import { Button } from  '/components/button/Button'
import Input from '/components/input'

import AppContext from "../../store/context";
import {className} from "../../utils/class-helper";
import {emailValidator} from "../../validators";
import {withFormHook} from "../../hoc/withFormHook";
import {FormGroup} from "../form-group/FormGroup";
import {tracking, trackingReachGoal} from "../../modules/tracking";
import {ORGANIZATION_TYPE_LEGAL} from "../../constants/osago";
import {moveNext, resetNumberAction, resetWizardAction, selectOsagoWizardById} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";

const SubscribeModal = ({register, setValueAndClearError, isFormValid, handleSubmit, errors}) => {
    const [email, setEmail] = useState('')
    const [pending, setPending] = useState(false)

    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)

    useEffect(() => {
        register(...emailValidator())
    }, [])

    const onEmailChanged = (e) => {
        const emailValue = e.target.value
        setValueAndClearError('email', emailValue)
        setEmail(emailValue)
    }

    const onSubmit = () => {
        if (isFormValid()) {
            trackingReachGoal(tracking.osagoFinished, ORGANIZATION_TYPE_LEGAL)
            dispatchWidgetAction(resetWizardAction())
            dispatchWidgetAction(resetNumberAction())
            dispatchWidgetAction(moveNext())
        }
    }

    return (
        <div>
            <div {...className('form-row')}>
                <div {...className('tc')}>
                    <Text color={TextColor.BLACK}
                          light
                          className={TextFont.UBUNTU}
                          size={TextSize.S_16} >
                        Мы пришлем тебе расчет стоимости полиса еОСАГО на электронную почту
                    </Text>
                </div>
            </div>

            <div {...className('form-row')}>
                <FormGroup error={errors.email} label='Email для получения расчета'>
                    <Input placeholder={'Введи свой email...'}
                           value={email}
                           disabled={pending}
                           onChange={onEmailChanged}
                    />
                </FormGroup>
            </div>
            <Button disabled={pending} onClick={handleSubmit(onSubmit)}>
                Спасибо, ожидаю
            </Button>
        </div>
    )
}

export default withFormHook(SubscribeModal)
