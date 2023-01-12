export function getAccidentUrl(domainPrefix = '') {
    return `https://${domainPrefix}accident.mustins.ru/`
}

export function getOsagoUrl(domainPrefix = '') {
    return `https://${domainPrefix}osago.mustins.ru/`
}

export function getMainUrl() {
    return 'https://mustins.ru/'
}

export function getLiabilityUrl() {
    return 'https://mustins.ru/liability'
}

export function getInjuryUrl() {
    return 'https://mustins.ru/injury'
}

export function getCargoUrl() {
    return 'https://mustins.ru/cargo'
}


export function getProDriveUrl() {
    return 'https://mustins.ru/prodrive'
}

export function getFaqUrl() {
    return 'https://mustins.ru/faq'
}

export function getCurrentUrl() {
    return window.location.href.split('?')[0].split('#')[0];
}

export function isEqualWithoutProtocol(url1, url2) {
    return url1.replace('https://','').replace('http://','') === url2.replace('https://','').replace('http://','');
}
