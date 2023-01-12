import React from 'react';
import {useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById, setScoringIdAction,
} from "../../redux/osagoWizardReducer";
import {selectAuth} from "../../redux/authReducer";
import api from "../../api";
import {tracking, trackingReachGoal} from "../../modules/tracking";
import {ORGANIZATION_TYPE_INDIVIDUAL} from "../../constants/osago";
import useWidgetId from "../../hooks/useWidgetId";
import {selectSource} from "../../redux/rootReducer";
import AuthContainer from "../auth/AuthContainer";
import {withWidgetId} from "../../hoc/withWidgetId";
import {callOperator, userScoringIdentification} from "../../api/modules/auth";

const LoginStepSmsConnected = ({startLoading, endLoading}) => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {prescoringId, ownerType, role, loginData: {phoneNumber}, helpType, localHelpType} = useSelector(selector)
    const {utm} = useSelector(selectAuth)

    const source = useSelector(selectSource)

    const applyPolicy = async (onSuccess) => {
        startLoading('finalizeOsago')
        const res = await api('/prescoring/front/apply', 'POST', {
            preScoringId: prescoringId,
            ownerType,
            customerType: role,
            scenarioType: helpType,
            source,
            utm
        });

        if (!res) {
            endLoading('finalizeOsago')
            return dispatchWidgetAction(moveNext({
                isSuccess: false
            }))
        } else {
            const {scoringId} = await res.json()
            dispatchWidgetAction(setScoringIdAction(scoringId))
            userScoringIdentification(scoringId);
            callOperator(scoringId, helpType);
            onSuccess();
        }
    }

    const onSuccess = () => {
        trackingReachGoal(tracking.osagoConfirmPhone, ORGANIZATION_TYPE_INDIVIDUAL)

        applyPolicy(() => {
            endLoading('finalizeOsago')
            dispatchWidgetAction(moveNext({
                isSuccess: true
            }))
        })
    }

    return (
        <AuthContainer
            smsLabelStep='03'
            initialStep='sms'
            onPhoneConfirmed={onSuccess}
            initialPhoneNumber={phoneNumber}
        />
    );
};

export default withWidgetId(LoginStepSmsConnected);
