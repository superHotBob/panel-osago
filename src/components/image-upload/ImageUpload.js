import React, {useEffect, useRef, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Document, Page, pdfjs} from 'react-pdf';
import PdfPreview from '../../svg/pdf.svg'
import './image-upload.scss'
import {BemHelper} from "../../utils/class-helper";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const ImageUpload = ({
                                placeholderImage = null,
                                previewImage = null,
                                children = null,
                                onChange,
                                image,
                                icon = null,
                                error = null,
                                actionText = '',
                                onError = () => {
                                },
                                readonly = false,
                                loading = false,
                                multiple = false
                            }) => {
    const classes = new BemHelper({name: 'image-upload'});
    const [extension, setExtension] = useState(null)
    const [pdfPreview, setPdfPreview] = useState(null)
    const [pdfFile, setPdfFile] = useState(null)
    const [showPdfCommonPreview, setShowPdfCommonPreview] = useState(false)
    const ref = useRef();
    const pdfPreviewRef = useRef(null);
    pdfPreviewRef.current = pdfPreview;

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({
        accept: '.png,.jpg,.jpeg,.bmp,.pdf',
        multiple,
        disabled: readonly || loading,
        onDropRejected: (files) => {
            onError('Загрузите фото в нужном формате')
        },
        onDropAccepted: acceptedFiles => {
            onError(null)

            const fileExtension = acceptedFiles[0].path.split('.').pop();
            setExtension(fileExtension)

            let preview = null
            if (fileExtension !== 'pdf') {
                preview = URL.createObjectURL(acceptedFiles[0])
            }
            onChange(multiple ? acceptedFiles : acceptedFiles[0], preview);
        }
    });

    const handlePdfLoaded = () => {
        const image = ref.current.getElementsByTagName('canvas')[0].toDataURL("image/png");
        setPdfPreview(image);
    }

    const placeholder = () => {
        if (isDragActive) {
            return null
        }

        if (image) {
            if (!previewImage || extension === 'pdf') {
                if (showPdfCommonPreview) {
                    return <PdfPreview {...classes('preview')}/>
                }
                return <img src={pdfPreview} {...classes('preview')}/>
            }
            return <img src={previewImage} {...classes('preview')}/>
        }
        return <img src={placeholderImage} {...classes('preview')}/>
    }

    useEffect(() => {
        if (!image) {
            return
        }
        const fileExtension = image?.path.split('.').pop();
        setExtension(fileExtension)
        setPdfPreview(null);
        setShowPdfCommonPreview(false);
        setPdfFile(URL.createObjectURL(image));
        const pdfTimer = setTimeout(() => {
            if (!pdfPreviewRef.current) {
                setShowPdfCommonPreview(true);
            }
        }, 5000);
        return  () => clearTimeout(pdfTimer);
    }, [image])

    const classModifiers = [
        isDragActive ? 'active' : '',
        readonly ? 'readonly' : '',
        image ? 'uploaded' : '',
        loading || image && !previewImage && !pdfPreview && !showPdfCommonPreview ? 'loading' : '',
        isDragReject || error ? 'rejected' : ''
    ]
    const buttonText = actionText ? actionText : (!image ? 'Загрузить фото' : (readonly ? 'Фото загружено' : 'Изменить фото'))

    return (
        <div {...classes('wrap')} ref={ref}>
            <div {...classes('label')}>{children}</div>
            <div {...getRootProps(classes(null, classModifiers))}>
                {icon && <div {...classes('icon')}>{icon}</div>}
                <input {...getInputProps()} />
                <div {...classes('placeholder')}>
                    {placeholder()}
                </div>
                <button type="button" {...classes('button')}>
                    {buttonText}
                </button>
            </div>
            {image && extension === 'pdf' && pdfFile &&
            <div {...classes('pdf-preview')}>
                <Document
                    file={pdfFile}>
                    <Page pageNumber={1} onRenderSuccess={handlePdfLoaded}/>
                </Document>
            </div>
            }
        </div>
    );
}
