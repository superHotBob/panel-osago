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
import {useSelector} from "react-redux";
import {selectMainPageUrl, selectSource} from "../../../../redux/rootReducer";
import {Typography, TypographyType} from '../../../typography/Typography';

const FinishStep = () => {

    const {dispatchWidgetAction} = useWidgetId(selectOsagoWizardById)
    const mainPageUrl = useSelector(selectMainPageUrl)

    const goNext = () => {
        trackEvent(TrackingEventName.SCREEN_THANKS_CLICKED, {
            type: 'invoicePayment'
        })
        dispatchWidgetAction(resetWizardAction())
        dispatchWidgetAction(resetNumberAction())
        dispatchWidgetAction(moveNext())
        window.location = mainPageUrl;
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_THANKS_LOADED, {
            type: 'invoicePayment'
        })
    }, [])

    return (
        <div className="mustins-tc">
            <Typography type={TypographyType.H5}>
                После проверки оплаты  <br/>
                я отправлю твой полис <br/>
                на почту и ссылку в СМС
            </Typography>
            <Button
                className="mustins-mt-40"
                onClick={goNext}>
                Спасибо
            </Button>
        </div>
    );
};

export default FinishStep;
