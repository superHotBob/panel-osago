import React, {useContext} from 'react';
import {BemHelper, className} from "../../utils/class-helper";
import LogoIngos from "../../svg/logo-ingos.svg";
import LogoRenessans from "../../svg/renessans-logo.svg";
import {Text, TextColor, TextFont, TextSize} from "../text/Text";
import {Button} from "../button/Button";
import {useDispatch, useSelector} from "react-redux";
import {moveNext, selectOsagoWizardById} from "../../redux/osagoWizardReducer";
import {selectAuthIsLoggedIn, selectAuthUtm} from "../../redux/authReducer";
import {tracking, trackingReachGoal} from "../../modules/tracking";
import {ORGANIZATION_TYPE_INDIVIDUAL} from "../../constants/osago";
import AppContext from "../../store/context";
import useWidgetId from "../../hooks/useWidgetId";
import {selectLoadingById} from "../../redux/loadingReducer";
import {selectSource} from "../../redux/rootReducer";

const classes = new BemHelper({name: 'policy'});

const ApplyStep = () => {
    const disp = useDispatch()
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {price, prescoringId, ownerType, role, helpType} = useSelector(selector)
    const source = useSelector(selectSource)

    const [dispatchWidgetLoadingAction, loadingSelector] = useWidgetId(selectLoadingById)
    const loading = useSelector(loadingSelector)

    const utm = useSelector(selectAuthUtm)
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)
    const {aggregateCrmData} = useContext(AppContext)

    const applyPolicy = async () => {
        trackingReachGoal(tracking.osagoIssuePolicy, ownerType)

        return dispatchWidgetAction(moveNext({
            isLoggedIn,
            role
        }))

        // if (!isLoggedIn) {
        //     return dispatchWidgetAction(moveNext({
        //         isLoggedIn: false
        //     }))
        // }
        //
        // dispatchWidgetLoadingAction(startLoadingAction('osagoApplyRequest'))
        //
        // const res = await api('/prescoring/front/apply', 'POST', {
        //     preScoringId: prescoringId,
        //     ownerType,
        //     customerType: role,
        //     scenarioType: helpType,
        //     source,
        //     utm
        // })
        //
        // if (!res) {
        //     dispatchWidgetLoadingAction(endLoadingAction('osagoApplyRequest'))
        //     return dispatchWidgetAction(moveNext({
        //         result: false,
        //     }))
        // }
        //
        //
        // if (res.status === 200) {
        //     const {scoringId} = await res.json()
        //     dispatchWidgetAction(setScoringIdAction(scoringId))
        //
        //     const aggregatedCrmData = aggregateCrmData()
        //
        //     if (Object.keys(aggregatedCrmData).length) {
        //         try {
        //             if (!aggregatedCrmData['UF_CRM_5EC28833CE8C5UF_CRM_5EC28833CE8C5']) {
        //                 const profileRes = !aggregatedCrmData['UF_CRM_5EC28833CE8C5UF_CRM_5EC28833CE8C5'] && await api('/profile')
        //                 const profile = await profileRes.json()
        //                 aggregateCrmData(profile)
        //                 disp(setAuthUserAction(profile))
        //             }
        //
        //         } catch (e) {
        //             console.error(e)
        //         }
        //     }
        //     dispatchWidgetAction(moveNext({
        //         result: res,
        //         isLoggedIn,
        //         ownerType
        //     }))
        // }
        //
        // dispatchWidgetLoadingAction(endLoadingAction('osagoApplyRequest'))
    }

    return (
        <>
            <div {...classes('success-details', null, className('tc', true))}>
                <div {...classes('logo')}>
                    {ownerType === ORGANIZATION_TYPE_INDIVIDUAL ? <LogoIngos/> : <LogoRenessans/>}
                </div>
                {ownerType === ORGANIZATION_TYPE_INDIVIDUAL ?
                    <Text uppercase
                          color={TextColor.BLACK}
                          size={TextSize.S_12}>
                        лиц. ОС №0928-03
                    </Text> : <Text uppercase
                                    color={TextColor.BLACK}
                                    size={TextSize.S_12}>
                        лиц. ОС №1284-03
                    </Text>}
            </div>

            <div {...classes('cost', null, [
                className(['grey-block', 'grey-block--20-pad', 'tc'], true),
            ])}>
                <Text uppercase
                      color={TextColor.BLACK}
                      size={TextSize.S_12}>
                    Предварительная стоимость полиса
                </Text>
                <div {...classes('cost')}>
                    <b>{(price).toLocaleString('ru', {currency: 'rub', minimumFractionDigits: 0})}</b>
                    <svg width="20px" height="23px" viewBox="0 0 20 23" version="1.1">
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="123-435-₽" fill="#27B4B8" fillRule="nonzero">
                                <path
                                    d="M3.285,23 L3.285,19.576 L0.725,19.576 L0.725,16.472 L3.285,16.472 L3.285,13.976 L0.725,13.976 L0.725,10.008 L3.285,10.008 L3.285,0.151999 L10.581,0.151999 C13.525,0.151999 15.669,0.749332 17.013,1.944 C18.378,3.13866 19.061,4.78133 19.061,6.872 C19.061,8.10933 18.784,9.272 18.229,10.36 C17.674,11.448 16.746,12.3227 15.445,12.984 C14.165,13.6453 12.416,13.976 10.197,13.976 L8.117,13.976 L8.117,16.472 L13.045,16.472 L13.045,19.576 L8.117,19.576 L8.117,23 L3.285,23 Z M8.117,10.008 L9.717,10.008 C11.082,10.008 12.16,9.77333 12.949,9.304 C13.76,8.83467 14.165,8.07733 14.165,7.032 C14.165,5.09067 12.885,4.12 10.325,4.12 L8.117,4.12 L8.117,10.008 Z"
                                    id="Shape"/>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
            <div {...classes('cost-item', null, className('tc', true))}>
                <Text color={TextColor.BLACK}
                      className={TextFont.UBUNTU}
                      light
                      size={TextSize.S_14}>
                    Предварительная стоимость полиса<br/>рассчитывается с учетом КБМ=1 и КВС=1.<br/>
                    <strong>Цена полиса будет меньше,<br/>если КБМ и КВС меньше 1.</strong>
                </Text>
            </div>

            <Button onClick={applyPolicy} loading={loading.osagoApplyRequest}>
                Оформить полис ОСАГО
            </Button>
        </>
    );
};

export default ApplyStep;
