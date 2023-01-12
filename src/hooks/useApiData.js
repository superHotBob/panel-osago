import {useSelector} from "react-redux";
import {useContext} from "react";
import AppContext from "../store/context";
import {REDUCER_TYPE_API} from "../redux/reducers";
import {prepareApiKey} from "../redux/widgetIdHelper";

const useApiData = (key) => {
    const {widgetId} = useContext(AppContext)
    const resultKey = prepareApiKey(key, widgetId)
    return useSelector(state => state[REDUCER_TYPE_API][resultKey]) || {}
}

export default useApiData
