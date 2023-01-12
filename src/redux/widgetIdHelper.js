export const selectByWidgetId = (widgetId, reducer) => state => state[reducer][widgetId] || {}

export const dispatchWithWidgetId = (widgetId, action, apiStringKey = '') => (dispatch, getState) => {
    if (typeof action === 'function') {
        try {
            return dispatch(action(widgetId, dispatch, getState, apiStringKey))
        } catch (e) {
            console.warn('An empty action type was received:', action)
        }
        return
    }

    if (!action || !action.type) {
        console.warn('An empty action type was received:', action)
        return
    }

    return dispatch({
        type: action.type,
        payload: {
            data: action.payload,
            widgetId,
            key: apiStringKey,
        }
    })
}

export const prepareApiKey = (key, widgetId) => {
    return widgetId ? `${key}/${widgetId}` : key
}
