import React from 'react';
import ErrorTailSvg from 'svg/error-tail.svg';
import './error-bubble.scss';
import {BemHelper} from "../../utils/class-helper";

const classes = new BemHelper({name: 'error-bubble'});

export const ErrorBubble = ({
    text = '',
    className = '',
    size = 'normal',
    shown = false,
    position = 'left',
    positionMobile = 'top',
    showMobile = false
}) => {

    return (
        <div
            {...classes(null, [
                shown ? 'shown' : '',
                size ? size : '',
                showMobile ? 'show-mobile' : '',
                `d-${position}`,
                `m-${positionMobile}`,
            ], [className])}
        >
            <div {...classes('rectangle')}>{text}</div>
            <ErrorTailSvg {...classes('tail')}/>
        </div>
    );
}
