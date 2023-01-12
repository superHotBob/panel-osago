const RootActionType = {
    SET_YM_ID: 'RootAction.SET_YM_ID',
    SET_SOURCE: 'RootAction.SET_SOURCE',
    SET_MAIN_PAGE_URL: 'RootAction.SET_MAIN_PAGE_URL',
    SET_DOMAIN_PREFIX: 'RootAction.SET_DOMAIN_PREFIX',
}

export function setYmIdAction(id) {
    return {type: RootActionType.SET_YM_ID, payload: id}
}

export function setSourceAction(source) {
    return {type: RootActionType.SET_SOURCE, payload: source}
}

export function setMainPageUrlAction(mainPageUrl) {
    return {type: RootActionType.SET_MAIN_PAGE_URL, payload: mainPageUrl}
}

export function setDomainPrefixAction(domainPrefix) {
    return {type: RootActionType.SET_DOMAIN_PREFIX, payload: domainPrefix}
}

export const reduceRoot = (state = {
    ymId: 52986040,
    source: null,
    mainPageUrl: 'https://osago.mustins.ru/',
    domainPrefix: ''
}, action) => {
    switch (action.type) {
        case RootActionType.SET_SOURCE:
            return {
                ...state,
                source: action.payload
            }
        case RootActionType.SET_YM_ID:
            return {
                ...state,
                ymId: action.payload
            }
        case RootActionType.SET_MAIN_PAGE_URL:
            return {
                ...state,
                mainPageUrl: action.payload
            }
        case RootActionType.SET_DOMAIN_PREFIX:
            return {
                ...state,
                domainPrefix: action.payload
            }
        default:
            return state
    }
}

export const selectRoot = state => state.Root;
export const selectSource = state => selectRoot(state).source;
export const selectMainPageUrl = state => selectRoot(state).mainPageUrl;
export const selectDomainPrefix = state => selectRoot(state).domainPrefix;
