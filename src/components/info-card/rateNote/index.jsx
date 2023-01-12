import React from 'react';
import find from 'lodash/find';
import inRange from 'lodash/inRange';
import cn from 'classnames';

import { Text, TextColor, TextSize } from '../../text/Text';
import { Ranges } from 'constants/ranges';

import './rateNote.scss'

const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const rateNote = ({
    rate,
    completedAt,
}) => {
    const {
        caption,
        className,
    } = find(Ranges, (range) => {
        const percentRate = rate * 100;

        return inRange(percentRate, range.min, range.max);
    });
    const rateDate = new Date(Date.parse(completedAt));
    const dateFormat = [
      rateDate.getDate(),
      months[rateDate.getMonth()],
      rateDate.getFullYear(),
    ].join(' ');

    return (
      <div className="rate-note">
        <Text color={TextColor.GRAY}
            size={TextSize.S_12}
            className="rate-note__title"
            uppercase={true}
        >{ dateFormat }</Text>
        <div className='rate-note__legend-container'>
            <span>
                <div className={cn('rate-note__legend', className)}></div>
                {caption}
            </span>
        </div>
        <Text color={TextColor.BLACK}
            size={TextSize.S_20}
            className="rate-note__text"
            uppercase={true}>
            {(rate * 100).toFixed(2)}%
        </Text>
    </div>
    )
};

export default rateNote;
