import React, {useCallback, useEffect, useRef, useState} from 'react';
import {IMaskInput} from 'react-imask';
import {className} from "../../utils/class-helper";

const ContractMaskedInput = ({onBlur, initialValue, mask, disabled}) => {
    const [localValue, setLocalValue] = useState(initialValue || '')
    const inputRef = useRef(null)
    const setValue = useCallback(value => {
        setLocalValue(value)
    }, [])

    const onFocus = useCallback(() => {
        inputRef.current.setSelectionRange(localValue.length, localValue.length)
    }, [])

    return (
        <IMaskInput
            {...className('input')}
            inputRef={el => inputRef.current = el}
            unmask
            disabled={disabled}
            lazy={false}
            placeholderChar='_'
            mask={mask}
            onBlur={() => onBlur(localValue)}
            onFocus={onFocus}
            onAccept={setValue}
            value={localValue}
        />
    );
};

export default ContractMaskedInput;
