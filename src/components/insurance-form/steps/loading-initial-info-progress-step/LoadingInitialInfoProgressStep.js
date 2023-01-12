import '../../calculation-progress-step.scss'
import React from "react";
import {CalculationProgressStep} from "../../CalculationProgressStep"
import {useState} from "react";
import {useInterval} from "../../../../hooks/useInterval";
import {moveNext, selectOsagoWizardById,} from "../../../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import useWidgetId from "../../../../hooks/useWidgetId";
import {trackEvent, TrackingEventName} from '../../../../modules/tracking';

const options = [
    {legend: 'Определяю марку и модель', percent: 16},
    {legend: 'Определяю тип ТС', percent: 32},
    {legend: 'Определяю год выпуска', percent: 48},
    {legend: 'Определяю мощность двигателя', percent: 64},
    {legend: 'Проверяю VIN-номер', percent: 80},
    {legend: 'Проверяю историю ДТП', percent: 96},
];

export const LoadingInitialInfoProgressStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {prescoringInfo, prescoringErrorCode} = useSelector(selector)
    let [loadingStep, setLoadingStep] = useState(1)
    const [delay, setDelay] = useState(3000);

    useInterval(() => {
        if (loadingStep + 1 > options.length) {
            if (prescoringInfo || prescoringErrorCode) {
                setDelay(null)
                dispatchWidgetAction(moveNext(prescoringErrorCode))
            }
            return
        }

        if (loadingStep === 1) {
            trackEvent(TrackingEventName.SCREEN_DATACOLLECTION_STARTED)
        }
        if (loadingStep === 5) {
            trackEvent(TrackingEventName.SCREEN_DATACOLLECTION_FINISHED)
        }

        setLoadingStep(loadingStep + 1)
    }, delay);

    return (
        <CalculationProgressStep options = {options} loadingStep = {loadingStep}/>
    )
}
