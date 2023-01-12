import makeAxiosRequest from "../makeAxiosRequest";

/**
 *
 * @param scoringId
 * @param model {{phone: string, email: string}}
 * @returns {Promise<*>}
 */
const sendBillApiPost = async (scoringId, model) => await makeAxiosRequest(
    'POST',
    `/api/user/scoring/${scoringId}/payment-invoice/send`,
    model,
)

export default sendBillApiPost
