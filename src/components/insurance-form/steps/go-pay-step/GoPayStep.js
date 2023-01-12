import React, {useCallback, useEffect} from 'react';
import {Button} from "../../../button/Button";
import useWidgetId from "../../../../hooks/useWidgetId";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById
} from "../../../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {trackEvent, TrackingEventName} from "../../../../modules/tracking";
import {Typography, TypographyType} from '../../../typography/Typography';

const GoPayStep = () => {
    const { selector } = useWidgetId(selectOsagoWizardById)
    const {dispatchWidgetAction} = useWidgetId(selectOsagoWizardById)
    const { paymentLink } = useSelector(selector)

    const goToGateway = useCallback(() => {
        window.location.href = paymentLink
    }, [paymentLink])

    const goNext = () => {
        // trackEvent(TrackingEventName.SCREEN_THANKS_CLICKED, {
        //     type: 'sentInvoice'
        // })
        trackEvent(TrackingEventName.SCREEN_POLICYLINK_SUBMIT);
        dispatchWidgetAction(resetWizardAction())
        dispatchWidgetAction(resetNumberAction())
        dispatchWidgetAction(moveNext())
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_POLICYLINK_LOADED);
    }, [])


    return (
        <div className="mustins-tc">
            <Typography type={TypographyType.H5}>
                Ссылку для оплаты картой  <br/>
                я отправил на почту <br/>
                и в СМС на твой номер
            </Typography>
            <Button
                buttonType='upper'
                className="mustins-mt-40"
                onClick={goNext}>
                Спасибо
            </Button>
        </div>
    );
};

export default GoPayStep;
