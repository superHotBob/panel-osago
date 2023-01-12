const debounce = (func, wait, immediate) => {
    let timeout
    return function () {
        let context = this
        let args = arguments
        let later = function () {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

const getObjectFromUrlParams = (params = []) => {
    if (params.length < 1) {
        return
    }

    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)

    const res = {}

    params.map(param => searchParams.get(param) && (res[param] = searchParams.get(param)))

    return res
}

const normalizePhone = (number) => {
    return parseInt(number.replace(/[^0-9]/g, ''))
      .toString()
      .substring(1)
}


export { debounce, getObjectFromUrlParams, normalizePhone }