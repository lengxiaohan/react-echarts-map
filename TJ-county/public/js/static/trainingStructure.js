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
    render: function(){
        return(
             <div className="header">
                <TopLeftComponent />
                <TopRightComponent />
            </div>
        )
    }
});
/**
 * @name TopLeftComponent 头部饼图组件
 * @param _getDatas 获取饼图数据
 */
var TopLeftComponent = React.createClass({
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
        
        $.GetAjax($.getCtx()+'/rest/ectrain/getLearnTypeCount', setData,'GET', true, function(data) {
           if (data.length>0) {
                that.setState({
                    data:data
                });
            } else {
                setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('主人，刚才服务器出了一下小差');
                }, 2000);
                that.setState({
                    data:''
                });
            };
        });
    },

    render: function(){
        return(
            <PieComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas} />
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
        let lineColors = [ '#F67734', '#8DC909', '#EAE63D',
                'rgba(2,163,66,0.9)', 'rgba(125,0,222,0.9)',
                'rgba(0,104,222,0.9)', 'rgba(0,204,222,0.9)' ];
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
                            /* align: 'left', */
                            baseline : 'middle',
                            fontFamily : '微软雅黑',
                            fontSize : 15,
                            fontWeight : 'bolder'
                        }
                    },
                },
            });
        };
        let dom = that.refs['JsPie '];//findDOMNode从组件获取真实 DOM 的节点
        if(that.data && that.data.length > 0){
            let row;
            let sdatas = [];
            for ( let i = 0; i < that.data.length; i++) {
                row = that.data[i];
                let sdata = {
                    value : row.persons,
                    name : row.learnType + "" + row.persons,
                    itemStyle : itemStyles[i],
                }
                sdatas.push(sdata);
            };
            this.getCanvas({
                data: sdatas,
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
                        radius : [0, 90],
                        center:['50%','50%'],
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
                        data:obj.data
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
 * @param _getName 头部信息名称
 */
var TopRightComponent = React.createClass({
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
        
        $.GetAjax($.getCtx()+'/rest/ectrain/getPersonScale', setData,'GET', true, function(data) {
           if (data.length>0) {
                let dataPersons=data[0].persons+data[1].persons;
                that.setState({
                    dataPersons:dataPersons
                });
            } else {
                setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('主人，刚才服务器出了一下小差');
                }, 2000);
                that.setState({
                    dataPersons:''
                });
            };
        });
    },
    render: function(){
        return(
            <div id="topTitle" className="topTitle" >
                <div className="table">
                    <div className="title">累计培训人数</div>
                    <div className="personData">
                        <p className="personSum"> {this.state.dataPersons || 0}
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
        
        $.GetAjax($.getCtx()+'/rest/ectrain/getTBTrainTimeList', setData,'GET', true, function(data) {
           if (data && JSON.stringify(data) != "{}") {
                that.setState({
                    data:data
                });
            } else {
                setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('主人，刚才服务器出了一下小差');
                }, 2000);
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
 * @param _getName 头部信息名称
 */
var LineComponent = React.createClass({
    componentDidMount:function(){
        $("#bgimgqu").attr("class","press");
        $("#bgimgqu2").attr("class","free");
        $("#bgimgqu3").attr("class","press");
        $("#bgimgqu4").attr("class","free");
    },
    componentWillReceiveProps: function(nextProps) {
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    line:function(){
        toolbarSelf.__onMagicTypeItemName("line");
        $("#bgimgqu").attr("class","press");
        $("#bgimgqu2").attr("class","free");
    },
    bar:function(){
        toolbarSelf.__onMagicTypeItemName("bar");
        $("#bgimgqu").attr("class","free");
        $("#bgimgqu2").attr("class","press");
    },
    stack:function(){
        toolbarSelf.__onMagicTypeItemName("stack");
        $("#bgimgqu3").attr("class","press");
        $("#bgimgqu4").attr("class","free");
    },
    tiled:function(){
        toolbarSelf.__onMagicTypeItemName("tiled");
        $("#bgimgqu3").attr("class","free");
        $("#bgimgqu4").attr("class","press");
    },
    getSesstion() {
        const that = this;
        let itemStyles = [];
        let lineColors = [ '#8DC909', '#F67734', '#EAE63D','#8DC909','#8DC909','#8DC909','#8DC909'];
        let areaColors = [
            [[0, 'rgba(92,119,48,0.9)'],[0.8, 'rgba(96,127,51,0.9)']],//个人
            [[0, 'rgba(139,75,27,0.9)'],[0.8, 'rgba(135,72,31,0.9)']],//政府
            [[0, 'rgba(136,125,63,0.9)'],[0.8, 'rgba(134,125,58,0.9)']],//企业
            [[0, 'rgba(2,163,66,0.9)'],[0.8, 'rgba(2,163,66,0.5)']],//创业者
            [[0, 'rgba(0,204,222,0.9)'],[0.8, 'rgba(0,204,222,0.5)']],//店铺人员
            [[0, 'rgba(0,104,222,0.9)'],[0.8, 'rgba(0,104,222,0.5)']],//京川服务人员
            [[0, 'rgba(125,0,222,0.9)'],[0.8, 'rgba(125,0,222,0.5)']]//社区
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
                         color: (function() {
                             var zrColor = zrender.tool.color;
                             return zrColor.getLinearGradient(
                                 0, 0, 0, 100, areaColors[i]
                             )
                         })(),
                     }
                }
            });
        };
        let dom = this.refs['JsLine'];//findDOMNode从组件获取真实 DOM 的节点
        if(that.data!=' '&& null != that.data){
            let sdata = [],sdatas = [],xdata = [],xdatas = [];
            var myData = that.data;
            for ( let x in myData){
                for (let y in myData[x]){
                    sdata.push(myData[x][y].persons);
                    xdata.push(myData[x][y].dataTime);
                }
            };
            for(var i=0,len=sdata.length;i<len;i+=3){
               sdatas.push(sdata.slice(i,i+3));
               xdatas.push(xdata.slice(i,i+3));
            }
            this.getCanvas({
                id: dom,
                data1:sdatas[0],
                data2:sdatas[1],
                data3:sdatas[2],
                data4:sdatas[3],
                itemStyles1:itemStyles[0],
                itemStyles2:itemStyles[1],
                itemStyles3:itemStyles[2],
                itemStyles4:itemStyles[3],
                xdata:xdatas[0]
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
             toolbox: {
                 show: true,
                 orient: 'horizontal', 
                 x:'right', 
                 y: 'top', 
                 color: ['#20B1ED', '#E47337', '#B679DC', '#22bb22'],
                 backgroundColor: '#1F2353', // 工具箱背景颜色
                 borderColor: '#ccc', // 工具箱边框颜色
                 borderWidth: 0, // 工具箱边框线宽，单位px，默认为0（无边框）
                 padding: 10, // 工具箱内边距，单位px，默认各方向内边距为5，
                 showTitle: true,
                 feature: {
                     magicType: {
                         show: true,
                         title: {
                             line: '动态类型切换-折线图',
                             bar: '动态类型切换-柱形图',
                             stack: '动态类型切换-堆积',
                             tiled: '动态类型切换-平铺'
                         },
                         type: ['line', 'bar', 'stack', 'tiled'],
                     }
                 }
             },
             dataZoom: { //滑动块样式
                 show: false,
                 realtime: true,
                 start: 0,
                 end: 100,
                 height: 20,
                 borderWidth: 0,
                 borderColor: '#2a2f42',
                 backgroundColor: '#2a2f42',
                 dataBackgroundColor: '#2a2f42',
                 fillerColor: '#1C2134',
                 handleColor: '#3e5d75',
             },
             calculable: false,
             xAxis: [{
                 type: 'category',
                 boundaryGap : false,
                 /*boundaryGap:  false,[0,0],*/
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
             series: [{
                 name: 'name',
                 type: 'line',
                 stack: '总量',
                 barWidth: 55,
                 symbol: 'circle',
                 symbolSize: 2,
                 itemStyle: obj.itemStyles1,
                 data: obj.data1
             },{
                 name: 'name',
                 type: 'line',
                 stack: '总量',
                 barWidth: 55,
                 symbol: 'circle',
                 symbolSize: 2,
                 itemStyle: obj.itemStyles2,
                 data: obj.data2
             },
             {
                 name: 'name',
                 type: 'line',
                 stack: '总量',
                 barWidth: 55,
                 symbol: 'circle',
                 symbolSize: 2,
                 itemStyle: obj.itemStyles3,
                 data: obj.data3
             },
             {
                 name: 'name',
                 type: 'line',
                 stack: '总量',
                 barWidth: 55,
                 symbol: 'circle',
                 symbolSize: 2,
                 itemStyle: obj.itemStyles4,
                 data: obj.data4
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
            <div className="content">
                <div className="conbg">
                    <ul className="button">
                        <li id="bgimgqu" onClick ={this.line}>
                           <img alt="" src="./img/button-1.png" />
                        </li>
                        <li id="bgimgqu2" onClick ={this.bar}>
                           <img alt="" src="./img/button-2.png" />
                        </li>
                        <li id="bgimgqu3" onClick ={this.stack}>
                           <img alt="" src="./img/button-3.png" />
                        </li>
                        <li id="bgimgqu4" onClick ={this.tiled}>
                            <img alt="" src="./img/button-4.png" /> 
                        </li>
                    </ul>
                </div>
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