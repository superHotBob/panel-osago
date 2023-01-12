import {HELP_TYPE_OPERATOR, HELP_TYPE_OWNER} from "/constants/osago";
import Radio from "../../components/radio";
import React, {useCallback, useEffect, useState} from "react";
import {
    PartnerEventName,
    trackEvent,
    tracking,
    TrackingEventName,
    trackingReachGoal,
    trackPartnerEvent
} from "../../modules/tracking";
import {useDispatch, useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById,
    setDocsTreeAction,
    setHelpTypeAction,
    setScoringIdAction,
} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";
import {Button} from "../button/Button";
import {selectAuth} from "../../redux/authReducer";
import {selectSource} from "../../redux/rootReducer";
import api from "../../api";
import {withWidgetId} from "../../hoc/withWidgetId";
import {endLoadingAction, startLoadingAction} from "../../redux/loadingReducer";

const roles = [
    {val: HELP_TYPE_OWNER, name: 'help', label: 'Оформлю все сам'},
    {val: HELP_TYPE_OPERATOR, name: 'help', label: 'Нужна помощь Оператора'}
];

export const ChooseHelpStepAgent = withWidgetId(({startLoading, endLoading, loading}) => {
    const {dispatchWidgetAction, selector, widgetId} = useWidgetId(selectOsagoWizardById)
    const dispatch = useDispatch()
    const [localHelpType, setLocalHelpType] = useState(null)

    const {prescoringId, ownerType, role, registrationData: {phoneNumber, name, email}, helpType, scoringId} = useSelector(selector)
    const {utm} = useSelector(selectAuth)

    const source = useSelector(selectSource)

    const applyPolicy = async (onSuccess) => {
        startLoading('finalizeOsago')
        if (name && email) {
            await api('/profile', 'POST', {
                firstName: name,
                email: email
            });
        }

        const res = await api('/prescoring/front/apply', 'POST', {
            preScoringId: prescoringId,
            ownerType,
            customerType: role,
            scenarioType: localHelpType,
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
            if (localHelpType === HELP_TYPE_OPERATOR) {
                api(`/user/scoring/${scoringId}/operator/call`, 'POST')
            }
            onSuccess();
        }
    }


    const submitHelpType = useCallback(async () => {
        startLoading('osagoInitialGetDocsForUpload');
        dispatchWidgetAction(setHelpTypeAction(localHelpType))
        if (localHelpType === HELP_TYPE_OPERATOR) {
            trackingReachGoal(tracking.osagoOperatorAssistanceAgent)
        } else if (localHelpType === HELP_TYPE_OWNER) {
            trackingReachGoal(tracking.osagoArrangeAloneAgent)
        }
        trackEvent(TrackingEventName.SCREEN_NEEDHELP_LOADED)
        trackEvent(TrackingEventName.SCREEN_NEEDHELP_SUBMIT, {
            needHelp: localHelpType === HELP_TYPE_OWNER ? 'no' : 'yes'
        })
        // if (localHelpType === HELP_TYPE_OPERATOR) {
        //     api(`/user/scoring/${scoringId}/operator/call`, 'POST')
        // }
        // api(`/user/scoring/${scoringId}/scenario-type`, 'POST', {
        //     scenarioType: localHelpType
        // })
        // await dispatch(setDocsTreeAction(widgetId))
        endLoading('osagoInitialGetDocsForUpload');
        dispatchWidgetAction(moveNext());
    }, [localHelpType])

    const selectHelpType = type => {
        trackEvent(TrackingEventName.SCREEN_NEEDHELP_SELECTED, {
            needHelp: type === HELP_TYPE_OWNER ? 'no' : 'yes'
        })
        setLocalHelpType(type)
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_NEEDHELP_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_5_NEED_HELP)
    }, [])

    return (
        <>
            <div className="mustins-radio-group">
                {roles.map(({val, name, label}) => {
                    return (
                        <Radio label={label} name={name}
                               key={val}
                               disabled={loading.osagoInitialGetDocsForUpload}
                               checked={val === localHelpType}
                               onChange={() => selectHelpType(val)}/>
                    )
                })}
            </div>
            <div>
                <div>
                    <Button buttonType='upper'
                            loading={loading.osagoInitialGetDocsForUpload}
                            disabled={!localHelpType}
                            onClick={submitHelpType}>Дальше</Button>
                </div>
            </div>
        </>
    )
})
