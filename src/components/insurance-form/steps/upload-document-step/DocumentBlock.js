import React from 'react';
import {DRIVER_COUNT_OPTIONS, OsagoDocs} from "../../../../constants/osago";
import {Checkbox} from "../../../checkbox/Checkbox";
import {FormGroup} from "../../../form-group/FormGroup";
import DefaultSelect from "../../../select";

const DocumentBlock = ({block, children}) => {
    let controls = null

    if (block.id === OsagoDocs.ownerPassport) {
        const disabled = !documents[OsagoDocs.insuredPassportSide1]?.completed ||
            !documents[OsagoDocs.insuredPassportSide2]?.completed

        controls = (
            <Checkbox
                label={'Страхователь является Владельцем транспортного средства'}
                labelAsFootnote={true}
                boldLabel
                color='black'
                disabled={disabled}
                disabledStyle={true}
                checked={insuredIsOwner}
                onChange={changeInsuredIsOwner}/>
        )
    }

    if (block.id === OsagoDocs.driverLicenseFake) {
        controls = (
            <div {...classes('driver-license-select')}>
                <FormGroup label='Количество водителей'>
                    <DefaultSelect
                        selectedOption={formData?.driverNumber}
                        onChange={onDriversCountChange}
                        options={DRIVER_COUNT_OPTIONS}/>
                </FormGroup>
            </div>
        )
    }

    return (
        <div {...classes('block')} key={block.id}>
            <div {...classes('title')}>{block.title}</div>
            {controls}
            {children}
        </div>
    )
};

export default DocumentBlock;
