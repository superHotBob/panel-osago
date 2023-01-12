import {batch} from 'react-redux';
import {selectOsagoWizardById, setContractDataAction} from "../../redux/osagoWizardReducer";
import {getContractDataValue} from "./contract-fields-map";
import {dispatchWithWidgetId} from "../../redux/widgetIdHelper";

export const fillContractDataAction = (widgetId, contract, fieldsAuc) => (dispatch, getState) => {
    const { contractData } = selectOsagoWizardById(widgetId)(getState());
     batch(() => {
        for (let field of Object.values(contractData)) {
            const value = getContractDataValue(contract, field.name)
            if (value !== undefined) {
                dispatch(dispatchWithWidgetId(widgetId, setContractDataAction({field: field.name, data: {value}})));
            }
            let shouldConfirm = !field.hide && field.editable && fieldsAuc.find(f => f.key === field.name)?.shouldConfirm && !!value
            dispatch(dispatchWithWidgetId(widgetId, setContractDataAction({field: field.name, data: {shouldConfirm}})));
        }
     })
}
