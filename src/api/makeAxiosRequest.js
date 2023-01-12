import axiosInstance from "./axiosInstance";

const makeAxiosRequest = async (method, url, data, responseType) => await axiosInstance({
    method,
    url,
    data,
    responseType,
})

export default makeAxiosRequest
