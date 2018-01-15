import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col ,Table,Form,Input, Button,Card,Select,DatePicker,Icon,Modal,message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from '../query/TableList.less';
import { deviceConnectSearch,deviceConnectDetail,downLoad } from '../../axios';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;


      
class deviceConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      cities:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]],
      Area:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]?this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]:'',
    }
  }
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
  searchDetail =(imei,station) => {
    this.props.form.validateFields((err, values) => {
      let beginTime=moment().format('YYYY-MM-DD 00:00:00');
      let endTime=moment().format('YYYY-MM-DD HH:mm:ss');
      // Should format date value before submit.
      const rangeTimeValue = values.orderTime;
      if(rangeTimeValue&&rangeTimeValue.length>0){
         beginTime = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
         endTime = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
      }
      deviceConnectDetail([imei,station,beginTime,endTime]).then(res=>{
        if(res.data&&res.data.status===1){
          const detail = res.data.info.map((item,i) => <p key={i} className={item.status?'online':'offline'}><span>{item.imei}</span><span>{item.status?'在线':'离线'}</span><span>{item.time}</span></p>);
          Modal.info({
            title: '重连明细',
            width:'600px',
            content: (
              <div className="connectDetail">
                <p><span>imei号</span><span>状态</span><span>时间</span></p>
                {detail}
              </div>
            ),
            onOk() {},
          });
        }
      });
    });
  }
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let beginTime=moment().format('YYYY-MM-DD 00:00:00');
      let endTime=moment().format('YYYY-MM-DD HH:mm:ss');
      // Should format date value before submit.
      const rangeTimeValue = values.orderTime;
      if(rangeTimeValue&&rangeTimeValue.length>0){
         beginTime = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
         endTime = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
      }
      deviceConnectSearch([values.city,values.DistrictHead,values.MAC,values.Dot,values.count,beginTime,endTime]).then(res => {
        let i = 0;
        if(res&&res.data.status===1){
          this.setState({data: [...res.data.info.map(val => {
                    val.key = ++i;
                    return val;
                })],});
        }else{
          message.error("查询失败");
        }      
        });

    });
  }
  download = () => {
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let beginTime=moment().format('YYYY-MM-DD 00:00:00');
        let endTime=moment().format('YYYY-MM-DD HH:mm:ss');
        // Should format date value before submit.
        const rangeTimeValue = values.orderTime;
        if(rangeTimeValue&&rangeTimeValue.length>0){
           beginTime = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss');
           endTime = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss');
        }
        downLoad([]).then(res => {
           if(res.data&&res.data.status===1){
            let url='http://manage.dianxiakg.com/api/box/connection/basic/download/'+''+res.data.id+'?beginTime='+beginTime+'&endTime='+endTime;
            if(values.city){
              url += '&city='+values.city;
            }
            if(values.DistrictHead){
              url += '&area='+values.DistrictHead;
            }
            if(values.MAC){
              url += '&imei='+values.MAC;
            }
            if(values.Dot){
              url += '&station='+values.Dot;
            }
            if(values.count){
              url += '&connectionCount='+values.count;
            }
            window.open(url);
           }
          });

      });
    }
  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const flowColumns = [{
        title: '设备MAC',
        dataIndex: 'imei',
      },{
        title: '当前状态',
        dataIndex: 'status',
        render:(text)=>{
          if (text ===10) {
          return <div><span style={{color:"#87D068",fontSize: 15,paddingRight: '10px'}}>●</span>在线</div>;
        }else if (text ===11) {
          return <div><span style={{color:"#CCC",fontSize: 15,paddingRight: '10px'}}>●</span>离线</div>;
        }
        }
      }, {
        title: '重连次数',
        dataIndex: 'connectCount',
      },{
        title: '所属城市',
        dataIndex: 'city',
      },{
        title: '区域负责人',
        dataIndex: 'area',
      },{
        title: '负责人手机',
        dataIndex: 'phone',
      },{
        title: '所属网点',
        dataIndex: 'station',
      },{
        title: '硬件版本号',
        dataIndex: 'version',
      },{
        title: '设备类型',
        dataIndex: 'type',
      },{
        title: '操作',
        dataIndex: 'operation',
        key:'operation',
        render: (text, record) => {
            return ( 
                  <a onClick={() => this.searchDetail(record.imei,record.station)}>查看重连明细</a>
              )
      },
      }];
  	const { getFieldDecorator } = this.props.form; 
    const provinceOptions = this.props.auth.data.stationInfo.city.map((province,i) => <Option key={i} value={province}>{province}</Option>);
    const cityOptions = this.state.cities?this.state.cities.map((city,i) => <Option key={i} value={city}>{city}</Option>):'';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className="gutter-example button-demo">
      <BreadcrumbCustom first="设备管理" second="设备连接性查询" />
      	<div className="gutter-box">
            <Card bordered={false} title="设备连接性查询" className={'no-padding'}>
	        <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={24} offset={1}>
                      <FormItem label="所属城市：">
                        {getFieldDecorator('city',{
                          initialValue:this.props.auth.data.stationInfo.city[0]
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
                    <Col md={7} sm={24}>
                      <FormItem label="网点名：" offset={2}>
                        {getFieldDecorator('Dot')(
                         <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col> 
                    <Button style={{ marginTop: 20 }} onClick={this.download}><Icon type="download" />导出表格</Button>
                    <Col md={6} sm={24} offset={1}>
                      <FormItem label="设备MAC">
                        {getFieldDecorator('MAC')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={5} sm={24} >
                      <FormItem label="大于重连次数">
                        {getFieldDecorator('count')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                      <FormItem {...formItemLayout} label={`时间`} >
                      {getFieldDecorator(`orderTime`,{
                      })(
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'null'}} />
                           )}
                        </FormItem>
                    </Col>             
                    <Col md={5} sm={24} style={{marginTop:20}} >
                      <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={this.handleReset}>重置</Button>
                      </span>
                    </Col>
                  </Row>
            </Form>
	       <Row>
	      	<Col md={20} offset={1}>
          <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.data.length}</span>台设备</p>
	      	<Table columns={flowColumns} dataSource={this.state.data} bordered />
	      	</Col>
	      </Row>
	      </Card>
        </div>
      </div>  
    );
  }
}
const mapStateToProps = state => {
    const { auth = {data: {}} ,dotEquipment = {data: {}}} = state.httpData;
    return { auth,dotEquipment };
};
const DeviceConnect = Form.create()(deviceConnect);
export default connect(mapStateToProps)(DeviceConnect);
