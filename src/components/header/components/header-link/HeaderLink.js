import React from 'react';
import './header-link.scss'
import classNames from 'classnames';
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";

export const HeaderLink = ({name, href}) => {
    return (
        <a className={classNames('header-link', href ? '' : 'header-link--disabled')}
           href={href ? href : 'javascript://'}
           target={href ? '_blank' : ''}>
            <Typography bigDesktopType={TypographyType.BODY}
                        desktopType={TypographyType.CAPTION}
                        type={TypographyType.BODY}
                        color={TypographyColor.MUST_900}>{name}</Typography>
        </a>
    )
}
