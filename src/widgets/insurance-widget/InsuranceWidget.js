import React, {useContext, useEffect} from 'react';

import './insurance-widget.scss'

import YaShare from "../../components/yandex-share";
import {
    PartnerEventName,
    trackEvent,
    tracking,
    TrackingEventName,
    trackingReachGoal,
    trackPartnerEvent
} from "/modules/tracking";
import {GetPrice} from "/components/insurance-form/GetPrice";
import InsuranceForm from "/components/insurance-form/InsuranceForm";
import {getOsagoUrl} from "../../utils/urls";
import {BemHelper} from "/utils/class-helper";
import {useDispatch, useSelector} from "react-redux";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById,
    setCarNumberAction,
    setCarRegionAction,
    setInitialWidgetAction,
    setScoringIdAction,
    setStepAction,
    setVinAction
} from "../../redux/osagoWizardReducer";
import {FORM_STEPS} from "../../constants/OSAGO_FORM";
import useWidgetId from "../../hooks/useWidgetId";
import {setSourceAction} from "../../redux/rootReducer";
import {OSAGO_SOURCE_VALUE} from "../../constants/osago";
import LogoPrimarySvg from "../../svg/logo-small.svg";
import E100LogoSvg from "../../svg/e100-logo.svg";
import ElpolisLogoSvg from "../../svg/elpolis-logo.svg";
import NoLogoSvg from "../../svg/nologo.svg";
import ObozLogoSvg from "../../svg/oboz-logo.svg";
import {Theme, ThemeContext} from "../../hoc/withTheme";

const classes = new BemHelper({name: 'osago-form-widget'});

export const InsuranceWidget = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {carNumber = '', carRegion = '', vin = '', step} = useSelector(selector)
    const dispatch = useDispatch();
    const themeContext = useContext(ThemeContext);

    const onCarNumberChange = (number, region) => {
        dispatchWidgetAction(setCarNumberAction(number))
        dispatchWidgetAction(setCarRegionAction(region))
    }

    const onVinChange = vin => {
        dispatchWidgetAction(setVinAction(vin))
    }

    const toggleModal = evt => {
        trackingReachGoal(tracking.osagoPriceButton, evt)
        dispatchWidgetAction(setStepAction(FORM_STEPS.ROLE))
    }

    const onClose = () => {
        dispatchWidgetAction(resetWizardAction())
        if (
            step === FORM_STEPS.SUCCESS_AGENT ||
            step === FORM_STEPS.SUCCESS_OWNER
        ) {
            dispatchWidgetAction(resetNumberAction())
            dispatchWidgetAction(moveNext())
        }
    }

    const isConfirmPaymentPage = document.location.pathname === '/confirm-payment';

    useEffect(() => {
        dispatchWidgetAction(setInitialWidgetAction())

        trackEvent(TrackingEventName.ACTIONS_WIGETLOADED, {
            'pagePath': document.location.pathname,
            'pageHref': document.location.href,
            'host': document.location.hostname
        })

        trackPartnerEvent(PartnerEventName.STEP_1_GET_NUMBER)

        const urlParams = new URLSearchParams(window.location.search);

        if (isConfirmPaymentPage) {
            dispatchWidgetAction(setScoringIdAction(urlParams.get('id')));
            dispatchWidgetAction(setStepAction(FORM_STEPS.UPLOAD_BILL))
        }
        if (urlParams.get('number')) {
            dispatchWidgetAction(setCarNumberAction(urlParams.get('number')))
        }
        if (urlParams.get('region')) {
            dispatchWidgetAction(setCarRegionAction(urlParams.get('region')))
        }

    }, [])


    return (
        <div {...classes()}>
            {!isConfirmPaymentPage &&
            <GetPrice
                toggleModal={toggleModal}
                number={carNumber}
                region={carRegion}
                vin={vin}
                fullNumber={`${carNumber}${carRegion}`}
                onCarNumberChange={onCarNumberChange}
                onCarVinChange={onVinChange}>
                {themeContext.theme === Theme.E100 &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <E100LogoSvg {...classes('e100-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.EL_POLIS &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <ElpolisLogoSvg {...classes('elpolis-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.DEMO &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands-demo')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <NoLogoSvg {...classes('no-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.OBOZ &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <ObozLogoSvg {...classes('oboz-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.KAMAZ &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <ObozLogoSvg {...classes('oboz-logo')}/>
                    </div>
                </div>}
            </GetPrice>}
            <InsuranceForm
                isConfirmPaymentPage={isConfirmPaymentPage}
                onClose={onClose}
            />
            {themeContext.theme === Theme.MUST &&
            <YaShare url={getOsagoUrl()}/>}
        </div>
    )
}
