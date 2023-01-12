import {AccidentRatingBadgeType} from './components/accident-rating/AccidentRating';

export const AccidentPredictionLevel = {
    NORMA: 'NORMA',
    ACCIDENT_RISK: 'ACCIDENT_RISK',
    ACCIDENT: 'ACCIDENT'
}


export const getAccidentPredictionRate = (predictionData) => {
    return predictionData ? predictionData.rate : null;
}

export const formatPercentage = (value) => {
    return value ? (value * 100).toFixed(2) : null;
}

export const getAccidentPredictionRatePosition = (predictionData) => {
    return predictionData ? predictionData.ratePosition : null;
}

export const getAccidentPredictionTop = (predictionData) => {
    return predictionData ? predictionData.top : null;
}

export const getAccidentPredictionBottom = (predictionData) => {
    return predictionData ? predictionData.bottom : null;
}

export const getAccidentPredictionTopRate = (predictionData) => {
    const top = getAccidentPredictionTop(predictionData);
    return top ? top.rate : null;
}

export const getAccidentPredictionTopRatePosition = (predictionData) => {
    const top = getAccidentPredictionTop(predictionData);
    return top ? top.ratePosition : null;
}

export const getAccidentPredictionBottomRate = (predictionData) => {
    const bottom = getAccidentPredictionBottom(predictionData);
    return bottom ? bottom.rate : null;
}

export const getAccidentPredictionBottomRatePosition = (predictionData) => {
    const bottom = getAccidentPredictionBottom(predictionData);
    return bottom ? bottom.ratePosition : null;
}

export const getAccidentPredictionNormaTo = (predictionData) => {
    return predictionData ? predictionData.normaTo : null;
}


export const getAccidentPredictionLevel = (predictionData) => {
    const rate = getAccidentPredictionRate(predictionData);
    if (!rate) {
        return null;
    }
    if (rate < predictionData.accidentRiskFrom) {
        return AccidentPredictionLevel.NORMA
    }
    if (rate < predictionData.accidentFrom) {
        return AccidentPredictionLevel.ACCIDENT_RISK
    }
    return AccidentPredictionLevel.ACCIDENT
}

export const getAccidentPredictionLevelBorders = (predictionData, level) => {
    switch (level) {
        case AccidentPredictionLevel.NORMA:
            return {
                min: predictionData.normaFrom,
                max: predictionData.normaTo
            }
        case AccidentPredictionLevel.ACCIDENT_RISK:
            return {
                min: predictionData.accidentRiskFrom,
                max: predictionData.accidentRiskTo
            }
        case AccidentPredictionLevel.ACCIDENT:
            return {
                min: predictionData.accidentFrom,
                max: predictionData.accidentTo
            }
    }
}

export const getBadgeTypeByPlace = (place) => {
    if (place === 1) {
        return AccidentRatingBadgeType.FIRST;
    } else if (place === 2) {
        return AccidentRatingBadgeType.SECOND;
    } else if (place === 3) {
        return AccidentRatingBadgeType.THIRD;
    } else if (place <= 10) {
        return AccidentRatingBadgeType.TOP_10;
    } else if (place <= 100) {
        return AccidentRatingBadgeType.TOP_100;
    } else if (place <= 1000) {
        return AccidentRatingBadgeType.TOP_1000;
    } else {
        return null;
    }
}