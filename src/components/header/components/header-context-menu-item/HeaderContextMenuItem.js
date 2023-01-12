import React from 'react';
import './header-context-menu-item.scss'
import classNames from 'classnames';
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";

export const HeaderContextMenuItem = ({text, badge, href, onClick = () => {}, disabled}) => {
    return (
        <a onClick={onClick}
           href={href}
           className={classNames('header-context-menu-item', disabled ? 'header-context-menu-item--disabled' : '')}>
            <Typography type={TypographyType.BODY}
                        color={TypographyColor.MUST_900}>
                {text}
            </Typography>
            {badge}
        </a>
    )
}
