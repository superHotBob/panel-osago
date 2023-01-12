import {DateTime} from "luxon";
import {getTodayEnd} from "../utils/get-today-date";

export const passportIssuedOnValidator = (name = 'passportIssuedOn', getValues)  => [
    {name}, {
        validate: (fieldName, value) => {
            const matches = fieldName.match(/^([a-z]+)\.([a-z]+)\./i)
            const bornOnField = getValues()?.[`${matches[0]}bornOn`]

            if (!bornOnField) {
                return true
            }

            const laterDate = DateTime.fromISO(value).minus({ years: 14 })
            const diff = laterDate.diff(DateTime.fromISO(bornOnField), ['days']).toObject();

            return diff.days >= 0 ? true : 'Дата выдачи не менее 14 лет назад'
        }
    }
]
