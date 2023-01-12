import {ORGANIZATION_TYPE_INDIVIDUAL, ORGANIZATION_TYPE_LEGAL} from "/constants/osago";
import Radio from "../../../radio";
import React from "react";
import {useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById,
    setOwnerTypeAction,
} from "../../../../redux/osagoWizardReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import {ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR} from "../../../../constants/osago";

const types = [
    {val: ORGANIZATION_TYPE_LEGAL, name: 'ownerType', label: 'Организация (ООО и др.)'},
    // {val: ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR, name: 'ownerType', label: 'ИП'},
    // {val: ORGANIZATION_TYPE_INDIVIDUAL, name: 'ownerType', label: 'Физическое лицо'},
];

export const ChooseOwnerTypeStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const { ownerType } = useSelector(selector)

    const chooseType = type => {
        // dispatchWidgetAction(setOwnerTypeAction(type))
        // dispatchWidgetAction(moveNext({
        //     needRecalculate: true,
        // }))
    }

    return (
        <div className="mustins-radio-group">
            {types.map(({val, name, label}) => {
                return (
                    <Radio label={label} name={name}
                           key={val}
                           disabled={true}
                           // disabled={ownerType && val !== ownerType}
                           checked={val === ownerType}
                           onChange={() => chooseType(val)}/>
                )
            })}
        </div>
    )
}
