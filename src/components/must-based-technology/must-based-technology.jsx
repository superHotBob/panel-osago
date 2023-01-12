import React, { memo } from 'react'
import { Typography, TypographyType } from '../typography/Typography';

import LogoSmallSvg from '../../svg/logo-small.svg';

import './must-based-technology.scss';
import {BemHelper} from "../../utils/class-helper";
const classes = new BemHelper({name: 'technologies'});

export const MustBasedTechnology = memo(() => (
    <div {...classes()}>
        <Typography type={TypographyType.CAPTION}>
            На основе технологий
        </Typography>
        <LogoSmallSvg {...classes('logo-small')} />
        <Typography type={TypographyType.CAPTION}>
            и Искусственного Интеллекта
        </Typography>
    </div>
));

