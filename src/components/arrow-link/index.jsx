import React from 'react';

import {IconSprite} from 'components/icon-sprite/IconSprite';

import './arrow-link.scss';
import {BemHelper} from '../../utils/class-helper'

const classes = new BemHelper({name: 'arrow-link'});

const ArrowLink = ({
	to = '/',
    href = null,
	children,
}) => {
    const CustomLink = href ? 'a' : 'Link';

    return (
        <CustomLink href={ href } to={ to } {...classes()}>
            <span {...classes('text')}>{ children }</span>
            <span {...classes('icon')}>
                <IconSprite name="right-arrow"/>
            </span>
        </CustomLink>
    )
};

export default ArrowLink;
