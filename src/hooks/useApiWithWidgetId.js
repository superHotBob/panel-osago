import {useContext} from "react";
import AppContext from "../store/context";

const useApiWithWidgetId = (action) => {
    const {widgetId} = useContext(AppContext)
    return action(widgetId)
}

export default useApiWithWidgetId
