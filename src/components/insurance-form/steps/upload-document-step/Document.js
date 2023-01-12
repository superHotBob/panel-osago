import React from 'react';
import {OsagoDocs} from "../../../../constants/osago";
import OkSvg from "../../../../svg/ok.svg";
import ExclamationSvg from "../../../../svg/exclamation.svg";
import {FormGroup} from "../../../form-group/FormGroup";
import {ImageUpload} from "../../../image-upload/ImageUpload";

const Document = ({document}) => {
    const readonly =
        ([OsagoDocs.ownerPassportSide1, OsagoDocs.ownerPassportSide2].includes(document.id) &&
            insuredIsOwner)
    const icon = documents[document.id]?.completed ? <OkSvg/> : (errors[document.id]?.message ?
        <ExclamationSvg/> : null)
    getDocumentError(document)

    // hide error for loading fields
    const errorText = loading[`osagoUploadDoc${document.id}`] || documents[document.id]?.completed
        ? null
        : errors[document.id]?.message
    return (
        <FormGroup
            key={document.id}
            errorTextStyle={'style-2'}
            error={errorText}>
            <ImageUpload
                loading={isDocumentUploadOrValidationInProgress(document)}
                previewImage={documents[document.id]?.preview}
                placeholderImage={document.preview}
                onChange={(file, preview) => onFileAdded(document.id, file, preview)}
                readonly={readonly}
                icon={icon}
                error={errorText}
                onError={error => onFileAddError(document.blobId, error)}//TODO тут явно ошибка
                image={documents[document.id]?.file}>
                {document.title}
            </ImageUpload>
        </FormGroup>
    )
};

export default Document;
