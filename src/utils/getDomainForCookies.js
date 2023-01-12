import takeRight from "lodash/takeRight";

// get first level domain for saving cookies
export const getDomainForCookies = (level = 1) => {
    if (document.domain === 'localhost') {
        return ''
    }

    let domainParts = document.domain.split('.');
    return takeRight(domainParts, level + 1).join('.')
}
