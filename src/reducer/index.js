import { combineReducers } from 'redux';
import * as type from '../action/type';

const handleData = (state = {isFetching: true, data:{info:{}}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        case type.ADD_DOT:
            return {...state,data:{info:[action.data,...state.data.info]}};
        case type.REMOVE_DOT:
            return {...state,data:{info:state.data.info.filter((item) => {
                return item.station !== action.data;
            })}};    
        default:
            return {...state};
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
        case type.ADD_DOT:
        case type.REMOVE_DOT:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};

export default combineReducers({
    httpData
});     
