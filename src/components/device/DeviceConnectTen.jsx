import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col ,Table,Form,Input, Button,Card,Select,DatePicker,Icon,message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from '../query/TableList.less';
import { deviceConnectTenSearch,downLoad } from '../../axios';
const FormItem = Form.Item;
const Option = Select.Option;

const connectColmns = [{
        title: '设备MAC',
        dataIndex: 'imei',
        width:'160px',
        fixed: 'left' 
      },{
        title: '当前状态',
        dataIndex: 'status',
        width:'100px',
        fixed: 'left',
        render: (text) => {
        if (text ===10) {
          return <div><span style={{color:"#87D068",fontSize: 10,paddingRight: '5px'}}>●</span>在线</div>;
        }else if (text ===11) {
          return <div><span style={{color:"#CCC",fontSize: 10,paddingRight: '5px'}}>●</span>离线</div>;
        }
      } 
      }, {
        title: '所属城市',
        dataIndex: 'city',
        width:'100px',
        fixed: 'left' 
      },{
        title: '区域负责人',
        dataIndex: 'area',
        width:'100px',
        fixed: 'left' 
      },{
        title: '负责人手机',
        dataIndex: 'phone',
        width:'160px',
        fixed: 'left' 
      },{
        title: '所属网点',
        dataIndex: 'station',
        width:'160px',
        fixed: 'left' 
      },{
        title: '硬件版本号',
        dataIndex: 'version',
        width:'80px',
        fixed: 'left' 
      },{
        title: '10日连接情况',
        dataIndex: 'connectInfoTen',
      }];
      
class deviceConnectTen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      cities:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]],
      Area:this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]?this.props.auth.data.stationInfo.area[0][this.props.auth.data.stationInfo.city[0]]:'',
      columns:connectColmns,
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
    this.props.form.setFieldsValue({
      DistrictHead:'全部'
    });
  }
  onAreaChange = (value) => {
    this.setState({
      Area: value,
    });
  }
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values['time']);
      const momentToday = values['time']?values['time']:moment();
      const dayListToday = momentToday.add(1, 'day');
      let columns = connectColmns;
     for(let i =1;i<=10;i++){
      let today = dayListToday.subtract(1, 'days').format('YYYY-MM-DD');
      const newColumn = {
          title: today,
        children: [{
        title: '信号评价',
        dataIndex: 'reConnect'+today,
        key: 'Signal'+today,
        width:'50px',
        render:(text) => {
          if(!text||text<4){
            return <span>极佳</span>
          }
          else if(text>=4&&text<=10){
            return <span>良好</span>
          }else if(text>=11&&text<=16){
            return <span>一般</span>
          }else if(text>=17&&text<=25){
            return <span>较差</span>
          }else{
            return <span>有问题</span>
          }
        }
         }, {
        title: '重连次数',
        dataIndex: 'reConnect'+today,
        key: 'reConnect'+today,
        width:'50px',
        render:(text) => {
          if(!text){
            return <span>0</span>
          }else {
            return <span>{text}</span>
          }
        }
        }]
        }
        columns = [...columns,newColumn];
     }
      this.setState({columns:columns}); 
      let beginTime=momentToday.subtract(1, 'days').format('YYYY-MM-DD');
      let endTime=momentToday.add(10, 'days').format('YYYY-MM-DD');
      deviceConnectTenSearch([values.city,values.DistrictHead,values.MAC,values.Dot,beginTime,endTime]).then(res => {
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
      this.props.form.resetFields();
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  download = () => {
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const rangeTimeValue = values.time;
        const endTime = rangeTimeValue.format('YYYY-MM-DD');
        const beginTime = rangeTimeValue.subtract(10, 'days').format('YYYY-MM-DD');
        downLoad([]).then(res => {
           if(res.data&&res.data.status===1){
            let url='http://manage.dianxiakg.com/api/box/connection/tendays/download/'+''+res.data.id+'?beginTime='+beginTime+'&endTime='+endTime;
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
            window.open(url);
          }
        });
      });
    }

  render() {
    const { getFieldDecorator } = this.props.form; 
    const provinceOptions = this.props.auth.data.stationInfo.city.map((province,i) => <Option key={i} value={province}>{province}</Option>);
    const cityOptions = this.state.cities?this.state.cities.map((city,i) => <Option key={i} value={city}>{city}</Option>):'';
    return (
      <div className="gutter-example button-demo">
      <BreadcrumbCustom first="设备管理" second="近10天设备连接性查询" />
        <div className="gutter-box">
            <Card bordered={false} title="近10天设备连接性查询" className={'no-padding'}>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={24} offset={2}>
                      <FormItem label="所属城市：">
                        {getFieldDecorator('city')(
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
                    <Col md={6} sm={24}>
                    <FormItem label={`时间`} >
                      {getFieldDecorator(`time`,{
                        initialValue:moment()
                      })(
                        <DatePicker format="YYYY-MM-DD" />
                           )}
                        </FormItem>
                    </Col> 
                    <Button style={{ marginTop: 20 }} onClick={this.download}><Icon type="download" />导出表格</Button>
                    <Col md={7} sm={24} offset={2}>
                      <FormItem label="设备MAC">
                        {getFieldDecorator('MAC')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                       <FormItem label="网点名：">
                        {getFieldDecorator('Dot')(
                         <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>             
                    <Col md={4} sm={24} style={{marginTop:20}} offset={2}>
                      <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                      </span>
                    </Col>
                  </Row>
            </Form>
         <Row>
          <Col md={20} offset={2}>
          <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.data.length}</span>台设备</p>
          <Table columns={this.state.columns} dataSource={this.state.data} scroll={{ x: 1860}} bordered />
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
const DeviceConnectTen = Form.create()(deviceConnectTen);
export default connect(mapStateToProps)(DeviceConnectTen);
