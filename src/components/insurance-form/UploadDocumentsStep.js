import React, {Fragment, useCallback, useEffect, useState} from "react";
import find from 'lodash/find';
import {useDispatch, useSelector} from "react-redux";
import {
    moveNext,
    selectOsagoWizardById,
    setDocsTabAction,
    setDocsTreeAction,
    setDocumentAction,
    setFormDataAction,
    setInsuredIsOwnerAction
} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";
import {BemHelper, className} from "../../utils/class-helper";

import './upload-documents-step.scss'
import {Checkbox} from "../checkbox/Checkbox";
import DefaultSelect from "../select";
import {Button} from "../button/Button";
import {ImageUpload} from "../image-upload/ImageUpload";
import ExclamationSvg from '../../svg/exclamation.svg'
import OkSvg from '../../svg/ok.svg'

import {DRIVER_COUNT_OPTIONS, OsagoDocs, OsagoDocsData} from "../../constants/osago";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../redux/loadingReducer";
import {FormGroup} from "../form-group/FormGroup";
import {saveDocs, uploadFile, validateDocs} from "../../api/modules/docs";
import {Tabs} from "../tabs/Tabs";
import {Tab} from "../tabs/Tab";
import {useInterval} from "../../hooks/useInterval";
import {omit} from "lodash/object";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../modules/tracking";
import useEffectWithSkipDidMount from "../../hooks/useEffectWithSkipDidMount";
import api from "../../api";
import {filter, keyBy} from "lodash";

export const UploadDocumentsStep = () => {
    const classes = new BemHelper({name: 'upload-documents-step'});
    const {dispatchWidgetAction, selector, widgetId} = useWidgetId(selectOsagoWizardById)
    const dispatch = useDispatch()

    const {
        documents,
        insuredIsOwner,
        role,
        scoringId,
        formData,
        docsTree,
        vehicleDocumentTypeTab,
        vin,
        carNumber,
        carRegion,
    } = useSelector(selector)

    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById);
    const loading = useSelector(selectorLoading);

    const rootRef = React.useRef(null);

    const [validationResult, setValidationResult] = useState({errors: [], completed: [], clientErrors: []});
    const [submitted, setSubmitted] = useState(false);
    const [validationInterval, setValidationInterval] = useState(2000);


    const errorTypes = {
        unknown: 'Попробуй загрузить другой файл',
        required: 'Загрузи файл документа',
        invalidFile: 'Неверный формат файла',
        invalidContent: 'Загруженный файл не является документом',
        incorrectVin: `Загрузи верный ${vehicleDocumentTypeTab === OsagoDocs.sts ? 'СТС' : 'ПТС'} для ${vin || `${carNumber}${carRegion}`}`,
    }

    const getDocumentError = (document, topParentTypeId) => {
        const {errors, completed, clientErrors} = validationResult
        const errorsDictionary = keyBy(errors, 'typeId')
        const completedDictionary = keyBy(completed, 'typeId')
        const clientErrorsDictionary = keyBy(clientErrors, 'typeId')

        const clientError = clientErrorsDictionary[document.id]
        if (clientError) return clientError

        const mostNestedError = errorsDictionary[document.id]
            || errorsDictionary[document.parentTypeId]
            || errorsDictionary[topParentTypeId]

        const isCompleted = completedDictionary[document.id]
        if (isCompleted) return null

        if (mostNestedError) {
            if (mostNestedError.errorType === 'required' && !submitted) return null
            return ({
                blobId: mostNestedError.blobId,
                message: errorTypes[mostNestedError.errorType],
                errorType: mostNestedError.errorType,
            })
        }
        return null
    }

    // drop documents that don't match active tab
    const filterDocumentsByActiveTab = useCallback(async () => {
        let newDocuments = {}
        if (vehicleDocumentTypeTab[1] === OsagoDocs.sts) {
            newDocuments = omit(documents, [OsagoDocs.ptsSide1, OsagoDocs.ptsSide2])
        }

        if (vehicleDocumentTypeTab[1] === OsagoDocs.pts) {
            newDocuments = omit(documents, [OsagoDocs.stsSide1, OsagoDocs.stsSide2])
        }

        await saveDocs(scoringId, newDocuments)
    }, [documents, vehicleDocumentTypeTab, scoringId])

    // server validation
    const validateForm = async () => {
        try {
            const result = await validateDocs(scoringId)

            const isValid = !result.data.errors.length

            // if document is still in upload process, wait while it will be completed
            if (loading.osagoUploadDoc) {
                return isValid
            }

            setValidationResult(mergeValidationResult(result.data));

            // setDocumentsCompleted(result.completed)
            // setDocumentErrors(result, submittedValue)

            return isValid
        } catch (e) {
            return false
        }
    }

    const mergeValidationResult = (newValidationResult) => (prevValidationResult) => {
        return ({
            ...prevValidationResult,
            completed: newValidationResult.completed,
            errors: newValidationResult.errors,
        })
    }

    const onFileAddError = (docId, errorText) => {
        if (errorText) {
            setValidationResult(prevResult => ({
                ...prevResult,
                clientErrors: [
                    ...prevResult.clientErrors,
                    {
                        typeId: docId,
                        message: errorText,
                        errorType: 'unknown',
                    }
                ]
            }))
        }
    }

    const onFileAdded = async (id, file, preview) => {
        dispatchWidgetLoadingAction(startLoadingAction(`osagoUploadDoc${id}`))

        // remove client errors on this document
        setValidationResult(prevResult => ({
            ...prevResult,
            clientErrors: filter(prevResult.clientErrors, error => error.typeId !== id)
        }))

        // upload file to server and save it to redux
        try {
            const response = await uploadFile(file)
            const {blobId} = await response.json()

            const newDocs = {...documents}

            const document = {
                id,
                file,
                blobId,
                preview,
                completed: false
            }

            dispatchWidgetAction(setDocumentAction(document))
            newDocs[document.id] = document

            // sync insured and owner passport files`osagoUploadDoc${id}`
            if (insuredIsOwner && [OsagoDocs.insuredPassportSide1, OsagoDocs.insuredPassportSide2].includes(id)) {
                const documentCopy = {
                    ...document,
                    id: id === OsagoDocs.insuredPassportSide1 ? OsagoDocs.ownerPassportSide1 : OsagoDocs.ownerPassportSide2
                }
                dispatchWidgetAction(setDocumentAction(documentCopy))
                newDocs[documentCopy.id] = documentCopy
            }

            await saveDocs(scoringId, newDocs)
            dispatchWidgetLoadingAction(endLoadingAction(`osagoUploadDoc${id}`));
        } catch (e) {
            console.log(e)
            dispatchWidgetLoadingAction(endLoadingAction(`osagoUploadDoc${id}`))
            setValidationResult(prevResult => ({
                ...prevResult,
                clientErrors: [
                    ...prevResult.clientErrors,
                    {
                        typeId: id,
                        message: errorTypes.unknown,
                        errorType: 'unknown',
                    }
                ]
            }))
        }
    }

    const changeInsuredIsOwner = async () => {
        const newValue = !insuredIsOwner
        dispatchWidgetAction(setInsuredIsOwnerAction(newValue))

        if (!newValue) {
            return
        }

        const passportDocs = [
            documents[OsagoDocs.insuredPassportSide1],
            documents[OsagoDocs.insuredPassportSide2]
        ]

        dispatchWidgetLoadingAction(startLoadingAction('osagoGetDocsForUpload'))
        await saveDocs(scoringId, {
            ...documents,
            [OsagoDocs.ownerPassportSide1]: documents[OsagoDocs.insuredPassportSide1],
            [OsagoDocs.ownerPassportSide2]: documents[OsagoDocs.insuredPassportSide2],
        })
        await validateForm()
        dispatchWidgetLoadingAction(endLoadingAction('osagoGetDocsForUpload'))

        passportDocs.forEach((document, index) => {
            dispatchWidgetAction(setDocumentAction({
                ...document,
                id: OsagoDocs[`ownerPassportSide${index + 1}`]
            }))
        })
    }

    const onDriversCountChange = selectedOption => {
        dispatchWidgetAction(setFormDataAction({driverNumber: selectedOption}))
    }

    const onTabChange = (id, tab) => {
        dispatchWidgetAction(setDocsTabAction({[id]: tab}))
    }

    const onTabClick = (id, tab) => {
    }

    useEffectWithSkipDidMount(() => {
        (async () => {
            dispatchWidgetLoadingAction(startLoadingAction('osagoGetDocsForUpload'))
            await dispatch(setDocsTreeAction(widgetId))
            dispatchWidgetLoadingAction(endLoadingAction('osagoGetDocsForUpload'))
        })()
    }, [vehicleDocumentTypeTab, formData?.driverNumber?.value])


    const pollForValidForOwnerDocs = async () => {
        const result = await validateDocs(scoringId)
        if (
            insuredIsOwner
            && result.data.errors.find(e => e.typeId === OsagoDocs.ownerSection) && result.data.errors.length === 1
            && documents[OsagoDocs.ownerPassportSide1] && documents[OsagoDocs.ownerPassportSide2]
        ) {
            await pollForValidForOwnerDocs()
        }
    }

    const onSubmit = async () => {
        setSubmitted(true)

        dispatchWidgetLoadingAction(startLoadingAction('osagoValidateDocs'))
        await filterDocumentsByActiveTab()
        await pollForValidForOwnerDocs()
        const isValid = await validateForm()
        dispatchWidgetLoadingAction(endLoadingAction('osagoValidateDocs'))

        if (isValid) {
            dispatchWidgetAction(moveNext({role}))
        } else {
            const firstError = rootRef.current.querySelector('.mustins-form-group--error')
            firstError && firstError.closest('.mustins-modal__root').scrollTo(0, firstError.offsetTop)
        }
    }

    // RENDER FUNCTIONS

    const isDocumentUploadOrValidationInProgress = (document) => {
        if (loading[`osagoUploadDoc${document.id}`]) {
            return true
        }

        const documentData = documents[document.id];

        if (!documentData || !documentData.blobId) {
            return false;
        }

        return !find(validationResult.completed, c => c.blob.blobId === documentData.blobId) &&
            !find(validationResult.errors, e => e.blobId === documentData.blobId);
    }

    const renderDocument = (document, topParentTypeId) => {
        const readonly =
            ([OsagoDocs.ownerPassportSide1, OsagoDocs.ownerPassportSide2].includes(document.id) &&
                insuredIsOwner)
        const {completed} = validationResult;
        const completedDictionary = keyBy(completed, 'typeId');
        const error = getDocumentError(document, topParentTypeId);

        const icon = completedDictionary[document.id]
            ? <div {...classes('ok-icon')}>
                <OkSvg/>
            </div>
            : (
                error
                    ? <ExclamationSvg/>
                    : null
            )

        // hide error for loading fields
        /*const errorText = loading[`osagoUploadDoc${document.id}`] || documents[document.id]?.completed
            ? null
            : errors[document.id]?.message*/

        const errorMessage = !isDocumentUploadOrValidationInProgress(document) && error?.message

        return (
            <FormGroup
                key={document.id}
                errorTextStyle={'style-2'}
                error={errorMessage}>
                <ImageUpload
                    loading={isDocumentUploadOrValidationInProgress(document)}
                    previewImage={documents[document.id]?.preview}
                    placeholderImage={document.preview}
                    onChange={(file, preview) => onFileAdded(document.id, file, preview)}
                    readonly={readonly}
                    icon={icon}
                    error={errorMessage}
                    onError={errorText => onFileAddError(document.id, errorText)}
                    image={documents[document.id]?.file}>
                    {document.title}
                </ImageUpload>
            </FormGroup>
        )
    }

    const getBlockCode = (block, children) => {
        let controls = null
        if (block.id === OsagoDocs.ownerPassport) {
            const {completed} = validationResult
            const disabled = !find(completed, {typeId: OsagoDocs.insuredPassportSide1})
                || !find(completed, {typeId: OsagoDocs.insuredPassportSide2})

            controls = (
                <Checkbox
                    label={'Страхователь является Владельцем транспортного средства'}
                    labelAsFootnote={true}
                    boldLabel
                    color='black'
                    disabled={disabled}
                    disabledStyle={true}
                    checked={insuredIsOwner}
                    onChange={changeInsuredIsOwner}/>
            )
        }
        if (block.id === OsagoDocs.driverLicenseFake) {
            controls = (
                <div {...classes('driver-license-select')}>
                    <FormGroup label='Количество водителей'>
                        <DefaultSelect
                            selectedOption={formData?.driverNumber}
                            onChange={onDriversCountChange}
                            options={DRIVER_COUNT_OPTIONS}/>
                    </FormGroup>
                </div>
            )
        }
        return (
            <div {...classes('block')} key={block.id}>
                <div {...classes('title')}>{block.title}</div>
                {controls}
                {children}
            </div>
        )
    }

    const renderBlock = block => getBlockCode(
        block,
        block.children.map(document => renderDocument(document, block.parentTypeId))
    )

    const renderGroup = group => {
        // for single field like diagnostic card
        if (!group.parentTypeId &&
            group.children.length === 1 &&
            !group.children[0].children.length) {
            return renderBlock(group)
        }

        if (group.view === 'tabs') {
            return getBlockCode(group, (
                <Tabs
                    skipInitialCallback
                    style='style-2'
                    active={vehicleDocumentTypeTab[group.id]}
                    onTabChange={tab => onTabChange(group.id, tab)}
                    onTabClick={tab => onTabClick(group.id, tab)}
                >
                    {[
                        <Tab key={OsagoDocs.sts} tabKey={OsagoDocs.sts} title={OsagoDocsData[OsagoDocs.sts].title}>
                            {group.children.map(block => block.children.map(document => renderDocument(document, block.parentTypeId)))}
                        </Tab>,
                        <Tab key={OsagoDocs.pts} tabKey={OsagoDocs.pts} title={OsagoDocsData[OsagoDocs.pts].title}>
                            {group.children.map(block => block.children.map(document => renderDocument(document, block.parentTypeId)))}
                        </Tab>
                    ]}
                </Tabs>
            ))
        }

        // if group is drivers render it as one block
        if (OsagoDocs.driverLicenseFake === group.id) {
            let driverLicenses = []
            group.children.forEach(block => driverLicenses.push(...block.children))
            return getBlockCode(group, driverLicenses.map(document => renderDocument(document, group.parentTypeId)))
        }

        return group.children.map(block => renderBlock(block, group.parentTypeId))
    }

    useInterval(() => {
        const wrap = async () => {
            if (loading.osagoUploadDoc || loading.osagoValidateDocsInterval) {
                return
            }
            dispatchWidgetLoadingAction(startLoadingAction('osagoValidateDocsInterval'))
            await validateForm(submitted)

            dispatchWidgetLoadingAction(endLoadingAction('osagoValidateDocsInterval'))
        }
        wrap()
    }, validationInterval)

    useEffect(() => {
        trackPartnerEvent(PartnerEventName.STEP_6_DOCUMENTS)
        api(`/user/scoring/${scoringId}/stage`, 'POST', {
            stage: 'userUploadDocuments'
        })

        //TODO Зачем нам нужен этот код?
        return () => setValidationInterval(null)
    }, [])

    return (
        <Fragment>
            <div {...classes()} ref={rootRef}>
                {docsTree.map(group => renderGroup(group))}
            </div>
            <div {...className('mustins-form-row-submit')}>
                <Button onClick={onSubmit} loading={loading.osagoValidateDocs}>
                    ОТПРАВИТЬ ДОКУМЕНТЫ
                </Button>
            </div>
        </Fragment>
    )
}

