import React from "react";
import './calculation-progress-step.scss'
import {BemHelper, className} from "../../utils/class-helper";
import {Typography, TypographyType} from "../typography/Typography";

export const CalculationProgressStep = ({options, loadingStep, customStepText}) => {
    const classes = new BemHelper({name: 'progress'});  
    return (
        <div {...className('tc')}>
            <div {...classes('step')}>
                {customStepText ? customStepText : <span>0{loadingStep}</span>}
            </div>
            <div {...classes('title')}>
                <Typography type={TypographyType.BODY}>
                    {options[loadingStep - 1].legend}
                </Typography>                
            </div>            
            <div {...classes('line')}>
                <div {...classes('line-content')} style={{
                    width: `${options[loadingStep - 1].percent}%`
                }}/>
            </div>
            <div {...classes('percentage')}>
                {options[loadingStep - 1].percent}%
            </div>            
        </div>
    )
}


