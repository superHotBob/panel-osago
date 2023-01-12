import React, { useEffect, useMemo, useState } from 'react';
import './style.scss';
import { Typography, TypographyColor, TypographyType, TypographyWeight } from '../typography/Typography';
import StatusDangerSvg from '../../svg/status-danger.svg';
import { CarNumber } from '../car-number/CarNumber';
import { FormGroup } from '../form-group/FormGroup';
import { withFormHook } from '../../hoc/withFormHook';
import { PhoneNumber } from '../phone-number/PhoneNumber';
import { agreementValidator, carNumberValidator, phoneValidator } from "../../validators";
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthIsLoggedIn, sendSmsCodeAction } from '../../redux/authReducer';
import { Checkbox } from '../checkbox/Checkbox';
import { Button } from '../button/Button';
import { withWidgetId } from '../../hoc/withWidgetId';
import api from '../../api';
import { getPredictionStatus, getUserInfo } from '../main-panel/MainPanelModel';
import { DateTime } from 'luxon';
import isEmpty from 'lodash/isEmpty';
// import { startAccidentFlowAction } from '../accident-flow/AccidentFlowModel';
import { getOsagoUrl } from '../../utils/urls';
import first from 'lodash/first';
import { ShturmanSvg } from '../../svg/components/ShturmanSvg';
import { ShturmanSmileSvg } from '../../svg/components/ShturmanSmileSvg';
import { AddTrack, CustomEventName } from '../../modules/tracking';

function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

export const ScoringPeriod = {
    SIX_MONTHS: 'SIX_MONTHS',
    YEAR: 'YEAR'
}

export const AccidentPageComponent = ({
    errors,
    handleSubmit,
    setValueAndClearError,
    register,
    unregister,
    startLoading,
    endLoading,
    isFormValid,
}) => {
    const dispatch = useDispatch();
    const [scoreAnimation, setScoreAnimation] = useState(false);
    const [predictionId, setPredictionId] = useState(null);
    const [info, setInfo] = useState(null);
    const [number, setNumber] = useState('');
    const [region, setRegion] = useState('');
    const [carNumberError, setCarNumberError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false);
    const [scoringPeriod, setScoringPeriod] = useState(ScoringPeriod.SIX_MONTHS);
    const [resultShown, setResultShown] = useState(false);
    const [periodChangeInProgress, setPeriodChangeInProgress] = useState(false);
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)

    let predictionData = null;
    let accidentRatingPredictionData = null;
    if (info) {
        accidentRatingPredictionData = predictionData = scoringPeriod === ScoringPeriod.SIX_MONTHS ? info.accidentoMeterHalfYear : info.accidentoMeter;
        if (periodChangeInProgress) {
            accidentRatingPredictionData = scoringPeriod === ScoringPeriod.YEAR ? info.accidentoMeterHalfYear : info.accidentoMeter;
        }
    }

    const handleStartPredictionFlow = async () => {
        if (isFormValid()) {
            if (isLoggedIn) {
                handlePhoneConfirmed();
                window.localStorage.setItem('osago-add-vehicle-number', JSON.stringify({ n: number, r: region }));
                window.location.href = "/add_vehicle"
            }
        }
    }

    const handleDecreaseAccidents = () => {
        AddTrack(CustomEventName.REDUCE_ACCIDENT);
        dispatch(startAccidentFlowAction(predictionId, true));
    }

    useEffect(() => {
        if (!isLoggedIn) {
            register(...phoneValidator('phone'))
            register(...agreementValidator())
        } else {
            unregister('phone')
            unregister('agreement')
        }

    }, [isLoggedIn])

    useEffect(() => {
        register(...carNumberValidator('fullNumber'))
    }, [])

    const handlePhoneNumberChange = (phoneNumber) => {
        setValueAndClearError('phone', phoneNumber);
        setPhoneNumber(phoneNumber);
    }

    const handleAgreementChanged = () => {
        const newIsConfirmedAgreement = !isConfirmedAgreement;
        setValueAndClearError('agreement', newIsConfirmedAgreement);
        setIsConfirmedAgreement(newIsConfirmedAgreement);
    }

    const handleNumberChange = (number) => {
        setValueAndClearError('fullNumber', `${number}${region}`);
        setNumber(number);
    }

    const handleRegionChange = (region) => {
        setValueAndClearError('fullNumber', `${number}${region}`);
        setRegion(region);
    }

    const checkPermission = async () => {
        const historyResponse = await api('/profile/history');
        const userResponse = await getUserInfo();

        if (historyResponse.status === 200 && userResponse.status == 200) {
            const historyResponseJson = await historyResponse.json();
            const userResponseJson = await userResponse.json();
            if (!isEmpty(historyResponseJson.history) && !userResponseJson.bornOn) {
                return false;
            }
        }
        return true;
    }

    const handlePhoneConfirmed = async () => {
        const checkPermissionResult = await checkPermission();

        if (!checkPermissionResult) {
            return;
        }

        if (isMobile()) {
            window.scrollTo(0, 280);
            window.scrollTo(0, 300);
        }

        const response = await api('/prediction/init', 'POST', {
            plates: `${number}${region}`
        });
        const data = await response.json();
        if (!data || !data.predictionId) {
            setPredictionErrorCode(data.errorCode);
            setScoreAnimation(false);
            return
        }

        const { predictionId } = data;
        setPredictionId(predictionId);

        do {
            try {
                const response = await getPredictionStatus(predictionId);
                const data = await response.json();
                if (data && data.isCompleted) {
                    if (!data.isFaulted) {
                        setInfo(data.info)
                    } else {
                        setPredictionErrorCode(data.errorCode);
                        setScoreAnimation(false);
                    }
                    break;
                }
            } catch (error) {

            }
            await new Promise(r => setTimeout(r, 2000));
        } while (true);
    }


    const renderFormHeaderWithTitle = () => {
        return (
            <>
                <div className="accident-page__form-header-stable">
                    {!resultShown && <ShturmanSvg className="accident-page__shturman-svg" />}
                    {resultShown && <ShturmanSmileSvg className="accident-page__shturman-svg" />}
                </div>
                <div className="accident-page__form-title">
                    {!resultShown && <Typography type={TypographyType.H5}>Укажи данные для расчета:</Typography>}
                    {resultShown && <Typography type={TypographyType.H5}>Результат твоего грузовика:</Typography>}
                </div>
            </>
        )
    }

    const renderFormOrResult = () => {
        return resultShown && info ? renderResultForm() : renderForm();
    }

    const renderForm = () => {
        return (
            <div className="accident-page__form">
                <FormGroup error={errors.fullNumber || carNumberError} label="Гос. номер грузовика">
                    <CarNumber
                        number={number}
                        region={region}
                        error={errors.fullNumber}
                        inputStyle='black'
                        onError={setCarNumberError}
                        onNumberChange={handleNumberChange}
                        onRegionChange={handleRegionChange}
                        onEnterPress={handleSubmit(handleStartPredictionFlow)}
                        readonly={false} />
                </FormGroup>

                <div className="mustins-mt-24">
                    <Button
                        loading={scoreAnimation}
                        onClick={handleSubmit(handleStartPredictionFlow)}>
                        ДОБАВИТЬ АВТО
                    </Button>
                </div>
            </div>
        )
    }


    const policyExpiresSoon = useMemo(() => {
        if (!info || !info.prevPolicyEndOn) {
            return false;
        }
        const prevPolicyEndOnDate = DateTime.fromISO(info.prevPolicyEndOn).toJSDate();
        const todayDate = DateTime.utc().startOf('day').toJSDate();
        const policyDatesDiff = DateTime.fromJSDate(prevPolicyEndOnDate).diff(DateTime.fromJSDate(todayDate), ['days']).toObject();
        return policyDatesDiff.days <= 45;
    }, [info])

    const renderResultForm = () => {
        return (
            <div className="accident-page__form">
                <FormGroup label="Гос. номер грузовика">
                    <CarNumber number={number}
                        region={region}
                        inputStyle='black'
                        readonly={true} />
                </FormGroup>
                <ul className="mustins-info-list accident-page__info-list">
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}
                                color={TypographyColor.GRAY_DARK}>
                                Марка ТС
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            <Typography type={TypographyType.BODY}>
                                {info.make}
                            </Typography>
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}
                                color={TypographyColor.GRAY_DARK}>
                                Модель ТС
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            <Typography type={TypographyType.BODY}>
                                {info.model}
                            </Typography>
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}
                                color={TypographyColor.GRAY_DARK}>
                                Год выпуска
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            <Typography type={TypographyType.BODY}>
                                {info.manufacturedOn}
                            </Typography>
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}
                                color={TypographyColor.GRAY_DARK}>
                                Двигатель
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            <Typography type={TypographyType.BODY}>
                                {info.powerHp} ЛС
                            </Typography>
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}
                                color={TypographyColor.GRAY_DARK}>
                                VIN номер
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            <Typography type={TypographyType.BODY}>
                                {info.vin}
                            </Typography>
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend"}>
                            <Typography type={TypographyType.BODY}>
                                Штрафы
                            </Typography>
                        </div>
                        <div className="mustins-info-list-item__val accident-page__fines">
                            {info.accidentCount > 0 && <>
                                <a className="accident-page__link accident-page__link--fines">
                                    <Typography type={TypographyType.BODY}
                                        color={TypographyColor.PRIMARY}>
                                        Оплатить
                                    </Typography>
                                </a>
                                <StatusDangerSvg className="accident-page__status-danger" />
                                <Typography type={TypographyType.BODY}
                                    weight={TypographyWeight.BOLD}
                                    color={TypographyColor.RED}>
                                    4
                                </Typography>
                            </>}
                            {info.accidentCount === 0 &&
                                <Typography type={TypographyType.BODY}>
                                    0
                            </Typography>}
                            {!info.accidentCount && info.accidentCount !== 0 &&
                                <Typography type={TypographyType.BODY}
                                    color={TypographyColor.MUST_800}>
                                    Нет данных
                            </Typography>}
                        </div>
                    </li>
                    <li className={"mustins-info-list-item"}>
                        <div className={"mustins-info-list-item__legend accident-page__osago"}>
                            <Typography type={TypographyType.BODY}>
                                ОСАГО до:
                            </Typography>
                        </div>
                        <div className={"mustins-info-list-item__val"}>
                            {info.prevPolicyEndOn && <>
                                <a className="accident-page__link accident-page__link--osago"
                                    target="_blank"
                                    href={`${getOsagoUrl()}?number=${number}&region=${region}`}>
                                    <Typography type={TypographyType.BODY}
                                        color={TypographyColor.PRIMARY}>
                                        Оформить
                                    </Typography>
                                </a>
                                <Typography type={TypographyType.BODY}
                                    weight={policyExpiresSoon ? TypographyWeight.BOLD : TypographyWeight.REGULAR}
                                    color={policyExpiresSoon ? TypographyColor.RED : TypographyColor.MUST_900}>
                                    {DateTime.fromISO(info.prevPolicyEndOn).toFormat('dd.MM.yyyy')}
                                </Typography>
                            </>}
                            {!info.prevPolicyEndOn &&
                                <Typography type={TypographyType.BODY}
                                    color={TypographyColor.MUST_800}>
                                    Нет данных
                            </Typography>}
                        </div>
                    </li>
                </ul>
                <div className="mustins-mt-32 accident-page__reduce-accidents">
                    <Button
                        loading={scoreAnimation}
                        onClick={handleDecreaseAccidents}>
                        Снизить аварийность
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="accident-page__form-container-stable">
                {renderFormHeaderWithTitle()}
                {renderFormOrResult()}
            </div>
        </>
    );
}

const AddCar = withWidgetId(withFormHook(AccidentPageComponent))

export { AddCar }

