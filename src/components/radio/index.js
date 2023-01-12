import React from 'react';

import './radio.scss'

import {BemHelper} from "../../utils/class-helper";
import {Typography, TypographyType} from "../typography/Typography";

const Radio = ({
   label = '',
   details,
   disabled,
   checked,
   onChange = () => {},
   name,
   value,
}) => {
    const classes = new BemHelper({name: 'radio'});
    return (
        <label
            {...classes(null, [disabled ? 'disabled' : '', checked ? 'checked' : '', details ? 'details': ''])}
        >
            <div {...classes('text-wrapper')}>
                <div {...classes('text')}>
                    {label}
                </div>
                {details && (
                    <div {...classes('sub-text')}>
                        {details}
                    </div>
                )}
            </div>

            <input
                type="radio"
                disabled={disabled}
                checked={checked}
                name={name}
                onChange={onChange}
                value={value}
            />
            <div {...classes('faker')}>
                <div {...classes('faker-icon')}/>
            </div>

        </label>
    )
}

const DefaultRadio = ({label = '', disabled, checked, onChange = () => {}, name}) => {
    const classes = new BemHelper({name: 'default-radio'});

    return (
        <label {...classes(null, disabled ? 'disabled' : '')}>
            <input type="radio" disabled={disabled} checked={checked} name={name} onChange={onChange}/>
            <div {...classes('faker')}>
                <div {...classes('faker-icon')}/>
            </div>
            <div {...classes('text')}>
                <Typography type={TypographyType.SUBHEAD}>
                    {label}
                </Typography>
            </div>
        </label>
    )
}

export default Radio
export { DefaultRadio }
