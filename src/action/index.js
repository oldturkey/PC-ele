/**
 * Created by 叶子 on 2017/7/30.
 */
import * as type from './type';
import * as http from '../axios/index';

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});
export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
}); 
export const addDot = (data,category) => ({
	type:type.ADD_DOT,
	data,
	category
});
export const removeDot = (data,category) => ({
	type:type.REMOVE_DOT,
	data,
	category
});
/**
 *
 * 
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
export const fetchData = ({funcName, params, stateName}) => dispatch => {
    !stateName && (stateName = funcName);
    dispatch(requestData(stateName));
 	http[funcName](params).then(res => dispatch(receiveData(res, stateName)));
};



 