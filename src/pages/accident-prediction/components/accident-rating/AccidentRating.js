import React, {useMemo} from 'react';
import './accident-rating.scss';
import {AccidentRatingItem} from "./AccidentRatingItem";
import {AccidentPredictionLevel, getBadgeTypeByPlace} from '../../AccidentPredictionModel';


export const AccidentRatingBadgeType = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
    THIRD: 'THIRD',
    TOP_10: 'TOP_10',
    TOP_100: 'TOP_100',
    TOP_1000: 'TOP_1000'
}

export const AccidentRating = ({place, level, number, region, score, bestScore, worstScore, count, short}) => {
    const items = [];

    const badgeType = useMemo(() => {
        return getBadgeTypeByPlace(place)
    }, [place])

    const renderMainItem = () => {
        return (
            <AccidentRatingItem place={place}
                                level={level}
                                number={number}
                                region={region}
                                short={short}
                                badgeType={badgeType}
                                score={score}/>
        )
    }

    const renderBest = (bestPlace = 1) => {
        return (
            <AccidentRatingItem place={bestPlace}
                                badgeType={bestPlace === 1 ? AccidentRatingBadgeType.FIRST : null}
                                level={AccidentPredictionLevel.NORMA}
                                short={short}
                                score={bestScore}/>
        );
    }

    const renderEmptyNorma = () => {
        return (
            <AccidentRatingItem level={AccidentPredictionLevel.NORMA}
                                short={short}/>
        )
    }
    const renderEmptyAccidentRisk = () => {
        return (
            <AccidentRatingItem level={AccidentPredictionLevel.ACCIDENT_RISK}
                                short={short}/>
        )
    }

    const renderEmptyAccident = () => {
        return (
            <AccidentRatingItem level={AccidentPredictionLevel.ACCIDENT}
                                short={short}/>
        )
    }

    const renderWorst = () => {
        return (
            <AccidentRatingItem place={count}
                                score={worstScore}
                                short={short}
                                level={AccidentPredictionLevel.ACCIDENT}/>
        )
    }

    switch (level) {
        case AccidentPredictionLevel.NORMA:
            if (place === 1) {
                items.push(renderMainItem())
                items.push(renderBest(2))
                items.push(renderEmptyNorma())
            } else if (place === 2) {
                items.push(renderBest())
                items.push(renderMainItem())
                items.push(renderEmptyNorma())
            } else {
                items.push(renderBest())
                items.push(renderEmptyNorma())
                items.push(renderMainItem())
            }
            if (!short) {
                items.push(renderEmptyNorma())
            }
            items.push(renderEmptyAccidentRisk())
            if (!short) {
                items.push(renderEmptyAccidentRisk())
                items.push(renderEmptyAccident())
            }
            items.push(renderWorst())
            break;
        case AccidentPredictionLevel.ACCIDENT_RISK:
            items.push(renderBest());
            items.push(renderEmptyNorma());
            if (!short) {
                items.push(renderEmptyNorma());
            }
            items.push(renderMainItem())
            if (!short) {
                items.push(renderEmptyAccidentRisk())
                items.push(renderEmptyAccident())
            }
            items.push(renderEmptyAccident())
            items.push(renderWorst())
            break;
        case AccidentPredictionLevel.ACCIDENT:
            items.push(renderBest());
            if (!short) {
                items.push(renderEmptyNorma());
                items.push(renderEmptyNorma());
                items.push(renderEmptyAccidentRisk());
            }
            items.push(renderEmptyAccidentRisk())
            const diff = count - place;
            if (diff > 1) {
                items.push(renderMainItem());
                items.push(renderEmptyAccident());
                items.push(renderWorst());
            } else if (diff === 1) {
                items.push(renderEmptyAccident());
                items.push(renderMainItem());
                items.push(renderWorst());
            } else {
                items.push(renderEmptyAccident());
                items.push(renderWorst());
                items.push(renderMainItem());
            }
            break;
    }
    return (
        <div className="accident-rating">
            {items}
        </div>
    );
}
