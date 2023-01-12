import {apiReducer} from "../../redux/apiReducer";
import createLeadPhoneApiPost from "../../api/requests/createLeadPhoneApiPost";
import {prepareApiKey} from "../../redux/widgetIdHelper";

export const createLeadPhoneApiPostKey = 'createLeadPhoneApiPostKey'

export const leadPhoneAction = widgetId => model => async dispatch => {
    const result = await dispatch(
        apiReducer.actions.loadAction(createLeadPhoneApiPost(model),
        prepareApiKey(createLeadPhoneApiPostKey, widgetId))
    )
    return !result.errorCode
}
