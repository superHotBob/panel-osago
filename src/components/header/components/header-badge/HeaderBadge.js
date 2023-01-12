import React from 'react';
import './header-badge.scss';
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";


export const HeaderBadge = ({count}) => {
    return (
        <div className="header-badge">
            <Typography type={TypographyType.CAPTION}
                        color={TypographyColor.MUST_100}>{count}</Typography>
        </div>
    );
}

