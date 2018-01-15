import React from 'react';
import { connect } from 'react-redux';
import { Row, Col ,Table,Form,Button,Card,Select,DatePicker,Icon,Radio } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from '../query/TableList.less';
import moment from 'moment';
import { incomeArea,downLoad } from '../../axios';
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

const districtManageColumns = [{
        title: '所属城市',
        dataIndex: 'city',
      },{
        title: '区域负责人',
        dataIndex: 'adminname',
      },{
        title: '负责人手机',
        dataIndex: 'adminphone',
      },{
        title: '日期',
        dataIndex: 'time',
      },{
        title: '总交易合计',
        children: [{
        title: '总交易金额',
        dataIndex: 'totalTurnover',
        key: 'totalTurnover',
         }, {
        title: '总交易笔数',
        dataIndex: 'totalCount',
        key: 'totalCount',
        }]
        },{
        title: '微信合计',
        children: [{
        title: '总交易金额',
        dataIndex: 'wechatTurnover',
        key: 'wechatTurnover',
         }, {
        title: '总交易笔数',
        dataIndex: 'wechatCount',
        key: 'wechatCount',
        }]
        },{
        title: '投币合计',
        children: [{
        title: '总交易金额',
        dataIndex: 'coinTurnover',
        key: 'coinTurnover',
         }, {
        title: '总交易笔数',
        dataIndex: 'coinCount',
        key: 'coinCount',
        }]
        }];
      
class districtManage extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      date:[],
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
  handleSearch = (e) => {
    e?e.preventDefault():null;
    this.props.form.validateFields((err,values) => {
      if (err) {
        return;
      }
      let beginTime=null;
      let endTime=null;
      // Should format date value before submit.
      const rangeTimeValue = values.orderTime?values.orderTime.length!==0?values.orderTime:[moment(),moment()]:[moment(),moment()];
      if(rangeTimeValue&&rangeTimeValue.length!==0){
         beginTime = rangeTimeValue[0].format('YYYY-MM-DD');
         endTime = rangeTimeValue[1].format('YYYY-MM-DD ');
      }
      incomeArea([values.city,values.DistrictHead,values.displayStyle?values.displayStyle:0,beginTime,endTime]).then(res => {
        let i = 0;
        if(res&&res.data.status===1){
          if(res&&res.data.status===1){
          if(values.displayStyle===1){
            this.setState({date: [...res.data.info.map(val => {
                    val.key = ++i;
                    return val;
                })]});
          }else{
            this.setState({date: [...res.data.info.map(val => {
                    val.key = ++i;
                    val.time=beginTime+'-'+endTime
                    return val;
                })]});
          }
        } 
        }     
        });
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
        let beginTime=null;
        let endTime=null;
        // Should format date value before submit.
        const rangeTimeValue = values.orderTime?values.orderTime.length!==0?values.orderTime:[moment(),moment()]:[moment(),moment()];
        if(rangeTimeValue&&rangeTimeValue.length!==0){
           beginTime = rangeTimeValue[0].format('YYYY-MM-DD ');
           endTime = rangeTimeValue[1].format('YYYY-MM-DD');
        }
        downLoad([]).then(res => {
           if(res.data&&res.data.status===1){
            const style = values.displayStyle?values.displayStyle:0;
            let url='http://manage.dianxiakg.com/api/income/area/download/'+res.data.id+'?beginTime='+beginTime+'&endTime='+endTime+'&showStyle='+style;
            if(values.city){
              url += '&city='+values.city;
            }
            if(values.DistrictHead){
              url += '&adminName='+values.DistrictHead;
            }
            window.open(url.replace(' ', ""));
          }
        });
      });
    }
  render() {
    const { getFieldDecorator } = this.props.form; 
    const provinceOptions = this.props.auth.data.stationInfo.city.map((province,i) => <Option key={i} value={province}>{province}</Option>);
    const cityOptions = this.state.cities?this.state.cities.map((city,i) => <Option key={i} value={city}>{city}</Option>):'';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className="gutter-example button-demo">
      <BreadcrumbCustom first="营收统计" second="区域营收统计" />
        <div className="gutter-box">
            <Card bordered={false} title="区域营收统计查询" className={'no-padding'}>
            <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={7} sm={24} offset={2}>
                      <FormItem label="所属城市：">
                        {getFieldDecorator('city',{
                        })(
                         <Select  style={{ width: 90 }} onChange={this.handleProvinceChange}>
                          {provinceOptions}
                        </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={7} sm={24} >
                      <FormItem label="区域负责人：">
                      {getFieldDecorator('DistrictHead')( 
                         <Select style={{ width: 90 }} onChange={this.onAreaChange}>
                          {cityOptions}
                        </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Button style={{ marginTop: 20 }} onClick={this.download}><Icon type="download" />导出表格</Button>
                    <Col md={7} sm={24} offset={2}>
                      <FormItem {...formItemLayout} label={`时间`} >
                      {getFieldDecorator(`orderTime`)(
                        <RangePicker format="YYYY-MM-DD" />
                           )}
                        </FormItem>
                    </Col> 
                    <Col md={6} sm={24} >
                      <FormItem label="显示方式">
                        {getFieldDecorator('displayStyle',{
                          initialValue:0
                        })(
                          <RadioGroup>
                            <Radio value={0}>合并显示</Radio>
                            <Radio value={1}>逐条显示</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>            
                    <Col md={4} sm={24} style={{marginTop:'20'}} offset={1}>
                      <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                      </span>
                    </Col>
                  </Row>
            </Form>
           <Row>
            <Col md={20} offset={2}>
            <p>查询结果：共<span style={{color:'#49a9ee'}}>{this.state.date.length}</span>个区域营收记录</p>
            <Table columns={districtManageColumns} dataSource={this.state.date} bordered />
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
const DistrictManage = Form.create()(districtManage);
export default connect(mapStateToProps)(DistrictManage);
