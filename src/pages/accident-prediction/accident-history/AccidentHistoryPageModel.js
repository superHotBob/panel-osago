import { REDUCER_TYPE_ACCIDENT_HISTORY_PAGE } from "../../../redux/reducers";
import api from "../../../api";
import map from 'lodash/map';
import first from 'lodash/first';

const AccidentHistoryPageType = {
    SET_HISTORY_CARDS: 'AccidentHistoryPageType.SET_HISTORY_CARDS',
    SET_PREDICTION_ID: 'AccidentHistoryPageType.SET_PREDICTION_ID',
    SET_TOTAL_COUNT: 'AccidentHistoryPageType.SET_TOTAL_COUNT',
    GET_PLANS: 'AccidentHistoryPageType.GET_PLANS'
}

let count = 0;

export const setHistoryCardsAction = (historyCards) => ({
    type: AccidentHistoryPageType.SET_HISTORY_CARDS,
    payload: { historyCards }
});

export const setHistoryTotalCountAction = (totalCount) => ({
    type: AccidentHistoryPageType.SET_TOTAL_COUNT,
    payload: { totalCount }
});

export const setPredictionIdAction = (predictionId) => ({
    type: AccidentHistoryPageType.SET_PREDICTION_ID,
    payload: { predictionId }
});

export const setPlansAction = (plans) => ({
    type: AccidentHistoryPageType.GET_PLANS,
    payload: { plans }
});

export const getPlans = () => async (dispatch, getState) => {
    const response = await api(`/subscription/plans`);

    if(response.status === 200) {
        const responseJson = await response.json();
        dispatch(setPlansAction(responseJson))
    }
}

export const loadHistoryCardsAction = (page, sizes, group, clear = false, setLoadingFunc) => async (dispatch, getState) => {
    if(clear) {
        console.log("clear historyy")
        // dispatch(setHistoryCardsAction([]));
    }

    const response = await api(`/profile/history/v2?page=${page}&pageSize=${sizes}&isGrouped=${group}`);
    const responseV1 = await api('/profile/history');

    if (response.status === 200) {
        const responseJson = await response.json();
        dispatch(setHistoryCardsAction(map(responseJson.history, h => h.info)));
        count = responseJson.totalCount
        dispatch(setHistoryTotalCountAction(responseJson.totalCount));
        setLoadingFunc && setLoadingFunc(false)
    }

    if (responseV1.status === 200) {
        const responseV1Json = await responseV1.json();

        const res = first(responseV1Json.history, {});
        res && dispatch(setPredictionIdAction(res.id));
        setLoadingFunc && setLoadingFunc(false)
    }


}

export function reduceAccidentHistoryPage(state = {}, { type, payload }) {
    switch (type) {
        case AccidentHistoryPageType.SET_HISTORY_CARDS:
            return {
                ...state,
                historyCards: payload.historyCards
            }

        case AccidentHistoryPageType.SET_PREDICTION_ID:
            return {
                ...state,
                predictionId: payload.predictionId
            }

        case AccidentHistoryPageType.SET_TOTAL_COUNT:
            return {
                ...state,
                totalCount: payload.totalCount
            }

        case AccidentHistoryPageType.GET_PLANS:
            return {
                ...state,
                plans: payload.plans.plans
            }
    }

    return state;
}

export const selectAccidentHistoryPage = (state) => state[REDUCER_TYPE_ACCIDENT_HISTORY_PAGE]

export const selectHistoryCards = (state) => selectAccidentHistoryPage(state).historyCards

export const selectHistoryCount = (state) => count // selectAccidentHistoryPage(state).totalCount

export const selectPredictionId = (state) => selectAccidentHistoryPage(state).predictionId

export const selectPlans = (state) => selectAccidentHistoryPage(state).plans
