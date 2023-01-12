const key = 'lastSmsSentTime'
const limitMilliseconds = 30 * 1000

export const getTimeLeft = phone => {
    const timestamp = localStorage.getItem(key + phone)
    if (!timestamp) {
        return 0
    }

    const left = limitMilliseconds - (Date.now() - timestamp)
    return left < 0 ? 0 : Math.ceil(left / 1000)
}

export const saveSentTime = phone => {
    localStorage.setItem(key + phone, Date.now().toString())
}

export const removeSentTime = phone => {
    localStorage.removeItem(key + phone)
}
