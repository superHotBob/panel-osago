import React, {useEffect, useState} from 'react';
import './upload-document-progress.scss'
import {BemHelper} from "../../../../../../utils/class-helper";
import {CalculationProgressStep} from "../../../../CalculationProgressStep";
import {useInterval} from "../../../../../../hooks/useInterval";

const options = [
    {legend: 'Происходит распознавание', percent: 16},
    {legend: 'Происходит распознавание', percent: 32},
    {legend: 'Происходит распознавание', percent: 48},
    {legend: 'Происходит распознавание', percent: 64},
    {legend: 'Происходит распознавание', percent: 80},
    {legend: 'Происходит распознавание', percent: 96},
];

const classes = new BemHelper({name: 'upload-document-progress'});

export const UploadDocumentProgress = ({filesCount}) => {
    let [loadingStep, setLoadingStep] = useState(1)
    const [delay, setDelay] = useState(2000);

    useInterval(() => {
        if (loadingStep + 1 > options.length) {
            return
        }

        setLoadingStep(loadingStep + 1)
    }, delay);

    useEffect(() => {
        return () => {
            setDelay(null);
        }
    }, [])

    return <div {...classes(null)}>
        <CalculationProgressStep loadingStep={loadingStep}
                                 customStepText={`Загружено документов [${filesCount}]`}
                                 options={options}/>
    </div>
}
