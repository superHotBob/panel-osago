import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import lodashGet from 'lodash/get'
import {
    moveNext,
    selectOsagoWizardById,
    setContractDataAction,
    setInitialContractDataAction, setScoringResponseJsonAction,
} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";
import {BemHelper, className} from "../../utils/class-helper";

import './fill-contract-data-step.scss'
import {ContractDataField} from "../contract-data-field/ContractDataField";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../redux/loadingReducer";
import DefaultSelect from "../select";
import {DateTime} from "luxon";
import DateInput from "../DateInput";
import {withFormHook} from "../../hoc/withFormHook";
import {Button} from "../button/Button";
import {getContractData, updateContractData} from "../../api/modules/contractData";
import {
    ContractDataFieldsMap,
    getContractDataValue,
    mapContractFieldsToApi,
    VehicleDocTypes
} from "./contract-fields-map";
import {ContractDataInput} from "../contract-data-field/ContractDataInput";
import {useInterval} from "../../hooks/useInterval";
import InputAddressAutoComplete from "../input-autocomplete/InputAddressAutoComplete";
import ContractMaskedInput from "../masked-input/ContractMaskedInput";
import {flatten} from "lodash/array";
import {noop} from "lodash";
import ContractPhoneNumberInput from "../contract-phone-number-input/ContractPhoneNumberInput";
import {times} from "lodash/util";
import {Checkbox} from "../checkbox/Checkbox";
import InputInnAutoComplete from "../input-autocomplete/InputInnAutoComplete";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../modules/tracking";
import {fillContractDataAction} from "./InsuranceFormModel";
import LogoRenessans from '../../svg/renessans-logo.svg';
import {Typography, TypographyColor, TypographyType} from '../typography/Typography';
import find from 'lodash/find';
import {CarNumber} from '../car-number/CarNumber';

const getEvalString = (source, name) => `${source}?.${name.replace(/\./g, '?.').replace(/\[/g, '?.[')}`

let renderCount = 1;


const FillContractDataStepComponent = ({
                                           register,
                                           isFormValid,
                                           errors,
                                           triggerValidation,
                                           setValueAndValidate,
                                           setError,
                                           getValues,
                                           setValue
                                       }) => {
    const classes = new BemHelper({name: 'fill-contract-data-step'});

    const {dispatchWidgetAction, selector, widgetId} = useWidgetId(selectOsagoWizardById);
    const dispatch = useDispatch();
    const {contractData, scoringId, formData: {driverNumber}, role, ownerType, scoringResults, insuranceCompany} = useSelector(selector);
    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById);
    const loading = useSelector(selectorLoading);

    const rootRef = React.useRef(null);

    const [validationInterval, setValidationInterval] = useState(2000)
    const [openedFields, setOpenedFields] = useState({})
    const [ownerIsInsurer, setOwnerIsInsurer] = useState({})
    const scoringResult = find(scoringResults, {insuranceCompany});

    const getDriversCount = driverNumber => {
        return (!driverNumber.value || driverNumber.value === 'no-restriction') ? 0 : driverNumber.value
    }
    const toggleField = (name, value) => {
        setOpenedFields({
            ...openedFields,
            [name]: value
        })

        // wait for rerender (input will be displayed)
        if (!value) {
            return
        }

        setTimeout(() => {
            if (contractData[name].ref.current) {
                contractData[name].ref.current.focus();
            }
        }, 0)
    }

    const confirmData = field => dispatchWidgetAction(setContractDataAction({field, data: {shouldConfirm: false}}))

    const setFieldValue = async (field, value) => {
        dispatchWidgetAction(setContractDataAction({field, data: {value}}))
        await setValueAndValidate(field, value)
        if (!getError(field)) {
            toggleField(field, false)
            confirmData(field)
        }
    }
    const setFieldValueCallback = field => async value => await setFieldValue(field, value)

    const getError = name => lodashGet(errors, name);

    const submitForm = async () => {
        if (loading.loadContractData) {
            return
        }

        // await triggerValidation()

        // if (!isFormValid()) {
        //     const firstError = rootRef.current.querySelector('.mustins-form-group--error')
        //     firstError && firstError.closest('.mustins-modal__root').scrollTo(0, firstError.offsetTop)
        //     return
        // }

        let notConfirmed = Object.values(contractData).filter(f => f.shouldConfirm)
        if (notConfirmed.length) {
            const firstConfirm = rootRef.current.querySelector('.mustins-contract-data-field--confirm')
            firstConfirm && firstConfirm.closest('.mustins-modal__root').scrollTo(0, firstConfirm.offsetTop)
            return
        }

        dispatchWidgetLoadingAction(startLoadingAction('updateContractData'))

        const requestData = mapContractFieldsToApi(contractData, getDriversCount(driverNumber), ownerType)
        // await updateContractData(scoringId, requestData)
        trackEvent(TrackingEventName.SCREEN_CHECKINFO_SUBMIT)
        dispatchWidgetLoadingAction(endLoadingAction('updateContractData'))
        dispatchWidgetAction(moveNext({ownerType, role}))
    }

    const isFieldOpened = field =>
        field.type === 'date' ||
        field.type === 'dropdown' ||
        field.type === 'plates' ||
        (field.editable && contractData[field.name].shouldConfirm) ||
        !!openedFields[field.name] ||
        (field.editable && getError(field.name))

    const renderEditableField = field => {
        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
                const callbackInput = field => async value => {
                    await setFieldValue(field, value)
                    toggleField(field, false)
                }
                return (
                    <ContractDataInput
                        disabled={loading.loadContractData}
                        ref={contractData[field.name].ref}
                        type={field.type}
                        name={field.name}
                        value={contractData[field.name].value}
                        onBlur={callbackInput(field.name)}/>
                )
            case 'plates':
                const plates = contractData[field.name].value;
                return <CarNumber number={plates.slice(0, 6)}
                                  region={plates.slice(6)}
                                  readonly={true}/>
            case 'dropdown':
                const callbackDropdown = field => async selected => {
                    await setFieldValue(field, selected.value)
                }
                return (
                    <DefaultSelect
                        disabled={loading.loadContractData}
                        selectedOption={field.options.find(o => o.value == contractData[field.name].value)}
                        onChange={callbackDropdown(field.name)}
                        options={field.options}/>
                )
            case 'date':
                const callbackDate = field => async date => {
                    await setFieldValue(field, DateTime.fromJSDate(date).toISO())
                    await triggerValidation()
                }
                const value = contractData[field.name].value ? DateTime.fromISO(contractData[field.name].value).toJSDate() : null;
                const dates = {
                    techInspectionStartOn: contractData['vehicle.technicalInspection.startOn']?.value,
                    techInspectionEndOn: contractData['vehicle.technicalInspection.endOn']?.value,
                    driverBornOnValue: contractData[`${field.name.split('.')[0]}.individual.bornOn`]?.value,
                    yearManufacturedOn: contractData[`vehicle.yearManufacturedOn`]?.value,
                    firstLicenseDateCategoryC: contractData[`${field.name.split('.')[0]}.firstLicenseDateCategoryC`]?.value,
                }

                return (
                    <DateInput
                        // disabled={loading.loadContractData}
                        disabled={true}
                        val={value}
                        minDate={typeof field.minDate === "function" ? field.minDate(dates) : field.minDate}
                        maxDate={typeof field.maxDate === "function" ? field.maxDate(dates) : field.maxDate}
                        onChange={callbackDate(field.name)}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={60}
                    />
                )

            case 'address': {
                // Если строка адреса расходится со значением из фиаса
                const setManualErrorCallback = field => () => {
                    setError(field.name, {
                        message: 'Неверный формат адреса. Выберите адрес из списка',
                    })
                }
                return (
                    <InputAddressAutoComplete
                        disabled={loading.loadContractData}
                        setError={setManualErrorCallback(field.name)}
                        initialValue={contractData[field.name].value}
                        onSelect={setFieldValueCallback(field.name)}
                    />
                )
            }

            case 'inn': {
                return (
                    <InputInnAutoComplete
                        disabled={loading.loadContractData}
                        initialValue={contractData[field.name].value}
                        onSelect={company => {
                            setFieldValueCallback('insurer.legalEntity')(company);
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.title',
                                data: {value: company.title}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.legalAddress',
                                data: {value: company.legalAddress}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.kpp',
                                data: {value: company.kpp}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.issuedAt',
                                data: {value: company.issuedAt}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.number',
                                data: {value: company.number}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.series',
                                data: {value: company.series}
                            }));
                            dispatchWidgetAction(setContractDataAction({
                                field: 'insurer.legalEntity.ogrn',
                                data: {value: company.ogrn}
                            }));
                        }}
                    />
                )
            }

            case 'masked': {
                return (
                    <ContractMaskedInput
                        disabled={loading.loadContractData}
                        initialValue={contractData[field.name].value}
                        onBlur={setFieldValueCallback(field.name)}
                        mask={field.mask}
                    />
                )
            }

            case 'phone': {
                return (
                    <ContractPhoneNumberInput
                        editable={field.editable}
                        shouldConfirm={contractData[field.name].shouldConfirm}
                        disabled={loading.loadContractData}
                        opened={isFieldOpened(field)}
                        error={getError(field.name)}
                        initialValue={contractData[field.name].value}
                        onBlur={setFieldValueCallback(field.name)}
                    />
                )
            }

            default:
                return null
        }
    }

    const renderBlockFields = fields => {
        return (
            <div>
                {
                    fields.map(field => {
                        if (field.hide) {
                            return null
                        }
                        let value = contractData[field.name].value ?
                            field.formatter(contractData[field.name].value) :
                            contractData[field.name].value
                        const toggleCallback = fieldName => value => toggleField(fieldName, value)
                        const confirmCallback = fieldName => () => confirmData(fieldName)
                        const editable = field.name === 'vehicle.plates' && contractData[field.name].value; //field.name === 'insurer.legalEntity' ? !ownerIsInsurer : field.editable;
                        let label = field.label;
                        if (field.name === 'vehicle.document.issuedAt' && contractData['vehicle.document.type'].value) {
                            label = `Дата выдачи ${VehicleDocTypes[contractData['vehicle.document.type'].value]}`
                        }
                        if (field.name === 'driverCount' && !value) {
                            value = 'Без ограничений';
                        }

                        return (
                            <ContractDataField
                                label={label}
                                key={field.name}
                                value={value}
                                editable={editable}
                                confirm={confirmCallback(field.name)}
                                shouldConfirm={contractData[field.name].shouldConfirm}
                                toggle={toggleCallback(field.name)}
                                // opened={isFieldOpened(field)}
                                opened={field.name === 'vehicle.plates' && contractData[field.name].value}
                                loading={loading.loadContractData}
                                error={getError(field.name)}>
                                {editable ? renderEditableField(field) : null}
                            </ContractDataField>
                        )
                    })
                }
            </div>
        )
    }

    const renderDriversBlock = block => {
        const count = getDriversCount(driverNumber)
        return times(count).map(i => {
            const title = block.title.replace('[0]', i + 1)
            const fields = block.fields.map(field => {
                return ({
                    ...field,
                    name: field.name.replace(new RegExp("[0-9]"), `${i}`)
                })
            })
            return (
                <div {...classes('block')} key={`driver${i}`}>
                    <div {...classes('block-title')}>{title}</div>
                    {renderBlockFields(fields)}
                </div>
            )
        })
    }

    const fillContractData = async (contract, fieldsAuc) => {
        for (let field of Object.values(contractData)) {
            const value = getContractDataValue(contract, field.name)
            if (value !== undefined) {
                await setFieldValue(field.name, value)
            }
            let shouldConfirm = !field.hide && field.editable && fieldsAuc.find(f => f.key === field.name)?.shouldConfirm && !!value
            dispatchWidgetAction(setContractDataAction({field: field.name, data: {shouldConfirm}}))
        }
    }

    const setupValidator = (field) => {
        if (!field.required && !field.validator) {
            return
        }

        let validator = {}
        if (field.validator) {
            validator = {
                ...validator,
                ...field.validator
            }
        }
        if (field.required) {
            validator.required = 'Поле обязательно для заполнения'
        }
        register({name: field.name}, {...validator, validate: validator?.validate?.bind(null, field.name)})
    }

    // add validator for each of the drivers
    const setupValidatorForDriver = (originalField) => {
        const driversCount = getDriversCount(driverNumber)
        if (driversCount > 0) {
            times(driversCount).forEach(number => {
                setupValidator({
                    ...originalField,
                    name: originalField.name.replace(new RegExp("[0-9]"), `${number}`)
                })
            })
        }
    }

    const setupValidators = () => {
        flatten(ContractDataFieldsMap(getValues, ownerType).map(fieldsMap => fieldsMap.fields))
            .forEach(field => {
                if (field.name.indexOf('drivers') === 0) {
                    setupValidatorForDriver(field)
                } else {
                    setupValidator(field)
                }
            })
    }

    const loadContractData = async () => {
        try {
            const response = await getContractData(scoringId)
            const responseJson = await response.json()
            const {isContractPrefilled, contract, fieldsAuc} = responseJson

            if (isContractPrefilled) {
                setValidationInterval(null)
                setupValidators()
                await dispatch(fillContractDataAction(widgetId, contract, fieldsAuc));
                dispatchWidgetAction(setScoringResponseJsonAction(responseJson));
                const initialDataForReactHookForm = [];
                for (let field of Object.values(contractData)) {
                    const value = getContractDataValue(contract, field.name)
                    if (value !== undefined) {
                        initialDataForReactHookForm.push({[field.name]: value})
                    }
                }
                setValue(initialDataForReactHookForm);
                // await fillContractData(contract, fieldsAuc)
                await triggerValidation()
                dispatchWidgetLoadingAction(endLoadingAction('loadContractData'))
            }
        } catch (e) {
            console.error(e)
            setValidationInterval(null)
            dispatchWidgetLoadingAction(endLoadingAction('loadContractData'))
        }
    }

    useInterval(() => loadContractData(), validationInterval)

    useEffect(() => {
        dispatchWidgetLoadingAction(startLoadingAction('loadContractData'))
        dispatchWidgetAction(setInitialContractDataAction())
        trackEvent(TrackingEventName.SCREEN_CHECKINFO_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_7_CHECK_INFO)
        return () => setValidationInterval(null)
    }, [])

    if (!Object.keys(contractData).length) {
        return null
    }

    return (
        <div {...classes()} ref={rootRef}>
            <div {...classes('block-title')}>Параметры полиса</div>
            <div {...className('tc')}>
                <div {...classes('logo')}>
                    <LogoRenessans/>
                </div>
                <div {...classes('logofooter')}>
                    <Typography type={TypographyType.FOOTNOTE} color={TypographyColor.GRAY_DARK}>
                        Лиц. ОС №1284-03
                    </Typography>
                </div>
                <div {...classes('grey-block')}>
                    <div {...classes('grey-block-title')}>
                        <Typography type={TypographyType.CAPTION} weight={18}>
                            Справедливая* цена полиса
                        </Typography>
                    </div>
                    <div {...classes('grey-block-cost')}>
                        {(scoringResult.writtenPremium).toLocaleString('en').split(',').join(' ')}
                        <span {...classes('grey-block-cost-rub')}>&nbsp;руб.</span>
                    </div>
                </div>
            </div>
            <div {...classes('explanation')}>
                <Typography type={TypographyType.FOOTNOTE} color={TypographyColor.MUST_700}>
                    <span>*Справедливая - потому, что учитывается вся<br/> информация, равно влияющая на цену полиса<br/>
                    как в меньшую так и в большую сторону.</span>
                </Typography>
            </div>
            {
                ContractDataFieldsMap(noop, ownerType).map((block, index) => {
                    if (block.name === 'drivers') {
                        return renderDriversBlock(block)
                    }

                    // if (block.name === 'legalEntityInsurer') {
                    //     return (
                    //         <div {...classes('block')} key={block.title}>
                    //             <div {...classes('block-title')}>{block.title}</div>
                    //             <div {...className('mb-24')}>
                    {/*                <Checkbox*/}
                    {/*                    checked={contractData['owner.legalEntity.inn'].value === contractData['insurer.legalEntity'].value.inn && contractData['owner.legalEntity.kpp'].value === contractData['insurer.legalEntity.kpp'].value}*/}
                    {/*                    onChange={() => {*/}
                    {/*                        const checked = !ownerIsInsurer;*/}
                    {/*                        if (checked) {*/}
                    {/*                            setFieldValueCallback('insurer.legalEntity')(contractData['owner.legalEntity'].value);*/}
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.kpp',
                    //                                 data: {value: contractData['owner.legalEntity.kpp'].value}
                    //                             }));
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.title',
                    //                                 data: {value: contractData['owner.legalEntity.title'].value}
                    //                             }));
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.legalAddress',
                    //                                 data: {value: contractData['owner.legalEntity.legalAddress'].value}
                    //                             }));
                    {/*                            dispatchWidgetAction(setContractDataAction({*/}
                    //                                 field: 'insurer.legalEntity.issuedAt',
                    //                                 data: {value: contractData['owner.legalEntity.issuedAt'].value}
                    //                             }));
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.number',
                    //                                 data: {value: contractData['owner.legalEntity.number'].value}
                    //                             }));
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.series',
                    //                                 data: {value: contractData['owner.legalEntity.series'].value}
                    //                             }));
                    //                             dispatchWidgetAction(setContractDataAction({
                    //                                 field: 'insurer.legalEntity.ogrn',
                    //                                 data: {value: contractData['owner.legalEntity.ogrn'].value}
                    //                             }));
                    //                         }
                    //                         setOwnerIsInsurer(checked)
                    //                     }}
                    //                     disabled={true}
                    //                     labelAsFootnote={true}
                    //                     label='Cобственник ТС является Страхователем транспортного средства'
                    //                 />
                    //             </div>
                    //             {renderBlockFields(block.fields)}
                    //         </div>
                    //     )
                    // }
                    return (
                        <div {...classes('block', index === 0 ? 'first' : '')} key={block.title}>
                            <div {...classes('block-title')}>{block.title}</div>
                            {renderBlockFields(block.fields)}
                        </div>
                    )
                })
            }
            <Button onClick={() => submitForm()} loading={loading.updateContractData}>Подтвердить данные</Button>
        </div>
    )
}

const FillContractDataStep = withFormHook(FillContractDataStepComponent);

export {FillContractDataStep}


