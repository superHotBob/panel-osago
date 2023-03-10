import React, {useEffect, useRef} from 'react';
import {Typography, TypographyType} from '../../../../../../components/typography/Typography';
import {className} from '../../../../../../utils/class-helper';
import {FormGroup} from '../../../../../../components/form-group/FormGroup';
import {agreementValidator, emailValidator, nameValidator} from '../../../../../../validators';
import {conditionValidator} from '../../../../../../validators/condition';
import {Button} from '../../../../../../components/button/Button';
import {withFormHook} from '../../../../../../hoc/withFormHook';
import {useDispatch, useSelector} from 'react-redux';
import {goToNextStepAction, selectProfileData, sendProfileAction, setProfileDataAction} from '../../AccidentFlowModel';
import {DateTime} from 'luxon';
import DateInput from '../../../../../../components/DateInput';
import {Email} from '../../../../../../components/email/Email';
import {PhoneNumber} from '../../../../../../components/phone-number/PhoneNumber';
import {Checkbox} from '../../../../../../components/checkbox/Checkbox';
import {birthdateValidator} from '../../../../../../validators/birthday';

const FieldName = {
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    PATRONYMIC: 'patronymic',
    EMAIL: 'email',
    PHONE: 'phone',
    BIRTHDATE: 'birthdate',
    AGREEMENT: 'agreement',
    CONDITION: 'condition'
}

export const AccidentFlowProfile = withFormHook(({
                                                     errors,
                                                     handleSubmit,
                                                     register,
                                                     setValue,
                                                     setValueAndClearError,
                                                     isFormValid
                                                 }) => {

    const dispatch = useDispatch();
    const profileData = useSelector(selectProfileData);
    const firstInputRef = useRef();

    useEffect(() => {
        firstInputRef.current.focus()
    }, [firstInputRef.current])

    useEffect(() => {
        register(...nameValidator(FieldName.LAST_NAME, '??????????????'))
        register(...nameValidator(FieldName.FIRST_NAME, '??????'))
        register(...nameValidator(FieldName.PATRONYMIC, '????????????????'))
        register(...emailValidator())
        register(...birthdateValidator(FieldName.BIRTHDATE))
        register(...agreementValidator())
        register(...conditionValidator())

        setValue(FieldName.AGREEMENT, false)
        setValue(FieldName.CONDITION, false)
        setValue(FieldName.FIRST_NAME, profileData[FieldName.FIRST_NAME])
        setValue(FieldName.LAST_NAME, profileData[FieldName.LAST_NAME])
        setValue(FieldName.PATRONYMIC, profileData[FieldName.PATRONYMIC])
        setValue(FieldName.EMAIL, profileData[FieldName.EMAIL])
    }, [])


    const handleFieldChanged = (fieldName) => (value) => {
        dispatch(setProfileDataAction({
            ...profileData,
            [fieldName]: value
        }))
        setValueAndClearError(fieldName, value)
    }

    const handleCheckboxChange = (handler) => (e) => {
        console.log('e',e);
        handler(e.target.checked)
    }

    const handleDateChange = (handler) => (date) => {
        handler(DateTime.fromJSDate(date).toISO())
    }

    const handleInputChange = (handler) => (e) => {
        handler(e.target.value)
    }

    const trySubmit = () => {
        if (isFormValid) {
            dispatch(sendProfileAction())
            dispatch(goToNextStepAction())
        }
    }

    return (
        <div>
            <Typography type={TypographyType.SUBHEAD}>?????? ?? ???????? ?? ???????? ?????????????????????</Typography>
            <div {...className('mt-8')}>
                <FormGroup error={errors[FieldName.LAST_NAME]}
                           label={'?????????? ???????? ??????????????'}>
                    <input
                        ref={firstInputRef}
                        value={profileData[FieldName.LAST_NAME]}
                        name={FieldName.LAST_NAME}
                        onChange={handleInputChange(handleFieldChanged(FieldName.LAST_NAME))}
                        {...className(['input', 'form-control'])}
                        placeholder="???????? ?????????????? (?????? ?? ????????????????)"
                    />
                </FormGroup>
            </div>
            <div {...className('mt-8')}>
                <FormGroup error={errors[FieldName.FIRST_NAME]}
                           label={'?????????? ??????'}>
                    <input
                        value={profileData[FieldName.FIRST_NAME]}
                        name={FieldName.FIRST_NAME}
                        onChange={handleInputChange(handleFieldChanged(FieldName.FIRST_NAME))}
                        {...className(['input', 'form-control'])}
                        placeholder="???????? ?????? (?????? ?? ????????????????)"
                    />
                </FormGroup>
            </div>
            <div {...className('mt-8')}>
                <FormGroup error={errors[FieldName.PATRONYMIC]}
                           label={'?? ???????? ????????????????'}>
                    <input
                        value={profileData[FieldName.PATRONYMIC]}
                        name={FieldName.PATRONYMIC}
                        onChange={handleInputChange(handleFieldChanged(FieldName.PATRONYMIC))}
                        {...className(['input', 'form-control'])}
                        placeholder="???????? ???????????????? (?????? ?? ????????????????)"
                    />
                </FormGroup>
            </div>
            <div {...className('mt-8')}>
                <FormGroup error={errors[FieldName.BIRTHDATE]}
                           label={'???????? ????????????????'}>
                    <DateInput
                        val={profileData[FieldName.BIRTHDATE] ? DateTime.fromISO(profileData[FieldName.BIRTHDATE]).toJSDate() : null}
                        maxDate={DateTime.local().minus({years: 18}).toJSDate()}
                        minDate={null}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={60}
                        onChange={handleDateChange(handleFieldChanged(FieldName.BIRTHDATE))}/>
                </FormGroup>
            </div>
            <div {...className('mt-8')}>
                <Typography type={TypographyType.SUBHEAD}>???????????????????? ????????????</Typography>
            </div>
            <div {...className('mt-8')}>
                <FormGroup error={errors[FieldName.EMAIL]}
                           label="Email ?????? ?????????????????? ??????????????">
                    <Email
                        email={profileData[FieldName.EMAIL]}
                        placeholder={'???????? email'}
                        onEmailChange={handleFieldChanged(FieldName.EMAIL)}
                    />
                </FormGroup>
            </div>
            <div {...className('mt-8')}>
                <FormGroup label="???????????????????? ??????????????">
                    <PhoneNumber
                        disabled={true}
                        number={profileData[FieldName.PHONE] || ''}
                    />
                </FormGroup>
            </div>
            <Button
                {...className('mt-40')}
                onClick={handleSubmit(trySubmit)}>
                ?????????????????????? ????????????
            </Button>
            <div {...className('mt-24')}>
                <FormGroup error={errors[FieldName.AGREEMENT]} showError={false}>
                    <Checkbox name="agreement"
                              checked={profileData[FieldName.AGREEMENT]}
                              onChange={handleCheckboxChange(handleFieldChanged(FieldName.AGREEMENT))}
                              disabled={false}
                              labelAsFootnote={true}
                              label='?? ???????????????? ???? ?????????????????? ???????? ???????????????????????? ???????????? ?? ?????????? ??????????????'
                    />
                </FormGroup>
            </div>

            <div {...className('mt-24')}>
                <FormGroup error={errors[FieldName.CONDITION]} showError={false}>
                    <Checkbox name="conditions"
                              checked={profileData[FieldName.CONDITION]}
                              onChange={handleCheckboxChange(handleFieldChanged(FieldName.CONDITION))}
                              disabled={false}
                              labelAsFootnote={true}
                              label='?? ???????????????? ?????????????? ???????????????????? ???? ?????????????????????????? ??????-?????????? mustins.ru'
                    />
                </FormGroup>
            </div>
        </div>
    )
});