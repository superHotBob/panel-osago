import React from 'react';
import classNames from 'classnames';
import {AccidentRatingBadgeType} from "./AccidentRating";
import {
    Typography,
    TypographyColor,
    TypographyType,
    TypographyWeight
} from "../../../../components/typography/Typography";
import BadgeFirstSvg from '../../../../svg/badge-first.svg';
import BadgeSecondSvg from '../../../../svg/badge-second.svg';
import BadgeThirdSvg from '../../../../svg/badge-third.svg';
import BadgeTop10Svg from '../../../../svg/badge-top-10.svg';
import BadgeTop100Svg from '../../../../svg/badge-top-100.svg';
import BadgeTop1000Svg from '../../../../svg/badge-top-1000.svg';
import BlurredPlatePng from '../../../../assets/images/png/blurred-plate.png';
import BlurredPlateSmallPng from '../../../../assets/images/png/blurred-plate-small.png';
import {AccidentResultColor} from "../accident-result-color/AccidentResultColor";
import {AccidentPlate, AccidentPlateBorderColor, AccidentPlateSize} from "../accident-plate/AccidentPlate";
import {AccidentBadgeSvg} from '../accident-badge-svg/AccidentBadgeSvg';


function formatScore(score) {
    const result = Number(score).toFixed(2);
    if (score >= 10) {
        return result
    }
    return '0' + result;
}

function formatPlace(place) {
    return Number(place).toLocaleString('en').split(',').join(' ')
}

export const AccidentRatingItem = ({score, place, level, number, region, badgeType, short}) => {

    const renderBadge = () => {
        return <AccidentBadgeSvg badgeType={badgeType}/>
    }

    return (
        <div
            className={classNames('accident-rating-item', score ? 'accident-rating-item--with-data' : '', number ? 'accident-rating-item--with-number' : '', short ? 'accident-rating-item--short' : '')}>
            {!score && !short && <AccidentResultColor placeType={level}
                                                      short={short}/>}
            {!score && short &&
            <div className="accident-rating-item__left">
                <div className="accident-rating-item__color-and-place">
                    <AccidentResultColor placeType={level}
                                         short={short}/>
                    <div className="accident-rating-item__place">
                        <div className="accident-rating-item__place-number">
                            <Typography type={TypographyType.BODY} weight={TypographyWeight.MEDIUM}>
                                ...
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>}
            {score && <>
                <div className="accident-rating-item__left">
                    {badgeType && !short && <div className="accident-rating-item__badge-container">
                        {renderBadge()}
                    </div>}
                    <div className="accident-rating-item__color-and-place">
                        <AccidentResultColor placeType={level}
                                             short={short}/>
                        <div className="accident-rating-item__place">
                            <div className="accident-rating-item__place-number">
                                <Typography type={TypographyType.BODY} weight={TypographyWeight.MEDIUM}>
                                    {formatPlace(place)}-е
                                </Typography>
                            </div>
                            {!short &&
                            <div className="accident-rating-item__place-label">
                                <Typography type={TypographyType.FOOTNOTE} color={TypographyColor.MUST_800}>
                                    место
                                </Typography>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="accident-rating-item__center">
                    {!number && <img src={short ? BlurredPlateSmallPng : BlurredPlatePng}
                                     className="accident-rating-item__blurred-plate"/>}
                    {number && <AccidentPlate number={number}
                                              region={region}
                                              borderColor={short ? AccidentPlateBorderColor.DEFAULT : AccidentPlateBorderColor.PRIMARY}
                                              size={short ? AccidentPlateSize.S : AccidentPlateSize.M}/>}
                </div>
                <div className="accident-rating-item__right">
                    <div className="accident-rating-item__score">
                        <Typography type={TypographyType.H5}
                                    weight={short && !number ? TypographyWeight.REGULAR : TypographyWeight.MEDIUM}>
                            {formatScore(score)}%
                        </Typography>
                    </div>
                </div>
            </>}

        </div>
    )
}

