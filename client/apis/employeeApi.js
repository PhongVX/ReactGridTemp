import axiosService from '../commons/axiosService'

import {API_URL} from '../constants'


const url ='employees'
const urlDelete = 'deleteEmployee'

export const getListEmployee = ()=>{
    return axiosService.get(`${API_URL}/${url}`)
}

export const createEmployee=(payload)=>{
    return axiosService.post(`${API_URL}/${url}`, payload)
}

export const deleteEmployee=(payload)=>{
    return axiosService.delete(`${API_URL}/${urlDelete}`, payload)
}