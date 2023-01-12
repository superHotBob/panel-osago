import React from 'react'
import InputMask from "react-input-mask";

import FormTitle from "../form-title";

import './input.scss'
import {BemHelper} from "../../utils/class-helper";

const classes = new BemHelper({name: 'input'});

const Input = ({label, onChange, error, mask, ...props}) => {

    let input = (
        <input {...props} onChange={onChange} {...classes(null, error ? ' error': '')}/>
    )

    if (mask) {
        input = (
            <InputMask
                {...props}
                onChange={onChange}
                mask={mask}
                {...classes(null, error ? ' error': '')}
            />
        )
    }

    return (
        <label {...classes('input-wrap')}>
            {label && <FormTitle>
                {label}
            </FormTitle>}
            {input}
        </label>
    )
}

export default Input
