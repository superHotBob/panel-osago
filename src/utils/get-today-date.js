import {DateTime} from "luxon";

export const getTodayStart = () => {
    const date = `${DateTime.local().toFormat('yyyy-MM-dd')}T00:00:00`
    return DateTime.fromISO(date)
}

export const getTodayEnd = () => {
    const date = `${DateTime.local().toFormat('yyyy-MM-dd')}T23:59:59`
    return DateTime.fromISO(date)
}
