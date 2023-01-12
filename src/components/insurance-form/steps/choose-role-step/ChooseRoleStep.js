import {ORGANIZATION_TYPE_LEGAL, ROLE_TYPE_AGENT, ROLE_TYPE_OWNER} from "/constants/osago";
import Radio from "../../../radio";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {moveNext, selectOsagoWizardById, setOwnerTypeAction, setRoleAction} from "../../../../redux/osagoWizardReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import {Button} from "../../../button/Button";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../../../modules/tracking";
import {ROLE_TYPE_OTHER, ROLE_TYPE_OWNER_REPRESENTATIVE} from "../../../../constants/osago";

const roles = [
    {val: ROLE_TYPE_OWNER, name: 'role', label: 'Я владелец Грузовика(ов)'},
    {val: ROLE_TYPE_OWNER_REPRESENTATIVE, name: 'role', label: <span>Я представитель<br/> владельца Грузовика(ов)</span>},
    {val: ROLE_TYPE_AGENT, name: 'role', label: 'Я страховой Агент'},
    {val: ROLE_TYPE_OTHER, name: 'role', label: 'Другое'},
];

export const ChooseRoleStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {role} = useSelector(selector)

    const chooseRole = role => {
        dispatchWidgetAction(setRoleAction(role))
        trackEvent(TrackingEventName.SCREEN_CUSTOMERTYPE_SELECTED, { type: role })
    }

    const moveNextClick = () => {
        dispatchWidgetAction(setOwnerTypeAction(ORGANIZATION_TYPE_LEGAL))
        trackEvent(TrackingEventName.SCREEN_CUSTOMERTYPE_SUBMIT, { type: role })
        dispatchWidgetAction(moveNext())
    }

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_CUSTOMERTYPE_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_2_CUSTOMER_TYPE)
    }, [])

    return (
        <div>
            <div className="mustins-radio-group">
                {roles.map(({val, name, label}) => {
                    return (
                        <Radio label={label} name={name}
                               key={val}
                               checked={val === role}
                               onChange={() => chooseRole(val)}/>
                    )
                })}
            </div>
            <Button onClick={moveNextClick} disabled={!role}>
                ДАЛЬШЕ
            </Button>
        </div>
    )
}
