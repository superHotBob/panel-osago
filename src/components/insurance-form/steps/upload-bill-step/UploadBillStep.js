import React, {useEffect, useState} from "react";
import './upload-bill-step.scss'
import {Button} from "../../../button/Button";
import {ImageUpload} from "../../../image-upload/ImageUpload";
import OkSvg from '../../../../svg/ok.svg'
import ExclamationSvg from '../../../../svg/exclamation.svg'
import {BemHelper} from "../../../../utils/class-helper";
import useWidgetId from "../../../../hooks/useWidgetId";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../../../redux/loadingReducer";
import {moveNext, selectOsagoWizardById,} from "../../../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {uploadPaymentOrderFile} from "../../../../api/modules/docs";
import billPreview from '../../../../assets/images/docs-preview/bill-preview.jpg'
import {FormGroup} from "../../../form-group/FormGroup";
import {trackEvent, TrackingEventName} from "../../../../modules/tracking";
import {Typography, TypographyColor, TypographyType, TypographyWeight} from "../../../typography/Typography";
import {getUnauthorizedScoringInfo} from "../../../../api/modules/contractData";

const INGOSTRAH = "ingostrah"
const UploadStates = {
    PREVIEW: "PREVIEW",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
}

const LOADING_ACTION = 'OSAGO_UPLOAD_BILL'
const ERROR_MESSAGE = 'Не верный формат'

export const UploadBillStep = () => {
    const classes = new BemHelper({name: 'upload-bill-step'});
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {scoringId, contractData} = useSelector(selector)
    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById)
    const loading = useSelector(selectorLoading)

    const [uploadState, setUploadState] = useState(UploadStates.PREVIEW);
    const [blobId, setBlobId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [errorText, setError] = useState(null);
    const [scoringInfo, setScoringInfo] = useState(null);

    let isDisabledButton = file == null

    const onFileAdded = async (file, preview) => {
        dispatchWidgetLoadingAction(startLoadingAction(LOADING_ACTION))
        try {
            await uploadPaymentOrderFile(file, scoringId)
            setPreviewImage(preview)
            setFile(file)
            trackEvent(TrackingEventName.SCREEN_PAYMENTPROOF_UPLOADED)
            dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
            setUploadState(UploadStates.SUCCESS)
        } catch (e) {
            setError(ERROR_MESSAGE)
            dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
            setUploadState(UploadStates.ERROR)
        }
    }

    const onSubmit = () => {
        trackEvent(TrackingEventName.SCREEN_PAYMENTPROOF_SUBMIT)
        dispatchWidgetAction(moveNext())
    }

    const getIcon = () => {
        switch (uploadState) {
            case UploadStates.SUCCESS:
                return <div {...classes('ok-svg')}><OkSvg/></div>
            case UploadStates.ERROR:
                return <ExclamationSvg/>
            default:
                return null
        }
    }

    const loadData = async () => {
        dispatchWidgetLoadingAction(startLoadingAction('loadContractDataConfirmPage'))
        try {
            const response = await getUnauthorizedScoringInfo(scoringId)
            const result = await response.json()
            setScoringInfo(result)
            dispatchWidgetLoadingAction(endLoadingAction('loadContractDataConfirmPage'))
        } catch (e) {
            console.error(e)
            dispatchWidgetLoadingAction(endLoadingAction('loadContractDataConfirmPage'))
        }
    }

    useEffect( () => {
        trackEvent(TrackingEventName.SCREEN_PAYMENTPROOF_LOADED)
        loadData();
    }, [])


    if (!scoringInfo) {
        return null;
    }

    return (
        <div>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.SUBHEAD} weight={TypographyWeight.BOLD}>
                    Транспортное средство для которого нужно оформить полис ОСАГО:
                </Typography>
            </div>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.CAPTION} weight={TypographyWeight.BOLD}>
                    Данные ТС
                </Typography>
            </div>
            <table className='upload-bill-step__table mustins-mb-16'>
                <tbody>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Госномер ТС
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.vehiclePlates}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            VIN номер
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.vehicleVin}
                        </Typography>
                    </td>
                </tr>
                </tbody>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Марка ТС
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.vehicleMake}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Модель ТС
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.vehicleModel}
                        </Typography>
                    </td>
                </tr>
            </table>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.CAPTION} weight={TypographyWeight.BOLD}>
                    Организация
                </Typography>
            </div>
            <table className='upload-bill-step__table mustins-mb-28'>
                <tbody>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            ИНН
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.legalEntityInn}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='upload-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Название
                        </Typography>
                    </td>
                    <td className='upload-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {scoringInfo.legalEntityTitle}
                        </Typography>
                    </td>
                </tr>
                </tbody>
            </table>
            <div {...classes('uploader')}>
                <FormGroup
                    errorTextStyle={'style-2'}
                    error={errorText}>
                    <ImageUpload
                        loading={loading[LOADING_ACTION]}
                        onChange={(file, preview) => onFileAdded(file, preview)}
                        readonly={false}
                        icon={getIcon()}
                        error={errorText}
                        placeholderImage={billPreview}
                        previewImage={previewImage}
                        image={file}
                    >
                        <b>Загрузи:</b> платёжное поручение с отметкой банка об исполнении или кассовый чек
                    </ImageUpload>
                </FormGroup>
            </div>

            <Button
                onClick={onSubmit}
                disabled={isDisabledButton}
            >
                Отправить
            </Button>
        </div>
    )
}

