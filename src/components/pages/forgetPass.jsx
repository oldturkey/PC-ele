import React from 'react';
import { Form, Icon, Input, Button,message,Layout } from 'antd';
import { sendVerifyCode,verification } from '../../axios';

const { Footer } = Layout;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class ForgetPass extends React.Component {
    state={
        authCode:undefined,
        validate:false,
        confirmDirty: false,
    }
    sendverifycode = () => {
      this.props.form.validateFields(['phone'],(err, values) => {
        if (err) {
            return;
          }
        this.setState({validate:true});

        sendVerifyCode([values.phone]).then(res=>{
            if(res.data&&res.data.status===1){
                this.setState({authCode:res.data.auth});
                message.success("验证码发送成功，请注意查收");
            }else{
                message.error("无效账号，请核实电话号码15秒后重试");
            }
            setTimeout(()=>this.setState({validate:false}),15000);
        })
      });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                verification([values.phone,values.verifycode,this.state.authCode,values.password]).then(res=>{
                    if(res.data&&res.data.status===1){
                       message.success("修改成功");
                       window.location.href='/';
                    }else{
                     message.error("修改失败！");   
                    }
                })
              }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的新密码不一直!');
        } else {
          callback();
        }
      }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="forgetPass">
                <div className="forgetPass-form" >
                    <div className="forgetPass-logo">
                        <span>密码修改</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入手机号!' },{len:11,message:'请输入合法手机号!'}],
                            })(
                                <Input prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="请输入手机号" />
                            )}
                        </FormItem>
                        <FormItem>
                                <InputGroup compact>
                                {getFieldDecorator('verifycode', {
                                rules: [{ required: true, message: '请输入手机验证码!' }],
                                })(
                                  <Input style={{ width: '68%'}} prefix={<Icon type="key" style={{ fontSize: 13 }} />} type="password" placeholder="请输入验证码" />
                                   )}
                                  <Input style={{ width: '32%' }} defaultValue="发送验证码" type="button" disabled={this.state.validate} onClick={this.sendverifycode} />
                                </InputGroup>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入新密码!' }, {
                                      validator: this.checkConfirm,
                                    }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('confirm', {
                                rules: [{ required: true, message: '请确认您的新密码!' }, {
                                  validator: this.checkPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请再次输入新密码" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                确认修改
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




export default Form.create()(ForgetPass);