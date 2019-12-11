import axiosService from '../commons/axiosService'

import {API_URL} from '../constants'

const API = 'api'
const VERSION = 'v1'
const OBJECT ='customers'

export const getListCustomer = (query)=>{
    return axiosService.get(`${API_URL}/${API}/${VERSION}/${OBJECT}?currentPage=${query.currentPage}&pageSize=${query.pageSize}`)
}

export const findCustomer = (searchText)=>{
    return axiosService.get(`${API_URL}/${API}/${VERSION}/${OBJECT}/search?q=${searchText}`)
}

export const createCustomer=(payload)=>{
    return axiosService.post(`${API_URL}/${API}/${VERSION}/${OBJECT}`, payload)
}

export const updateCustomer=(payload)=>{
    return axiosService.put(`${API_URL}/${API}/${VERSION}/${OBJECT}`, payload)
}

export const deleteCustomer=(payload)=>{
    return axiosService.delete(`${API_URL}/${API}/${VERSION}/${OBJECT}/${payload.id}`)
}