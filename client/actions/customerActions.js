import * as customerApi from '../apis/customerApi'
import * as customerConstants from '../constants/customerConstants'

export const fetchListCustomer= ()=>{
    return{
        type: customerConstants.FETCH_CUSTOMER
    }
}

export const fetchListCustomerSuccess = (data)=>{
    return{
        type: customerConstants.FETCH_CUSTOMER_SUCCESS,
        payload:{
            data
        }
    }
}

export const fetchListCustomerFailed = (error)=>{
    return{
        type: customerConstants.FETCH_CUSTOMER_FAILED,
        payload:{
            error
        }
    }
}

export const fetchListCustomerRequest = (query)=>{
    return dispatch =>{
        dispatch(fetchListCustomer())
        customerApi
        .getListCustomer(query)
        .then(resp=>{
            const {data} = resp
            dispatch(fetchListCustomerSuccess(data))
        }).catch(error=>{
            console.log(error)
            dispatch(fetchListCustomerFailed(error))
        })
    }
}

export const findCustomerRequest = (query)=>{
    return dispatch =>{
        dispatch(fetchListCustomer())
        customerApi
        .findCustomer(query)
        .then(resp=>{
            const {data} = resp
            dispatch(fetchListCustomerSuccess(data))
        }).catch(error=>{
            console.log(error)
            dispatch(fetchListCustomerFailed(error))
        })
    }
}

export const createCustomerRequest = (payload) =>{
    return dispatch =>{
        customerApi
        .createCustomer(payload)
        .then(resp=>{
            dispatch(fetchListCustomerRequest())
        }).catch(error=>{
            console.log(error)
        })
    } 
}

export const updateCustomerRequest = (payload)=>{
    return dispatch =>{
        customerApi
        .updateCustomer(payload)
        .then(resp=>{
            dispatch(fetchListCustomerRequest())
        }).catch(error=>{
            console.log(error)
        })
    } 
}

export const deleteCustomerRequest = (id) =>{
    return dispatch =>{
        customerApi
        .deleteCustomer({"id":id})
        .then(resp=>{
            dispatch(fetchListCustomerRequest())
        }).catch(error=>{
            console.log(error)
        })
    } 
}