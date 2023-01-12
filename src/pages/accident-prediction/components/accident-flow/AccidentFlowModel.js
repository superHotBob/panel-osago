import React from 'react';
import {AccidentFlowInitial} from './steps/accident-flow-initial/AccidentFlowInitial';
import {AccidentFlowClassification} from './steps/accident-flow-classification/AccidentFlowClassification';
import {AccidentFlowProfile} from './steps/accident-flow-profile/AccidentFlowProfile';
import {AccidentFlowSms} from './steps/accident-flow-sms/AccidentFlowSms';
import {AccidentFlowFinish} from './steps/accident-flow-finish/AccidentFlowFinish';
import {REDUCER_TYPE_ACCIDENT_FLOW, REDUCER_TYPE_ACCIDENT_HISTORY_PAGE} from '../../../../redux/reducers';
import indexOf from 'lodash/indexOf';
import {selectAuthUser, setAuthUserAction} from '../../../../redux/authReducer';
import {AccidentFlowFilled} from './steps/accident-flow-filled/AccidentFlowFilled';
import api from '../../../../api';

export const AccidentFlowStep = {
    INITIAL: 'INITIAL',
    CLASSIFICATION: 'CLASSIFICATION',
    PROFILE: 'PROFILE',
    SMS: 'SMS',
    FINISH: 'FINISH',
    FILLED: 'FILLED',
}

const accidentFlowStepsOrder = [
    AccidentFlowStep.INITIAL,
    AccidentFlowStep.CLASSIFICATION,
    AccidentFlowStep.PROFILE,
    AccidentFlowStep.SMS,
    AccidentFlowStep.FINISH
]


export const AccidentFlowStepDescription = {
    [AccidentFlowStep.INITIAL]: {
        title:
            <span>Зарегистрируйся, чтбы получить<br/>неограниченный доступ к сервису<br/> оценки  Вероятности ДТП</span>,
        Component: AccidentFlowInitial
    },
    [AccidentFlowStep.CLASSIFICATION]: {
        title: <span>Привет, я Штурман,<br/> твой электронный помощник.<br/> Выбери подходящий вариант</span>,
        Component: AccidentFlowClassification
    },
    [AccidentFlowStep.PROFILE]: {
        title: <span>Зарегистрируйся и получи доступ<br/> в личный кабинет, чтобы Cнизить <br/>Аварийность для своего автопарка</span>,
        Component: AccidentFlowProfile
    },
    [AccidentFlowStep.SMS]: {
        title: <span>Введи код из СМС, чтобы подтвердить <br/>данные твоего личного кабинета</span>,
        Component: AccidentFlowSms
    },
    [AccidentFlowStep.FINISH]: {
        title: <span>Благодарю за твое время, <br/>я уже оформляю доступ<br/> в личный кабинет</span>,
        Component: AccidentFlowFinish
    },
    [AccidentFlowStep.FILLED]: {
        title: <span>Ты уже зарегистрировал личный<br/>кабинет и получаешь рекомендации <br/> по снижению аварийности на email </span>,
        Component: AccidentFlowFilled
    }
}

const AccidentFlowTypeAction = {
    SET_STEP: 'AccidentFlow.SET_STEP',
    SET_CLIENT_TYPE: 'AccidentFlow.SET_CLIENT_TYPE',
    SET_PROFILE_DATA: 'AccidentFlow.SET_PROFILE_DATA',
    SET_LOADING: 'AccidentFlow.SET_LOADING',
    SET_PREDICTION_ID: 'AccidentFlow.SET_PREDICTION_ID',
}

export const setStepAction = (step) => ({
    type: AccidentFlowTypeAction.SET_STEP,
    payload: {step}
});

export const setPredictionIdAction = (predictionId) => ({
    type: AccidentFlowTypeAction.SET_PREDICTION_ID,
    payload: {predictionId}
});

export const setClientTypeAction = (clientType) => ({
    type: AccidentFlowTypeAction.SET_CLIENT_TYPE,
    payload: {clientType}
});

export const setLoadingAction = (loading) => ({
    type: AccidentFlowTypeAction.SET_LOADING,
    payload: {loading}
});

export const setProfileDataAction = (profileData) => ({
    type: AccidentFlowTypeAction.SET_PROFILE_DATA,
    payload: {profileData}
});

export const startAccidentFlowAction = (predictionId, skipInitial) => (dispatch, getState) => {
    const user = selectAuthUser(getState())
    let step = skipInitial ? AccidentFlowStep.CLASSIFICATION : AccidentFlowStep.INITIAL
    dispatch(setPredictionIdAction(predictionId))
    dispatch(setProfileDataAction({
        ...user,
        phone: user.phone.slice(2)
    }));
    if (user.bornOn) {
        step = AccidentFlowStep.FILLED
    }
    dispatch(setStepAction(step));
    dispatch(setClientTypeAction(null));
}

export const goToNextStepAction = () => (dispatch, getState) => {
    const step = selectStep(getState());
    const currentStepIndex = indexOf(accidentFlowStepsOrder, step);
    const nextStep = accidentFlowStepsOrder[currentStepIndex + 1];
    dispatch(setStepAction(nextStep));
}

export const sendProfileAction = () => (dispatch, getState) => {
    const profileData = selectProfileData(getState());
    api('/profile', 'POST', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        patronymic: profileData.patronymic,
        email: profileData.email,
        bornOn: profileData.birthdate,
    })
    api('/profile/authorize-personal-data-processing', 'POST', {
        isConfirmed: true
    });
    api('/profile/confirm-terms-of-service', 'POST', {
        isConfirmed: true
    });
    dispatch(setAuthUserAction({
        ...profileData,
        bornOn: profileData.birthdate
    }))
}

export const sendClientTypeAction = () => (dispatch, getState) => {
    const predictionId = selectPredictionId(getState())
    const userType = selectClientType(getState())
    api(`/prediction/${predictionId}/user-type`, 'POST', {userType})
}

export function reduceAccidentFlow(state = {
    profileData: {}
}, {type, payload}) {
    switch (type) {

        case AccidentFlowTypeAction.SET_STEP:
            state = {...state};
            state.step = payload.step
            break;

        case AccidentFlowTypeAction.SET_CLIENT_TYPE:
            state = {...state};
            state.clientType = payload.clientType
            break;

        case AccidentFlowTypeAction.SET_PROFILE_DATA:
            state = {...state};
            state.profileData = payload.profileData
            break;

        case AccidentFlowTypeAction.SET_LOADING:
            state = {...state};
            state.loading = payload.loading
            break;

        case AccidentFlowTypeAction.SET_PREDICTION_ID:
            state = {...state};
            state.predictionId = payload.predictionId
            break;

    }

    return state;
}

export const selectAccidentFlow = (state) => state[REDUCER_TYPE_ACCIDENT_FLOW];

export const selectStep = (state) => selectAccidentFlow(state).step;

export const selectClientType = (state) => selectAccidentFlow(state).clientType;

export const selectProfileData = (state) => selectAccidentFlow(state).profileData;

export const selectLoading = (state) => selectAccidentFlow(state).loading;

export const selectPredictionId = (state) => selectAccidentFlow(state).predictionId;