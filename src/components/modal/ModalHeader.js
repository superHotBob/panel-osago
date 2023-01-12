import React from 'react'
import ShturmanSVG from 'svg/shturman.svg';

import './modal-header.scss'
import {BemHelper} from "/utils/class-helper";

const ModalHeader = ({
    title,
    children,
    color,
    SvgIcon = ShturmanSVG
}) => {
    const classes = new BemHelper({name: 'modal-header'});

    color = color || 'primary'
    return (
        <div {...classes('', color)}>           
            <SvgIcon {...classes('shturmanSvg')} />
            <div {...classes('title')}>{title}</div>
            {
                !!children && (
                    <div {...classes('text-container')}>
                        <div {...classes('line')}/>
                        <div {...classes('text')}>{children}</div>
                        <div {...classes('line')}/>
                    </div>
                )
            }
        </div>
    )
}

export {ModalHeader};
