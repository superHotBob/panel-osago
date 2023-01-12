import Radio from "../../../radio";
import find from 'lodash/find';
import some from 'lodash/some';
import every from 'lodash/every';
import React, {useEffect} from "react";
import './choose-insurance-company.scss';
import {useSelector} from "react-redux";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById,
    setInsuranceCompanyAction,
    waitAllScoringResults
} from "../../../../redux/osagoWizardReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import {Button} from "../../../button/Button";
import RenesansCompanySvg from 'svg/renessans-logo.svg';
import RosgosstrahCompanySvg from 'svg/rosgosstrah-company.svg';
import IngosCompanySvg from 'svg/ingos-company.svg';
import {className} from "../../../../utils/class-helper";
import {Typography, TypographyColor, TypographyType, TypographyWeight} from "../../../typography/Typography";
import {FORM_STEPS} from "../../../../constants/OSAGO_FORM";
import {trackEvent, TrackingEventName} from "../../../../modules/tracking";

export const ChooseInsuranceCompanyStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {insuranceCompany, scoringResults, step} = useSelector(selector)

    const handleInsuranceCompanyChange = insuranceCompany => {
        trackEvent(TrackingEventName.SCREEN_INSURANCETYPE_SELECTED, {
            type: insuranceCompany
        })
        dispatchWidgetAction(setInsuranceCompanyAction(insuranceCompany))
    }

    const moveNextClick = () => {
        if (step === FORM_STEPS.CHOOSE_INSURANCE_COMPANY) {
            trackEvent(TrackingEventName.SCREEN_INSURANCETYPE_SUBMIT)
            dispatchWidgetAction(moveNext(true))
        } else {
            dispatchWidgetAction(resetWizardAction())
            dispatchWidgetAction(resetNumberAction())
            dispatchWidgetAction(moveNext())
            trackEvent(TrackingEventName.SCREEN_ERROR_TRYAGAIN)
        }

    }

    const getInsuranceCompanySvg = (insuranceCompany) => {
        switch (insuranceCompany) {
            case 'ingostrah':
                return <IngosCompanySvg/>
            case 'renaissance':
                return <RenesansCompanySvg {...className('choose-insurance-company__renaissance')}/>
            case 'rgs':
                return <RosgosstrahCompanySvg/>
        }
    }

    const renderInsuranceCompanyResult = (insuranceCompanyResult) => {
        return (
            <div {...className('choose-insurance-company__company')}>
                <div {...className('choose-insurance-company__logo')}>{getInsuranceCompanySvg(insuranceCompanyResult.insuranceCompany)}</div>
                <div>
                    {insuranceCompanyResult.isPending &&
                    <div {...className('choose-insurance-company__loading')}></div>}
                    {insuranceCompanyResult.isApproved === false &&
                    <Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_800}>Нет
                        предложений</Typography>}
                    {insuranceCompanyResult.isApproved && <div>
                        <Typography type={TypographyType.BODY}
                                    weight={TypographyWeight.BOLD}
                                    color={TypographyColor.MUST_900}>{(insuranceCompanyResult.writtenPremium).toLocaleString('en').split(',').join(' ')}</Typography>
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.MUST_900}>&nbsp;руб.</Typography>
                    </div>}
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (step === FORM_STEPS.CHOOSE_INSURANCE_COMPANY) {
            trackEvent(TrackingEventName.SCREEN_INSURANCETYPE_LOADED)
        } else {
            trackEvent(TrackingEventName.SCREEN_ERROR_LOADED)
        }

        dispatchWidgetAction(waitAllScoringResults());
        const approvedScoringResult = find(scoringResults, result => result.isApproved)
        if (approvedScoringResult) {
            handleInsuranceCompanyChange(approvedScoringResult.insuranceCompany);
        }
    }, [])

    useEffect(() => {
        if (every(scoringResults, result => result.isApproved === false) && step === FORM_STEPS.CHOOSE_INSURANCE_COMPANY) {
            dispatchWidgetAction(moveNext(false))
        }
    }, [scoringResults])

    return (
        <div>
            <div {...className('mb-32')}>
                <Typography type={TypographyType.SUBHEAD}>Предложения наших партнеров, страховых компаний</Typography>
            </div>
            <div {...className(['choose-insurance-company__radio', 'radio-group'])}>
                {scoringResults.map(result => {
                    return (
                        <Radio label={renderInsuranceCompanyResult(result)}
                               name={result.insuranceCompany}
                               disabled={!result.isApproved || result.isPending}
                               key={result.insuranceCompany}
                               checked={result.insuranceCompany === insuranceCompany}
                               onChange={() => handleInsuranceCompanyChange(result.insuranceCompany)}/>
                    )
                })}
            </div>
            <Button onClick={moveNextClick}
                    loading={!find(scoringResults, result => result.isApproved) && some(scoringResults, result => result.isPending)}>
                {every(scoringResults, result => result.isApproved === false) ? 'Ввести другой номер' : 'Оформить полис ОСАГО'}
            </Button>
        </div>
    )
}
