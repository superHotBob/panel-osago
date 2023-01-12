import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { AUTH_TOKEN_COOKIE, AUTH_TOKEN_EXPIRATION_TIME, USER_COOKIE, AUTH_TOKEN_MAX_TIME } from "../constants/auth";
import { getDomainForCookies } from "../utils/getDomainForCookies";

export const getToken = () => {
    return Cookies.get(AUTH_TOKEN_COOKIE)
}

export const getUser = () => {
    const userCookie = Cookies.get(USER_COOKIE)

    return userCookie && JSON.parse(userCookie)
}

export const removeUser = () => {
    Cookies.remove(USER_COOKIE, {
        domain: getDomainForCookies()
    })
}

export const saveUser = user => {
    Cookies.set(USER_COOKIE, JSON.stringify(user), {
        expires: 31,
        domain: getDomainForCookies()
    });
}

export const isLoggedIn = () => {
    removeTokenIfExpired()

    return !!getToken()
}

export const getTokenSecondsLeft = (token) => {
    if (!token) {
        return 0
    }
    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const diff = decodedToken.exp - currentTime - AUTH_TOKEN_EXPIRATION_TIME;
        const maxSecondsLeft = diff < AUTH_TOKEN_MAX_TIME ? diff : AUTH_TOKEN_MAX_TIME; 
        
        return maxSecondsLeft > 0 ? maxSecondsLeft : 0;
    } catch (error) {
        console.error('invalid token format', error);
        return 0
    }
}

export const isTokenExpired = () => {
    const token = getToken();
    return getTokenSecondsLeft(token) <= 0
}

export const removeToken = () => {
    Cookies.remove(AUTH_TOKEN_COOKIE, {
        domain: getDomainForCookies()
    })
}

export const saveToken = token => {
    Cookies.set(AUTH_TOKEN_COOKIE, token, {
        expires: 31,
        domain: getDomainForCookies()
    });
}

export const removeTokenIfExpired = () => {
    if (isTokenExpired()) {
        removeToken()
    }
}
