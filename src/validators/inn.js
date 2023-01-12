import {size, toNumber} from 'lodash'

const TEN_DIGIT_RATIOS = [2, 4, 10, 3, 5, 9, 4, 6, 8];
const ELEVENTH_DIGIT_RATIOS = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const TWELVE_DIGIT_RATIOS = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

const INDIVIDUAL_INN_LENGTH = 12;
const CORPORATE_INN_LENGTH = 10;

function calculateInnCheckSum(inn, ratios) {
    let ratioSum = 0;
    for (let i = 0; i < size(ratios); i++) {
        ratioSum += inn[i] * ratios[i];
    }
    return ratioSum % 11 % 10;
}

export function isInnValid(inn) {
    let result = false;
    if (size(inn) === CORPORATE_INN_LENGTH) {
        result = calculateInnCheckSum(inn, TEN_DIGIT_RATIOS) === toNumber(inn[9]);
    } else if (size(inn) === INDIVIDUAL_INN_LENGTH) {
        const eleventhDigitRatios = calculateInnCheckSum(inn, ELEVENTH_DIGIT_RATIOS);
        const twelveDigitRatios = calculateInnCheckSum(inn, TWELVE_DIGIT_RATIOS);
        result = toNumber(inn[10]) === eleventhDigitRatios && toNumber(inn[11]) === twelveDigitRatios;
    }
    return result;
}

export const innValidator = (name = 'inn')  => [
    {name}, {
        required: 'Укажи ИНН',
        validate: value => isInnValid(value) ? true : 'Исправь ошибки в ИНН'
    }
]

export const innObjectValidator = (name = 'inn')  => [
    {name}, {
        required: 'Укажи ИНН',
        validate(value) {
            if (!value?.kpp) {
                return 'Выбери компанию из списка'
            }
            if (!isInnValid(value?.inn)) {
                return 'Исправь ошибки в ИНН'
            }

            return true
        }
    }
]
