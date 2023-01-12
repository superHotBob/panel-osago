import React from 'react';
import './accident-badge-svg.scss';
import {AccidentRatingBadgeType} from '../accident-rating/AccidentRating';
import BadgeFirstSvg from '../../../../svg/badge-first.svg';
import BadgeSecondSvg from '../../../../svg/badge-second.svg';
import BadgeThirdSvg from '../../../../svg/badge-third.svg';
import BadgeTop10Svg from '../../../../svg/badge-top-10.svg';
import BadgeTop100Svg from '../../../../svg/badge-top-100.svg';
import BadgeTop1000Svg from '../../../../svg/badge-top-1000.svg';

export const AccidentBadgeSvg = ({badgeType, historyCard}) => {
    switch (badgeType) {
        case AccidentRatingBadgeType.FIRST:
            return <BadgeFirstSvg className="accident-badge-svg"/>
        case AccidentRatingBadgeType.SECOND:
            return <BadgeSecondSvg className="accident-badge-svg"/>
        case AccidentRatingBadgeType.THIRD:
            return <BadgeThirdSvg className="accident-badge-svg"/>
        case AccidentRatingBadgeType.TOP_10:
            return <BadgeTop10Svg className={historyCard ? 'accident-badge-svg--long' : 'accident-badge-svg'}/>
        case AccidentRatingBadgeType.TOP_100:
            return <BadgeTop100Svg className={historyCard ? 'accident-badge-svg--long' : 'accident-badge-svg'}/>
        case AccidentRatingBadgeType.TOP_1000:
            return <BadgeTop1000Svg className={historyCard ? 'accident-badge-svg--long' : 'accident-badge-svg'}/>
    }
}