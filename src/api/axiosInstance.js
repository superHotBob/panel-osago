import axios from 'axios'
import {getToken, isLoggedIn, isTokenExpired, removeToken} from "../modules/auth";
import {getDomainForCookies} from "../utils/getDomainForCookies";
import {getApiBaseUrl} from "./index";

const config = {
    baseURL: getApiBaseUrl(),
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
        }

const axiosInstance = axios.create(config)

axiosInstance.interceptors.request.use(config => {
    if (isTokenExpired()) removeToken()

    if (isLoggedIn()) config.headers['Authorization'] = `Bearer ${getToken()}`

    return config
})

axiosInstance.interceptors.response
    .use(
        response => response,
        error => {
            if (error.response.status === 401 || error.response.status === 403) {
                removeToken()
            }
            console.debug(error)
            return Promise.reject(error.response)
        })

export default axiosInstance
