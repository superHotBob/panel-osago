import makeAxiosRequest from "../makeAxiosRequest";

const createGetPaymentInvoiceApiPost = async (scoringId, model) => await makeAxiosRequest(
    'POST',
    `/api/user/scoring/${scoringId}/payment-invoice`,
    model)

export default createGetPaymentInvoiceApiPost
