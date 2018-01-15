import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Layout } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';

const { Footer } = Layout;
const FormItem = Form.Item;

class Login extends React.Component {
    componentWillMount() {
        const { receiveData } = this.props;
        receiveData(null, 'auth');
    }
    componentWillReceiveProps(nextProps) {
        const { auth: nextAuth = {} } = nextProps;
        const { router } = this.props;
        if (nextAuth.data && nextAuth.data.status===1) {   // 判断是否登陆
            localStorage.setItem('user', JSON.stringify(nextAuth.data));
            router.push('/app');
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { fetchData } = this.props;
                 fetchData({funcName:'login',stateName:'auth',params:[values.userName,values.password]});
            }
        });
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <img src="http://oltjsnp86.bkt.clouddn.com/%E7%94%B5%E4%BE%A0logo.jpg" alt="电侠" width="240px" height="60px"/>
                        <span>电侠管理平台</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" style={{float: 'right'}} onClick={()=>{window.location.href='/forgetpass';}}>忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <Footer style={{ textAlign: 'center',position: 'absolute',bottom:'10px',backgroundColor: '#f3f3f3'}}>
                  Electricity Man ©2017 Powered by Terabits.cn
                  <p>浙ICP备17058689号 杭州电侠控股</p>
                </Footer>
            </div>

        );
    }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));