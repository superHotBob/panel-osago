import React, {useEffect, useMemo, useState} from 'react';
import throttle from 'lodash/throttle';
import {Link} from "react-router-dom";
import './accident-page.scss';
import {
    CenterColumn,
    LeftColumn,
    RightColumn,
    ThreeColumnsLayout
} from '../../../components/three-columns-layout/ThreeColumnsLayout';
import {ScoreGraph} from '../../../components/score-graph/ScoreGraph';
import {Carousel} from '../../../components/carousel/Carousel';
import {Typography, TypographyColor, TypographyType, TypographyWeight} from '../../../components/typography/Typography';
import StatusDangerSvg from '../../../svg/status-danger.svg';
import QuestionSvg from '../../../svg/question.svg';
import LogoSmallSvg from '../../../svg/logo-small.svg';
import DangerMonthSvg from '../../../svg/danger-month.svg';
import {CarNumber} from '../../../components/car-number/CarNumber';
import {FormGroup} from '../../../components/form-group/FormGroup';
import {withFormHook} from '../../../hoc/withFormHook';
import {PhoneNumber} from '../../../components/phone-number/PhoneNumber';
import {agreementValidator, carNumberValidator, phoneValidator} from "../../../validators";
import {useDispatch, useSelector} from 'react-redux';
import {
    selectAuthIsLoggedIn,
    selectAuthUser,
    sendSmsCodeAction,
    getProfileRes,
    getProfileSubscriptionRes,
    getProfileUniqVehiclesRes
} from '../../../redux/authReducer';
import {Checkbox} from '../../../components/checkbox/Checkbox';
import {Button} from '../../../components/button/Button';
import {Modal} from '../../../components/modal/Modal';
import AuthContainer from '../../../components/auth/AuthContainer';
import {withWidgetId} from '../../../hoc/withWidgetId';
import {AccidentErrorModal} from '../components/accident-error-modal/AccidentErrorModal';
import api from '../../../api';
import {getPredictionStatus, getUserInfo} from '../../../components/main-panel/MainPanelModel';
import {AccidentRating} from '../components/accident-rating/AccidentRating';
import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import {DateTime} from 'luxon';
import isEmpty from 'lodash/isEmpty';
import {
    formatPercentage,
    getAccidentPredictionBottomRate,
    getAccidentPredictionBottomRatePosition,
    getAccidentPredictionLevel,
    getAccidentPredictionLevelBorders,
    getAccidentPredictionNormaTo,
    getAccidentPredictionRate,
    getAccidentPredictionRatePosition,
    getAccidentPredictionTopRate
} from '../AccidentPredictionModel';
import {IconName, IconSprite} from '../../../components/icon-sprite/IconSprite';
import {AccidentFlow} from '../components/accident-flow/AccidentFlow';
import {selectStep, startAccidentFlowAction} from '../components/accident-flow/AccidentFlowModel';
import {getOsagoUrl} from '../../../utils/urls';
import first from 'lodash/first';
import {ShturmanSvg} from '../../../svg/components/ShturmanSvg';
import {ShturmanSmileSvg} from '../../../svg/components/ShturmanSmileSvg';
import {MustBasedTechnology} from '../../../components/must-based-technology/must-based-technology';
import { FREE_VEHICLES_LIMITATION } from '../../../constants/auth';
import {AccidentPricingPlansModal} from "src/pages/accident-prediction/accident-history/components/accident-pricing-plans-modal/AccidentPricingPlansModal";

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
                                          loading,
                                          startLoading,
                                          endLoading,
                                          isFormValid
                                      }) => {
    const dispatch = useDispatch();

    const [scoreAnimation, setScoreAnimation] = useState(false);
    const [predictionId, setPredictionId] = useState(null);
    const [info, setInfo] = useState(null);
    const [number, setNumber] = useState('');
    const [region, setRegion] = useState('');
    const [authModalShown, setAuthModalShown] = useState(false);
    const [carNumberError, setCarNumberError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false);
    const [predictionErrorCode, setPredictionErrorCode] = useState(null);
    const [scoringPeriod, setScoringPeriod] = useState(ScoringPeriod.SIX_MONTHS);
    const [resultShown, setResultShown] = useState(false);
    const [periodChangeInProgress, setPeriodChangeInProgress] = useState(false);
    const [shouldRunCalculationAfterProfileCompletion, setShouldRunCalculationAfterProfileCompletion] = useState(false);
    const [isOpenPricingModal, setIsOpenPricingModal] = useState(false)

    const isLoggedIn = useSelector(selectAuthIsLoggedIn)
    const step = useSelector(selectStep);
    const user = useSelector(selectAuthUser)

    let predictionData = null;
    let accidentRatingPredictionData = null;
    if (info) {
        accidentRatingPredictionData = predictionData = scoringPeriod === ScoringPeriod.SIX_MONTHS ? info.accidentoMeterHalfYear : info.accidentoMeter;
        if (periodChangeInProgress) {
            accidentRatingPredictionData = scoringPeriod === ScoringPeriod.YEAR ? info.accidentoMeterHalfYear : info.accidentoMeter;
        }
    }


    const handleScoreGraphAnimationFinished = () => {
        setScoreAnimation(false);
        setResultShown(true);
    }

    const handleErrorModalClose = () => {
        setPredictionErrorCode(null);
    }

    const handleCheckMoreClick = (e) => {
        if (!!user && !user.bornOn) {
            dispatch(startAccidentFlowAction(predictionId));
            e.stopPropagation();
            e.preventDefault();
        }
    }

    const getHelpText = () => {
        return '';
    }

    const handleStartPredictionFlow = async () => {
        if (isFormValid()) {
            if (isLoggedIn) {
                handlePhoneConfirmed();
            } else {
                setAuthModalShown(true);
                startLoading('requestSmsCode')
                await dispatch(sendSmsCodeAction(phoneNumber))
                endLoading('requestSmsCode')
            }
        }
    }

    const handleDecreaseAccidents = () => {
        dispatch(startAccidentFlowAction(predictionId, true));
    }

    useEffect(() => {
        if (shouldRunCalculationAfterProfileCompletion && !step && !!user && user.bornOn) {
            setShouldRunCalculationAfterProfileCompletion(false);
            handlePhoneConfirmed(true);
        }

    }, [user, step, shouldRunCalculationAfterProfileCompletion])

    useEffect(() => {
        if (!isLoggedIn) {
            register(...phoneValidator('phone'))
            register(...agreementValidator())
        } else {
            unregister('phone')
            unregister('agreement')
        }

    }, [isLoggedIn])

    // * catch vehicle number from "my_vehicles" and "my_history" and trigger loading
    useEffect(() => {
        const data = window.localStorage.getItem('osago-add-vehicle-number');
        if (data) {
            window.localStorage.removeItem('osago-add-vehicle-number');
            const {n, r} = JSON.parse(data);

            setTimeout(() => {
                handleRegionChange(r);
                handleNumberChange(n);
                document.querySelector("#submit-button").click()
            });
        } else {
            register(...carNumberValidator('fullNumber'));
        }
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

    const handleCloseModal = () => {
        setAuthModalShown(false);
    }

    const handleScoringPeriodChange = async (period) => {
        if (periodChangeInProgress) {
            return;
        }
        setScoringPeriod(period);
        setPeriodChangeInProgress(true);
        await new Promise(r => setTimeout(r, 4500));
        setPeriodChangeInProgress(false);
    }
 

    const checkPermission = async () => {
        const [
            user,
            subscriptions,
            vehicles
        ] = await Promise.all([
            getProfileRes(),
            getProfileSubscriptionRes(),
            getProfileUniqVehiclesRes()
        ]);

        if (
            !user && !subscriptions && !vehicles ||
            user.errorCode ||
            subscriptions.errorCode ||
            vehicles.errorCode
        ) {
            return true;
        } 

        // * если есть история и не заполнен профиль то показывать окно регистрации
        if (!isEmpty(vehicles.history) && !!user && !user.bornOn) {
            dispatch(startAccidentFlowAction(first(vehicles.history, {}).id));
            setAuthModalShown(false);
            setScoreAnimation(false);
            setShouldRunCalculationAfterProfileCompletion(true);
            return false;
        }

        // * если есть история и заполнен профиль но нету подписки то проверять не превышен ли лимит
        if (!subscriptions.hasActiveSubscription && vehicles.totalCount >= FREE_VEHICLES_LIMITATION) {
            setAuthModalShown(false);
            setScoreAnimation(false);
            setIsOpenPricingModal(true);
            return false;
        }
        return true;
    }
 
    const handlePhoneConfirmed = async (skipCheck) => {
        setAuthModalShown(false);
        setScoreAnimation(true);

        if (!skipCheck) {
            const checkPermissionResult = await checkPermission();

            if (!checkPermissionResult) {
                return;
            }
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

        const {predictionId} = data;
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
    const formatPhone = () => {
        return `+7(${phoneNumber.substring(0, 3)}) ***-**-${phoneNumber.substr(-2)}`
    }

    const renderTitleAndSubtitle = () => {
        return (
            <>
                <div className="accident-page__title">
                    <Typography type={TypographyType.H2}>Вероятность ДТП</Typography>
                </div>
                <div
                    className={classNames('accident-page__sub-title', resultShown ? 'accident-page__sub-title--score' : '')}>
                    {!resultShown &&
                    <Typography type={TypographyType.BODY}>Узнай вероятность ДТП для совего грузовика, включая
                        ситуации когда виновником является третья сторона</Typography>}
                    {resultShown &&
                    <Typography type={TypographyType.BODY}>Рейтинг безопасности самосвалов:</Typography>}
                </div>
            </>
        )
    }

    const renderScoreGraph = () => {
        const level = getAccidentPredictionLevel(predictionData);
        return (
            <ScoreGraph loading={scoreAnimation}
                        score={formatPercentage(getAccidentPredictionRate(predictionData))}
                        number={number}
                        region={region}
                        norm={formatPercentage(getAccidentPredictionNormaTo(predictionData))}
                        onAnimationFinished={handleScoreGraphAnimationFinished}
                        scoringPeriod={scoringPeriod}
                        onScoringPeriodChange={handleScoringPeriodChange}
                        level={level}
                        levelBorders={getAccidentPredictionLevelBorders(predictionData, level)}
                        helpText={getHelpText()}/>
        )
    }

    const renderFormHeaderWithTitle = () => {
        return (
            <>
                <div className="accident-page__form-header">
                    {!resultShown && <ShturmanSvg className="accident-page__shturman-svg"/>}
                    {resultShown && <ShturmanSmileSvg className="accident-page__shturman-svg"/>}
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
                        readonly={false}/>
                </FormGroup>
                {!isLoggedIn &&
                <>
                    <FormGroup error={errors.phone} label="Телефон для отчета">
                        <PhoneNumber
                            onNumberChange={handlePhoneNumberChange}
                            onEnter={handleSubmit(handleStartPredictionFlow)}
                            number={phoneNumber}
                        />
                    </FormGroup>
                    <div className="mustins-mt-12">
                        <FormGroup error={errors.agreement} showError={false}>
                            <Checkbox name="agreement"
                                      checked={isConfirmedAgreement}
                                      onChange={handleAgreementChanged}
                                      disabled={false}
                                      labelAsFootnote={true}
                                      label='Я согласен на обработку моих персональных данных в целях расчета вероятности ДТП'
                            />
                        </FormGroup>
                    </div>
                </>}

                <div className="mustins-mt-24">
                    <Button
                        loading={scoreAnimation}
                        onClick={handleSubmit(handleStartPredictionFlow)}
                        id="submit-button"
                    >
                        узнать вероятность дтп
                    </Button>
                </div>
            </div>
        )
    }

    const renderTechnologies = () => {
        return (
            <div className="accident-page__technologies">
                <Typography type={TypographyType.CAPTION}>
                    На основе технологий
                </Typography>
                <LogoSmallSvg className="accident-page__logo-small"/>
                <Typography type={TypographyType.CAPTION}>
                    и Искусственного Интеллекта
                </Typography>
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
                               readonly={true}/>
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
                    {/*<li className={"mustins-info-list-item"}>*/}
                    {/*    <div className={"mustins-info-list-item__legend"}>*/}
                    {/*        <Typography type={TypographyType.BODY}*/}
                    {/*                    color={TypographyColor.GRAY_DARK}>*/}
                    {/*            Двигатель*/}
                    {/*        </Typography>*/}
                    {/*    </div>*/}
                    {/*    <div className={"mustins-info-list-item__val"}>*/}
                    {/*        <Typography type={TypographyType.BODY}>*/}
                    {/*            {info.powerHp} ЛС*/}
                    {/*        </Typography>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
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
                                <StatusDangerSvg className="accident-page__status-danger"/>
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

    const renderAccidentRating = () => {
        return (
            <div className="accident-page__accident-rating">
                <AccidentRating score={formatPercentage(getAccidentPredictionRate(accidentRatingPredictionData))}
                                place={getAccidentPredictionRatePosition(accidentRatingPredictionData)}
                                level={getAccidentPredictionLevel(accidentRatingPredictionData)}
                                bestScore={formatPercentage(getAccidentPredictionTopRate(accidentRatingPredictionData))}
                                worstScore={formatPercentage(getAccidentPredictionBottomRate(accidentRatingPredictionData))}
                                number={number}
                                region={region}
                                count={getAccidentPredictionBottomRatePosition(accidentRatingPredictionData)}/>
            </div>
        )
    }

    const renderDangerMonth = () => {
        const month = capitalize(DateTime.fromISO(accidentRatingPredictionData.maxRiskDate).setLocale('ru').toFormat('LLLL yyyy'));
        return (
            <div className="accident-page__danger-month">
                <div>
                    <div className="accident-page__danger-month-title">
                        <QuestionSvg className="accident-page__question-svg"/>
                        <Typography type={TypographyType.CAPTION}>Период максимальной опасности</Typography>
                    </div>
                    <Typography type={TypographyType.H4}
                                weight={TypographyWeight.BOLD}>{month}</Typography>
                </div>
                <div className="accident-page__danger-month-svg-container">
                    <DangerMonthSvg/>
                </div>
            </div>
        )
    }

    const renderPageLinks = () => {
        return (
            <div className="accident-page__page-links">

                {resultShown &&
                <a href="/add_vehicle" className="accident-page__page-link"
                   onClick={handleCheckMoreClick}>
                    <IconSprite name={IconName.CIRKLE_PLUS}
                                className="accident-page__page-link-icon"/>
                    <Typography type={TypographyType.CAPTION}>
                        Проверить еще
                    </Typography>
                </a>}
                {isLoggedIn &&
                <a href={`/my_history`} className="accident-page__page-link">
                    <IconSprite name={IconName.CIRKLE_TIME}
                                className="accident-page__page-link-icon"/>
                    <Typography type={TypographyType.CAPTION}>
                        История запросов
                    </Typography>
                </a>}
            </div>
        )
    }

    return (
        <>
            <div className="accident-page__desktop-version">
                <ThreeColumnsLayout>
                    <LeftColumn>
                        {renderTitleAndSubtitle()}
                        {!resultShown && <Carousel/>}
                        {resultShown && renderAccidentRating()}
                        {resultShown && predictionData && renderDangerMonth()}
                        <MustBasedTechnology/>
                    </LeftColumn>
                    <CenterColumn>
                        <div className="accident-page__score-graph-container">
                            {renderScoreGraph()}
                        </div>
                    </CenterColumn>
                    <RightColumn>
                        {renderPageLinks()}
                        <div className="accident-page__form-container">
                            {renderFormHeaderWithTitle()}
                            {renderFormOrResult()}
                        </div>
                    </RightColumn>
                </ThreeColumnsLayout>
            </div>
            <div className="accident-page__mobile-and-tablet-version">
                {renderTitleAndSubtitle()}
                {renderPageLinks()}
                {renderFormHeaderWithTitle()}
                {renderScoreGraph()}
                {resultShown && <div className="accident-page__mobile-rating-title">
                    <Typography type={TypographyType.H4}>Рейтинг безопасности самосвалов:</Typography>
                </div>}
                {resultShown && renderAccidentRating()}
                {resultShown && predictionData && renderDangerMonth()}
                <div className="accident-page__mobile-form">
                    {renderFormOrResult()}
                </div>
                {!resultShown && <Carousel/>}
                <MustBasedTechnology/>
            </div>

            <Modal
                isOpened={authModalShown}
                title={<span>Подтверди номер телефона. <br/> Отправил СМС с кодом на номер {formatPhone()} </span>}
                loading={loading.requestSmsCode || loading.submitSmsCode}
                onClose={handleCloseModal}>
                <AuthContainer
                    shouldLoginAfterConfirmation={true}
                    initialStep='sms'
                    initialPhoneNumber={phoneNumber}
                    onPhoneConfirmed={handlePhoneConfirmed}
                    smsLabelStep='01'
                />
            </Modal>
            <AccidentErrorModal shown={!!predictionErrorCode}
                                onClose={handleErrorModalClose}
                                errorCode={predictionErrorCode}/>
            <AccidentFlow/>

            <AccidentPricingPlansModal
                    isOpen={isOpenPricingModal}
                    setOpen={setIsOpenPricingModal}
            />
        </>

    );
}

const AccidentPage = withWidgetId(withFormHook(AccidentPageComponent))

export {AccidentPage}

