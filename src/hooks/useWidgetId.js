import {useDispatch} from "react-redux";
import {useContext} from "react";
import AppContext from "../store/context";
import {dispatchWithWidgetId} from "../redux/widgetIdHelper";

const useWidgetId = selector => {
    const dispatch = useDispatch()
    const {widgetId} = useContext(AppContext)

    return Object.assign([
        action => dispatch(dispatchWithWidgetId(widgetId, action)),
        selector(widgetId),
        widgetId,
    ], {
        dispatchWidgetAction: action => dispatch(dispatchWithWidgetId(widgetId, action)),
        selector: selector(widgetId),
        widgetId,
    })
}

export default useWidgetId
