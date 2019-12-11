import {combineReducers} from 'redux'
import customerReducer from './customerReducer'

const rootReducer = combineReducers({
    customers:customerReducer
})

export default rootReducer