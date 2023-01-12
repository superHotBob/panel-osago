import React from "react";
import {useSelector} from "react-redux";
import useWidgetId from "../hooks/useWidgetId";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../redux/loadingReducer";

export const withWidgetId = Component => props => {
    const [dispatchWidgetLoadingAction, loadingSelector] = useWidgetId(selectLoadingById)
    const loading = useSelector(loadingSelector)

    const startLoading = type => dispatchWidgetLoadingAction(startLoadingAction(type))
    const endLoading = type => dispatchWidgetLoadingAction(endLoadingAction(type))

    return (
        <Component
            {...props}
            loading={loading}
            endLoading={endLoading}
            startLoading={startLoading}/>
    )
}
