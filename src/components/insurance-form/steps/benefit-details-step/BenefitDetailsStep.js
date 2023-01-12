import React, {useCallback, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { DateTime } from 'luxon';
import { moveNext, selectOsagoWizardById } from "../../../../redux/osagoWizardReducer";
import { Button } from "../../../button/Button";
import { className } from "../../../../utils/class-helper";
import { Typography, TypographyColor, TypographyType, TypographyWeight } from "../../../typography/Typography";
import { CarNumber } from "../../../car-number/CarNumber";
import { FormGroup } from "../../../form-group/FormGroup";
import useWidgetId from "../../../../hooks/useWidgetId";
import { trackEvent, TrackingEventName } from "../../../../modules/tracking";

import './benefit-details-step.scss';

export const BenefitDetailsStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {prescoringInfo, carNumber, carRegion} = useSelector(selector);
    const [dateIsInDanger, setDateIsInDanger] = useState(false);
    const [benefit, setBenefit] = useState(0);
    const DANGER_LEFT_DAYS_COUNT = 45;

    useEffect(() => {
        if (
            !prescoringInfo ||
            !prescoringInfo?.prevPolicyPrice ||
            !prescoringInfo?.precalculatedPrice
        ) {
            handleNextStep();
            return;
        }

        const benefitResult = prescoringInfo.prevPolicyPrice - prescoringInfo.precalculatedPrice;

        if (benefitResult <= 0) {
            handleNextStep();
            return;
        }

        checkIfDateIsInDanger();
        setBenefit(benefitResult);
        trackEvent(TrackingEventName.SCREEN_BENEFIT_LOADED);
    }, []);

    const checkIfDateIsInDanger = useCallback(() => {
        const maxPolicyStartOn = DateTime.local();
        const { days } = DateTime.fromISO(prescoringInfo.prevPolicyEnOn).diff(maxPolicyStartOn, ['days']).toObject();
        setDateIsInDanger(parseInt(days, 10) <= DANGER_LEFT_DAYS_COUNT);
    }, [prescoringInfo]);


    const handleNextStep = useCallback(() => {
        trackEvent(TrackingEventName.SCREEN_BENEFIT_SUBMIT);
        dispatchWidgetAction(moveNext());
    }, [dispatchWidgetAction])


    if (benefit === 0) {
        return <></>;
    }

    return (
        <div {...className('benefit-details-step__inner')}>
            <div {...className('mb-20')}>
                <Typography type={TypographyType.SUBHEAD}>
                    Твой грузовик
                </Typography>
            </div>
            <FormGroup label="Гос. номер грузовика">
                <CarNumber number={carNumber}
                            region={carRegion}
                            inputStyle='black'
                            readonly={true}/>
            </FormGroup>
            <div {...className(['form-row--bordered'])}>
                <ul {...className(["info-list", 'mb-0', 'mt-30'])}>
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
                    <li {...className(["info-list-item", "mt-16"])}>
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
                    <li {...className(["info-list-item", "mt-16"])}>
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
                    <li {...className(["info-list-item", "mt-16"])}>
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
                    <li {...className(["info-list-item", "mt-16"])}>
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
            </div>
            <div {...className('mb-26')}>
                <Typography type={TypographyType.SUBHEAD}>ОСАГО по Справедливой цене</Typography>
            </div>
            <ul {...className("info-list")}>
                <li {...className("info-list-item")}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Полис ОСАГО
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.prevPolicySeries} {prescoringInfo.prevPolicyNumber}
                        </Typography>
                    </div>
                </li>
                <li {...className(["info-list-item", "mt-16"])}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Действует до
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}
                                    color={dateIsInDanger ? TypographyColor.RED : null}>
                            {DateTime.fromISO(prescoringInfo.prevPolicyEnOn).toFormat('dd.MM.yyyy')}
                        </Typography>
                    </div>
                </li>
                <li {...className(["info-list-item", "mt-16"])}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Страховщик
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {prescoringInfo.prevPolicyInsuranceCompanyTitle}
                        </Typography>
                    </div>
                </li>
                <li {...className(["info-list-item", "mt-16"])}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Старая цена
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {(prescoringInfo.prevPolicyPrice).toLocaleString('ru', {currency: 'rub', minimumFractionDigits: 0})} ₽
                        </Typography>
                    </div>
                </li>
                <li {...className(["info-list-item", "mt-16"])}>
                    <div {...className("info-list-item__legend")}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.BLACK}
                                    weight={TypographyWeight.MEDIUM}>
                            Цена от MUST
                        </Typography>
                    </div>
                    <div {...className("info-list-item__val")}>
                        <Typography type={TypographyType.BODY}>
                            {(prescoringInfo.precalculatedPrice).toLocaleString('ru', {currency: 'rub', minimumFractionDigits: 0})} ₽
                        </Typography>
                    </div>
                </li>
            </ul>
            <div {...className('benefit-details-step__result')}>
                <Typography type={TypographyType.CAPTION}>
                    Твоя ВЫГОДА
                </Typography>
                <div {...className('benefit-details-step__result__price')}>
                    <Typography type={TypographyType.H1}>
                        {(benefit).toLocaleString('ru', {currency: 'rub', minimumFractionDigits: 0})} ₽
                    </Typography>
                </div>
            </div>
            <Button buttonType='upper'
                    onClick={handleNextStep}>Оформить осаго</Button>
        </div>
    )
}
