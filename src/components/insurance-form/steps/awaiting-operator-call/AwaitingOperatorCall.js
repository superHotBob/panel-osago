import React from 'react';
import './awaiting-operator-call.scss'
import {Button} from "../../../button/Button";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction, selectOsagoWizardById,
} from "../../../../redux/osagoWizardReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import {trackEvent, tracking, TrackingEventName, trackingReachGoal} from "../../../../modules/tracking";
import {ORGANIZATION_TYPE_INDIVIDUAL} from "../../../../constants/osago";
import {Typography, TypographyDisplay, TypographyType} from '../../../typography/Typography';
import {className} from '../../../../utils/class-helper';

const AwaitingOperatorCall = () => {
    const {dispatchWidgetAction} = useWidgetId(selectOsagoWizardById)

    const onSubmit = () => {
        trackingReachGoal(tracking.osagoFinished, ORGANIZATION_TYPE_INDIVIDUAL)

        // dispatchWidgetAction(resetWizardAction())
        // dispatchWidgetAction(resetNumberAction())
        trackEvent(TrackingEventName.SCREEN_THANKS_CLICKED, {
            type: 'needHelp'
        })
        dispatchWidgetAction(moveNext())
    }

    return (
        <div {...className('awaiting-operator-call')}>
            <Typography type={TypographyType.H5}
                        display={TypographyDisplay.BLOCK}>
                Я назначил оператора и он уже <br/>
                звонит тебе, чтобы помочь
            </Typography>
            <Button onClick={onSubmit}
                    {...className('mt-40')}>
                Спасибо, ожидаю
            </Button>
        </div>
    );
};

export default AwaitingOperatorCall;
