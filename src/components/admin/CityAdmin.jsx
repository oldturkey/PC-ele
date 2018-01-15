
import React from 'react';
import { Row, Col, Card, Select,Input,Popconfirm,Button,Table,Form,Modal,message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from '../query/TableList.less';
import { adminCity,adminModify,adminAdd,adminRemove } from '../../axios';
import { connect } from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;

class CityAdmin extends React.Component {
    state={
      dataSource: [],
      count: 1,
      modalVisible: false,
      edit:false,
      editPhone:undefined,
      editCity:undefined,
      editEmail:undefined,
      editType:undefined
    }
    componentWillMount() {
      this.handleSearch();
    } 

   handleModalVisible = (flag,edit,phone,city,email,type) => {
    this.setState({modalVisible: !!flag},function(){
      this.setState({
          edit:!!edit,
          editPhone:phone?phone:undefined,
          editCity:city?city:undefined,
          editEmail:email?email:undefined,
          editType:type?type:undefined,
          })
    });
    this.handleReset();
  }

  handleReset = () => {
    this.props.form.resetFields();
  }
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields(["city","phone"],(err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      adminCity([values.city,values.phone]).then(res => {
        let i = 0;
        if(res&&res.data.status===1){
          this.setState({dataSource: [...res.data.info.map(val => {
                    val.key = ++i;
                    return val;
                })],count:res.data.info.length+1});
        }else{
          message.error("查询失败");
        }    
        });
    });
  }


  //删除管理员
  onDelete = (phone) => { 
    adminRemove([phone]).then(res=>{
      if(res&&res.data.status===1){
        message.success("删除成功");
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.phone !== phone) });
      }else{
      message.error("删除失败");
      }
    });
   }
  //添加管理员
  onUpDate = (key) => {
    if(key){
      this.props.form.validateFields(["newCity","adminPhone","email","roleType","adminName"],(err, values) => {
      if (err) {
        return;
      }
      adminModify([values.newCity,values.adminPhone,values.email,values.roleType]).then(res=>{
        if(res&&res.data.status===1){
          message.success("修改成功");
          this.handleSearch();
          this.handleModalVisible();
        }else {
          message.error("修改失败");
          this.handleModalVisible();
        }
      });
    });
    }else{  
      this.props.form.validateFields(["newCity","adminName","adminPhone","roleType","email","password"],(err, values) => {
        if (err) {
          return;
        }
        adminAdd([values.newCity,values.adminName,values.adminPhone,values.roleType,values.email,values.password]).then(res=>{
          if(res&&res.data.status===1){
            message.success("添加成功");
            const { count, dataSource } = this.state;
            const newData = {
              key: count,
              name:values.adminName ,
              city:values.newCity,
              email: values.email,
              type: values.roleType,
              phone:values.adminPhone
            };
            this.setState({
              dataSource: [newData,...dataSource],
              count: count + 1,
            });
            this.handleModalVisible(); 
            }else {
              message.error("添加失败");
              this.handleModalVisible(); 
            }
          });
        });
      }   
  }

    render() {
           const { getFieldDecorator } = this.props.form;
           const authority = JSON.parse(localStorage.getItem('user')).authority; 
           const cityOptions = this.props.auth.data.stationInfo.city.map((province,i) => <Option key={i} value={province}>{province}</Option>);
            const columns = [{
            title: '管理员姓名',
            dataIndex: 'name',
            width: '17%',
          },{
            title: '手机号',
            dataIndex: 'phone',
            width: '12%',
          },{
            title: '所属城市',
            dataIndex: 'city',
            width: '12%',
          },{
            title: '邮箱',
            dataIndex: 'email',
            width: '16%',
          },{
            title: '管理员类型',
            dataIndex: 'type',
            width: '16%',
            render:(text)=>{
              if(text===2||text==="2"){
                return <span>城市主管</span>
              }else if(text===3||text==="3"){
                return <span>城市操作员</span>
              }else if(text===4||text==="4"){
                return <span>电侠观察员</span>
              }
            }
          },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
              if(authority.includes('/account/city/modify')){
                return (
                  <span>   
                      <Popconfirm title="确定要删除该管理员?" onConfirm={() => this.onDelete(record.phone)}>
                        <a href="">删除 </a>
                      </Popconfirm>
                      <a onClick={() => this.handleModalVisible(true,true,record.phone,record.city,record.email,record.type)}>修改管理员资料</a>
                    </span> 
                );
              }
            },
          }];
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="账号管理" />
                <Row>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} title="城市人员设置" className={'no-padding'}>
                             <Form onSubmit={this.handleSearch} layout="inline">
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                        <Col md={7} sm={24} offset={1}>
                                          <FormItem label="所属城市：" >
                                            {getFieldDecorator('city')(
                                             <Input placeholder="请输入" />
                                            )}
                                          </FormItem>
                                        </Col> 
                                        <Col md={5} sm={24} >
                                          <FormItem label="管理员手机号">
                                            {getFieldDecorator('phone', {
                                              rules: [{len:11,message:'请输入正确的手机号'}],
                                            })(
                                              <Input placeholder="请输入"/>
                                            )}
                                          </FormItem>
                                        </Col>           
                                        <Col md={4} sm={24} style={{marginTop:'20'}}>
                                          <span className={styles.submitButtons}>
                                            <Button type="primary" htmlType="submit">查询</Button>
                                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                                          </span>
                                        </Col>
                                      </Row>
                                </Form>
                                <div style={{width:'90%' ,margin:'10px auto'}}>
                                    <Button className="editable-add-btn" onClick={() => this.handleModalVisible(true)}>新建</Button>
                                    <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.dataSource.length}</span>位城市管理员</p>
                                    <Table bordered dataSource={this.state.dataSource} columns={columns} />
                                </div>  
                            </Card>
                        </div>
                    </Col>     
                </Row>
                <Modal
                  title={this.state.edit===true?"修改管理员资料":"新建城市管理员"}
                  visible={this.state.modalVisible}
                  onOk={() =>this.onUpDate(this.state.editPhone)}
                  onCancel={() => this.handleModalVisible()}
                >
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="所属城市"
                  >
                    {getFieldDecorator('newCity',{
                      rules: [{ required: true, message: '请选择管理城市!' }],
                      initialValue:this.state.editCity?this.state.editCity:undefined,
                    })(
                      <Select style={{ width: 100 }} >
                        {cityOptions}
                      </Select>
                    )}
                  </FormItem>
                {
                  this.state.edit===false
                  &&
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="管理员姓名"
                  >
                    {getFieldDecorator('adminName',{
                      rules: [{ required: true, message: '请输入管理员姓名!' }],
                    })(
                      <Input placeholder="请输入" style={{ width: 120 }} />
                    )}
                  </FormItem>
                }

                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="管理员手机号"
                  >
                  {getFieldDecorator('adminPhone',{
                    rules: [{ required: true, message: '请输入手机号!' },{len:11,message:'请输入正确的手机号'}],
                    initialValue:this.state.editPhone?this.state.editPhone:undefined,
                  })(
                      <Input placeholder="请输入" style={{ width: 150 }} disabled={this.state.editPhone?true:false} />
                    )}
                  </FormItem> 

                  
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="角色类型"
                  >
                  {getFieldDecorator('roleType',{
                      rules: [{ required: true, message: '请选择管理员类型!' }],
                      initialValue:(this.state.editType?this.state.editType:undefined)+"",
                    })(
                    <Select style={{ width: 150 }} >
                      <Option value="2">城市主管</Option>
                      <Option value="3">城市操作员</Option>
                      <Option value="4" >电侠观察员</Option>
                    </Select>
                  )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="邮箱："
                  >
                    {getFieldDecorator('email',{
                      rules: [{ required: true, message: '请输入邮箱!' },{type:'email',message:'请输入正确的邮箱'}],
                      initialValue:this.state.editEmail?this.state.editEmail:undefined,
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                  {
                  this.state.edit===false
                  &&
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="初始密码"
                  >
                    {getFieldDecorator('password',{
                      rules: [{ required: true, message: '请设置初始密码!' }],
                      initialValue:"123123",
                    })(
                      <Input placeholder="请输入" type="password" />
                    )}
                  </FormItem>
                }  
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}} } = state.httpData;
    return { auth};
};

const cityAdmin = Form.create()(CityAdmin);
export default connect(mapStateToProps)(cityAdmin);