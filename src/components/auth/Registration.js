import React, {useCallback, useEffect, useRef} from 'react';
import {className} from "../../utils/class-helper";
import {FormGroup} from "../form-group/FormGroup";
import {Email} from "../email/Email";
import {PhoneNumber} from "../phone-number/PhoneNumber";
import {ErrorText} from "../error-text/ErrorText";
import {Button} from "../button/Button";
import {Checkbox} from "../checkbox/Checkbox";
import {withFormHook} from "../../hoc/withFormHook";
import {agreementValidator, emailValidator, nameValidator, phoneValidator} from "../../validators";
import '../registration/registration.scss';
import {noop} from "lodash";
import {conditionValidator} from "../../validators/condition";
import {Typography, TypographyType} from "../typography/Typography";
import DateInput from '../DateInput';
import {DateTime} from 'luxon';
import {birthdateValidator} from '../../validators/birthday';
import {useFilledData} from "../../hooks/useFilledData";

const Registration = ({
                          errors,
                          shortMode,
                          isLoading,
                          handleSubmit,
                          register,
                          setValue,
                          email,
                          buttonText,
                          setValueAndClearError,
                          phoneNumber,
                          isConfirmedAgreement,
                          isConfirmedCondition,
                          isFormValid,
                          onSubmit,
                          onChangeIsConfirmedAgreement,
                          onChangeIsConfirmedCondition,
                          otpErrorText,
                          onChangePhoneNumber,
                          onChangeName,
                          onChangeEmail,
                          name,
                          switchForm,
                          canSwitchForm,
                          registrationLabelTexts,
                          onUnmount,
                          onBlurEmailInput = noop,
                          onBlurPhoneNumberInput = noop,
                          onBlurNameInput = noop,
                          onBlurPositionInput = noop,
                          onBlurLastNameInput = noop,
                          onBlurPatronymicInput = noop,
                          lastName,
                          onChangeLastName,
                          patronymic,
                          onChangePatronymic,
                          bornOn,
                          onBornOnChange,
                          position,
                          onChangePosition,
                          hidePosition,
                          hideLoginBtn
                      }) => {
    const firstInputRef = useRef(null)
    const isNeedRedirect = useFilledData();

    useEffect(() => {
        if (!shortMode) {
            register(...emailValidator())
            register(...nameValidator('lastName', '??????????????'))
            register(...nameValidator('patronymic', '????????????????'))
            if (!hidePosition) {
                register(...nameValidator('position', '??????????????????'))
            }
        }
        register(...phoneValidator())
        register(...nameValidator())
        register(...agreementValidator())
        register(...conditionValidator())
        register(...birthdateValidator('bornOn'))

        setValue('agreement', false)
        setValue('condition', false)
    }, [])

    useEffect(() => {
        firstInputRef.current.focus()
    }, [firstInputRef.current])

    useEffect(() => {
        setValueAndClearError('phone', phoneNumber)
    }, [phoneNumber])

    useEffect(() => {
        setValueAndClearError('agreement', isConfirmedAgreement)
    }, [isConfirmedAgreement])

    useEffect(() => {
        setValueAndClearError('condition', isConfirmedCondition)
    }, [isConfirmedCondition])

    useEffect(() => {
        setValueAndClearError('name', name)
    }, [name])

    useEffect(() => {
        setValueAndClearError('bornOn', bornOn)
    }, [bornOn])

    useEffect(() => {
        setValueAndClearError('lastName', lastName)
    }, [lastName])

    useEffect(() => {
        setValueAndClearError('patronymic', patronymic)
    }, [patronymic])

    useEffect(() => {
        setValueAndClearError('position', position)
    }, [position])

    useEffect(() => {
        setValueAndClearError('email', email)
    }, [email])

    useEffect(() => {
        return onUnmount
    }, [])

    const trySubmit = () => {
        if (isFormValid) onSubmit()
    }

    const handleBlurNameInput = useCallback(() => {
        onBlurNameInput(name);
    }, [onBlurNameInput, name])

    const handleBlurLastNameInput = useCallback(() => {
        onBlurLastNameInput(lastName);
    }, [onBlurLastNameInput, lastName])

    const handleBlurPatronymicInput = useCallback(() => {
        onBlurPatronymicInput(patronymic);
    }, [onBlurPatronymicInput, patronymic])

    const handleBlurPositionInput = useCallback(() => {
        onBlurPositionInput(position);
    }, [onBlurPositionInput, position])

    const handleBlurEmailInput = useCallback(() => {
        onBlurEmailInput(email);
    }, [onBlurEmailInput, email])

    const handleBlurPhoneInput = useCallback(() => {
        onBlurPhoneNumberInput(phoneNumber);
    }, [onBlurPhoneNumberInput, phoneNumber])

    return (
        <>
            {shortMode &&
            <div>
                <FormGroup error={errors.name} label={registrationLabelTexts[1]}>
                    <input
                        ref={firstInputRef}
                        value={name}
                        name="name"
                        onChange={onChangeName}
                        {...className(['input', 'form-control'])}
                        placeholder="??????..."
                        onBlur={handleBlurNameInput}
                    />
                </FormGroup>
            </div>}
            {
                !shortMode &&
                <>
                    <Typography type={TypographyType.SUBHEAD}>?????? ?? ???????? ?? ???????? ?????????????????????</Typography>
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.lastName} label={'?????????? ???????? ??????????????'}>
                            <input
                                ref={firstInputRef}
                                value={lastName}
                                name="lastName"
                                onChange={onChangeLastName}
                                {...className(['input', 'form-control'])}
                                placeholder="???????? ?????????????? (?????? ?? ????????????????)"
                                onBlur={handleBlurLastNameInput}
                            />
                        </FormGroup>
                    </div>
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.name} label={'?????????? ??????'}>
                            <input
                                value={name}
                                name="name"
                                onChange={onChangeName}
                                {...className(['input', 'form-control'])}
                                placeholder="???????? ?????? (?????? ?? ????????????????"
                                onBlur={handleBlurNameInput}
                            />
                        </FormGroup>
                    </div>
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.patronymic} label={'?? ???????? ????????????????'}>
                            <input
                                value={patronymic}
                                name="patronymic"
                                onChange={onChangePatronymic}
                                {...className(['input', 'form-control'])}
                                placeholder="???????? ???????????????? (?????? ?? ????????????????)"
                                onBlur={handleBlurPatronymicInput}
                            />
                        </FormGroup>
                    </div>
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.bornOn}
                                   label={'???????? ????????????????'}>
                            <DateInput
                                val={bornOn ? DateTime.fromISO(bornOn).toJSDate() : null}
                                maxDate={DateTime.local().minus({years: 18}).toJSDate()}
                                minDate={null}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={60}
                                onChange={onBornOnChange}
                            />
                        </FormGroup>
                    </div>
                    <div {...className('mt-8')}>
                        {hidePosition && <Typography type={TypographyType.SUBHEAD}>?????????????????</Typography>}
                        {!hidePosition && <Typography type={TypographyType.SUBHEAD}>?????????????????? ?? ?????????????????</Typography>}
                    </div>
                    {!hidePosition &&
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.position} label={'?????????? ???????????????? ?????????? ??????????????????'}>
                            <input
                                value={position}
                                name="position"
                                onChange={onChangePosition}
                                {...className(['input', 'form-control'])}
                                placeholder="???????? ?????????????????? ?? ??????????????????????"
                                onBlur={handleBlurPositionInput}
                            />
                        </FormGroup>
                    </div>}
                    <div {...className('mt-8')}>
                        <FormGroup error={errors.email} label={registrationLabelTexts[2]}>
                            <Email
                                email={email}
                                placeholder={'???????? email'}
                                onEmailChange={onChangeEmail}
                                onBlur={handleBlurEmailInput}
                            />
                        </FormGroup>
                    </div>
                </>
            }


            <div {...className('mt-8')}>
                <FormGroup error={errors.phone} label={registrationLabelTexts[3]}>
                    <PhoneNumber
                        onNumberChange={onChangePhoneNumber}
                        number={phoneNumber}
                        onBlur={handleBlurPhoneInput}
                    />
                </FormGroup>
            </div>

            {canSwitchForm && (
                (!isNeedRedirect && !hideLoginBtn && (
                        (
                            <div {...className(['mt-40', 'mb-40', 'tc'])}>
                                <a href="#" className={'mustins-button--link'} onClick={(e) => {
                                    e.preventDefault()
                                    switchForm()
                                }}>
                                    ?? ???????? ?????? ???????? ???????????? ??????????????
                                </a>
                            </div>
                        )
                    )
            ))}

            {
                otpErrorText && (
                    <div {...className(['modal__row', 'modal--bordered'])}>
                        <ErrorText>{otpErrorText}</ErrorText>
                    </div>
                )
            }

            <div>
                <Button
                    loading={isLoading}
                    onClick={handleSubmit(trySubmit)}>
                    {buttonText || '?????????????? ??????????????'}
                </Button>
            </div>

            <div {...className('mt-24')}>
                <FormGroup error={errors.agreement} showError={false}>
                    <Checkbox name="agreement"
                              checked={isConfirmedAgreement}
                              onChange={onChangeIsConfirmedAgreement}
                              disabled={false}
                              labelAsFootnote={true}
                              label='?? ???????????????? ???? ?????????????????? ???????? ???????????????????????? ???????????? ?? ?????????? ??????????????'
                    />
                </FormGroup>
            </div>

            <div {...className('mt-24')}>
                <FormGroup error={errors.condition} showError={false}>
                    <Checkbox name="conditions"
                              checked={isConfirmedCondition}
                              onChange={onChangeIsConfirmedCondition}
                              disabled={false}
                              labelAsFootnote={true}
                              label='?? ???????????????? ?????????????? ???????????????????? ???? ?????????????????????????? ??????-?????????? mustins.ru'
                    />
                </FormGroup>
            </div>
        </>
    );
};

export default withFormHook(Registration);
