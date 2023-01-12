import React from 'react';
import './form-group.scss'
import {BemHelper} from "../../utils/class-helper";
import {ErrorText} from "../error-text/ErrorText";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";

const classes = new BemHelper({name: 'form-group'});

export const FormGroup = ({
                              error = false,
                              formNote = '',
                              label = '',
                              errorTextStyle = '',
                              showError = true,
                              labelColor = null,
                              errorTextTypographyColor = TypographyColor.RED,
                              warning = '',
                              icon = null,
                              children
                          }) => {
    let message = ''
    if (error) {
        // we can receive a simple string (jsx) or error object from validator
        if (typeof error === 'string' || error.hasOwnProperty('props')) {
            message = error
        } else if (error.hasOwnProperty('message') && error.message) {
            message = error.message
        } else if (error.hasOwnProperty('types') && error.types.message) {
            message = error.types.message
        }
    }

    const getError = () => {
        if (!showError) {
            return null
        }
        return <ErrorText style={errorTextStyle}>{message}</ErrorText>
    }

    const getColor = () => {
        if (labelColor) {
            return labelColor;
        }
        return !!error ? TypographyColor.RED : TypographyColor.BLACK;
    }

    if (warning) {
        formNote = warning;
        errorTextTypographyColor = TypographyColor.WARNING
    }

    return (
        <div {...classes(null, label && showError ? 'additional-padding' : '')}>
            {label && <div {...classes('label')}>
                <Typography type={TypographyType.CAPTION}
                            color={getColor()}>
                    {label}
                </Typography>
                {!!icon && icon}
            </div>}
            <div {...classes('container',[ !!error ? 'error' : '', !!warning ? 'warning' : ''])}>
                {children}
                {
                    formNote ?
                        <ErrorText style={errorTextStyle}
                                   typographyColor={errorTextTypographyColor}>{formNote}</ErrorText> :
                        getError()
                }
            </div>
        </div>

    )
}
