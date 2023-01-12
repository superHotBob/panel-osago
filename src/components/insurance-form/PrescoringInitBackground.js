import React, {useContext, useEffect, useState} from "react";
import './calculation-progress-step.scss'
import api from "../../api";
import {
    selectOsagoWizardById, selectStep,
    setPrescoringErrorAction,
    setPrescoringIdAction,
    setPrescoringInfoAction,
} from "../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {cloneDeep} from "lodash";
import AppContext from "../../store/context";
import {getDrivingLicenseCategory} from "../../utils/crmDataValues";
import useWidgetId from "../../hooks/useWidgetId";
import {OSAGO_NUMBER_TYPE_VIN} from "../../constants/osago";
import {store} from "../../hoc/withStore";

export const PrescoringInitBackground = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {carNumber, carRegion, vin, numberType} = useSelector(selector)
    const {aggregateCrmData} = useContext(AppContext)

    const prepareResultFields = async (prescoringId) => {
        const fields =  await api(`/prescoring/front/fields/${prescoringId}`)
        const fieldsData = await fields.json();

        if (!fieldsData.isCompleted) {
            setTimeout(() => {
                prepareResultFields(prescoringId)
            }, 4000)
        } else {
            if (!!fieldsData.errorCode) {
                dispatchWidgetAction(setPrescoringErrorAction(fieldsData.errorCode))
            } else {
                const hasTrailer = fieldsData.info.bodyType === 'Седельный тягач' || fieldsData.info.bodyType === 'Седельный тягач с КМУ'

                const aggregatorData = cloneDeep({
                    ...fieldsData,
                    isCompleted: !!fieldsData.isFaulted ? 238 : 236
                })

                aggregatorData.info.bodyType = hasTrailer
                aggregatorData.info.drivingLicenseCategory = getDrivingLicenseCategory(fieldsData.info.drivingLicenseCategory)
                aggregatorData.kbc = 1
                aggregatorData.kbm = 1

                aggregateCrmData(aggregatorData)

                dispatchWidgetAction(setPrescoringInfoAction({...fieldsData.info, hasTrailer}))
            }
        }
    }

    const initPrescoring = async () => {
        const data = {}
        if (numberType === OSAGO_NUMBER_TYPE_VIN) {
            data.vin = vin
        } else {
            data.plates = `${carNumber}${carRegion}`
        }
        const res = await api('/prescoring/front/init', 'POST', data)

        const predictionData = await res.json();
        if (!predictionData.preScoringId) {
            return dispatchWidgetAction(setPrescoringErrorAction(predictionData.errorCode))
        }
        dispatchWidgetAction(setPrescoringIdAction(predictionData.preScoringId))

        await prepareResultFields(predictionData.preScoringId)
    }

    useEffect(() => {
        initPrescoring()
    }, [])

    return null;
}
