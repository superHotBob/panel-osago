import {combineReducers} from 'redux'
import {reduceAuth} from './authReducer'
import {reduceRoot} from './rootReducer'
import {reduceOsagoWizard} from "./osagoWizardReducer";
import {reduceLoading} from './loadingReducer'
import {
    REDUCER_TYPE_ACCIDENT_FLOW,
    REDUCER_TYPE_ACCIDENT_HISTORY_PAGE,
    REDUCER_TYPE_API,
    REDUCER_TYPE_AUTH,
    REDUCER_TYPE_LOADING,
    REDUCER_TYPE_OSAGO_WIZARD,
    REDUCER_TYPE_ROOT
} from "./reducers";
import {apiReducer} from "./apiReducer";
import {reduceAccidentHistoryPage} from "../pages/accident-prediction/accident-history/AccidentHistoryPageModel";
import {reduceAccidentFlow} from '../pages/accident-prediction/components/accident-flow/AccidentFlowModel';


export default combineReducers({
    [REDUCER_TYPE_AUTH]: reduceAuth,
    [REDUCER_TYPE_ROOT]: reduceRoot,
    [REDUCER_TYPE_LOADING]: reduceLoading,
    [REDUCER_TYPE_OSAGO_WIZARD]: reduceOsagoWizard,
    [REDUCER_TYPE_API]: apiReducer.reducer,
    [REDUCER_TYPE_ACCIDENT_HISTORY_PAGE]: reduceAccidentHistoryPage,
    [REDUCER_TYPE_ACCIDENT_FLOW]: reduceAccidentFlow,
})


