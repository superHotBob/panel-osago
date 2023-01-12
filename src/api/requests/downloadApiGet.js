import makeAxiosRequest from "../makeAxiosRequest";

const downloadApiGet = async downloadKey => await makeAxiosRequest(
    'GET',
    `/download?key=${downloadKey}`,
    null,
    'arraybuffer'
)

export default downloadApiGet
