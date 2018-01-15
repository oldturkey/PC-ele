import React from 'react';
import { Row, Col, Card, Form, Input,Button,DatePicker,Table } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './TableList.less';
import { consumption } from '../../axios';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const flowColumns = [{
        title: '设备编号',
        dataIndex: 'boxId',
      },{
        title: '手机号',
        dataIndex: 'phone',
      }, {
        title: '消费时间',
        dataIndex: 'time',
      },{
        title: '消费网点',
        dataIndex: 'station',
      },{
        title: '消费金额',
        dataIndex: 'money',
      }];
class Payment extends React.Component {
    constructor(props) {
    super(props);
    this.state={
      data:[],
      pagination: {},
    }
  }
  componentWillMount() {
      this.handleSearch();
    }
  fetch = (phone,beginTime,endTime,currentPage) => {
    this.setState({ loading: true });
    consumption([phone,beginTime,endTime,currentPage]).then(res => {
      const pagination = { ...this.state.pagination };
      pagination.total = res.data.itemcount;
      let i = 0;
      this.setState({
        loading: false,
        data: [...res.data.info.map(val => {
                    val.key = ++i;
                    return val;
                })],
        pagination,
      }); 
    });
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.props.form.validateFields((err,values) => {
      if (err) {
        return;
      }
      let beginTime=null;
      let endTime=null;
      // Should format date value before submit.
      const rangeTimeValue = values.orderTime;
      if(rangeTimeValue&&rangeTimeValue.length!==0){
         beginTime = rangeTimeValue[0].format('YYYY-MM-DD ');
         endTime = rangeTimeValue[1].format('YYYY-MM-DD ');
      }
      this.fetch(values.phone,beginTime,endTime,pagination.current);
    });
  }
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields((err,values) => {
      if (err) {
        return;
      }
      let beginTime=null;
      let endTime=null;
      // Should format date value before submit.
      const rangeTimeValue = values.orderTime;
      if(rangeTimeValue&&rangeTimeValue.length!==0){
         beginTime = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
         endTime = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
      }
      this.fetch(values.phone,beginTime,endTime,1);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
    render() {
        const { getFieldDecorator } = this.props.form; 
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 6 },
        };
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="查询管理" second="用户消费查询" />
                <Row gutter={30}>                  
                  <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} title="用户消费查询" className={'no-padding'}>
                                <div className="gutter-box">
                                    <Form onSubmit={this.handleSearch} layout="inline">
                                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                        <Col md={7} sm={24} offset={2}>
                                          <FormItem label="手机号">
                                            {getFieldDecorator('phone')(
                                              <Input placeholder="请输入" />
                                            )}
                                          </FormItem>
                                        </Col>
                                        <Col md={7} sm={24}>
                                          <FormItem {...formItemLayout} label={`订单时间`} >
                                          {getFieldDecorator(`orderTime`)(
                                             <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'null'}} />
                                          )}
                                          </FormItem>
                                        </Col>
                                        <Col md={4} sm={24} style={{marginTop:'20px'}}>
                                          <span className={styles.submitButtons}>
                                            <Button type="primary" htmlType="submit">查询</Button>
                                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                                          </span>
                                        </Col>
                                      </Row>
                                    </Form>
                                  <Row>
                                    <Col md={20} offset={2}>
                                    <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.pagination.total}</span>条消费记录</p>
                                    <Table columns={flowColumns} dataSource={this.state.data} pagination={this.state.pagination} onChange={this.handleTableChange} bordered />
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

const Pay = Form.create()(Payment);
export default Pay;