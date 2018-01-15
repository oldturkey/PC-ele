import React from 'react';
import { Row, Col, Card, Steps, Button, message,Form,Input,Alert,InputNumber } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { rechargeCheck,adminRechargeMoney } from '../../axios';
const Step = Steps.Step;
const FormItem = Form.Item;

class adminRecharge extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      current: 0,
      phone:'',
      remark:'',
      money:'',
      rechargeCity:undefined,
      rechargeName:undefined,
    };
  }
  validate() {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      //返回正确后，保存充值信息
      this.setState({
        phone:fieldsValue['phone'],
        remark:fieldsValue['Remarks'],
        money:fieldsValue['recharge']
      },function(){
        rechargeCheck([fieldsValue['phone']]).then(res=>{
          if(res&&res.data.status===1){
            this.setState({rechargeCity:res.data.info[0].city,rechargeName:res.data.info[0].nickname},this.next());
          }else{
            message.error("未找到用户");
          }
        })
      })
      // this.next();
    });   
  }
  recharge(){
    adminRechargeMoney([this.state.phone,this.state.remark,this.state.money]).then(res=>{
      if(res&&res.data.status===1){
        this.next();
      }else{
        message.error("充值失败");
      }
    })
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  } 
  goBack() {
    const current = this.state.current - 2;
    this.setState({ current }); 
  }
    render() {
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form; 
        const steps = [{
            title: '填写充值信息',
            content: <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24} offset={7}>  
                  <FormItem label="充值对象手机号：" offset={2}>
                    {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入手机号!' },{len:11,message:'请输入正确的手机号'}],
                    })(
                      <Input addonBefore="+86" placeholder="请输入" />
                    )}
                  </FormItem>
                  <FormItem label="操作备注" offset={2}>
                    {getFieldDecorator('Remarks', {
                    rules: [{ required: true, message: '请输入操作备注!' }],
                  })(
                    <Input placeholder="请输入" />
                          )}
                  </FormItem>    
                  <FormItem label="充值金额：" offset={2}>
                    {getFieldDecorator('recharge',{
                    rules: [{ required: true, message: '请输入充值金额!' }],
                  })(
                    <InputNumber min={1} max={999} />
                          )}
                  </FormItem>      
              </Col>
            </Row>
          </Form>,
}, {
  title: '确认充值信息',
  content: <Row><Col md={14} offset={6}>
    <Alert
      message="确认转账后，资金将直接打入对方账户，无法退回。"
      type="info"
      closable
      showIcon
    />
    <h2>充值对象手机号：{this.state.phone}</h2>
    <h2>充值对象城市：{this.state.rechargeCity}</h2>
    <h2>充值对象昵称：{this.state.rechargeName}</h2>
    <h2>操作备注：{this.state.remark}</h2>
    <h2>充值金额：{this.state.money}</h2>
  </Col></Row>,
}, {
  title: '完成',
  content:<Row><Col md={14} offset={8}>
   <img src="http://oltjsnp86.bkt.clouddn.com/%E5%85%85%E5%80%BC%E6%88%90%E5%8A%9F.svg" width="55%" alt="充值成功" />
   </Col></Row>,
}];
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="查询管理" second="用户充值" />
                <Row gutter={30}>                  
                  <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} className={'no-padding'} style={{paddingTop:'30px'}}>
                                <div className="gutter-box">
                                  <Row>
                                    <Col md={14} offset={5}>
                                      <Steps current={current}>
                                      {steps.map(item => <Step key={item.title} title={item.title} />)}
                                      </Steps>
                                      <div className="steps-content" style={{paddingTop:'30px'}}>{steps[this.state.current].content}</div>
                                      <div className="steps-action">
                                        {
                                          this.state.current === 0
                                          &&
                                          <Button type="primary" onClick={() => this.validate()}>验证信息</Button>
                                        }
                                        {
                                          this.state.current === 1
                                          &&
                                          <Button type="primary" onClick={() => this.recharge()}>提交充值</Button>
                                        }
                                        {
                                          this.state.current === steps.length - 1
                                          &&
                                          <Button type="primary" onClick={() => this.goBack()}>确认，返回</Button>
                                        }
                                        {
                                          this.state.current === 1
                                          &&
                                          <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                            上一步
                                          </Button>
                                        }
                                    </div>
                                    </Col>
                                  </Row>
                                </div>
                            </Card>
                        </div>
                    </Col>                      
                </Row>
            </div>
        )
    }
}

export default Form.create()(adminRecharge);;