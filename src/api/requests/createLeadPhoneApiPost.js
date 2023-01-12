import makeAxiosRequest from "../makeAxiosRequest";

const createLeadPhoneApiPost = model => async () => await makeAxiosRequest('POST', '/api/lead/request/call', model)

export default createLeadPhoneApiPost
