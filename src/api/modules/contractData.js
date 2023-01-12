import api from "../index";

export const getContractData = async (scoringId) => {
    return await api(`/user/scoring/${scoringId}`)
}

export const getUnauthorizedScoringInfo = async (scoringId) => {
    return await api(`/prescoring/front/${scoringId}`)
}

export const updateContractData = async (scoringId, data) => {
    return await api(`/user/scoring/${scoringId}/contract`, 'POST', data)
}
