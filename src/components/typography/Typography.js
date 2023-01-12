import React from 'react';
import {className} from "../../utils/class-helper";
import './typography.scss';
import compact from 'lodash/compact';

export const TypographyType = {
    H1: 'typography__heading__h1',
    H2: 'typography__heading__h2',
    H3: 'typography__heading__h3',
    H4: 'typography__heading__h4',
    H5: 'typography__heading__h5',
    H6: 'typography__heading__h6',
    SUBHEAD: 'typography__subhead',
    BODY: 'typography__body',
    CAPTION: 'typography__caption',
    CAPTION2: 'typography__caption-2',
    FOOTNOTE: 'typography__footnote',
}

export const TypographyWeight = {
    REGULAR: 'typography__regular',
    MEDIUM: 'typography__medium',
    BOLD: 'typography__bold',
}

export const TypographyColor = {
    BLACK: 'typography__black',
    GRAY_DARK: 'typography__gray-dark',
    GRAY: 'typography__gray',
    GRAY_LIGHT: 'typography__gray-light',
    WHITE: 'typography__white',
    PRIMARY: 'typography__primary',
    PRIMARY_DARK: 'typography__primary-dark',
    PRIMARY_LIGHT: 'typography__primary-light',
    RED: 'typography__red',
    WARNING: 'typography__warning',
    MUST_900: 'typography__must900',
    MUST_800: 'typography__must800',
    MUST_700: 'typography__must700',
    MUST_600: 'typography__must600',
    MUST_200: 'typography__must200',
    MUST_100: 'typography__must100',
}

export const TypographyDisplay = {
    BLOCK: 'typography__block',
    INLINE: 'typography__inline'
}


export function Typography({
   children,
   type,
   desktopType,
   bigDesktopType,
   weight,
   color = TypographyColor.BLACK,
   display = TypographyDisplay.INLINE
}) {
    bigDesktopType = bigDesktopType ? `${bigDesktopType}--big-desktop-up` : bigDesktopType;
    desktopType = desktopType ? `${desktopType}--desktop-up` : desktopType;
    return (
        <span
            {...className(compact(
                [type, desktopType, bigDesktopType, weight, color, display]
            ))}
        >
            {children}
        </span>
    )
}
