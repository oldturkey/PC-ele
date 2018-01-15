import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button,Table,Row,Col,Popconfirm,Modal,message,Card ,Select} from 'antd';
import styles from '../query/TableList.less';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { bindActionCreators } from 'redux';
import { fetchData } from '@/action';
import { stationSearch,dotEquipment,removeDot } from '../../axios';
const FormItem = Form.Item;
const Option = Select.Option;

class Log extends React.Component {
  state = {
    data:[],
    cities:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]],
    Area:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]?this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]:'',
    modalVisible: false,
    count:0,
    boxList:[]
  };
  componentWillMount() {
      this.handleSearch();
    }

  handleProvinceChange = (value) => {
    this.setState({
      cities: this.props.auth.data.stationInfo.area[this.props.auth.data.stationInfo.city.indexOf(value)][value],
      Area:this.props.auth.data.stationInfo.area[this.props.auth.data.stationInfo.city.indexOf(value)][value][0]
    });
  }
  onAreaChange = (value) => {
    this.setState({
      Area: value,
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  // //增加网点
  // handleAdd = (e) => {
  //   e.preventDefault();
  //   const { addDot } = this.props;
  //   this.props.form.validateFields((err, fieldsValue) => {
  //   const count = this.state.data.length;
  //   const newData = {
  //     key: count+1,
  //     city: fieldsValue['cityNew'],
  //     Dot: fieldsValue['dotName'],
  //     address: fieldsValue['dotAddress'],
  //   };
  //   addDot(newData,'dotEquipment');
  //   this.props.form.resetFields([['cityNew'],['dotName'],['dotAddress']]);
  //   this.setState({count:count+1});
  //   this.handleModalVisible();
  //   })
  // }
  删除网点
  onDelete=(key) => {
    removeDot([key]).then(res=>{
      if(res.data&&res.data.status===1){
        message.success("删除成功");
        this.handleSearch();
      }else{
        message.error("删除失败");
      }
    })
  }

  //查询网点
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      dotEquipment([values.city,values.DistrictHead,values.Dot]).then(res => {
        let i = 0;
        if(res&&res.data.status===1){
          this.setState({data: [...res.data.info.map(val => {
                    val.key = ++i;
                    return val;
                })],count:res.data.info.length+1});
        }else{
          message.error("查询失败");
        }    
        });
    });
  }

  showDot = (key) => {
    stationSearch([key]).then(res => {
        if(res.data.status===1){
          this.setState({boxList:res.data.info},function(){
            Modal.info({
            title: '网点盒子列表：',
            content: (
              <div>
                {this.state.boxList.map(item => <p key={item.boxId}>盒子编号：{item.boxId}</p>)}
              </div>
            ),
            onOk() {},
          });
          });
        }     
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const provinceOptions = this.props.auth.data.stationInfo.city.map((province,i) => <Option key={i} value={province}>{province}</Option>);
    const cityOptions = this.state.cities?this.state.cities.map((city,i) => <Option key={i} value={city}>{city}</Option>):'';
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '所属城市',
      dataIndex: 'city',
      key: 'city',
    }, {
      title: '区域负责人',
      dataIndex: 'area',
      key: 'area',
      }, {
        title: '负责人手机',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: '网点名',
        dataIndex: 'station',
        key: 'station',
      },{
        title: '网点地址',
        dataIndex: 'address',
        key: 'address',
      },{
        title: '操作',
        dataIndex: 'operation',
        key:'operation',
          render: (text, record) => {
        if(this.props.auth.data.type===1){
          return (
            <span>   
                <Popconfirm title="确定要删除该网点?" onConfirm={() => this.onDelete(record.station)}>
                  <a href="">删除 </a>
                </Popconfirm>
                <a onClick={() => this.showDot(record.station)}>查看网点列表</a>
              </span> 
          );
        }else{
          return(
            <a onClick={() => this.showDot(record.station)}>查看网点列表</a>
            )
        }
      },
      }];
    return (
    <div className="gutter-example button-demo">
      <BreadcrumbCustom first="网点设备" />
      <Row>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card bordered={false} title="网点设备查询" className={'no-padding'}>
                <Form onSubmit={this.handleSearch} layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={5} sm={24} offset={2}>
                      <FormItem label="所属城市：">
                        {getFieldDecorator('city',{
                        })(
                         <Select style={{ width: 90 }} onChange={this.handleProvinceChange}>
                          {provinceOptions}
                        </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={5} sm={24} >
                      <FormItem label="区域负责人：">
                      {getFieldDecorator('DistrictHead')( 
                         <Select style={{ width: 90 }} onChange={this.onAreaChange}>
                          {cityOptions}
                        </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={7} sm={24} >
                      <FormItem label="网点名：">
                        {getFieldDecorator('Dot')(
                         <Input placeholder="请输入" />
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
                    <div style={{width:'90%' ,margin:'10px auto'}}>
                        <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.data.length}</span>个网点</p>
                        <Table bordered dataSource={this.state.data} columns={columns} />
                    </div> 
              </Card>
            </div>
          </Col>                     
        </Row>
        <Modal
          title="新建网点"
          visible={this.state.modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="所在城市："
          >
            {getFieldDecorator('cityNew')(
              <Select style={{ width: 90 }}>
                {provinceOptions}
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="网点名："
          >
          {getFieldDecorator('dotName')(
                         <Input placeholder="请输入" />
                        )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="网店地址："
          >
          {getFieldDecorator('dotAddress')(
                         <Input placeholder="请输入" />
                        )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="经度："
          >
          {getFieldDecorator('longtitude')(
                         <Input placeholder="请输入" />
                        )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="纬度："
          >
          {getFieldDecorator('latitude')(
                         <Input placeholder="请输入" />
                        )}
          </FormItem>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => {
    const { auth = {data: {}} ,dotEquipment = {data: {}}} = state.httpData;
    return { auth,dotEquipment };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});

const WrappedApp = Form.create()(Log);
export default connect(mapStateToProps,mapDispatchToProps)(WrappedApp);

