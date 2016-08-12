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
 * @param _getName 头部信息名称
 */
var TopLeftComponent = React.createClass({
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
                        center:['50%','40%'],
                        // for funnel
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
                console.log(dataPersons);
                that.setState({
                    dataPersons:dataPersons
                });
                console.log(dataPersons);
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
                            <p className="unit">人</p>
                        </p>
                        
                    </div>
                </div>
            </div>
        )
    }
});

/**
 * @name ConComponent 折线图组件
 * @param _getName 头部信息名称
 */
var ConComponent = React.createClass({
    render: function() {
        return (
            <div id="conLine"></div>
        )
    }
});


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