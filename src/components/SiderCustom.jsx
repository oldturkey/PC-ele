import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const {path} = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        console.log(this.state);
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        console.log(v);
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render() {
        const auth = JSON.parse(localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):0;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}
            >
                <div className="logo" ><img src="http://oltjsnp86.bkt.clouddn.com/%E7%94%B5%E4%BE%A0logo.jpg" alt="logo" width="168px"/></div>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.firstHide ? null : [this.state.openKey]}
                    onOpenChange={this.openMenu}
                >
                    <SubMenu
                        key="/app/device"
                        title={<span><Icon type="database" /><span className="nav-text">设备管理</span></span>}
                    >
                        <Menu.Item key="/app/device/dotEquipment"><Link to={'/app/device/dotEquipment'}>网点设备查询</Link></Menu.Item>
                        <Menu.Item key="/app/device/connect"><Link to={'/app/device/connect'}>设备连接性查询</Link></Menu.Item>
                        <Menu.Item key="/app/device/connectTen"><Link to={'/app/device/connectTen'}>近10天设备连接性查询</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="/app/manage"
                        title={<span><Icon type="shop" /><span className="nav-text">营收统计</span></span>}
                    >
                        <Menu.Item key="/app/manage/device"><Link to={'/app/manage/device'}>设备营收统计</Link></Menu.Item>
                        {
                            auth.authority&&auth.authority.includes('/income/station')
                            &&
                            <Menu.Item key="/app/manage/dot"><Link to={'/app/manage/dot'}>网点营收统计</Link></Menu.Item>
                        }                        
                        {
                            auth.authority&&auth.authority.includes('/income/area')
                            &&
                            <Menu.Item key="/app/manage/district"><Link to={'/app/manage/district'}>区域营收统计</Link></Menu.Item>
                        }
                        {
                            auth.authority&&auth.authority.includes('/income/city')
                            &&
                            <Menu.Item key="/app/manage/city"><Link to={'/app/manage/city'}>城市营收统计</Link></Menu.Item>
                        }
                    </SubMenu>
                    <SubMenu
                        key="/app/query"
                        title={<span><Icon type="search" /><span className="nav-text">查询管理</span></span>}
                    >
                        {
                            auth.authority&&auth.authority.includes('/user/consumption')
                            &&
                           <Menu.Item key="/app/query/payment"><Link to={'/app/query/payment'}>用户消费查询</Link></Menu.Item>
                        } 
                        {
                            auth.authority&&auth.authority.includes('/user/recharge/info')
                            &&
                           <Menu.Item key="/app/query/recharge"><Link to={'/app/query/recharge'}>用户充值查询</Link></Menu.Item>
                        } 
                        {
                            auth.authority&&auth.authority.includes('/user/recharge')
                            &&
                           <Menu.Item key="/app/query/adminRecharge"><Link to={'/app/query/adminRecharge'}>用户充值</Link></Menu.Item>
                        }   
                    </SubMenu>
                    <SubMenu
                        key="/app/admin"
                        title={<span><Icon type="usergroup-add" /><span className="nav-text">账号管理</span></span>}
                    >
                        {
                            auth.authority&&auth.authority.includes('/account/city/modify')
                            &&
                           <Menu.Item key="/app/admin/city"><Link to={'/app/admin/city'}>城市人员管理</Link></Menu.Item>
                        }
                        {
                            auth.authority&&auth.authority.includes('/query/station/noarea')
                            &&
                           <Menu.Item key="/app/admin/district"><Link to={'/app/admin/district'}>区域负责人管理</Link></Menu.Item>
                        }
                        
                    </SubMenu>
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;