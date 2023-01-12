import React, {useEffect} from 'react';
import {Button} from "../../../button/Button";
import useWidgetId from "../../../../hooks/useWidgetId";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById
} from "../../../../redux/osagoWizardReducer";
import {trackEvent, TrackingEventName} from "../../../../modules/tracking";
import {Typography, TypographyType} from '../../../typography/Typography';

const GoUploadBillStep = () => {

    const {dispatchWidgetAction} = useWidgetId(selectOsagoWizardById)

    const goNext = () => {
        trackEvent(TrackingEventName.SCREEN_THANKS_CLICKED, {
            type: 'sentInvoice'
        })
        dispatchWidgetAction(resetWizardAction())
        dispatchWidgetAction(resetNumberAction())
        dispatchWidgetAction(moveNext())
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_THANKS_LOADED, {
            type: 'sentInvoice'
        })
    }, [])

    return (
        <div className="mustins-tc">
            <Typography type={TypographyType.H5}>
                Я отправил счет   <br/>
                на указазнную тобою почту  <br/>
                и ссылку на счет в СМС
            </Typography>
            <Button
                onClick={goNext}
                className="mustins-mt-40"
                buttonType='lower'>
                Спасибо
            </Button>
        </div>
    );
};

export default GoUploadBillStep;
