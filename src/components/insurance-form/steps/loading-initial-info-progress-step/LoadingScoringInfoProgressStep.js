import '../../calculation-progress-step.scss'
import React, {useEffect, useState} from "react";
import {CalculationProgressStep} from "../../CalculationProgressStep"
import {useInterval} from "../../../../hooks/useInterval";
import {
    getContractDataUntil,
    moveNext,
    selectOsagoWizardById,
    setScoringResultsAction,
    setVinAction,
} from "../../../../redux/osagoWizardReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import find from 'lodash/find';
import {trackEvent, TrackingEventName} from '../../../../modules/tracking';

const options = [
    {legend: <span>Определяю ТБ <br/> тариф базовый (индивидуальный)</span>, percent: 16},
    {legend: <span>Определяю КТ коэффициент <br/> территории использования ТС</span>, percent: 32},
    {
        legend: <span>Определяю КБМ <br/> коэффициент бонус-малус для лиц, <br/> допущенных к управлению</span>,
        percent: 48
    },
    {
        legend: <span>Определяю КВС <br/> коэффициент возраст-стаж для лиц, <br/> допущенных к управлению</span>,
        percent: 64
    },
    {
        legend: <span>Определяю КО <br/> коэффициент ограничений списка <br/> лиц, допущенных к управлению</span>,
        percent: 80
    },
    {legend: <span>Определяю КС <br/> коэффициент сезонности <br/> использования ТС</span>, percent: 96},
];

let request = null;

export const LoadingScoringInfoProgressStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    let [loadingStep, setLoadingStep] = useState(1)
    const [delay, setDelay] = useState(2500);

    const switchLoadingScreens = async () => {
        if (loadingStep + 1 > options.length) {
            setDelay(null)
        } else {
            if (loadingStep === 1) {
                trackEvent(TrackingEventName.SCREEN_SCORING_STARTED)
            }
            if (loadingStep === 6) {
                trackEvent(TrackingEventName.SCREEN_SCORING_FINISHED)
            }
            setLoadingStep(loadingStep + 1)
        }
        request = null;
    }

    useEffect(() => {
        if (!delay) {
            dispatchWidgetAction(getContractDataUntil((contractData) => {
                const {errorCode, scoringResults, contract} = contractData;
                const finishedScoringResult = find(scoringResults, result => !result.isPending);
                if (errorCode || finishedScoringResult) {
                    if (!errorCode) {
                        dispatchWidgetAction(setScoringResultsAction(scoringResults))
                        dispatchWidgetAction(setVinAction(contract.vehicle.vin))
                    }
                    dispatchWidgetAction(moveNext({errorCode}))
                    return true;
                }
            }))
        }
    }, [delay])

    useInterval(() => switchLoadingScreens(), delay)

    return (
        <CalculationProgressStep options={options} loadingStep={loadingStep}/>
    )
}
