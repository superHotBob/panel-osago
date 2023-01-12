import React, {useContext, useEffect, useState} from 'react';
import {BemHelper, className} from '/utils/class-helper'
import {
    PartnerEventName,
    trackEvent,
    tracking,
    TrackingEventName,
    trackingReachGoal,
    trackPartnerEvent
} from "/modules/tracking";
import {GetPrice} from "/components/insurance-form/GetPrice";
import LogoPrimarySvg from "/svg/logo-small.svg";
import LogoIngosSvg from "/svg/logo-ingos.svg";

import './insurance-partner-widget.scss'
import useWidgetId from "../../hooks/useWidgetId";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById,
    setCarNumberAction,
    setCarRegionAction, setInitialWidgetAction, setScoringIdAction,
    setStepAction, setVinAction
} from "../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {FORM_STEPS} from "../../constants/OSAGO_FORM";
import {Theme, ThemeContext} from "../../hoc/withTheme";
import ElpolisLogoSvg from "../../svg/elpolis-logo.svg";
import AgentBrokerLogoSvg from "../../svg/agent-broker-logo.svg";
import KuplyuPolisLogoSvg from "../../svg/kuplyu-polis-logo.svg";
import E100LogoSvg from "../../svg/e100-logo.svg";
import NoLogoSvg from "../../svg/nologo.svg";
import ObozLogoSvg from "../../svg/oboz-logo.svg";
import PolisOnlineLogoSvg from "../../svg/polis-online-logo.svg";
import InfullLogoSvg from "../../svg/infull-logo.svg";
import EurogarantLogoSvg from "../../svg/eurogarant-logo.svg";
import Opti24LogoSvg from "../../svg/opti24-logo.svg";
import KamazLogoSvg from "../../svg/kamaz-logo.svg";
import IpolisLogoSvg from "../../svg/ipolis-logo.svg";
import DividerSvg from "../../svg/divider.svg";
import GazpromNextSloganSvg from "../../svg/gazprom-next-slogan-logo.svg";
import {selectAuthIsLoggedIn} from "../../redux/authReducer";
import InsuranceForm from '../../components/insurance-form/InsuranceForm';

export const InsurancePartnerWidget = () => {
    const classes = new BemHelper({name: 'partner-widget'});
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {carNumber = '', carRegion = '', vin = '', step} = useSelector(selector);
    const themeContext = useContext(ThemeContext);
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)

    const onCarNumberChange = (number, region) => {
        dispatchWidgetAction(setCarNumberAction(number))
        dispatchWidgetAction(setCarRegionAction(region))
    }

    const onVinChange = vin => {
        dispatchWidgetAction(setVinAction(vin))
    }

    const toggleModal = evt => {
        trackingReachGoal(tracking.osagoPriceButton, evt)
        dispatchWidgetAction(setStepAction(FORM_STEPS.ROLE));
        // dispatchWidgetAction(setStepAction(FORM_STEPS.CHOOSE_INSURANCE_COMPANY));
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
        dispatchWidgetAction(setInitialWidgetAction());
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
            <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500&display=swap&subset=cyrillic" rel="stylesheet"/>
            <div {...classes('labels', themeContext.theme === Theme.MUST && (isLoggedIn || !themeContext.showPhoneInput)? 'must' : '')}>
                <div {...classes('title')}>#ОСАГОГРУЗОВОЙ</div>
                <div {...classes('description')}>ОФОРМЛЯЙ ОСАГО ОНЛАЙН</div>
            </div>
            {!isConfirmPaymentPage &&
            <GetPrice
                toggleModal={toggleModal}
                number={carNumber}
                region={carRegion}
                vin={vin}
                fullNumber={`${carNumber}${carRegion}`}
                onCarNumberChange={onCarNumberChange}
                showPhoneInput={themeContext.showPhoneInput}
                onCarVinChange={onVinChange}>
                {themeContext.theme === Theme.EL_POLIS &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <ElpolisLogoSvg {...classes('elpolis-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.AGENT_BROKER &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <AgentBrokerLogoSvg {...classes('agent-broker-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.KUPLYU_POLIS &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'kuplyu-polis')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <KuplyuPolisLogoSvg {...classes('kuplyu-polis-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.E100 &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <E100LogoSvg {...classes('e100-logo')}/>
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
                {themeContext.theme === Theme.POLIS_ONLINE &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'polis-online')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <PolisOnlineLogoSvg {...classes('polis-online-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.INFULL &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'infull')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <InfullLogoSvg {...classes('infull-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.EUROGARANT &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'eurogarant')}>
                        <LogoPrimarySvg {...classes('must-logo')}/>
                        <span {...classes('plus')}>+</span>
                        <EurogarantLogoSvg {...classes('eurogarant-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.GPN_REGION &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'gpnregion')}>
                        <GazpromNextSloganSvg {...classes('eurogarant-logo')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.KAMAZ &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'kamaz')}>
                        <KamazLogoSvg {...classes('kamaz-logo')}/>
                        <DividerSvg {...classes('divider')}/>
                        <LogoPrimarySvg {...classes('must-logo-opti')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.IPOLIS &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'ipolis')}>
                        <IpolisLogoSvg {...classes('ipolis-logo')}/>
                        <DividerSvg {...classes('divider')}/>
                        <LogoPrimarySvg {...classes('must-logo-opti')}/>
                    </div>
                </div>}
                {themeContext.theme === Theme.MUST &&
                <div {...classes('brands-container')}>
                    <div {...classes('brands', 'opti24')}>
                        <Opti24LogoSvg {...classes('opti24-logo')}/>
                        <DividerSvg {...classes('divider')}/>
                        <LogoPrimarySvg {...classes('must-logo-opti')}/>
                    </div>
                </div>}
                {/*{themeContext.theme === Theme.MUST && <div {...className(['mb-30', isLoggedIn || !themeContext.showPhoneInput ? 'partner-widget__must-extra-space' : ''])}>*/}
                {/*</div>}*/}
            </GetPrice>}            
            <InsuranceForm
                onClose={onClose}
            />
        </div>
    )
}

