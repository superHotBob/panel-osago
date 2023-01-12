import {DateTime} from "luxon";
import {getTodayEnd} from "../utils/get-today-date";

export const birthdayValidator = (name = 'birthday')  => [
    {name}, {
        validate: (fieldName, value) => {
            const laterDate = DateTime.fromISO(value).plus({ years: 18 })
            const diff = laterDate.diff(getTodayEnd(), ['days']).toObject();
            return diff.days <= 0 ? true : 'Вам должно быть больше 18 лет'
        }
    }
]

export const birthdateValidator = (name = 'birthdate')  => [
    {name}, {
        required: 'Введи дату рождения',
        validate: (value) => {
            const laterDate = DateTime.fromISO(value).plus({ years: 18 })
            const diff = laterDate.diff(getTodayEnd(), ['days']).toObject();
            return diff.days <= 0 ? true : 'Вам должно быть больше 18 лет'
        }
    }
]

export const validateEighteen = (driverBornOnValue, value) => {
    if (!value) return true
    let adultDateObject
    if (driverBornOnValue) {
        adultDateObject = getAgeDateObject(driverBornOnValue, 18)
    } else {
        return true
    }

    if (DateTime.fromISO(value) >= adultDateObject) return true

    return 'Дата должна быть не ранее, чем 18 лет со дня рождения'
}

export const getAgeDateObject = (value, age) => {
    const isoBornOnValue = DateTime.fromISO(value)
    const driverYear = isoBornOnValue.plus({years: age}).get('year')
    return isoBornOnValue
        .set({
            year: driverYear
        })
}

export const getMaxDateObjectOfTwo = (date1, date2) => {

}
