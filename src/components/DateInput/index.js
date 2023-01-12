import React, { useState, useRef } from 'react';
import DatePicker , { registerLocale }  from 'react-datepicker'

import ru from 'date-fns/locale/ru'

import 'react-datepicker/dist/react-datepicker.css'
import './dateInput.scss'
import FormTitle from "../form-title";
import {BemHelper} from "../../utils/class-helper";

const classes = new BemHelper({name: 'date-input'});

registerLocale('ru', ru)


const DateInput = ({label, disabled, onChange, val, error, minDate = new Date(), maxDate = null, ...props}) => {

    const [focused, setFocused] = useState(false)
    const [inputRef, setInputRef] = useState(false)

    if (inputRef && inputRef.input) {
        inputRef.input.readOnly = true;
    }

    return (
        <div {...classes(null, [error ? 'error': '', disabled ? 'disabled': ''])}>
            {
                label ?
                    <FormTitle>
                        {label}
                    </FormTitle> : null
            }
            <label onClick={e => inputRef.state.open && e.preventDefault()}>
                <DatePicker
                    onFocus={(e) => {
                        e.target.readOnly = true
                        setFocused(true)
                    }}
                    onBlur={(e) => {
                        e.target.readOnly = false
                        setFocused(false)
                    }}
                    ref={(r) => {
                        setInputRef(r)
                    }}
                    showPopperArrow={false}
                    locale='ru'
                    selected={val}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat='dd MMMM yyyy'
                    disabled={disabled}
                    onChange={onChange}
                    {...props}
                />
            </label>
        </div>
    )
}

export default DateInput
