import React from 'react';

import './error-text.scss';
import {BemHelper} from '../../utils/class-helper'
import {Typography, TypographyColor, TypographyType} from '../typography/Typography';

const classes = new BemHelper({name: 'error-text'});

export const ErrorText = ({
                              children,
                              style = 'style-1',
                              typographyColor = TypographyColor.RED
                          }) => {
    return (
            <div {...classes(null, style)}>
                <Typography type={TypographyType.FOOTNOTE} color={typographyColor}>
                    {children}
                </Typography>
            </div>
    )
};

