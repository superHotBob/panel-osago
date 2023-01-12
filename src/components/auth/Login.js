import React, {useEffect, useState} from 'react';
import {withFormHook} from "../../hoc/withFormHook";
import {className} from "../../utils/class-helper";
import {FormGroup} from "../form-group/FormGroup";
import {PhoneNumber} from "../phone-number/PhoneNumber";
import {ErrorText} from "../error-text/ErrorText";
import {Button} from "../button/Button";
import {Checkbox} from "../checkbox/Checkbox";
import {agreementValidator, phoneValidator} from "../../validators";
import {noop} from "lodash";
import {trackEvent, TrackingEventName} from '../../modules/tracking';

const Login = ({
                          onChangePhoneNumber,
                          phoneNumber,
                          onChangeIsConfirmedAgreement,
                          isConfirmedAgreement,
                          onSubmit,
                          otpErrorText,
                          errors,
                          isFormValid,
                          setValue,
                          setValueAndClearError,
                          register,
                          handleSubmit,
                          buttonText,
                          labelNumber,
                          switchForm,
                          canSwitchForm,
                          loginLabelText,
                          isLoading,
                          onUnmount,
                          onBlurPhoneNumberInput = noop,
                      }) => {

    const [focused, setFocused] = useState(false)

    useEffect(() => {
        register(...phoneValidator())
        // register(...agreementValidator())

        // setValue('agreement', isConfirmedAgreement)
    }, [])

    useEffect(() => {
        setValueAndClearError('phone', phoneNumber)
    }, [phoneNumber])

    // useEffect(() => {
    //     setValueAndClearError('agreement', isConfirmedAgreement)
    // }, [isConfirmedAgreement])

    const trySubmit = () => {
        if (isFormValid) {
            trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_SUBMIT)
            onSubmit()
        }
    }

    useEffect(() => {
        setFocused(true)
        return onUnmount
    }, [])


    return (
        <div {...className('modal__row')}>
            <div>
                <FormGroup error={errors.phone} label={loginLabelText}>
                    <PhoneNumber
                        onNumberChange={onChangePhoneNumber}
                        onEnter={onSubmit}
                        number={phoneNumber}
                        focused={focused}
                        onBlur={onBlurPhoneNumberInput}
                    />
                </FormGroup>
            </div>

            {
                otpErrorText
                    ? <div {...className(['modal__row', 'tc'])}>
                        <ErrorText>{otpErrorText}</ErrorText>
                    </div>
                    : null
            }

            {canSwitchForm && (
                <div {...className(['mt-20', 'mb-40', 'tc'])}>
                    <a href="#" {...className('button--link')}
                       onClick={(e) => {
                           e.preventDefault()
                           switchForm()
                       }}>
                        Я новый пользователь
                    </a>
                </div>
            )}

            <div>
                <Button
                    loading={isLoading}
                    onClick={handleSubmit(trySubmit)}>{buttonText}</Button>
            </div>
            {/*<div {...className('mt-24')}>*/}
            {/*    <FormGroup error={errors.agreement} showError={false}>*/}
            {/*        <Checkbox name="agreement"*/}
            {/*                  labelAsFootnote={true}*/}
            {/*                  checked={isConfirmedAgreement}*/}
            {/*                  onChange={onChangeIsConfirmedAgreement}*/}
            {/*                  disabled={false}*/}
            {/*                  label='Я согласен на обработку моих персональных данных в целях расчета'*/}
            {/*        />*/}
            {/*    </FormGroup>*/}
            {/*</div>*/}
        </div>
    );
};

export default withFormHook(Login);
