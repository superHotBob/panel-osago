import React, {useMemo, useState} from 'react';
import './accident-history-card.scss';
import {AccidentResultColor} from "../../../components/accident-result-color/AccidentResultColor";
import {AccidentRating} from "../../../components/accident-rating/AccidentRating";
import {
    Typography,
    TypographyColor,
    TypographyType,
    TypographyWeight
} from "../../../../../components/typography/Typography";
import RefreshSvg from '../../../../../svg/refresh.svg';
import ChevronDownSvg from '../../../../../svg/chevron-down.svg';
import classNames from 'classnames';
import {AccidentPlate, AccidentPlateSize} from "../../../components/accident-plate/AccidentPlate";
import {ScoreGraph} from '../../../../../components/score-graph/ScoreGraph';
import {ScoringPeriod} from '../../../accident/AccidentPage';
import {Button} from '../../../../../components/button/Button';
import {AccidentCarInfo} from '../../../components/accident-car-info/AccidentCarInfo';
import QuestionSvg from '../../../../../svg/question.svg';
import {
    AccidentPredictionLevel,
    formatPercentage,
    getAccidentPredictionBottomRate,
    getAccidentPredictionBottomRatePosition,
    getAccidentPredictionLevel,
    getAccidentPredictionLevelBorders,
    getAccidentPredictionNormaTo,
    getAccidentPredictionRate,
    getAccidentPredictionRatePosition,
    getAccidentPredictionTopRate, getBadgeTypeByPlace
} from '../../../AccidentPredictionModel';
import capitalize from 'lodash/capitalize';
import {DateTime} from 'luxon';
import findIndex from 'lodash/findIndex';
import slice from 'lodash/slice';
import StatusDangerSvg from '../../../../../svg/status-danger.svg';
import api from '../../../../../api';
import {getPredictionStatus} from '../../../../../components/main-panel/MainPanelModel';
import {useDispatch, useSelector} from 'react-redux';
import {selectHistoryCards, selectPredictionId, setHistoryCardsAction} from '../../AccidentHistoryPageModel';
import {AccidentBadgeSvg} from '../../../components/accident-badge-svg/AccidentBadgeSvg';
import {startAccidentFlowAction} from '../../../components/accident-flow/AccidentFlowModel';
import {getOsagoUrl} from '../../../../../utils/urls';
import { AddTrack, CustomEventName } from '../../../../../modules/tracking';

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

const setHistoryCardItem = (items, plates, newHistoryCard) => {
    const arrayIndex = findIndex(items, (item) => item.plates === plates);
    if (arrayIndex !== -1) {
        return [
            ...slice(items, 0, arrayIndex),
            newHistoryCard,
            ...slice(items, arrayIndex + 1)
        ];
    }
    const originalArray = this || [];
    return [...originalArray, newHistoryCard];
}

export const AccidentHistoryCard = ({historyCard, uuid}) => {
    const dispatch = useDispatch();
    const historyCards = useSelector(selectHistoryCards);
    const predictionId = useSelector(selectPredictionId);

    const [expanded, setExpanded] = useState(false);
    const [scoreAnimation, setScoreAnimation] = useState(false);
    const [scoreShown, setScoreShown] = useState(true);
    const [periodChangeInProgress, setPeriodChangeInProgress] = useState(false);
    const [scoringPeriod, setScoringPeriod] = useState(ScoringPeriod.YEAR);

    const PLATE_FALLBACK = 'O000OO00';
    const number = useMemo(() => (historyCard.plates ?? PLATE_FALLBACK).substring(0, 6), [historyCard]);
    const region = useMemo(() => (historyCard.plates ?? PLATE_FALLBACK).substring(6), [historyCard]);

    let predictionData = null;
    let accidentRatingPredictionData = null;
    if (historyCard) {
        accidentRatingPredictionData = predictionData = scoringPeriod === ScoringPeriod.SIX_MONTHS ? historyCard.accidentoMeterHalfYear : historyCard.accidentoMeter;
        if (periodChangeInProgress) {
            accidentRatingPredictionData  = scoringPeriod === ScoringPeriod.YEAR ? historyCard.accidentoMeterHalfYear : historyCard.accidentoMeter;
        }
    }


    const badgeType = useMemo(() => {
        return getBadgeTypeByPlace(getAccidentPredictionRatePosition(accidentRatingPredictionData));
    }, [scoringPeriod, historyCard, periodChangeInProgress])

    const handleScoreGraphAnimationFinished = () => {
        setScoreAnimation(false);
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

    const getHelpText = () => {
        return '';
    }

    const handleExpandClick = () => {
        const newVal = !expanded;

        setExpanded(newVal);

        if (newVal) {
            AddTrack(CustomEventName.SHOW_CARD);
        }
    }

    const renderScoreGraph = () => {
        const level = getAccidentPredictionLevel(predictionData);
        return (
            <div className="accident-history-card__score-graph">
                <ScoreGraph loading={scoreAnimation}
                            score={scoreShown ? formatPercentage(getAccidentPredictionRate(predictionData)) : null}
                            number={number}
                            region={region}
                            norm={scoreShown ? formatPercentage(getAccidentPredictionNormaTo(predictionData)) : null}
                            onAnimationFinished={handleScoreGraphAnimationFinished}
                            scoringPeriod={scoringPeriod}
                            level={level}
                            levelBorders={getAccidentPredictionLevelBorders(predictionData, level)}
                            onScoringPeriodChange={handleScoringPeriodChange}
                            helpText={getHelpText()}/>
            </div>
        )
    }

    const renderCarInfo = () => {
        return (
            <div className="accident-history-card__info">
                <div className="accident-history-card__info-title">
                    <Typography type={TypographyType.CAPTION}
                                color={TypographyColor.MUST_800}>
                        Данные твоего грузовика
                    </Typography>
                </div>
                <div>
                    <AccidentCarInfo number={number}
                                     region={region}
                                     info={historyCard}/>
                </div>
            </div>
        )
    }

    const handleDecreaseAccidentClick = () => {
        dispatch(startAccidentFlowAction(predictionId));
    }

    const renderRating = () => {
        return (
            <div className="accident-history-card__rating">
                <div className="accident-history-card__rating-title">
                    <Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_800}>
                        Место грузовика в Российском рейтинге “Безопасности Дорожного Движения”
                    </Typography>
                </div>
                <div>
                    <AccidentRating short={true}
                                    number={number}
                                    region={region}
                                    bestScore={formatPercentage(getAccidentPredictionTopRate(accidentRatingPredictionData))}
                                    count={getAccidentPredictionBottomRatePosition(accidentRatingPredictionData)}
                                    worstScore={formatPercentage(getAccidentPredictionBottomRate(accidentRatingPredictionData))}
                                    place={getAccidentPredictionRatePosition(accidentRatingPredictionData)}
                                    level={getAccidentPredictionLevel(accidentRatingPredictionData)}
                                    score={formatPercentage(getAccidentPredictionRate(accidentRatingPredictionData))}/>
                </div>
                <div className="accident-history-card__rating-button">
                    <Button onClick={handleDecreaseAccidentClick}>
                        Снизить аварийность
                    </Button>
                </div>
            </div>
        )
    }

    const handleRefreshClick = async () => {
        if (scoreAnimation) {
            return;
        }
        AddTrack(CustomEventName.REFRESH_CARD);
        setScoreShown(false);
        setScoreAnimation(true);
        const response = await api('/prediction/init', 'POST', {
            plates: `${number}${region}`
        });
        const data = await response.json();
        if (!data || !data.predictionId) {
            setScoreShown(true);
            return
        }

        const {predictionId} = data;

        do {
            try {
                const response = await getPredictionStatus(predictionId);
                const data = await response.json();
                if (data && data.isCompleted) {
                    if (!data.isFaulted) {
                        const newHistoryCards = setHistoryCardItem(historyCards, historyCard.plates, data.info);
                        dispatch(setHistoryCardsAction(newHistoryCards));
                        setScoreShown(true);
                    } else {
                        setScoreShown(true);
                    }
                    break;
                }
            } catch (error) {

            }
            await new Promise(r => setTimeout(r, 2000));
        } while (true);
    }

    const policyExpiresSoon = useMemo(() => {
        if (!historyCard || !historyCard.prevPolicyEndOn) {
            return false;
        }
        const prevPolicyEndOnDate = DateTime.fromISO(historyCard.prevPolicyEndOn).toJSDate();
        const todayDate = DateTime.utc().startOf('day').toJSDate();
        const policyDatesDiff = DateTime.fromJSDate(prevPolicyEndOnDate).diff(DateTime.fromJSDate(todayDate), ['days']).toObject();
        return policyDatesDiff.days <= 45;
    }, [historyCard])

    const dangerMonth = capitalize(DateTime.fromISO(accidentRatingPredictionData.maxRiskDate).setLocale('ru').toFormat('LLLL yyyy'));

    const handleOsagoClick = () => {
        AddTrack(expanded ? CustomEventName.ISSUE_BUTTON2 : CustomEventName.ISSUE_BUTTON);

        openInNewTab(`${getOsagoUrl()}?number=${number}&region=${region}`)
    }


    return (
        <>
            <div className="accident-history-card accident-history-card--desktop" key={uuid}>
                <div className="accident-history-card__color">
                    <AccidentResultColor placeType={AccidentPredictionLevel.ACCIDENT_RISK}/>
                </div>
                <div className="accident-history-card__content">
                    <div
                        className={classNames('accident-history-card__row', expanded ? 'accident-history-card__row--expanded' : '')}>
                        <div>
                            <AccidentPlate size={AccidentPlateSize.L}
                                           number={number}
                                           region={region}/>
                            <div className="accident-history-card__car-type">
                                <Typography type={TypographyType.CAPTION}>
                                    {historyCard.bodyTypeGroup}
                                </Typography>
                            </div>
                        </div>
                        <div className="accident-history-card__item accident-history-card__item--place">
                            <div className="accident-history-card__item-label">
                                <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                    Рейтинг Безопасности
                                </Typography>
                                {badgeType && <div className="accident-history-card__badge">
                                    <AccidentBadgeSvg badgeType={badgeType}
                                                      historyCard={true}/>
                                </div>}
                            </div>
                            <div className="accident-history-card__item-value">
                                <Typography type={TypographyType.H5}
                                            weight={TypographyWeight.MEDIUM}>
                                    {getAccidentPredictionRatePosition(accidentRatingPredictionData)}-е место
                                </Typography>
                            </div>
                        </div>
                        <div className="accident-history-card__item accident-history-card__item--score">
                            <div className="accident-history-card__item-label">
                                <div>
                                    <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                        Вероятность ДТП
                                    </Typography>
                                </div>
                                <div>
                                    <Typography color={TypographyColor.MUST_700}
                                                type={TypographyType.FOOTNOTE}>
                                        6 | 12 мес
                                    </Typography>
                                </div>
                            </div>
                            <div className="accident-history-card__item-value accident-history-card__item-value--score">
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.H5}
                                            weight={TypographyWeight.MEDIUM}>
                                    {formatPercentage(getAccidentPredictionRate(historyCard.accidentoMeterHalfYear))}%
                                </Typography>}
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.H5}
                                            color={TypographyColor.MUST_700}>
                                    &nbsp;|&nbsp;
                                </Typography>}
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.H5}
                                            weight={TypographyWeight.MEDIUM}>
                                    {formatPercentage(getAccidentPredictionRate(historyCard.accidentoMeter))}%
                                </Typography>}
                                {!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.H5}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}
                            </div>
                        </div>
                        <div className="accident-history-card__item accident-history-card__item--month">
                            <div className="accident-history-card__item-label">
                                <Typography color={TypographyColor.MUST_900}
                                            weight={TypographyWeight.MEDIUM}
                                            type={TypographyType.CAPTION}>
                                    Максимальная опасность ДТП
                                </Typography>
                            </div>
                            <div className="accident-history-card__item-value">
                                <Typography type={TypographyType.H5}
                                            weight={TypographyWeight.MEDIUM}>
                                    <QuestionSvg className="accident-history-card__question-svg"/> {dangerMonth}
                                </Typography>
                            </div>
                        </div>
                        <div className="accident-history-card__item accident-history-card__item--fines">
                            <div className="accident-history-card__item-label">
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>
                                    Неоплаченые штрафы
                                </Typography>
                            </div>
                            <div className="accident-history-card__item-value">
                                {historyCard.accidentCount > 0 && <>
                                    <div>
                                        <StatusDangerSvg className="accident-page__status-danger"/>
                                        <Typography type={TypographyType.H5}
                                                    weight={TypographyWeight.MEDIUM}
                                                    color={TypographyColor.RED}>
                                            4
                                        </Typography>
                                    </div>
                                    <Button small={true}>
                                        Оплатить
                                    </Button>
                                </>}
                                {historyCard.accidentCount === 0 &&
                                <Typography type={TypographyType.H5}
                                            weight={TypographyWeight.MEDIUM}>
                                    0
                                </Typography>}
                                {!historyCard.accidentCount && historyCard.accidentCount !== 0 &&
                                <Typography type={TypographyType.H5}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}

                            </div>
                        </div>
                        <div className="accident-history-card__item accident-history-card__item--osago">
                            <div className="accident-history-card__item-label">
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>
                                    Окончание полиса ОСАГО
                                </Typography>
                            </div>
                            <div className="accident-history-card__item-value">
                                {historyCard.prevPolicyEndOn && <>
                                    <Typography type={TypographyType.H5}
                                                weight={TypographyWeight.MEDIUM}
                                                color={policyExpiresSoon ? TypographyColor.RED : TypographyColor.MUST_900}>
                                        {DateTime.fromISO(historyCard.prevPolicyEndOn).toFormat('dd.MM.yyyy')}
                                    </Typography>
                                    <Button small={true}
                                            className="accident-history-card__osago-button"
                                            onClick={handleOsagoClick}>
                                        Оформить
                                    </Button>
                                </>}
                                {!historyCard.prevPolicyEndOn &&
                                <Typography type={TypographyType.H5}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}

                            </div>
                        </div>
                        <div className="accident-history-card__actions">
                            <RefreshSvg className={classNames('accident-history-card__refresh-svg', scoreAnimation ? 'accident-history-card__refresh-svg--rotation' : '')}
                                        onClick={handleRefreshClick}/>
                            <ChevronDownSvg
                                className={classNames('accident-history-card__chevron-down-svg', expanded ? 'accident-history-card__chevron-down-svg--expanded' : '')}
                                onClick={handleExpandClick}/>
                        </div>
                    </div>
                    <div
                        className={classNames('accident-history-card__details', expanded ? 'accident-history-card__details--expanded' : '')}>
                        <div className="mustins-mt-24">
                            {renderRating()}
                        </div>
                        <div>
                            {renderScoreGraph()}
                        </div>
                        <div className="mustins-mt-24">
                            {renderCarInfo()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="accident-history-card accident-history-card--mobile-and-tablet" key={uuid + '2'}>
                <div className="accident-history-card__color-and-content-mobile">
                    <div>
                        <AccidentResultColor placeType={AccidentPredictionLevel.ACCIDENT_RISK} short={true}/>
                    </div>
                    <div
                        className={classNames('accident-history-card__content', expanded ? 'accident-history-card__content--expanded' : '')}>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <AccidentPlate size={AccidentPlateSize.M}
                                               number={number}
                                               region={region}/>
                                <div className="accident-history-card__car-type">
                                    <Typography type={TypographyType.CAPTION}>
                                        {historyCard.bodyTypeGroup}
                                    </Typography>
                                </div>
                            </div>
                            <RefreshSvg className={classNames('accident-history-card__refresh-svg', scoreAnimation ? 'accident-history-card__refresh-svg--rotation' : '')}
                                        onClick={handleRefreshClick}/>
                        </div>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                    Рейтинг Безопасности
                                </Typography>
                            </div>
                            <div>
                                <Typography type={TypographyType.CAPTION}
                                            weight={TypographyWeight.MEDIUM}>
                                    2-е место
                                </Typography>
                            </div>
                        </div>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                    Вероятность ДТП 6|12
                                </Typography>
                            </div>
                            <div>
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.CAPTION}
                                            weight={TypographyWeight.MEDIUM}>
                                    {formatPercentage(getAccidentPredictionRate(historyCard.accidentoMeter))}%
                                </Typography>}
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_700}>
                                    &nbsp;|&nbsp;
                                </Typography>}
                                {!!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.CAPTION}
                                            weight={TypographyWeight.MEDIUM}>
                                    {formatPercentage(getAccidentPredictionRate(historyCard.accidentoMeterHalfYear))}%
                                </Typography>}
                                {!getAccidentPredictionRate(accidentRatingPredictionData) &&
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}
                            </div>
                        </div>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <Typography color={TypographyColor.MUST_900} type={TypographyType.CAPTION}>
                                    Макс. опасность ДТП
                                </Typography>
                            </div>
                            <div>
                                <Typography type={TypographyType.CAPTION}
                                            weight={TypographyWeight.MEDIUM}>
                                    {dangerMonth} <QuestionSvg className="accident-history-card__mobile-question-svg"/>
                                </Typography>
                            </div>
                        </div>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                    Неоплаченые штрафы
                                </Typography>
                            </div>
                            <div className="accident-history-card__fines-mobile">
                                {historyCard.accidentCount > 0 && <>
                                    <div className="accident-history-card__fines-count-mobile">
                                        <StatusDangerSvg className="accident-page__status-danger"/>
                                        <Typography type={TypographyType.CAPTION}
                                                    weight={TypographyWeight.MEDIUM}
                                                    color={TypographyColor.RED}>
                                            4
                                        </Typography>
                                    </div>
                                    <Button small={true}>
                                        Оплатить
                                    </Button>
                                </>}
                                {historyCard.accidentCount === 0 &&
                                <Typography type={TypographyType.CAPTION}
                                            weight={TypographyWeight.MEDIUM}>
                                    0
                                </Typography>}
                                {!historyCard.accidentCount && historyCard.accidentCount !== 0 &&
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}
                            </div>
                        </div>
                        <div className="accident-history-card__mobile-row">
                            <div>
                                <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                    ОСАГО до
                                </Typography>
                            </div>
                            <div className="accident-history-card__osago-mobile">
                                {historyCard.prevPolicyEndOn && <>
                                    <div className="accident-history-card__osago-date-mobile">
                                        <Typography type={TypographyType.CAPTION}
                                                    weight={TypographyWeight.MEDIUM}
                                                    color={policyExpiresSoon ? TypographyColor.RED : TypographyColor.MUST_900}>
                                            {DateTime.fromISO(historyCard.prevPolicyEndOn).toFormat('dd.MM.yyyy')}
                                        </Typography>
                                    </div>
                                    <Button small={true} onClick={handleOsagoClick}>
                                        Оформить
                                    </Button>
                                </>}
                                {!historyCard.prevPolicyEndOn &&
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>
                                    Нет данных
                                </Typography>}
                            </div>
                        </div>
                        {expanded && <>
                            <div className="accident-history-card__mobile-row">
                                <div>
                                    <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                        Марка TC
                                    </Typography>
                                </div>
                                <div>
                                    <Typography type={TypographyType.CAPTION}>
                                        {historyCard.make}
                                    </Typography>
                                </div>
                            </div>
                            <div className="accident-history-card__mobile-row">
                                <div>
                                    <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                        Модель TC
                                    </Typography>
                                </div>
                                <div>
                                    <Typography type={TypographyType.CAPTION}>
                                        {historyCard.model}
                                    </Typography>
                                </div>
                            </div>
                            <div className="accident-history-card__mobile-row">
                                <div>
                                    <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                        Год выпуска
                                    </Typography>
                                </div>
                                <div>
                                    <Typography type={TypographyType.CAPTION}>
                                        {historyCard.manufacturedOn}
                                    </Typography>
                                </div>
                            </div>
                            {/*<div className="accident-history-card__mobile-row">*/}
                            {/*    <div>*/}
                            {/*        <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>*/}
                            {/*            Двигатель*/}
                            {/*        </Typography>*/}
                            {/*    </div>*/}
                            {/*    <div>*/}
                            {/*        <Typography type={TypographyType.CAPTION}>*/}
                            {/*            {historyCard.powerHp} ЛС*/}
                            {/*        </Typography>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="accident-history-card__mobile-row">
                                <div>
                                    <Typography color={TypographyColor.MUST_800} type={TypographyType.CAPTION}>
                                        VIN номер
                                    </Typography>
                                </div>
                                <div>
                                    <Typography type={TypographyType.CAPTION}>
                                        {historyCard.vin}
                                    </Typography>
                                </div>
                            </div>
                        </>}
                        {!expanded && <div className="accident-history-card__mobile-expand-row">
                            <ChevronDownSvg onClick={handleExpandClick}/>
                        </div>}
                    </div>
                </div>
                <div
                    className={classNames('accident-history-card__details', expanded ? 'accident-history-card__details--expanded' : '')}>
                    <div>
                        {renderScoreGraph()}
                    </div>
                    <div>
                        {renderRating()}
                    </div>
                    {expanded && <div className="accident-history-card__mobile-expand-row">
                        <ChevronDownSvg onClick={handleExpandClick}
                                        className="accident-history-card__chevron-down-mobile-expanded"/>
                    </div>}
                </div>
            </div>
        </>
    )
}
