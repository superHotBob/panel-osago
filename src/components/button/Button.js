import React from 'react';
import cn from 'classnames';

import './button.scss';
import {BemHelper} from "../../utils/class-helper";

const classes = new BemHelper({name: 'button'});

export const Button = ({
                           className,
                           disabled,
                           onClick,
                           children,
                           width = 'fixed',
                           size = 'regular',
                           loading = false,
                           landing = false,
                           buttonType = 'none',
                           small = false,
                           icon,
                           id = ""
                       }) => {
    return (
        <button
            {...classes(null, [
                disabled ? 'disabled' : '',
                loading ? 'loading' : '',
                landing ? 'landing' : '',
                `width-${width}`,
                `type-${size}`,
                `type-${buttonType}`,
                small ? 'small' : '',
                icon ? `icon-${icon}` : '',
            ], [className])}
            onClick={onClick}
            type='button'
            id={id}
        >
            {children}
        </button>
    )
};
