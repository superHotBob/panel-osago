import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById, setScoringIdAction,
} from "../../redux/osagoWizardReducer";
import {selectAuth, updateProfileAction} from "../../redux/authReducer";
import {trackEvent, tracking, TrackingEventName, trackingReachGoal} from "../../modules/tracking";
import {ORGANIZATION_TYPE_INDIVIDUAL} from "../../constants/osago";
import api from "../../api";
import useWidgetId from "../../hooks/useWidgetId";
import {selectSource} from "../../redux/rootReducer";
import AuthContainer from "../auth/AuthContainer";
import {withWidgetId} from "../../hoc/withWidgetId";
import {callOperator, userScoringIdentification} from "../../api/modules/auth";

const RegistrationStepSmsConnected = ({startLoading, endLoading}) => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {prescoringId, ownerType, role, registrationData: {phoneNumber, name, email, lastName, patronymic, position, bornOn}, helpType} = useSelector(selector)
    const {utm} = useSelector(selectAuth)
    const dispatch = useDispatch();

    const source = useSelector(selectSource)

    const applyPolicy = async (onSuccess) => {
        startLoading('finalizeOsago')
        dispatch(updateProfileAction({
            firstName: name,
            email: email,
            position,
            patronymic,
            lastName,
            bornOn
        }))

        await api('/profile/authorize-personal-data-processing', 'POST', {
            isConfirmed: true
        });
        await api('/profile/confirm-terms-of-service', 'POST', {
            isConfirmed: true
        });

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
        trackEvent(TrackingEventName.SCREEN_REGISTRATIONDATA_APPROVED)

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

export default withWidgetId(RegistrationStepSmsConnected);
