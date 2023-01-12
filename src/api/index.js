import 'whatwg-fetch'
import {getToken, isLoggedIn, isTokenExpired, removeToken} from "../modules/auth";
import AppContext from "../store/context";
import {getDomainForCookies} from "../utils/getDomainForCookies";

const API_BASE_URL = 'https://api.must.io';

const TEST_API_BASE_URL = 'https://api-stage.back.must.io';

export const getApiBaseUrl = () => {
    const firstLevelDomain = getDomainForCookies();
    const domain = document.domain;
    if (!firstLevelDomain ||
        firstLevelDomain === 'tilda.ws' ||
        domain === 'osago-k8s-test.stage.mustins.ru') {
        return TEST_API_BASE_URL;
    } else {
        return API_BASE_URL;
    }
}
export const serializeParams = (params) => {
    return '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

const api = async (path, method = 'GET', body, additionalHeaders = {}) => {
    // we don't need to send request if token is expired
    if (isTokenExpired()) {
        removeToken()
    }

    let headers = {'Accept': 'application/json'}

    // for form data content-type will be detected automatically
    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }
    if (isLoggedIn()) {
        headers['Authorization'] = `Bearer ${getToken()}`
    }

    headers = {
        ...headers,
        ...additionalHeaders
    }

    let bodyFormat = {body}
    if (headers['Content-Type'] === 'application/json') {
        bodyFormat = body ? {body: JSON.stringify(body)} : {};
    }

    let response = await window.fetch(`${getApiBaseUrl()}/api${path}`, {
        method,
        headers,
        ...bodyFormat,
    })
    if (response.status === 401 || response.status === 403) {
        removeToken()
        return false
    } else {
        return response
    }
};

api.contextType = AppContext

export default api;
