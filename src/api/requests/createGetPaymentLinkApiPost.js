import makeAxiosRequest from "../makeAxiosRequest";

const createGetPaymentLinkApiPost = async (scoringId, model) => await makeAxiosRequest('POST', `/api/user/scoring/${scoringId}/payment-link`, model)

export default createGetPaymentLinkApiPost
