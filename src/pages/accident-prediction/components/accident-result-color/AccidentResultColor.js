import React from 'react';
import classNames from "classnames";
import './accident-result-color.scss';
import {AccidentPredictionLevel} from '../../AccidentPredictionModel';


const getColorClassName = (placeType) => {
    switch (placeType) {
        case AccidentPredictionLevel.NORMA:
            return 'accident-result-color--green';
        case AccidentPredictionLevel.ACCIDENT_RISK:
            return 'accident-result-color--yellow';
        case AccidentPredictionLevel.ACCIDENT:
            return 'accident-result-color--red';
    }
}

export const AccidentResultColor = ({placeType, short}) => {
    return (
        <div className={classNames('accident-result-color', getColorClassName(placeType), short ? 'accident-result-color--short' : '')}/>
    )
}
