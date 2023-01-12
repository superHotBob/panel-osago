import api from "../index";
import {removeSentTime, saveSentTime} from "../../modules/sms";
import Cookies from "js-cookie";
import {HELP_TYPE_OPERATOR} from '../../constants/osago';

export const sendSmsCode = async phone => {
    const response = await api('/auth/otp/', 'POST', {phone})

    if (response.status === 200) {
        saveSentTime(phone.replace('+7', ''))
    }

    return response
}

export const sendCookiesToBackEnd = () => {
    api('/user/cookies', 'POST', {cookies: document.cookie})
}

const getGaClientId = () => {
    try {
        const gaCookie = Cookies.get('_ga');
        return gaCookie ? gaCookie.split('.').splice(2).join('.') : ''
    } catch(e) {
        return ''
    }
}

const getCounterIdGoogle = () => {
    try {
        return ga.getAll()[0].get('trackingId').toString();
    } catch(e) {
        return ''
    }
}

const getYandexClientId = () => {
    try{
        return Cookies.get('_ym_uid');
    }catch (e) {
        return ''
    }
}

const getYandexCounterId = () => {
    try {
        return Ya.Metrika.counters()[0].id.toString();
    } catch (e) {
        try {
            return Ya.Metrika2.counters()[0].id.toString();
        } catch(e) {
            return ''
        }
    }

}

export const userScoringIdentification = scoringId => {
    const gaCookie = Cookies.get('_ga');
    const gaClientId = gaCookie ? gaCookie.split('.').splice(2).join('.') : ''
    api(`/user/scoring/${scoringId}/identification`, 'POST', {
        clientIdFirebase: getGaClientId(),
        clientIdYandex: getYandexClientId(),
        counterIdYandex: getYandexCounterId(),
        clientIdGoogle: getGaClientId(),
        counterIdGoogle: getCounterIdGoogle()
    })
}

export const callOperator = (scoringId, helpType) => {
    if (helpType === HELP_TYPE_OPERATOR) {
        api(`/user/scoring/${scoringId}/operator/call`, 'POST')
    }
}

export const login = async (phone, otpState, otp) => {
    const response = await api('/auth/login/jwt', 'POST', {phone, otpState, otp})

    if (response.status === 200) {
        removeSentTime(phone.replace('+7', ''))
    }

    return response
}
