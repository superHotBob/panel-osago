import React from 'react';
import './header-collapsabe-block.scss';
import classNames from 'classnames';
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";
import {IconName, IconSprite} from "../../../icon-sprite/IconSprite";

    export const HeaderCollapsableBlock = ({title, children, expanded, onExpandChange}) => {
    return (
        <div className={classNames('header-collapsable-block', expanded ? 'header-collapsable-block--expanded': '')}>
            <div className="header-collapsable-block__trigger" onClick={onExpandChange} >
                <Typography type={TypographyType.BODY}
                            color={expanded ? TypographyColor.MUST_800 : TypographyColor.MUST_900}>{title}</Typography>
                <IconSprite name={IconName.CHEVRON_DOWN}
                            className={classNames('header-collapsable-block__icon', expanded ? 'header-collapsable-block__icon--expanded': '')}/>
            </div>
            {children}
        </div>
    )
}

