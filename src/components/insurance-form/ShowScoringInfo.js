import React, {useCallback, useEffect} from "react";
import find from 'lodash/find';
import './scoring-info.scss'
import {BemHelper, className} from "../../utils/class-helper";
import LogoRenessans from "../../svg/renessans-logo.svg";
import {Button} from "../button/Button";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";
import useWidgetId from "../../hooks/useWidgetId";
import {moveNext, selectOsagoWizardById} from "../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../modules/tracking";
import api from "../../api";

const classes = new BemHelper({name: 'scoring-info'});

export const ShowScoringInfo = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {ownerType, role, scoringResults, scoringId, insuranceCompany} = useSelector(selector)

    const scoringResult = find(scoringResults, {insuranceCompany});

    const goNext = useCallback(() => {
        trackEvent(TrackingEventName.SCREEN_COVEROFFER_SUBMIT)
        api(`/user/scoring/${scoringId}/agreement`, 'POST', {
            insuranceCompany
        });
        dispatchWidgetAction(moveNext({ownerType, role}));
    }, [ownerType, role]);

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_COVEROFFER_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_4_PREDICTED_PRICE)
    }, [])

    return (
        <div>
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
            <div {...classes('details-title')}>
                <Typography type={TypographyType.CAPTION} weight={700}>
                    <b>Стоимость полиса расчитана по<br/>следующим коэфициентам:</b>
                </Typography>
            </div>

            <ul {...classes('info-list')}>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Базовая ставка, индивидуальный тариф
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            ТБ
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            {scoringResult.baseTariff}
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Коэффициент Территория преимущественного использования ТС
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            КТ
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            {scoringResult.cbTerritoryRate}
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Коэффициент бонус-малус лиц, допущенных к управлению или твоей организации
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            КБМ
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            {scoringResult.bonusMalusRate}
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Коэффициент возраст-стаж самого молодого водителя. Для организации = 1
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            КВС
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            {scoringResult.ageExperienceRate}
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Коэффициент ограничений списка лиц, допущенных к управлению
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            КО
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            {scoringResult.restrictionRate}
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            Коэффициент сезонности использования ТС. Для грузовика всегда = 1
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            КС
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            1
                        </Typography>
                    </div>
                </li>
                <li {...classes("info-list-item")}>
                    <div {...classes("info-list-item-description")}>
                        <Typography type={TypographyType.CAPTION}>
                            <b>Стоимость полиса</b>
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-legend")}>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.GRAY_DARK}>
                            Т
                        </Typography>
                    </div>
                    <div {...classes("info-list-item-cost")}>
                        <Typography type={TypographyType.CAPTION}>
                            <b>{(scoringResult.writtenPremium).toLocaleString('en').split(',').join(' ')}</b>
                        </Typography>
                    </div>
                </li>
            </ul>

            <Button onClick={goNext}>
                Оформить полис ОСАГО
            </Button>

            <a href="http://www.cbr.ru/Queries/UniDbQuery/File/90134/1098"
               {...classes('link')}
               target="_blank"
               onClick={() => trackEvent(TrackingEventName.SCREEN_COVEROFFER_CLICKED)}
            >
                Письмо ЦБ РФ о тарифах ОСАГО
            </a>
        </div>
    )
}


