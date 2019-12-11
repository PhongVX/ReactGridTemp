import * as customerConstants from '../constants/customerConstants'

const initialState = {
    listCustomer:[],
    totalCount:0,
    currentPage:0,
    pageSize:10
}

const customerReducer = (state = initialState, action)=>{
    switch(action.type){
        case customerConstants.FETCH_CUSTOMER:{
            return {
                ...state,
                listCustomer:[]
            }
        }
        case customerConstants.FETCH_CUSTOMER_SUCCESS:{
            const {data} = action.payload
            return {
                ...state,
                listCustomer: data.listCustomer,
                totalCount: data.totalCount
                // currentPage:data.currentPage,
                // pageSize:data.pageSize
            }
        }
        case customerConstants.FETCH_CUSTOMER_FAILED:{

        }
        default:
            return state
    }
}

export default customerReducer