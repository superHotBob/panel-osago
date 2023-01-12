import React, {useEffect} from 'react';
import {BemHelper, className} from "../../utils/class-helper";
import {FormGroup} from "../form-group/FormGroup";
import {SmsCode} from "../sms-code/SmsCode";
import {ErrorText} from "../error-text/ErrorText";
import {Countdown} from "../countdown/Countdown";
import {Button} from "../button/Button";

import './login.scss'

const classes = new BemHelper({name: 'form-sms-code'});

const EnterSms = ({
                        smsLabelStep,
                        onChangeSmsCode,
                        smsCode,
                        otpErrorText,
                        onRequestCode,
                        onTimeIsOver,
                        timeLeft,
                        countdown,
                        onUnmount
}) => {

    useEffect(() => {
        return onUnmount
    }, [])

    return (
        <div {...classes()}>
            <div {...className('modal__row')}>
                <FormGroup
                    step={smsLabelStep}
                    label='Введи код из СМС'>
                    <SmsCode
                        onSmsCodeChange={onChangeSmsCode}
                        smsCode={smsCode}
                    />
                </FormGroup>
            </div>

            {
                otpErrorText && (
                    <div {...classes('sms-error-text')}>
                        <ErrorText>{otpErrorText}</ErrorText>
                    </div>
                )
            }

            {
                countdown !== 0
                    ? <div {...className('modal__row')}>
                        <div {...className(['modal__countdown-text', 'tc'])}>
                            Запросить код повторно можно через&nbsp;
                            <Countdown timeLeft={timeLeft} onTimeOver={onTimeIsOver}/> сек
                        </div>
                    </div>
                    : null
            }

            {
                countdown === 0
                    ? <div {...className(['modal__row', 'tc'])}>
                        <Button
                            onClick={onRequestCode}
                            buttonType='link'
                            type='button'
                        >Запросить новый код</Button>
                    </div>
                    : null
            }
        </div>
    )
};

export default EnterSms;
