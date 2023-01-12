import api from "api";
import {saveSentTime, removeSentTime} from "modules/sms";

export function initPrediction(number, region, email) {
    return api(
        '/prediction/init',
        'POST',
        {plates: `${number}${region}`, email},
    )
}


export function getPredictionStatus(predictionId) {
    return api(`/prediction/status/${predictionId}`, 'GET')
}

export async function initOtp(phone) {
    const response = await api('/auth/otp/', 'POST', {phone})

    if (response.status === 200) {
        saveSentTime(phone.replace('+7', ''))
    }

    return response
}


export async function login(phone, otpState, otp) {
    const response = await api('/auth/login/jwt', 'POST', {phone, otpState, otp})

    if (response.status === 200) {
        removeSentTime(phone.replace('+7', ''))
    }

    return response
}

export function apply(predictionId, name) {
    return api('/prediction/apply', 'POST', {predictionId, name})
}

export function getUserInfo() {
    return api('/profile', 'GET');
}

export function changeUserData(firstName, lastName, email) {
    return api(
        '/profile',
        'POST',
        {firstName, lastName, email}
    );
}

export function profileLogout() {
    return api('/auth/logout', 'POST');
}
