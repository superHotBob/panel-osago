import React, {useState} from 'react';
import {PhoneNumber} from "../phone-number/PhoneNumber";
import {FormGroup} from "../form-group/FormGroup";

const ContractPhoneNumberInput = ({initialValue, onBlur, error, opened, disabled, editable, shouldConfirm}) => {
    const [localValue, setLocalValue] = useState(initialValue)

    return (
        <FormGroup
            error={error}
            showError={false}
            formNote={editable && shouldConfirm ? 'Проверь и нажми кнопку' : ''}>
            <PhoneNumber
                disabled={disabled}
                number={localValue}
                onNumberChange={value => setLocalValue(value)}
                onBlur={onBlur}
            />
        </FormGroup>

    );
};

export default ContractPhoneNumberInput;
