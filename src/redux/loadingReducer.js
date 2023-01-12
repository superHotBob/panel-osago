import {selectByWidgetId} from "./widgetIdHelper";
import {REDUCER_TYPE_LOADING} from "./reducers";

const actionType = {
    START_LOADING: 'START_LOADING',
    END_LOADING: 'END_LOADING',
}

export function startLoadingAction(type) {
    return {type: actionType.START_LOADING, payload: type}
}

export function endLoadingAction(type) {
    return {type: actionType.END_LOADING, payload: type}
}

export const reduceLoading = (state = {}, {type, payload}) => {
    const widgetId = payload ? payload.widgetId : null;

    switch (type) {
        case actionType.START_LOADING:
            if (widgetId) {
                return {
                    ...state,
                    [widgetId]: {
                        ...state[widgetId],
                        [payload.data]: true
                    }
                }
            }
            return {
                ...state,
                [payload]: true
            }
        case actionType.END_LOADING:
            if (widgetId) {
                return {
                    ...state,
                    [widgetId]: {
                        ...state[widgetId],
                        [payload.data]: false
                    }
                }
            }
            return {
                ...state,
                [payload]: false
            }
        default:
            return state
    }
}

export const selectLoading = state => state[REDUCER_TYPE_LOADING]
export const selectLoadingById = widgetId => selectByWidgetId(widgetId, REDUCER_TYPE_LOADING)
