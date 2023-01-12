import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import './main-osago-form.scss'
import {ChooseOwnerTypeStep} from "./steps/choose-owner-step/ChooseOwnerTypeStep";
import FormTitle from "../form-title";
import {CarNumber} from "../car-number/CarNumber";
import {className} from "../../utils/class-helper";
import {FormGroup} from "../form-group/FormGroup";
import DateInput from "../DateInput";
import {DateTime} from "luxon";
import {
    DRIVER_COUNT_OPTIONS,
    ORGANIZATION_TYPE_INDIVIDUAL,
    ORGANIZATION_TYPE_LEGAL,
    ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR,
    OSAGO_NUMBER_TYPE_GOV
} from "../../constants/osago";
import AutoComplete from "./AutoComplete";
import {Checkbox} from "../checkbox/Checkbox";
import {DefaultRadio} from "../radio";
import DefaultSelect from "../select";
import {Button} from "../button/Button";
import {useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById,
    setFormDataAction,
    setPriceAction,
    setScoringIdAction
} from "../../redux/osagoWizardReducer";
import {withFormHook} from "../../hoc/withFormHook";
import {debounce} from "../../utils";
import api from "../../api";
import cloneDeep from "clone-deep";
import size from 'lodash/size';
import {
    PartnerEventName,
    trackEvent,
    tracking,
    TrackingEventName,
    trackingReachGoal,
    trackPartnerEvent
} from "../../modules/tracking";
import AppContext from "../../store/context";
import useWidgetId from "../../hooks/useWidgetId";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../redux/loadingReducer";
import {VinInput} from "../vin-input/VinInput";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";
import {innObjectValidator, isInnValid} from "../../validators/inn";
import {selectAuth, selectAuthIsLoggedIn} from "../../redux/authReducer";
import {selectSource} from "../../redux/rootReducer";
import filter from "lodash/filter";
import Input from "../input";
import {callOperator, userScoringIdentification} from "../../api/modules/auth";
import isEmpty from 'lodash/isEmpty';
import CheckSvg from '../contract-data-field/check.svg';
import LookSvg from '../contract-data-field/look.svg';
import {HelpBubble} from '../help-bubble/HelpBubble';

const MainOsagoForm = ({
                           register,
                           setValue,
                           errors,
                           setValueAndClearError,
                           handleSubmit,
                           triggerValidation,
                           setValueAndValidate,
                           isFormValid
                       }) => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const [dispatchWidgetLoadingAction, loadingSelector] = useWidgetId(selectLoadingById)
    const {prescoringInfo, prescoringId, ownerType, role, numberType, vin, formData, helpType} = useSelector(selector)
    const loading = useSelector(loadingSelector)
    const {aggregateCrmData} = useContext(AppContext)
    const {utm} = useSelector(selectAuth);
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)
    const source = useSelector(selectSource);

    const hasTrailerDisabled = prescoringInfo.hasTrailer
    const [addressSuggestions, setAddressSuggestions] = useState([])
    const [companySuggestions, setCompanySuggestions] = useState([])
    const [ownerCompanySuggestions, setOwnerCompanySuggestions] = useState([])
    const [companyName, setCompanyName] = useState('')
    const [ownerCompanyName, setOwnerCompanyName] = useState('')
    const [ownerIsInsurer, setOwnerIsInsurer] = useState(false)
    const [technicalInspectionFieldsDisabled, setTechnicalInspectionFieldsDisabled] = useState(false)
    const [requiresOwnerConfirmation, setRequiresOwnerConfirmation] = useState(false)
    const [risk, setRisk] = useState({
        isStandardCargo: true,
        isHighRiskCargo: false,
    })
    const isLegal = ownerType === ORGANIZATION_TYPE_LEGAL

    const onPolicyStartOnChange = (val) => {
        setValueAndClearError('policyStartOn', val)
        dispatchWidgetAction(setFormDataAction({policyStartOn: val}))
    }

    const handleTechnicalInspectionStartOnChange = (val) => {
        setValueAndClearError('technicalInspectionStartOn', val)
        dispatchWidgetAction(setFormDataAction({
            technicalInspection: {
                ...formData.technicalInspection,
                startOn: val
            }
        }))
    }

    const handleOwnerIsInsurerChange = () => {
        const newOwnerIsInsurer = !ownerIsInsurer;
        setOwnerIsInsurer(newOwnerIsInsurer)
        if (newOwnerIsInsurer) {
            setOwnerCompanyInfo({
                title: companyName,
                inn: formData.inn,
                kpp: formData.kpp
            })
        }
    }

    const handleTechnicalInspectionEndOnChange = (val) => {
        setValueAndClearError('technicalInspectionEndOn', val)
        dispatchWidgetAction(setFormDataAction({
            technicalInspection: {
                ...formData.technicalInspection,
                endOn: val
            }
        }))
    }

    const handleTechnicalInspectionNumberChange = (e) => {
        setValueAndClearError('technicalInspectionNumber', e.target.value)
        dispatchWidgetAction(setFormDataAction({
            technicalInspection: {
                ...formData.technicalInspection,
                number: e.target.value
            }
        }))
    }

    const searchForAddresses = useCallback(debounce(async (ownerRegistrationCityObject) => {
        const {fullTitle} = ownerRegistrationCityObject

        if (fullTitle) {
            const req = await api('/prescoring/front/fias', 'POST', {
                query: fullTitle
            })

            const list = await req.json()

            aggregateCrmData(list)

            setAddressSuggestions(list.results.length ? list.results : [])
        }
    }, 200), [])

    const searchForCompanies = async (inn, setSuggestions) => {
        if (inn && isInnValid(inn)) {
            trackEvent(TrackingEventName.SCREEN_POLICYINFO_PUTIN, {
                type: 'INN'
            })
            const req = await api('/user/legal/suggest?inn=' + inn, 'POST', {})
            const list = await req.json()
            const suggestionsWithKpp = filter(list.suggestions, s => !!s.kpp);
            setSuggestions(suggestionsWithKpp);
        } else {
            setSuggestions([]);
        }
    }

    const searchForCompaniesWithDebounce = useCallback(debounce(searchForCompanies, 200), [])

    const setCityData = (ownerRegistrationCity) => {
        setValueAndClearError('city', ownerRegistrationCity.fiasId)
        dispatchWidgetAction(setFormDataAction({ownerRegistrationCity}))
    }

    const setCompanyInfo = (company) => {
        setValueAndClearError('inn', {
            kpp: company.kpp,
            inn: company.inn,
        })
        setCompanyName(company.title);
        trackEvent(TrackingEventName.SCREEN_POLICYINFO_SELECTED, {
            type: 'organization_kpp'
        })
        dispatchWidgetAction(setFormDataAction({kpp: company.kpp, inn: company.inn}))
        if (ownerIsInsurer) {
            setOwnerCompanyInfo(company)
        }
    }

    const setOwnerCompanyInfo = (company) => {
        setValueAndClearError('ownerInn', {
            kpp: company.kpp,
            inn: company.inn,
        })
        setOwnerCompanyName(company.title);
        trackEvent(TrackingEventName.SCREEN_POLICYINFO_SELECTED, {
            type: 'organization_kpp'
        })
        dispatchWidgetAction(setFormDataAction({ownerKpp: company.kpp, ownerInn: company.inn}))
        setRequiresOwnerConfirmation(false);
    }

    const onInnChange = (inn) => {
        setValueAndClearError('inn', {
            kpp: '',
            inn,
        })
        dispatchWidgetAction(setFormDataAction({inn}))
        if (!inn) {
            setCompanyName('');
        }
    }

    const onOwnerInnChange = (ownerInn) => {
        setValueAndClearError('ownerInn', {
            kpp: '',
            inn: ownerInn,
        })
        dispatchWidgetAction(setFormDataAction({ownerInn}))
        if (!ownerInn) {
            setOwnerCompanyName('');
            setRequiresOwnerConfirmation(false);
        }
    }

    const onDriversCountChange = (selectedOption) => {
        setValueAndClearError('driversCount', selectedOption.value)
        trackEvent(TrackingEventName.SCREEN_POLICYINFO_SELECTED, {
            drivers: selectedOption.value
        })
        dispatchWidgetAction(setFormDataAction({driverNumber: selectedOption}))
    }

    const pollCalcResult = async () => {
        dispatchWidgetLoadingAction(startLoadingAction('osagoCalcRequest'))
        const res = await api(`/prescoring/front/calculate/${prescoringId}`)

        const data = await res.json()

        if (!data.isCompleted) {
            setTimeout(() => {
                pollCalcResult()
            }, 4000)
            return
        }

        if (data.isFaulted) {
            dispatchWidgetAction(moveNext({errorCode: data.errorCode}))
            dispatchWidgetLoadingAction(endLoadingAction('osagoCalcRequest'))
            return
        }

        if (ownerType === ORGANIZATION_TYPE_LEGAL) {
            if (isLoggedIn) {
                const applyRes = await api('/prescoring/front/apply', 'POST', {
                    preScoringId: prescoringId,
                    ownerType,
                    customerType: role,
                    source,
                    utm
                });
                const applyData = await applyRes.json()
                if (applyRes) {
                    const {scoringId} = applyData;
                    dispatchWidgetAction(setScoringIdAction(scoringId))
                    userScoringIdentification(scoringId);
                    callOperator(scoringId, helpType);
                } else {
                    dispatchWidgetAction(moveNext({errorCode: applyData.errorCode}))
                    dispatchWidgetLoadingAction(endLoadingAction('osagoCalcRequest'))
                    return
                }
            }
            dispatchWidgetAction(moveNext({role, ownerType, isLoggedIn}))
            dispatchWidgetLoadingAction(endLoadingAction('osagoCalcRequest'))
            return false
        }


        dispatchWidgetLoadingAction(endLoadingAction('osagoCalcRequest'))
        dispatchWidgetAction(moveNext({role, ownerType}))
        dispatchWidgetAction(setPriceAction(data.info.price))

        aggregateCrmData(cloneDeep({
            ...data,
            isCompleted: !!data.isFaulted ? 238 : 236
        }))
    }


    const requestCalc = async () => {
        await triggerValidation()
        const {isStandardCargo, isHighRiskCargo} = risk

        if (!isFormValid() || requiresOwnerConfirmation) return false


        dispatchWidgetLoadingAction(startLoadingAction('osagoCalcRequest'))

        let hasRestrictions = formData.driverNumber.value !== 'no-restriction'

        let sendData = {
            preScoringId: prescoringId,
            isStandardCargo,
            isHighRiskCargo,
            hasTrailer: formData.hasTrailer,
            policyStartOn: DateTime.fromJSDate(formData.policyStartOn).toISO(),
            ownerType,
            isRestricted: hasRestrictions,
            driverCount: hasRestrictions ? formData.driverNumber.value : null,
            technicalInspection: formData.technicalInspection
            //ownerRegistrationCity: formData.ownerRegistrationCity
        }
        if (isLegal) {
            trackEvent(TrackingEventName.SCREEN_POLICYINFO_SUBMIT, {
                vehicleOvnerType: ORGANIZATION_TYPE_LEGAL,
                categoryC: prescoringInfo.vehicleWeightGross <= 16 * 1000,
                withTrailer: sendData.isHighRiskCargo ? 'checked' : 'no checked',
                dangerous: sendData.isHighRiskCargo ? 'yes' : 'no',
                drivers: sendData.driverCount,
                inn: formData.inn,
                kpp: formData.kpp,
                ownerInn: formData.ownerInn,
                ownerKpp: formData.ownerKpp,
            })
        }

        if (ownerType === ORGANIZATION_TYPE_LEGAL) {
            sendData = {
                ...sendData,
                inn: formData.inn,
                kpp: formData.kpp,
                ownerInn: formData.ownerInn,
                ownerKpp: formData.ownerKpp,
            }
        }

        const allowedDriverNumberToCrm = {'no-restriction': 308, 1: 310, 2: 312, 3: 314, 4: 316, 5: 318}
        const driverNumberToCrm = {'no-restriction': 240, 1: 242, 2: 244, 3: 246, 4: 248, 5: 250}

        const crmAggregatorData = cloneDeep({
            ...sendData,
            allowedDriverNumber: allowedDriverNumberToCrm[formData.driverNumber.value],
            driverNumber: driverNumberToCrm[formData.driverNumber.value],
            cargoType: sendData.isHighRiskCargo ? 302 : 300
        })

        aggregateCrmData(crmAggregatorData)

        trackingReachGoal(tracking.osagoCalcCost, ownerType);

        const res = await api('/prescoring/front/calculate', 'POST', {
            ...sendData
        })

        if (res.status && res.status === 200) {
            pollCalcResult()
        } else if (res.status === 400) {
            const data = await res.json();
            dispatchWidgetAction(moveNext({errorCode: data.errorCode}))
            dispatchWidgetLoadingAction(endLoadingAction('osagoCalcRequest'))
            return;
        }
    }

    const renderNumberInput = () => {
        if (numberType === OSAGO_NUMBER_TYPE_GOV) {
            return (
                <Fragment>
                    <div {...className('car-number-title')}>
                        <Typography type={TypographyType.BODY}>
                            Гос. номер грузовика
                        </Typography>
                    </div>
                    <CarNumber number={prescoringInfo.plates.slice(0, 6)}
                               region={prescoringInfo.plates.slice(6)}
                               readonly={true}/>
                </Fragment>
            )
        }

        return (
            <Fragment>
                <FormTitle isGray>
                    VIN-номер грузовика
                </FormTitle>
                <VinInput readonly={true} value={vin}/>
            </Fragment>
        )
    }

    const onClickCategory = () => {}

    const onChangeHasTrailer = () => {
        dispatchWidgetAction(setFormDataAction({hasTrailer: !formData.hasTrailer}))
    }

    const onClickHasTrailer = () => {
        if (isLegal) {
            trackEvent(TrackingEventName.SCREEN_POLICYINFO_SELECTED, {
                withTrailer: !formData.hasTrailer ? 'no checked' : 'checked'
            })
        }
    }

    const onChangeHighRiskCargo = (riskObject) => {
        setRisk(riskObject)
        if (isLegal) {
            trackEvent(TrackingEventName.SCREEN_POLICYINFO_SELECTED, {
                dangerous: riskObject.isHighRiskCargo ? 'yes' : 'no'
            })
        }
    }

    useEffect(() => {
        let policyStartOn = DateTime.local().plus({'days': prescoringInfo.owner ? 3 : 4}).toJSDate();
        const maxPolicyStartOn = DateTime.local().plus({'days': 45}).toJSDate();
        if (prescoringInfo.prevPolicyEnOn) {
            const prevPolicyEnOn = DateTime.fromISO(prescoringInfo.prevPolicyEnOn).plus({'days': 1}).toJSDate();
            let datesDiff = DateTime.fromJSDate(prevPolicyEnOn).diff(DateTime.fromJSDate(policyStartOn), ['days']).toObject();
            if (datesDiff.days > 0) {
                policyStartOn = prevPolicyEnOn
            }
            datesDiff = DateTime.fromJSDate(prevPolicyEnOn).diff(DateTime.fromJSDate(maxPolicyStartOn), ['days']).toObject();
            if (datesDiff.days > 0) {
                policyStartOn = maxPolicyStartOn
            }
        }

        const technicalInspectionStartOn = prescoringInfo.technicalInspection?.startOn ? DateTime.fromISO(prescoringInfo.technicalInspection.startOn).toJSDate() : null;
        const technicalInspectionEndOn = prescoringInfo.technicalInspection?.endOn ? DateTime.fromISO(prescoringInfo.technicalInspection.endOn).toJSDate() : null;

        dispatchWidgetAction(setFormDataAction({
            hasTrailer: prescoringInfo.hasTrailer,
            policyStartOn,
            technicalInspection: {
                number: prescoringInfo.technicalInspection?.number,
                startOn: technicalInspectionStartOn,
                endOn: technicalInspectionEndOn,
                inn: prescoringInfo?.insurer?.legalEntity.inn,
                kpp: prescoringInfo?.insurer?.legalEntity.kpp,
                ownerInn: prescoringInfo?.owner?.legalEntity.inn,
                ownerKpp: prescoringInfo?.owner?.legalEntity.kpp,
            }
        }))


        register({name: 'driversCount'}, {required: 'Укажи количество водителей'})
        register({name: 'policyStartOn'}, {required: 'Укажи дату начала'})

        register({name: 'technicalInspectionNumber'}, {
            required: 'Укажи номер ДК',
            validate: (number) => {
                if (size(number + '') !== 15) {
                    return 'Номер ДК должен состоять из 15 символов';
                }
            }
        })
        register({name: 'technicalInspectionStartOn'}, {required: 'Укажи дату начала ДК'})
        register({name: 'technicalInspectionEndOn'}, {
            required: 'Укажи дату окончания ДК',
            validate: (endOnDate) => {
                const todayPlus5 = DateTime.local().plus({'days': 5});
                if (DateTime.fromJSDate(endOnDate).toMillis() < todayPlus5.toMillis()) {
                    return `Дата окончания должна быть не ранее ${todayPlus5.toFormat('dd.MM.yyyy')}`
                }
            }
        })


        setValue('policyStartOn', policyStartOn)
        setValue('technicalInspectionNumber', prescoringInfo.technicalInspection?.number)
        setValue('technicalInspectionStartOn', technicalInspectionStartOn)
        if (technicalInspectionEndOn) {
            setValueAndValidate('technicalInspectionEndOn', technicalInspectionEndOn);
        }

        const todayPlus5 = DateTime.local().plus({'days': 5});

        if (size(prescoringInfo.technicalInspection?.number + '') === 15 &&
            technicalInspectionStartOn &&
            technicalInspectionEndOn &&
            DateTime.fromJSDate(technicalInspectionEndOn).toMillis() >= todayPlus5.toMillis()) {
            setTechnicalInspectionFieldsDisabled(true);
        }

        if (ownerType === ORGANIZATION_TYPE_INDIVIDUAL || ownerType === ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR) {
            register({name: 'city'}, {required: 'Выбери город из списка'})
        } else {
            register(...innObjectValidator());
            register(...innObjectValidator('ownerInn'));

            if (prescoringInfo?.owner?.legalEntity) {
                setOwnerCompanyInfo(prescoringInfo?.owner?.legalEntity)
                searchForCompanies(prescoringInfo?.owner?.legalEntity?.inn, setOwnerCompanySuggestions)
            }

            if (prescoringInfo?.insurer?.legalEntity) {
                setCompanyInfo(prescoringInfo?.insurer?.legalEntity)
                searchForCompanies(prescoringInfo?.insurer?.legalEntity?.inn, setCompanySuggestions())
            }

            if (prescoringInfo?.owner?.legalEntity?.inn &&
                prescoringInfo?.owner?.legalEntity?.inn === prescoringInfo?.insurer?.legalEntity?.inn &&
                prescoringInfo?.owner?.legalEntity?.kpp === prescoringInfo?.insurer?.legalEntity?.kpp) {
                setOwnerIsInsurer(true);
            }

            if (prescoringInfo?.owner?.legalEntity?.inn && !prescoringInfo.isConsistentOwner) {
                setRequiresOwnerConfirmation(true);
            }

            onDriversCountChange(DRIVER_COUNT_OPTIONS[0]);
        }
    }, [])

    useEffect(() => {
        searchForAddresses(formData.ownerRegistrationCity)
    }, [formData.ownerRegistrationCity.fullTitle])

    useEffect(() => {
        searchForCompaniesWithDebounce(formData.inn, setCompanySuggestions)
    }, [formData.inn])

    useEffect(() => {
        searchForCompaniesWithDebounce(formData.ownerInn, setOwnerCompanySuggestions)
    }, [formData.ownerInn])

    useEffect(() => {
        if (isLegal) {
            trackEvent(TrackingEventName.SCREEN_POLICYINFO_LOADED)
            // trackPartnerEvent(PartnerEventName.STEP_3_ENTERPRENEUER_INFO)
        }
    }, [])

    return (
        <>
            <div {...className('owner-title')}>
                <Typography type={TypographyType.SUBHEAD}>
                    Тип собственника ТС?
                </Typography>
            </div>
            <ChooseOwnerTypeStep/>
            {renderNumberInput()}
            <ul {...className("info-list")}>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Марка ТС
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.make}
                        </Typography>
                    </div>
                </li>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Модель ТС
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.model}
                        </Typography>
                    </div>
                </li>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Год выпуска
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.yearManufacturedOn}
                        </Typography>
                    </div>
                </li>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Двигатель
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.powerHp} ЛС
                        </Typography>
                    </div>
                </li>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            VIN номер
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.vin}
                        </Typography>
                    </div>
                </li>
            </ul>
            <Checkbox label={'Автомобиль категории С'}
                      color='black'
                      boldLabel
                      disabled
                      onClick={onClickCategory}
                      note={`${prescoringInfo.vehicleWeightGross <= 16 * 1000 ?
                          'Разрешенная масса 16 тонн и менее' : 'Разрешенная масса более 16 тонн'}`}
                      checked/>
            <div {...className('mt-24')}>
                <Checkbox label={'Используется с прицепом'}
                          color='black'
                          boldLabel
                          onChange={onChangeHasTrailer}
                          onClick={onClickHasTrailer}
                          checked={formData.hasTrailer}
                          disabled={hasTrailerDisabled}/>
            </div>

            <div {...className(['form-row--bordered', 'form-row--bordered--first'])}>

                <div {...className('cargo-type')}>
                    <Typography type={TypographyType.SUBHEAD}>
                        Тип перевозимых грузов:
                    </Typography>
                </div>

                <div {...className(['form-row', 'form-row--24'])}>
                    <DefaultRadio label={'Стандартные грузы'}
                                  checked={risk.isStandardCargo}
                                  name={'cargoType'}
                                  onChange={() => onChangeHighRiskCargo({
                                      isHighRiskCargo: false,
                                      isStandardCargo: true
                                  })}
                    />
                </div>
                <div {...className(['form-row', 'form-row--last'])}>
                    <DefaultRadio label={'Опасные грузы'}
                                  checked={risk.isHighRiskCargo}
                                  name={'cargoType'}
                                  onChange={() => onChangeHighRiskCargo({
                                      isHighRiskCargo: true,
                                      isStandardCargo: false
                                  })}/>
                </div>
            </div>
            <div {...className(['form-row--bordered'])}>

                <div {...className('cargo-type')}>
                    <Typography type={TypographyType.SUBHEAD}>
                        Диагностическая карта
                    </Typography>
                </div>

                <div {...className('form-row')}>
                    <FormGroup label='Номер ДК' error={errors.technicalInspectionNumber}>
                        <Input value={formData.technicalInspection?.number}
                               disabled={technicalInspectionFieldsDisabled}
                               onChange={handleTechnicalInspectionNumberChange}
                        />
                    </FormGroup>
                </div>
                <div {...className('form-row')}>
                    <FormGroup error={errors.technicalInspectionStartOn}
                               label='Дата начала действия ДК'>
                        <DateInput
                            val={formData.technicalInspection?.startOn}
                            maxDate={DateTime.local().toJSDate()}
                            minDate={null}
                            disabled={technicalInspectionFieldsDisabled}
                            onChange={handleTechnicalInspectionStartOnChange}/>
                    </FormGroup>
                </div>
                <div {...className('form-row')}>
                    <FormGroup error={errors.technicalInspectionEndOn}
                               label='Дата окончания действия ДК'>
                        <DateInput
                            val={formData.technicalInspection?.endOn}
                            maxDate={null}
                            disabled={technicalInspectionFieldsDisabled}
                            minDate={DateTime.local().plus({'days': 5}).toJSDate()}
                            onChange={handleTechnicalInspectionEndOnChange}/>
                    </FormGroup>
                </div>
            </div>

            <div {...className(['form-row--bordered'])}>
                <div {...className(['mb-12'])}>
                    <Typography type={TypographyType.SUBHEAD}>
                        Кто оплачивает полис?
                    </Typography>
                </div>

                <div {...className('form-row')}>
                    {(ownerType === ORGANIZATION_TYPE_INDIVIDUAL || ownerType === ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR) ?
                        <FormGroup error={errors.city} label='Город регистрации собственника ТС'>
                            <AutoComplete value={formData.ownerRegistrationCity.fullTitle}
                                          suggestions={addressSuggestions}
                                          keyToDisplay='fullTitle'
                                          onChoose={setCityData}
                                          onChange={async value => {
                                              await setCityData({
                                                  fiasId: '',
                                                  fullTitle: value
                                              })
                                          }}/>
                        </FormGroup>
                        :
                        <FormGroup error={errors.inn} label='ИНН организации'>
                            <AutoComplete value={formData.inn}
                                          placeholder={'Введи ИНН организации'}
                                          defaultValue={prescoringInfo?.owner?.legalEntity?.inn}
                                          suggestions={companySuggestions}
                                          keyToDisplay='kpp'
                                          limit={100}
                                          onChoose={setCompanyInfo}
                                          renderItem={item => (
                                              <div>
                                                  <div {...className(['mb-4', 'main-osago-form__organization-row'])}>
                                                      <Typography type={TypographyType.CAPTION}
                                                                  color={TypographyColor.MUST_900}>{item.title}</Typography>
                                                  </div>
                                                  <div {...className(['mb-4', 'main-osago-form__organization-row'])}>
                                                      <Typography type={TypographyType.CAPTION}
                                                                  color={TypographyColor.MUST_800}>{item.inn}</Typography>
                                                      <span {...className(['ml-8', 'mr-8'])}><Typography
                                                          type={TypographyType.CAPTION}
                                                          color={TypographyColor.MUST_800}>|</Typography></span>
                                                      <Typography type={TypographyType.CAPTION}
                                                                  color={TypographyColor.MUST_800}>КПП: {item.kpp}</Typography>
                                                  </div>
                                              </div>
                                          )}
                                          onChange={async value => {
                                              await onInnChange(value)
                                          }}/>
                        </FormGroup>
                    }

                </div>

                {ownerType === ORGANIZATION_TYPE_LEGAL &&
                <div {...className('form-row')}>
                    <FormGroup label='Название организации'>
                        <Input value={companyName}
                               disabled={true}
                               onChange={() => {
                               }}
                        />
                    </FormGroup>
                </div>}

            </div>

            <div {...className(['form-row--bordered'])}>
                <div {...className(['mb-12'])}>
                    <Typography type={TypographyType.SUBHEAD}>
                        Кто собственник ТС?
                    </Typography>
                </div>

                <div {...className('mt-24')}>
                    <FormGroup error={null} showError={false}>
                        <Checkbox name="conditions"
                                  checked={ownerIsInsurer}
                                  onChange={handleOwnerIsInsurerChange}
                                  disabled={false}
                                  labelAsFootnote={true}
                                  label='Cобственник ТС является Страхователем транспортного средства'
                        />
                    </FormGroup>
                </div>

                <div {...className(['form-row', 'mt-24'])}>
                    {(ownerType === ORGANIZATION_TYPE_INDIVIDUAL || ownerType === ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR) ?
                        <FormGroup error={errors.city} label='Город регистрации собственника ТС'>
                            <AutoComplete value={formData.ownerRegistrationCity.fullTitle}
                                          suggestions={addressSuggestions}
                                          keyToDisplay='fullTitle'
                                          onChoose={setCityData}
                                          onChange={async value => {
                                              await setCityData({
                                                  fiasId: '',
                                                  fullTitle: value
                                              })
                                          }}/>
                        </FormGroup>
                        :
                        <FormGroup error={errors.ownerInn}
                                   icon={!!requiresOwnerConfirmation && <HelpBubble text='Проверь верно ли указан ИНН Собственника и внеси изменения, если необходимо.'/> }
                                   warning={!!requiresOwnerConfirmation && 'Нужно проверить и подтвердить'}
                                   label='ИНН организации'>
                            <div {...className(['main-osago-form__owner-row', requiresOwnerConfirmation ? 'main-osago-form__owner-row--requires-confirmation' : ''])}>
                                <AutoComplete value={formData.ownerInn || ''}
                                              defaultValue={prescoringInfo?.owner?.legalEntity?.inn}
                                              placeholder={'Введи ИНН организации'}
                                              suggestions={ownerCompanySuggestions}
                                              keyToDisplay='kpp'
                                              disabled={ownerIsInsurer}
                                              limit={100}
                                              onChoose={setOwnerCompanyInfo}
                                              renderItem={item => (
                                                  <div>
                                                      <div {...className(['mb-4', 'main-osago-form__organization-row'])}>
                                                          <Typography type={TypographyType.CAPTION}
                                                                      color={TypographyColor.MUST_900}>{item.title}</Typography>
                                                      </div>
                                                      <div {...className(['mb-4', 'main-osago-form__organization-row'])}>
                                                          <Typography type={TypographyType.CAPTION}
                                                                      color={TypographyColor.MUST_800}>{item.inn}</Typography>
                                                          <span {...className(['ml-8', 'mr-8'])}><Typography
                                                              type={TypographyType.CAPTION}
                                                              color={TypographyColor.MUST_800}>|</Typography></span>
                                                          <Typography type={TypographyType.CAPTION}
                                                                      color={TypographyColor.MUST_800}>КПП: {item.kpp}</Typography>
                                                      </div>
                                                  </div>
                                              )}
                                              onChange={async value => {
                                                  await onOwnerInnChange(value)
                                              }}/>
                                {requiresOwnerConfirmation &&
                                <Button onClick={() => {
                                    trackEvent(TrackingEventName.SCREEN_POLICYINFO_CONFIRMED, {
                                        confirmed: 'INN'
                                    })
                                    setRequiresOwnerConfirmation(false)
                                }}><CheckSvg/></Button>}
                            </div>
                        </FormGroup>
                    }

                </div>

                {ownerType === ORGANIZATION_TYPE_LEGAL &&
                <div {...className('form-row')}>
                    <FormGroup label='Название организации'>
                        <Input value={ownerCompanyName}
                               disabled={true}
                               onChange={() => {
                               }}
                        />
                    </FormGroup>
                </div>}

            </div>
            <div {...className(['mb-12'])}>
                <Typography type={TypographyType.SUBHEAD}>
                    Параметры полиса 
                </Typography>
            </div>

            <div {...className('form-row')}>
                <FormGroup error={errors.policyStartOn} label='Начало действия нового полиса'>
                  { prescoringInfo.owner ?
                    <DateInput
                        val={formData.policyStartOn}
                        minDate={DateTime.local().plus({'days':  3}).toJSDate()}
                        maxDate={DateTime.local().plus({'days': 45}).toJSDate()}
                        onChange={onPolicyStartOnChange}
                    />
                    :
                    <DateInput
                        val={formData.policyStartOn}
                        minDate={DateTime.local().plus({'days':  4}).toJSDate()}
                        maxDate={DateTime.local().plus({'days': 45}).toJSDate()}
                        onChange={onPolicyStartOnChange}
                    />
                  }
                </FormGroup>
            </div>

            <div {...className(['form-row'])}>
                <FormGroup error={errors.driversCount} label='Количество водителей'>
                    <DefaultSelect
                        disabled={ownerType === ORGANIZATION_TYPE_LEGAL}
                        selectedOption={formData.driverNumber}
                        onChange={onDriversCountChange}
                        options={DRIVER_COUNT_OPTIONS}/>
                </FormGroup>
            </div>

            <div {...className('form-row-submit')}>
                <Button
                    loading={loading.osagoCalcRequest}
                    onClick={handleSubmit(requestCalc)}>
                    РАССЧИТАТЬ СТОИМОСТЬ
                </Button>
            </div>
        </>
    );
}

export default withFormHook(MainOsagoForm);
