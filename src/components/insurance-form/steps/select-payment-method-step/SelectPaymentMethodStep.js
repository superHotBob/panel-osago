import React, {useCallback, useContext, useEffect, useState} from 'react';
import Radio from "../../../radio";
import {Button} from "../../../button/Button";
import {PAYMENT_TYPE_BILL, PAYMENT_TYPE_CARD} from "../../../../constants/osago";
import useWidgetId from "../../../../hooks/useWidgetId";
import {
    moveNext,
    selectOsagoWizardById,
    setPaymentInvoiceDownloadKeyAction,
    setPaymentLinkAction,
    setPaymentTypeAction
} from "../../../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../../../redux/loadingReducer";
import createGetPaymentLinkApiPost from "../../../../api/requests/createGetPaymentLinkApiPost";
import {getContractData} from "../../../../api/modules/contractData";
import {useInterval} from "../../../../hooks/useInterval";
import {noop} from "lodash/util";
import createGetPaymentInvoiceApiPost from "../../../../api/requests/createGetPaymentInvoiceApiPost";
import AppContext from "../../../../store/context";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../../../modules/tracking";
import api from "../../../../api";
import {Typography, TypographyColor, TypographyType} from '../../../typography/Typography';

const paymentTypes = [
    {
        val: PAYMENT_TYPE_CARD, name: 'payment', label: <div>
            <div>Оплата картой</div>
            <div><Typography type={TypographyType.CAPTION}
                             color={TypographyColor.MUST_800}>
                можно картой физического лица
            </Typography>
            </div>
        </div>
    },
    {val: PAYMENT_TYPE_BILL, name: 'payment', label: 'Оплата по счету'}
];

const DELAY = 1000
const LOADING_ACTION = 'AWAIT_PAYMENT_LINK'

let request = null;

const SelectPaymentMethodStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById)
    const {paymentType, scoringId, insuranceCompany} = useSelector(selector)
    const [delay, setDelay] = useState(null)
    const [moved, setMoved] = useState(false);
    const [linkOrInvoiceGenerationStarted, setLinkOrInvoiceGenerationStarted] = useState(false);
    const loading = useSelector(selectorLoading)
    const {widgetId} = useContext(AppContext);

    const onSelectPaymentType = useCallback(newPaymentType => () => {
        trackEvent(TrackingEventName.SCREEN_PAYMENTMETHOD_SELECTED, {
            type: newPaymentType === PAYMENT_TYPE_CARD ? 'card' : 'invoice'
        })
        dispatchWidgetAction(setPaymentTypeAction(newPaymentType))
    }, [paymentType])

    const processMoveNext = (isSuccess = true) => {
        if (!moved) {
            dispatchWidgetAction(moveNext({paymentType, isSuccess}))
            setMoved(true);
        }
    }

    const createPaymentLinkOrInvoice = async () => {
        switch (paymentType) {
            case PAYMENT_TYPE_CARD: {
                await createGetPaymentLinkApiPost(scoringId, {insuranceCompany})
                break
            }

            case PAYMENT_TYPE_BILL: {
                await createGetPaymentInvoiceApiPost(scoringId, {insuranceCompany})
                break
            }

            default:
                noop()
        }
    }

    const pollScoringResults = useCallback(async () => {
        try {
            if (request) {
                return;
            }
            request = getContractData(scoringId);
            const response = await request;
            const {
                isPaymentUrlGenerated,
                isPaymentInvoiceGenerated,
                paymentInvoiceDownloadKey,
                errorCode,
                scoringResults,
                isAgreementCreated,
                paymentLink,
                isScoringCompleted
            } = await response.json()

            if (isScoringCompleted && isAgreementCreated && !linkOrInvoiceGenerationStarted) {
                setLinkOrInvoiceGenerationStarted(true);
                await createPaymentLinkOrInvoice();
            }

            if (errorCode) {
                processMoveNext(false);
                setDelay(null)
                dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
            }

            if (isPaymentUrlGenerated) {
                dispatchWidgetAction(setPaymentLinkAction(paymentLink))
                processMoveNext();
                setDelay(null)
                dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
            }

            if (isPaymentInvoiceGenerated && scoringResults.length) {
                setDelay(null)
                dispatchWidgetAction(setPaymentInvoiceDownloadKeyAction(paymentInvoiceDownloadKey))
                dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
                processMoveNext();
            }
            request = null;
        } catch (e) {
            console.error(e)
            setDelay(null)
            dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
            request = null;
        }
    }, [setDelay, paymentType, moved, linkOrInvoiceGenerationStarted])

    useInterval(pollScoringResults, delay)

    const submitPaymentType = useCallback(async () => {
        trackEvent(TrackingEventName.SCREEN_PAYMENTMETHOD_SUBMIT);
        if (paymentType === PAYMENT_TYPE_BILL) {
            createGetPaymentInvoiceApiPost(scoringId, {insuranceCompany});
            processMoveNext();
        } else if (paymentType === PAYMENT_TYPE_CARD) {
            createGetPaymentLinkApiPost(scoringId, {insuranceCompany})
            processMoveNext();
        } else {
            dispatchWidgetLoadingAction(startLoadingAction(LOADING_ACTION))
            setDelay(DELAY)
        }
    }, [paymentType, scoringId, pollScoringResults])

    useEffect(() => {
        trackEvent(TrackingEventName.SCREEN_PAYMENTMETHOD_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_8_PAYMENT_METHOD)
        api(`/user/scoring/${scoringId}/stage`, 'POST', {
            stage: 'userSelectingPaymentType'
        })
    }, [])


    return (
        <>
            <div className="mustins-radio-group">
                {paymentTypes.map(({val, name, label}) => {
                    return (
                        <Radio label={label}
                               name={name}
                               key={val}
                               disabled={loading[LOADING_ACTION]}
                               checked={val === paymentType}
                               onChange={onSelectPaymentType(val)}/>
                    )
                })}
            </div>
            <div>
                <Button
                    buttonType='upper'
                    disabled={!paymentType}
                    loading={loading[LOADING_ACTION]}
                    onClick={submitPaymentType}>
                    Оплатить
                </Button>
            </div>
        </>
    );
};

export default SelectPaymentMethodStep;
