import React, {useState} from "react";
import {className} from "../../utils/class-helper";

export const ContractDataInput = React.forwardRef(({
                                                       onBlur = () => {},
                                                       value = '',
                                                       disabled = false,
                                                       type
                                                   }, ref) => {

    const [localValue, setLocalValue] = useState(value)
    return (
        <input
            {...className('input')}
            ref={ref}
            disabled={disabled}
            type={type}
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={() => onBlur(localValue)}/>
    )
})

