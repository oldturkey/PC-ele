import http from './tools';
import * as config from './config';
import { message } from 'antd';

 //登录
export const login = (params) => http.post(config.requestIp+'/login', {
    "name":params[0],
    "password":params[1],
}).then(function (response) {
	console.log(response);
	if(response.data.status===1){
		message.success('登录成功');
		return response.data;
	}else{
		message.error('用户名或密码错误');
	}  
}).catch(function (error) {
    console.log(error);
});
 //发送短信验证码
export const sendVerifyCode = (params) => http.post(config.requestIp+'/resetpassword/sendverifycode',{
	phone:params[0],
});
 //短信验证码激活
export const verification = (params) => http.post(config.requestIp+'/resetpassword/verification',{
	phone:params[0],
	code:params[1],
	auth:params[2],
	password:params[3]
});

// 管理员权限获取
//网点查询获取
export const dotEquipment = (params) => http.post(config.requestIp+'/station/info',{
	city:params[0],
	area:params[1],
	station:params[2],
	Authorization:JSON.parse(localStorage.getItem('user')).token	
});
//新增网点
export const addDot = (params) => http.post(config.requestIp+'/station/create',{
	city:params[0],
	station:params[1],
	address:params[2],
	longtitude:params[3],
	latitude:params[4],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//删除网点
export const removeDot = (params) => http.post(config.requestIp+'/station/remove',{
	station:params[0],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//网点设备列表
export const stationSearch = (params) => http.post(config.requestIp+'/box/station/list',{
	station:params[0],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//1.4(2)重连明细
export const deviceConnectDetail = (params) => http.post(config.requestIp+'/box/connection/detail',{
	imei:params[0],
	station:params[1],
	beginTime:params[2],
	endTime:params[3],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//1.4设备连接性查询
export const deviceConnectSearch = (params) => http.post(config.requestIp+'/box/connection/basic',{
	city:params[0],
	area:params[1],
	imei:params[2],
	station:params[3],
	connectionCount:params[4],
	beginTime:params[5],
	endTime:params[6],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//统一下载访问接口
export const downLoad = (params) => http.post(config.requestIp+'/download',{
	Authorization:JSON.parse(localStorage.getItem('user')).token
});

//1.5近十天设备连接性查询 
export const deviceConnectTenSearch = (params) => http.post(config.requestIp+'/box/connection/tendays',{
	city:params[0],
	area:params[1],
	imei:params[2],
	station:params[3],
	beginTime:params[4],
	endTime:params[5],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//2.1设备营收统计
export const incomeBox = (params) => http.post(config.requestIp+'/income/box',{
	city:params[0],
	adminName:params[1],
	imei:params[2],
	site:params[3],
	showStyle:params[4],
	beginTime:params[5],
	endTime:params[6],
	Authorization:JSON.parse(localStorage.getItem('user')).token
	
});
//2.2网点营收统计 
export const incomeStation = (params) => http.post(config.requestIp+'/income/station',{
	city:params[0],
	adminName:params[1],
	site:params[2],
	showStyle:params[3],
	beginTime:params[4],
	endTime:params[5],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//2.3区域营收统计 
export const incomeArea = (params) => http.post(config.requestIp+'/income/area',{
	city:params[0],
	adminName:params[1],
	showStyle:params[2],
	beginTime:params[3],
	endTime:params[4],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//2.4城市营收统计 
export const incomeCity = (params) => http.post(config.requestIp+'/income/city',{
	city:params[0],
	showStyle:params[1],
	beginTime:params[2],
	endTime:params[3],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});

//3.1用户充值查询 
export const recharge = (params) => http.post(config.requestIp+'/user/recharge/info',{
	phone:params[0],
	beginTime:params[1],
	endTime:params[2],
	currentPage:params[3],
	pageSize:10,
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//3.2用户消费查询 
export const consumption = (params) => http.post(config.requestIp+'/user/consumption/query',{
	phone:params[0],
	beginTime:params[1],
	endTime:params[2],
	currentPage:params[3],
	pageSize:10,
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//用户充值钱检测

export const rechargeCheck = (params) => http.post(config.requestIp+'/user/recharge/check',{
	phone:params[0],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//3.3管理员充值 
export const adminRechargeMoney = (params) => http.post(config.requestIp+'/user/recharge',{
	phone:params[0],
	comments:params[1],
	money:params[2],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.1城市人员查询
export const adminCity = (params) => http.post(config.requestIp+'/account/city/info',{
	city:params[0],
	phone:params[1],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.2城市人员编辑
export const adminModify = (params) => http.post(config.requestIp+'/account/city/modify',{
	city:params[0],
	phone:params[1],
	email:params[2],
	type:params[3],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.3城市人员新增
export const adminAdd = (params) => http.post(config.requestIp+'/account/city/add',{
	city:params[0],
	name:params[1],
	phone:params[2],
	type:params[3],
	email:params[4],
	password:params[5],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.4城市人员删除
export const adminRemove = (params) => http.post(config.requestIp+'/account/city/remove',{
	phone:params[0],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.5区域负责人查询
export const adminArea = (params) => http.post(config.requestIp+'/account/area/info',{
	city:params[0],
	phone:params[1],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.10区域负责人删除
export const areaRemove = (params) => http.post(config.requestIp+'/account/area/remove',{
	phone:params[0],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.9区域负责人新增
export const areaAdd = (params) => http.post(config.requestIp+'/account/area/add',{
	city:params[0],
	name:params[1],
	phone:params[2],
	type:params[3],
	email:params[4],
	password:params[5],
	station:params[6],
	Authorization:JSON.parse(localStorage.getItem('user')).token,
});
//4.6区域负责人编辑
export const areaModify = (params) => http.post(config.requestIp+'/account/area/modify',{
	city:params[0],
	phone:params[1],
	email:params[2],
	type:params[3],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.7区域负责人网点新增
export const areaAddDOt = (params) => http.post(config.requestIp+'/account/area/station/add',{
	phone:params[0],
	station:params[1],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//4.8区域负责人网点删除
export const areaRemoveDot = (params) => http.post(config.requestIp+'/account/area/station/remove',{
	phone:params[0],
	station:params[1],
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//5.1查询所有未分配网点
export const noareaSearch = (params) => http.post(config.requestIp+'/query/station/noarea',{
	Authorization:JSON.parse(localStorage.getItem('user')).token
});
//测试代码
export const getgetAlertTable = () =>http.post({url: './npm1.json'}); 

//首页信息
export const HomeUserInfo = () =>http.post({url: '/home/user/info',headers: {'Authorization': 'token'}}); 
//首页报警表
export const homeAlertTable = () =>http.post({url: '/home/device/hour-alarm',headers: {'Authorization': 'token'}}); 
//首页供水表
export const homeSupply = () =>http.post({url: '/home/delivery/hour-record',headers: {'Authorization': 'token'}}); 




