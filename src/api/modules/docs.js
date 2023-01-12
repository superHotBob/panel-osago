import api from "../index";
import axiosInstance from "../axiosInstance";

export const uploadFile = async file => {
    var formData = new FormData();
    formData.append('Blob', file);

    return await api('/user/blob', 'POST', formData)
}

export const classifyFiles = async (blobIds) => {
    return await api('/user/blob/classify', 'POST', {blobIds})
}

export const uploadPaymentOrderFile = async (file, scoringId) => {
    var formData = new FormData();
    formData.append('Blob', file);

    return await api(`/prescoring/front/${scoringId}/payment-order`, 'POST', formData)
}

export const getDocTypes = async ({scoringId, driverCount, vehicleDocumentType}) => {
    return await api(`/user/scoring/${scoringId}/documents/types-required`, 'POST', {
        driverCount: driverCount === 'no-restriction' ? null : driverCount,
        vehicleDocumentType,
        isRestricted: true
    })
}

export const validateDocs = async (scoringId, cancelToken) => {
    return await axiosInstance.post(`/api/user/scoring/${scoringId}/documents/validate`, undefined, {
        cancelToken
    })
}

export const saveDocs = async (scoringId, documents) => {
    let json = {documents: []}
    for (let id in documents) {
        if (!documents[id].blobId) {
            continue
        }
        json.documents.push({
            typeId: parseInt(id),
            num: 1,
            blob: {blobId: documents[id].blobId, name: documents[id].blobId}
        })
    }
    return await api(`/user/scoring/${scoringId}/documents`, 'POST', json)
}

export const saveBill = async (scoringId, data) => {
    return await api(`/user/scoring/${scoringId}/payment-order`, 'POST', data)
}
