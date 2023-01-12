import api, { serializeParams } from "../api";
import {getTokenSecondsLeft, removeToken, removeUser, saveToken, saveUser} from "../modules/auth";
import {saveSentTime} from "../modules/sms";
import {sendCookiesToBackEnd} from "../api/modules/auth";
import { FREE_VEHICLES_LIMITATION } from "../constants/auth";

export const REQUEST_TOKEN_SUCCESS = 'REQUEST_TOKEN_SUCCESS'
export const REQUEST_TOKEN_ERROR = 'REQUEST_TOKEN_ERROR'

var tokenTimeout = null;

const AuthActionType = {
    SET_TOKEN: 'SET_TOKEN',
    SET_MAIN_USER_INFO: 'SET_MAIN_USER_INFO',
    SET_USER: 'SET_USER',
    SET_HISTORY_CARDS: 'SET_HISTORY_CARDS',
    SET_UTM: 'SET_UTM',
    LOGOUT: 'LOGOUT',
    REQUEST_SMS_CODE_SUCCESS: 'REQUEST_SMS_CODE_SUCCESS',
    REQUEST_SMS_CODE_ERROR: 'REQUEST_SMS_CODE_ERROR',
    SET_OTP_STATE: 'SET_OTP_STATE',
    SET_ERROR_CODE: 'SET_ERROR_CODE',
}


export function setHistoryCardsAction(historyCards) {
    return {type: AuthActionType.SET_HISTORY_CARDS, payload: {historyCards}}
}

export function setUtmAction(utm) {
    return {type: AuthActionType.SET_UTM, payload: {utm}}
}

export function setOtpStateAction(otpState) {
    return {type: AuthActionType.SET_OTP_STATE, payload: {otpState}}
}

export function setErrorCodeAction(errorCode) {
    return {type: AuthActionType.SET_ERROR_CODE, payload: {errorCode}}
}

export const setAuthUserAction = user => dispatch => {
    saveUser(user)

    return dispatch({type: AuthActionType.SET_USER, payload: {user}});
}

export const setMainUserInfoAction = data => dispatch => {
    saveUser(data.user)

    return dispatch({type: AuthActionType.SET_MAIN_USER_INFO, payload: data});
}

export const removeUserAction = () => dispatch => {
    return dispatch({type: AuthActionType.LOGOUT});
}

export const setAuthTokenAction =  (token, initial, check = false, callback) => dispatch => {
    if (!token) {
        return;
    }
    const tokenSecondsLeft = getTokenSecondsLeft(token);
    if (tokenSecondsLeft) {
        saveToken(token);
        tokenTimeout = setTimeout(
            () => dispatch(logoutAction()),
            tokenSecondsLeft * 1000
        )
        dispatch({type: AuthActionType.SET_TOKEN, payload: {token}});
        if (!initial) {
            sendCookiesToBackEnd();
        }
        return dispatch(getAuthInfo());
    } else {
        return dispatch(logoutAction());
    }
}

export const logoutAction = () => dispatch => {
    removeToken()
    removeUser()
    dispatch(removeUserAction())

    if (tokenTimeout) {
        clearTimeout(tokenTimeout);
        tokenTimeout = null
    }
}


export const sendSmsCodeAction = phoneNumber => {
    return async dispatch => {

        dispatch({
            type: AuthActionType.REQUEST_SMS_CODE_ERROR,
            payload: null,
        })

        const response = await api('/auth/otp/', 'POST', {phone: `+7${phoneNumber}`})
        if (response.status === 200) {
            saveSentTime(phoneNumber.replace('+7', ''))
        }

        const data = await response.json()

        if (data.errorCode) {
            return dispatch({
                type: AuthActionType.REQUEST_SMS_CODE_ERROR,
                payload: data.errorCode
            })
        }

        const {otpState} = data
        return dispatch({
            type: AuthActionType.REQUEST_SMS_CODE_SUCCESS,
            payload: {otpState, errorCode: null}
        })
    }
}

export const updateProfileAction = (profileData) => async (dispatch, getState) => {
    await api('/profile', 'POST', profileData);
    const currentUser = selectAuthUser(getState())
    dispatch(setAuthUserAction({...currentUser, ...profileData}));
}

export const profileSignAction = (phoneNumber, context, contextDetails) => {
    return async dispatch => {

        dispatch({
            type: AuthActionType.REQUEST_SMS_CODE_ERROR,
            payload: null,
        })

        const response = await api('/profile/sign/', 'POST', {context, contextDetails})
        if (response.status === 200) {
            saveSentTime(phoneNumber.replace('+7', ''))
        }

        const data = await response.json()

        if (data.errorCode) {
            return dispatch({
                type: AuthActionType.REQUEST_SMS_CODE_ERROR,
                payload: data.errorCode
            })
        }

        const {otpState} = data
        return dispatch({
            type: AuthActionType.REQUEST_SMS_CODE_SUCCESS,
            payload: {otpState, errorCode: null}
        })
    }
}

export const login = (phone, otpState, otp) => {
    return async dispatch => {
        const response = await api('/auth/login/jwt', 'POST', {phone, otpState, otp})
        const data = await response.json()

        if (data.errorCode) {
            removeToken()
            return dispatch({
                type: REQUEST_TOKEN_ERROR,
                errorCode: data.errorCode
            })
        }

        saveToken(data.token)
        return dispatch({
            type: REQUEST_TOKEN_SUCCESS,
            token: data.token
        })
    }
}
export const isProfileInfoValid = async token => {
    const additionalHeaders = token ? {
        Authorization: `Bearer ${token}`
    } : null;

    const response = await api('/profile', 'GET', null, additionalHeaders);
    const data = await response.json();

    if (!data || data.errorCode) {
        return {
            isValid: false,
            info: null
        };
    } else {
        const {
            firstName,
            lastName,
            patronymic,
            email,
        } = data;

        return {
            isValid: !!(firstName && lastName && patronymic && email),
            info: data
        };
    }
}


export const getProfileRes = async () => {
    const response = await api('/profile', 'GET');
    return await response.json();
}

export const getProfileSubscriptionRes = async () => {
    const response = await api('/subscription', 'GET');
    return await response.json();
}

export const getProfileUniqVehiclesRes = async () => {
    const params = serializeParams({
        isGrouped: true
    });
    const response = await api(`/profile/history/v2${params}`, 'GET');
    return await response.json();
}

export const getAuthInfo = () => {
    return async dispatch => {
        const [
            user,
            subscriptions,
            vehicles
        ] = await Promise.all([
            getProfileRes(),
            getProfileSubscriptionRes(),
            getProfileUniqVehiclesRes()
        ]);

        if (
            !user && !subscriptions && !vehicles ||
            user.errorCode ||
            subscriptions.errorCode ||
            vehicles.errorCode
        ) {
            dispatch(logoutAction());
        } else {
            dispatch(setMainUserInfoAction({
                user,
                subscriptions,
                vehicles
            }));
        }
    }

}

export const getProfile = () => {
    return async dispatch => {
        const response = await api('/profile', 'GET');
        const data = await response.json()

        if (!data || data.errorCode) {
            dispatch(logoutAction());
        } else {
            dispatch(setAuthUserAction(data));
        }
    }
}

export const reduceAuth = (state = {
    token: null,
    user: null,
    isLoggedIn: false,
    utm: null,
    errorCode: null,
    errorText: '',
    otpState: null,
    subscriptions: null,
    vehicles: null
}, action) => {
    switch (action.type) {
        case AuthActionType.SET_MAIN_USER_INFO:
            return {
                ...state,
                user: action.payload.user,
                subscriptions: action.payload.subscriptions,
                vehicles: action.payload.vehicles,
                isLoggedIn: true
            }
        case AuthActionType.SET_USER:
            return {
                ...state,
                user: action.payload.user,
                isLoggedIn: true
            }
        case AuthActionType.SET_TOKEN:
            return {
                ...state,
                token: action.payload.token,
                isLoggedIn: true
            }
        case AuthActionType.SET_HISTORY_CARDS:
            return {
                ...state,
                historyCards: action.payload.historyCards
            }
        case AuthActionType.SET_UTM:
            return {
                ...state,
                utm: action.payload.utm
            }
        case AuthActionType.LOGOUT:
            return {
                ...state,
                token: null,
                user: null,
                isLoggedIn: false
            }
        case AuthActionType.REQUEST_SMS_CODE_SUCCESS:
            return {
                ...state,
                errorCode: action.payload.errorCode,
                otpState: action.payload.otpState,
            }
        case AuthActionType.REQUEST_SMS_CODE_ERROR:
            return {
                ...state,
                errorCode: action.payload,
            }
        case AuthActionType.SET_OTP_STATE:
            return {
                ...state,
                otpState: action.payload.otpState,
            }

        case AuthActionType.SET_ERROR_CODE:
            return {
                ...state,
                errorCode: action.payload.errorCode,
            }

        default:
            return state
    }
}

export function selectAuth(state) {
    return state.Auth;
}

export function selectAuthToken(state) {
    return selectAuth(state).token;
}

export function selectAuthUser(state) {
    return selectAuth(state).user;
}

export function selectAuthUserVehicleLimitIsReached(state) {
    const hasActiveSubscription = selectAuth(state).subscriptions?.hasActiveSubscription;
    const totalCount = selectAuth(state).vehicles?.totalCount;

    if (!selectAuthUser(state)) {
        return false;
    }

    if (!totalCount) {
        return false;
    }

    return hasActiveSubscription ? false : totalCount >= FREE_VEHICLES_LIMITATION;
}

export function selectAuthIsLoggedIn(state) {
    return selectAuth(state).isLoggedIn;
}

export function selectAuthHistoryCards(state) {
    return selectAuth(state).historyCards;
}

export function selectAuthUtm(state) {
    return selectAuth(state).utm;
}
