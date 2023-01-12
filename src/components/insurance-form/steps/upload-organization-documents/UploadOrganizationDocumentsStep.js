import React, {useEffect, useState} from "react";
import map from 'lodash/map';
import find from 'lodash/find';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import './upload-organization-documents.scss'
import StsPtsExampleImage from '../../../../assets/images/docs-preview/sts-pts-example.jpg'
import {ImageUpload} from "../../../image-upload/ImageUpload";
import {BemHelper, className} from "../../../../utils/class-helper";
import {Button} from "../../../button/Button";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../../../redux/loadingReducer";
import useWidgetId from "../../../../hooks/useWidgetId";
import {useSelector} from "react-redux";
import {classifyFiles, getDocTypes, uploadFile, validateDocs} from "../../../../api/modules/docs";
import {moveNext, selectOsagoWizardById} from "../../../../redux/osagoWizardReducer";
import {Typography, TypographyType} from "../../../typography/Typography";
import {UploadedDocument} from "./components/uploaded-document/UploadedDocument";
import {UploadDocumentProgress} from "./components/upload-document-progress/UploadDocumentProgress";
import api from "../../../../api";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../../../modules/tracking";
import {OsagoDocs} from "../../../../constants/osago";

const classes = new BemHelper({name: 'upload-organization-documents'});

const LOADING_ACTION = 'osagoUploadOrganizationDoc';

export const UploadOrganizationDocumentsStep = () => {

    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById);
    const loading = useSelector(selectorLoading);
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {vin, scoringId} = useSelector(selector);
    const [vehiclePassports, setVehiclePassports] = useState(null);
    const [registrationCertificates, setRegistrationCertificates] = useState(null);
    const [blobIds, setBlobIds] = useState([]);
    const [newFilesCount, setNewFilesCount] = useState(0);
    const vehiclePassport = find(vehiclePassports, {vin});
    const registrationCertificate = find(registrationCertificates, {vin}) || find(registrationCertificates, certificate => !certificate.vin);

    const hasFullRegistrationCertificate = size(registrationCertificate && uniqBy(registrationCertificate.files, file => file.typeId)) >= 2;
    const hasEnoughDocuments = vehiclePassport || hasFullRegistrationCertificate;

    const uploadFileAndReturnBlobId = async (file) => {
        const response = await uploadFile(file)
        const {blobId} = await response.json();
        return blobId;
    }

    const handleFilesAdded = async (files) => {
        setNewFilesCount(size(files));
        dispatchWidgetLoadingAction(startLoadingAction(LOADING_ACTION))
        const newBlobIds = await Promise.all(map(files, uploadFileAndReturnBlobId));
        const allBlobIds = [...blobIds, ...newBlobIds];
        const response = await classifyFiles(allBlobIds);
        const {registrationCertificates, vehiclePassports} = await response.json();
        setRegistrationCertificates(registrationCertificates);
        setVehiclePassports(vehiclePassports);
        dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION));
        setBlobIds(allBlobIds);
    }

    const onSubmit = async () => {
        dispatchWidgetAction(moveNext())
        await getDocTypes({
            scoringId,
            driverCount: null,
            vehicleDocumentType: hasFullRegistrationCertificate ? 'registrationCertificate' : 'vehiclePassport'
        })
        let json = {documents: []}
        if (hasFullRegistrationCertificate) {
            const firstPage = find(registrationCertificate.files, file => file.typeId === 111);
            const secondPage = find(registrationCertificate.files, file => file.typeId === 112);
            json.documents.push({
                typeId: 111,
                num: 1,
                blob: {blobId: firstPage.blobId, name: firstPage.blobId}
            })
            json.documents.push({
                typeId: 112,
                num: 1,
                blob: {blobId: secondPage.blobId, name: secondPage.blobId}
            })
        } else {
            json.documents.push({
                typeId: 121,
                num: 1,
                blob: {blobId: vehiclePassport.files[0].blobId, name: vehiclePassport.files[0].blobId}
            })
        }
        await api(`/user/scoring/${scoringId}/documents`, 'POST', json)
        validateDocs(scoringId);
    }

    useEffect(() => {
        trackPartnerEvent(PartnerEventName.STEP_6_DOCUMENTS)
        return () => {
            dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
        }
    }, [])

    const renderDocuments = () => {
        if (isEmpty(blobIds)) {
            return null;
        } else if (hasFullRegistrationCertificate) {
            const text = registrationCertificate.plates || registrationCertificate.vin;
            return (
                <div {...className('mb-40')}>
                    <UploadedDocument title="СТС сторона 1" text={text}/>
                    <UploadedDocument title="СТС сторона 2" text={text}/>
                </div>
            )
        } else if (vehiclePassport) {
            return (
                <div {...className('mb-40')}>
                    <UploadedDocument title="ПТС" text={vehiclePassport.vin}/>
                </div>
            )

        } else if (registrationCertificate) {
            const hasFirstPage = !!find(registrationCertificate.files, file => file.typeId === 111);
            const text = registrationCertificate.plates || registrationCertificate.vin;
            return (
                <div {...className('mb-40')}>
                    <UploadedDocument title="СТС сторона 1" text={text} error={!hasFirstPage}/>
                    <UploadedDocument title="СТС сторона 2" text={text} error={hasFirstPage}/>
                </div>
            )
        } else {
            return (
                <div {...className('mb-40')}>
                    <UploadedDocument title={`В загруженных файлах документы ТС ${vin} не найдены`} text={''} error={true}/>
                </div>
            )
        }
    }

    return (
        <>
            <div {...className('mb-24')}>
                <Typography type={TypographyType.SUBHEAD}>Документы для ТС</Typography>
            </div>
            {renderDocuments()}
            {loading[LOADING_ACTION] &&
            <div{...className('mb-40')}>
                <UploadDocumentProgress filesCount={newFilesCount}/>
            </div>}
            <div {...classes('file')}>
                <ImageUpload
                    loading={loading[LOADING_ACTION]}
                    multiple={true}
                    actionText="Загрузить еще"
                    onChange={handleFilesAdded}
                    placeholderImage={StsPtsExampleImage}
                    readonly={false}
                >
                    {isEmpty(blobIds) ? <span>Загрузи сразу все копии или фото СТС <br/>
                    и\или ПТС для одного или нескольких
                    своих Грузовиков</span> : <span>Загрузи недостающие копии или фото <br/>
СТС и\или ПТС для своих Грузовиков</span>}

                </ImageUpload>
            </div>
            <div {...className('mt-40')}>
                <Button onClick={onSubmit}
                        loading={false}
                        disabled={!hasEnoughDocuments}>
                    Отправить документы
                </Button>
            </div>
        </>
    )
}
