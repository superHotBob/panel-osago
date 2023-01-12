export const initialApiState = {
    data: null,
    isLoading: false,
    isLoadingError: false,
    loaded: false,
    errorCode: null,
}

export const buildReducer = () => {
    const makeSimpleAction = (type, payload) => ({ type, payload })

    const TYPES = {
        SET_INITIAL_STATE: 'API/SET_INITIAL_STATE',
        SET_DATA: 'API/SET_DATA',
        SET_IS_LOADING: 'API/SET_IS_LOADING',
        SET_IS_LOADING_ERROR: 'API/SET_IS_LOADING_ERROR',
        SET_ERROR_CODE: 'API/SET_ERROR_CODE',
        CLEAR: 'API/CLEAR',
    }

    const setInitialStateAction = payload => makeSimpleAction(TYPES.SET_INITIAL_STATE, payload)
    const setDataAction = payload => makeSimpleAction(TYPES.SET_DATA, payload)
    const setIsLoadingAction = payload => makeSimpleAction(TYPES.SET_IS_LOADING, payload)
    const setIsLoadingErrorAction = payload => makeSimpleAction(TYPES.SET_IS_LOADING_ERROR, payload)
    const setErrorCodeAction = payload => makeSimpleAction(TYPES.SET_ERROR_CODE, payload)
    const clearAction = (payload) => makeSimpleAction(TYPES.CLEAR, payload)

    const loadAction = (api, key) => async dispatch => {
        dispatch(clearAction({key}))
        dispatch(setIsLoadingAction({key, data: true}))
        let result
        try {
            result = await api()
            dispatch(setDataAction({key, data: result.data}))
            dispatch(setIsLoadingErrorAction({key, data: false}))
        } catch(e) {
            console.error(e)
            result = e.data
            dispatch(setIsLoadingErrorAction({key, data: true}))
            dispatch(setErrorCodeAction({key, data: e.data?.errorCode}))
        }
        dispatch(setIsLoadingAction({key, data: false}))

        return result
    }

    const actions = {
        setDataAction,
        setIsLoadingAction,
        setIsLoadingErrorAction,
        clearAction,
        loadAction,
        setInitialStateAction,
    }

    const reducer = (state = {}, action) => {
        if (!action) return state
        const {type, payload} = action


        let data, key
        if (payload) {
            data = payload.data
            key = payload.key
        }

        return (({
            [TYPES.SET_DATA]: (state) => ({
                ...state,
                [key]: {
                    ...state[key],
                    isLoading: false,
                    data,
                    loaded: true,
                }
            }),
            [TYPES.SET_IS_LOADING]: (state) => ({
                ...state,
                [key]: {
                    ...state[key],
                    isLoading: data,
                }
            }),
            [TYPES.SET_IS_LOADING_ERROR]: (state) => ({
                ...state,
                [key]: {
                    ...state[key],
                    isLoadingError: data,
                }
            }),
            /*[TYPES.SET_ERROR_CODE]: (state) => ({
                ...state,
                [widgetId]: {
                    ...state[widgetId],
                    [key]: {
                        ...state[widgetId][key],
                        isLoadingError: true,
                        errorCode: data,
                    }
                }
            }),*/
            [TYPES.CLEAR]: state => ({
                ...state,
                [key]: initialApiState,
            }),
        })[type] || (x => x))(state, action)
    }

    return {
        TYPES,
        actions,
        reducer,
        makeSimpleAction,
    }
}
