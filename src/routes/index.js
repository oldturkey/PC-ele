import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect,IndexRoute } from 'react-router';
import App from '../App';
import Page from '../components/Page';
import DotEquipment from '../components/device/DotEquipment';
import DeviceConnect from '../components/device/DeviceConnect';
import DeviceConnectTen from '../components/device/DeviceConnectTen';
import DeviceManage from '../components/manage/DeviceManage';
import DotManage from '../components/manage/DotManage';
import DistrictManage from '../components/manage/DistrictManage';
import CityManage from '../components/manage/CityManage';
import Payment from '../components/query/Payment';
import Recharge from '../components/query/Recharge';
import AdminRecharge from '../components/query/AdminRecharge';
import CityAdmin from '../components/admin/CityAdmin';
import DistrictAdmin from '../components/admin/DistrictAdmin';
import Login from '../components/pages/Login';
import NotFound from '../components/pages/NotFound';
import ForgetPass from '../components/pages/forgetPass';



export default class CRouter extends Component {

    requireAuth = (component,authority) => {
       const auth = JSON.parse(localStorage.getItem('user'))?1:0;
        if (!auth) browserHistory.replace('/404');
        return component;
    };
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="/login" />
                    <Route path={'login'} components={Login} />
                    <Route path={'forgetPass'} components={ForgetPass} />
                    <Route path={'404'} component={NotFound} />
                    <Route onEnter={this.requireAuth} >
                        <Route path={'app'} component={App}>
                            <IndexRoute component={DotEquipment} />
                            <Route path={'device'}>
                                <Route path={'dotEquipment'} component={DotEquipment} />
                                <Route path={'connect'} component={DeviceConnect} />
                                <Route path={'connectTen'} component={DeviceConnectTen} />
                                <Route path={'manage'} component={DeviceManage} />
                            </Route>
                            <Route path={'manage'}>
                                <Route path={'device'} component={DeviceManage} /> 
                                <Route path={'dot'} component={DotManage} /> 
                                <Route path={'district'} component={DistrictManage} />  
                                <Route path={'city'} component={CityManage} />
                            </Route>
                            <Route path={'query'}>
                                <Route path={'payment'} component={Payment} /> 
                                 <Route path={'recharge'} component={Recharge} />
                                 <Route path={'adminRecharge'} component={AdminRecharge} />
                            </Route>
                            <Route path={'admin'}>
                                <Route path={'city'} component={CityAdmin} /> 
                                <Route path={'district'} component={DistrictAdmin} />
                            </Route>                        
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}