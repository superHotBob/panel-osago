import React, {useEffect, useState} from 'react'
import { BemHelper } from "../../utils/class-helper";
import {IconName, IconSprite} from "src/components/icon-sprite/IconSprite";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";

import './quantity-select.scss'

const classes = new BemHelper({ name: 'quantity-select' });

export const QuantitySelect = ({handlerQuantity}) => {
    const [count, setCount] = useState(1);

    useEffect(() => {
        handlerQuantity(count)
    }, [count])

    return (
        <div className='counter-wrapper'>
            <button
                className='counter-wrapper__button counter-wrapper__button--minus'
                type='button'
                onClick={() => count > 1 ? setCount(count - 1) : ''}
            >
                <IconSprite
                    name={IconName.SIMPLE_MINUS}
                    {...classes('counter-icon')}
                />
            </button>
            <Typography type={TypographyType.BODY}
                        color={TypographyColor.MUST_900}>
                {count}
            </Typography>
            <button
                className='counter-wrapper__button counter-wrapper__button--plus'
                type='button'
                onClick={() =>  setCount(count + 1)}
            >
                <IconSprite
                    name={IconName.SIMPLE_PLUS}
                    {...classes('counter-icon')}
                />
            </button>
        </div>
    )
}

