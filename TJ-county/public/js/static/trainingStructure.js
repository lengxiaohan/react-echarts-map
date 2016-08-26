"use strict";
import "trainingStructure";
import {getAreaName} from "common";
import "jquery";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';


// 获取区域id
let areaId = $.getUrlParam('areaId');

/**
 * @name topComponent 头部组件
 * @param _getName 头部信息名称
 */
var TopComponent = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentWillMount: function() {//加载数据。
        this._getDatas();
    },
    _getDatas: function() {
        const that = this;
        let setData = {
            "areaId": areaId ? areaId : '',
            dataType:'json',
            type:'GET'
        };
        $.GetAjax($.getCtx()+'/rest/ectrain/getTBLearnTimeTypeCount', setData,'GET', true, function(data,state) {
            if (state && data != '' && null != data) {
                that.setState({
                    data:data
                });
            } else {
                setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('链接服务器失败');
                }, 4000);
                that.setState({
                    data:''
                });
            };
       });
    },
    render: function(){
        return(
             <div className="header">
                <PieComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas} />
                <TopRightComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas}/>
            </div>
        )
    }
});

/**
 * @name PieComponent 饼图组件
 * @param _getName 头部信息名称
 */
var PieComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getSesstion() {
        const that = this;
        let itemStyles = [];    

        let lineColors = [ '#ff5f00 ', '#fcff00 ','#7df343','#01d7ac','#0cb0e6' ];
        for ( let i = 0; i <= lineColors.length; i++) {
            itemStyles.push({
                normal : {
                    color : lineColors[i],
                    labelLine : {
                        "show" : true,
                        length : 1,
                        lineStyle : {
                            color : lineColors[i],
                        },
                    },
                    label : {
                        position : 'outer',/* （外部） */
                        textStyle : {
                            color : lineColors[i],
                            baseline : 'middle',
                            fontFamily : '微软雅黑',
                            /*fontSize : 15 */
                            fontSize : $(window).height()/60
                        }
                    }
                }
            });
        };
        let dom = that.refs['JsPie '];//findDOMNode从组件获取真实 DOM 的节点
        if(that.data != '' && null != that.data){
            let sdatas = [];
            for ( let i in that.data ) {
                let row = that.data[i];
                let sdata = {
                    value : row,
                    name : i+row +"人次"
                }
                sdatas.push(sdata);
            };
            this.getCanvas({
                data: sdatas,
                itemStyles:itemStyles,
                id: dom
            });
        }else{
            this.getCanvas({
                data:'',
                id: dom
            });
        };
    },
    getCanvas:function(obj){
        const myChart = echarts.init(obj.id).clear();
        var datas=[];
        if(obj.data.length>0){
            for(let i=0;i<obj.data.length;i++){
                let value = obj.data[i].value;
                let name = obj.data[i].name;
                datas.push({
                    value: value,
                    name: name,
                    itemStyle : obj.itemStyles[i]
                })
            }
        }
        
        let option = { 
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}   ({d}%)"
                },
                calculable : false,
                series : [
                    {
                        name:'培训人员结构',
                        type:'pie',
                        selectedMode: 'single',
                       /* radius : [0, 90],*/
                       radius : [0, "92%"],
                        center:['50%','54%'],
                        x: '20%',
                        width: '40%',
                        funnelAlign: 'right',
                        max: 1548,
                        
                        itemStyle : {
                            normal : {
                                label : {
                                    position : 'inner'
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data:datas
                    }
                ]
        };
        myChart.setOption(option);
    },
    componentDidUpdate: function() {
        this.getSesstion();
    },
    render: function(){
        return(
            <div id="topPie" className="topPie" ref="JsPie "></div>
        )
    }
});

/**
 * @name topRightComponent 头部累计培训人数组件
 * @param getSesstion 处理信息
 */
var TopRightComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getSesstion() {
        const that = this;
        if(that.data != '' && null != that.data){
            let dataPersons = 0;
            let value;
            for ( let i in that.data ) {
                value = that.data[i];
                dataPersons+=value;
            };

            $(".personSum").html(dataPersons);
        }else{
            $(".personSum").html("");
        };
    },
    componentDidUpdate: function() {
        this.getSesstion();
    },
    render: function(){
        return(
            <div id="topTitle" className="topTitle" >
                <div className="table">
                    <div className="title">累计培训人数</div>
                    <div className="personData">
                        <p className="personSum"> 
                        </p>
                    </div>
                </div>
            </div>
        )
    }
});

/**
 * @name ConComponent 折线图数据加载组件
 * @param _getDatas 获取折线图数据
 */
var ConComponent = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {//加载数据。
        this._getDatas();
    },
    _getDatas: function() {
        const that = this;
        let setData = {
            "areaId": areaId ? areaId : '',
            dataType:'json',
            type:'GET'  
        };
        
        $.GetAjax($.getCtx()+'/rest/ectrain/getTBTrainTimeList', setData,'GET', true, function(data,state) {
           if (state && data != " " && null != data) {
                that.setState({
                    data:data
                });
            } else {
                setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('链接服务器失败');
                }, 4000);
                that.setState({
                    data:''
                });
            };
        });
    },
    render: function() {
        return (
            <LineComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas}/>
        )
    }
});

/**
 * @name LineComponent 折现图组件
 * @param getInitialState 初始化
 * @param _getName 头部信息名称
 */
var LineComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getSesstion() {
        const that = this;
        let itemStyles = [];
        let lineColors = [ '#ff5f00 ', '#fcff00 ', '#7df343 ',
            '#01d7ac ', '#0cb0e6'
            ];
        let areaColors = [
            'rgba(255,95,0,0.5)', 'rgba(252,255,0,0.5)', 'rgba(125,243,67,0.5)',
            'rgba(1,215,172,0.5)', 'rgba(17,176,230,0.5)'
            ];
        for ( let i = 0; i < lineColors.length; i++) {
            itemStyles.push({
                normal: {
                     lineStyle: { //上面线条样式
                         color: lineColors[i],
                         width: 4,
                     },
                     color: lineColors[i], //决定了上面远点的样式
                     areaStyle: {
                         type: 'default',
                         color: areaColors[i],
                     }
                }
            });
        };
        let dom = this.refs['JsLine'];//findDOMNode从组件获取真实 DOM 的节点
        if(that.data !=' '&& null != that.data ){
              let array=[];           
              for(let index in that.data){
                    let key=index; //电商课程分类名字 
                    let value=that.data[index];//电商课程列表
                    let x=[];
                    let y=[];
                    for(let i=0;i<value.length;i++){
                         let dataTime=value[i].dataTime;
                         let persion=value[i].persons;
                         x.push(dataTime);
                         y.push(persion);
                    }
                    let obj=new Object();
                    obj.x=x;//x轴名称
                    obj.y=y;//对应数值
                    obj.name=key;//类型名称
                    array.push(obj);
            };
            this.getCanvas({
                id: dom,
                data:array,
                itemStyles:itemStyles,
                xdata:array[0].x
            });
        }else{
            this.getCanvas({
                data:'',
                id: dom
            });
        };
    },
    getCanvas:function(obj){
        const myChart = echarts.init(obj.id,'macarons').clear();
        let datas=obj.data;
        let itemStyles=obj.itemStyles;
        let series=[];
        for(let i=0;i<datas.length;i++){
            let data=datas[i];
            series.push( {
                 name: 'name',
                 type: 'line',
                 stack: '总量',
                 barWidth: 55,
                 symbol: 'emptyCircle',
                 symbolSize: 5,
                 itemStyle: itemStyles[i],
                 data: data.y
             });
        }             
        let option = { 
             grid: {
                 borderWidth: 0,
                 width:'92%',
             },
             tooltip: {
                 show:false,
                 trigger: 'axis',
                 axisPointer: {
                     "type": "line",
                     "lineStyle": {
                         "color": "#fff",
                         "width": 0,
                         "type": "solid"
                     },
                 }
             },
             grid: {
               height:'85%',
               width:'90%',
               x:'5%',
               y:'3%',
               x2:'95%',
               y2:'88%',
               borderColor:'rgba(125,0,222,0.0)'
             },
             calculable: false,
             xAxis: [{
                 type: 'category',
                 boundaryGap : false,
                 //boundaryGap:  false,[0,0],
                 axisLine: { //坐标轴线，默认显示
                     show: true,
                     lineStyle: {
                         color: '#6C7A8F',
                         width: 2,
                         type: 'solid',
                     },
                 },
                 splitLine: {
                     show: false,
                     lineStyle: {
                         color: '#fff',
                         width: 1,
                     },
                 },
                 axisLabel: {
                     textStyle: {
                         color: '#adb3c0',
                     },
                 },
                 data: obj.xdata
             }],
             yAxis: [{
                 type: 'value',
                 axisLine: { 
                     lineStyle: {
                         color: '#6C7A8F',
                         width: 2,
                         type: 'solid',
                     },
                 },
                 axisLabel: {
                     interval: 100,
                     textStyle: {
                         color: '#adb3c0',
                     },
                 },
                 splitLine: {
                     show: false,
                 },
                 splitArea: {
                     show: true,
                     areaStyle: {
                         color: ['#14192c', '#161B2E'],
                     },
                 },
             }],
             series: series
        };
        myChart.setOption(option);
    },
    componentDidUpdate: function() {
        this.getSesstion();
    },
    render: function(){
        return(
            <div className="content">
                <div id="conLine" className="conLine"  ref="JsLine"  ></div>
            </div>
        )
    }
});

/**
 * @param Container   总组件
 */
var Container = React.createClass({
    render: function() {
        return (
            <div className="con" id="con">
                <TopComponent />
                <ConComponent />
            </div>
        )
    }
});

/**
 * @param 添加整个Container组件到页面
 */
ReactDOM.render(
    <Container />,
    document.body
);