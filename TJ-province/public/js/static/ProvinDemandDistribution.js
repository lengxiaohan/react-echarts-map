"use strict";
import "SaleDistribution";
import {getAreaName,getMapPosition} from "common";
import "jquery";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');
//非必传参数 Android传过来的
let itemName = $.getUrlParam('itemName')?$.getUrlParam('itemName'):'';
//获取路径
let urlCtx = $.getCtx();
/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
    _getName: function() {
        const name = ['全国消费者对','农产品需求热度分布'];
        return name;
    },
    componentDidUpdate:function(){
        function GetRequest() { 
            const url = location.search; //获取url中"?"符后的字串 
            const theRequest = new Object(); 
            if (url.indexOf("?") != -1) { 
                const str = url.substr(1); 
                const strs = str.split("&"); 
                for(let i = 0; i < strs.length; i ++) { 
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
                } 
            } 
            return theRequest; 
        }; 
        let Request = new Object(); 
        Request = GetRequest(); 
        const name = Request['name']; 
        $("#areaName").html(name);
    },
    render: function() {
        return (
            <div className="header">
                <div className="head-left"></div>
                <div className="head-con">
                    <img alt="header" src="./img/head-bg.png"/>
                    <p>{this._getName()[0]}<label id="areaName"></label>{this._getName()[1]}</p>
                </div>
                <div className="head-right"></div>
            </div>
        )
    }
});

/**
 * @name ConComponent 主要内容组件
 * @param _getName 头部信息名称
 */
var ConComponent = React.createClass({
    render: function() {
        return (
            <div className="con">
                <ConListComponent data={this.props.data}/>
                <LegendComponent/>
                <GetMapComponent data={this.props.data}  />
            </div>
        )
    }
});

/**
 * @name ConComponent 主要内容里列表组件
 * @param componentDidMount 初始化渲染后调用
 * @param componentDidUpdate 新的props更新后调用
 * @param _getName 列表表头信息
 */
var ConListComponent =React.createClass({
    _addPlaceHolder:function(number){//不足两位数补零
        var len=(""+number).length;
        if(len==1){
            number="0"+number;
        }else{
            number=number;
        };
        return number;
    },
    componentWillMount:function(){
         this.setState({
            dom:""
        });
    },
    componentWillUpdate:function(props,state){//在接收到新的 props 或者 state 之前立刻调用。
        var data=props.data;
        let arr = data.infos ? data.infos : []; //获取数据进行遍历赋值
        if(!arr.length>0||state.ready){
            return false;
        }
        let size=10;//每页行数
        let page=1;
        let pageTotal;//总页数
        let rest =arr.length%size;//总数据除以每页个数后余下行数
        if(rest=0 ){
            pageTotal=arr.length/size;
        }else{
            pageTotal=Math.ceil(arr.length/size);
        };
        let listArray=[];
        let index = 0;//第一页
        let newIndex=0;
        for(let i=0;i<10;i++){
            listArray.push(arr[i]);

        };
        var that=this;
        var dom = listArray.map(function(item,list){
            index = Number(index+1);
            newIndex = that._addPlaceHolder(index);
            return <SectionListComponent item={item} list={list} newIndex={newIndex}/>
        });
        
        this.setState({
            dom:dom,
            ready:true
        });
        setInterval(function(){
            page+=1;
            if(page>pageTotal){
                page=1;
            }
            listArray=[];
            let startPoint=(page-1)*size;
            let endPoint=page*size;
            for(let i=startPoint;i<endPoint;i++){
                    listArray.push(arr[i]);
            }
            var dom = listArray.map(function(item,list){
                index = index >= pageTotal*10 ? 1 : index+1;
                newIndex = that._addPlaceHolder(index);
                return <SectionListComponent item={item} list={list} newIndex={newIndex}/>
            });
            that.setState({
                dom:dom,
                ready:true
            });
        },3000)
    },
    _getName: function() {
        const name = '需求省份分布';
        return name;
    },
    render: function() {
        return (
            <div className="list">
                <div className="table" >
                    <div className="thead">
                        <ul>
                            <li >{this._getName()}</li>
                        </ul>
                    </div>
                    <div className="tbody">
                        {this.state.dom}
                    </div>
                </div>
            </div>
        )
    }
});

/**
 * @name SectionListComponent 内容中列表行组件
 * @param componentWillReceiveProps 当该组件接收到新的props时调用
 */
var SectionListComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        this.item=nextProps.item;
        this.setState({
            updata:true
        });
    },
    render: function() {
        this.item=this.props.item;
        return (
            <ul>
                <li  ><span>{this.item? this.props.newIndex: ''}</span></li>
                <li  >{this.props.item ? this.props.item.areaName  : ''}</li>
                <li  >{this.props.item ? this.props.item.scale : ''}</li>
            </ul>
        )
    }
});


/**
 * @name LegendComponent 图例组件
 * @param _getText 右部文字信息
 */
var LegendComponent = React.createClass({
	render: function(){
		return (
			<div className="legend">
                <label>需求度：&nbsp;&nbsp;</label>
				<div><img alt="Legend" src="./img/redxin.png" className="xinxin"/><label>需求度&nbsp;高</label></div>
                <div><img alt="Legend" src="./img/yellowxin.png" className="xinxin"/><label>需求度&nbsp;中</label></div>
                <div><img alt="Legend" src="./img/bulexin.png" className="xinxin"/><label>需求度&nbsp;低</label></div>
			</div>
		)
	}
});

/**
 * @name GetMapComponent 地图部分组件
 * @param componentDidUpdate 更新后调用。
 * @param componentWillReceiveProps 在接收到新的props时，会调用这个方法。
 * @param getCanvas 计算生成echarts的option属性
 */
var GetMapComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getSesstion() {
        const that = this;
        //获取数据的平均值，两个分界点数据，以使右边地图图标正确显示
        let rowDatas = that.data["infos"]?that.data["infos"]:'';
        let dom = that.refs['JsMap '];//findDOMNode从组件获取真实 DOM 的节点
        if(rowDatas && rowDatas.length){
            let dataLen=rowDatas.length;
            let dataSum=0;
            let dataAverage,rowData;
            for (let i =0;  i<dataLen; i++) {
                rowData = rowDatas[i];
                dataSum+=parseInt((parseFloat(rowData["scale"])).toFixed(2));
            };
            dataAverage=dataSum/31;
            let dataMax=rowDatas[0].scale;
            let dataMin=rowDatas[30].scale;
            let dataone=((dataMin+dataAverage)/2).toFixed(1);
            let datatwo=((dataMax+dataAverage)/2).toFixed(1);   
            this.getCanvas({
                data: that.data.infos,
                id: dom,
                dataone:dataone,
                datatwo:datatwo
            });
        }else{
            this.getCanvas({
                data:'',
                id: dom,
                dataone:'',
                datatwo:''
            });
        };

    },
    componentDidUpdate: function() {
        this.getSesstion();
    },
    getCanvas: function(obj) {
        const myChart = echarts.init(obj.id).clear();
        let option = {
                    color : [ 'rgba(255, 255, 255, 0.8)',
                            'rgba(14, 241, 242, 0.8)',
                            'rgba(37, 140, 249, 0.8)' ],
                    legend : {
                        orient : 'vertical',
                        x : 'left',
                        data : [],
                        textStyle : {
                            color : '#fff'
                        }
                    },
                    series : [
                    {
                        name : '弱',
                        type : 'map',
                        mapType : 'china',
                        textFixed : {
                            '新疆' : [ 30, 20 ],
                        },
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false,
                                    textStyle : {
                                        color : '#fff'
                                    }
                                },
                                borderWidth : 1,
                                borderColor : '#000033',
                                areaStyle : {
                                    // 区域图，纵向渐变填充
                                    type : 'default',
                                    color : (function() {
                                        var zrColor = zrender.tool.color;
                                        return zrColor.getLinearGradient(
                                            0,200,0,400,[
                                                [ 0,'rgba(0,102,255,0.4)' ],
                                                [ 0,'rgba(0,102,255,0.4)' ] ])
                                    })()
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    textStyle : {
                                        color : '#0066ff',
                                        fontSize : 1
                                    }
                                },
                                color : '#0066ff',
                                opacity : 0.2
                            }
                        },
                        data : [],
                        markPoint : {
                            symbol : 'image://'+urlCtx+'/img/bulexin.png',
                            symbolSize : 9,
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    color : '#ed8953'
                                }
                            },
                            data : (function() {
                                var passData = [];
                                var len = obj.data.length ;
                                var geoCoord;
                                var areaName;
                                var value;
                                while (len--) {
                                    areaName = obj.data[len]["areaName"];
                                    value = obj.data[len ]["scale"].toFixed(2);
                                    geoCoord =getMapPosition().get(areaName);
                                     value = Number(value);
                                     var num1 = Number(obj.dataone);
                                    if( value>0 && value < num1){
                                        if(geoCoord==null||"null"==geoCoord){
                                            return false;
                                        }else{
                                            passData.push({
                                                name : areaName + len,
                                                value : value,
                                                geoCoord : [geoCoord[0],
                                                            geoCoord[1]]
                                            });
                                           
                                        };
                                        
                                    }
                                }
                                return passData;
                            })()
                        }
                    },
                    {
                        name : '中',
                        type : 'map',
                        mapType : 'china',
                        data : [],
                        markPoint : {
                            symbol : 'image://'+urlCtx+'/img/yellowxin.png',//diamond
                            symbolSize : 9,
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    color : '#ed8953'
                                }
                            },
                            data : (function() {
                                var passData = [];
                                var len = obj.data.length ;
                                var geoCoord;
                                var areaName;
                                var value;
                                while (len--) {
                                    areaName = obj.data[len]["areaName"];
                                    value = obj.data[len ]["scale"];
                                     geoCoord =getMapPosition().get(areaName);
                                     value = Number(value);
                                     var num1 = Number(obj.dataone);
                                     var num2 = Number(obj.datatwo);
                                    if(value >= num1 && value < num2 ){
                                        if(geoCoord==null||"null"==geoCoord){
                                            return false;
                                        }else{
                                            passData.push({
                                                name : areaName + len,
                                                value : value,
                                                geoCoord : [geoCoord[0],
                                                            geoCoord[1]  ]
                                            });
                                        };
                                    }
                                }
                                return passData;
                            })()
                        }
                    },
                    {
                        name : '强',
                        type : 'map',
                        mapType : 'china',
                        data : [],
                        markPoint : {
                            symbol : 'image://'+urlCtx+'/img/redxin.png',//diamond
                            symbolSize : 9,
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    color : '#ed8953'
                                }
                            },
                            data : (function() {
                                var passData = [];
                                var len = obj.data.length ;
                                var geoCoord;
                                var areaName;
                                var value;
                                while (len--) {
                                    areaName = obj.data[len]["areaName"];
                                    value = obj.data[len ]["scale"];
                                     geoCoord =getMapPosition().get(areaName);
                                     value= Number(value);
                                    var num2 = Number(obj.datatwo);
                                    if(value >= num2){
                                     
                                        if(geoCoord==null||"null"==geoCoord){
                                            return false;
                                        }else{
                                            passData.push({
                                                name : areaName + len,
                                                value : value,
                                                geoCoord : [geoCoord[0] ,
                                                            geoCoord[1] ]
                                            });
                                        };
                                    }
                                }
                                return passData;
                            })()
                        }
                    }

                    ]

            };
        myChart.setOption(option);
    },
    
    render: function() {
        return (
            <div className="jsmap" ref="JsMap "></div>
        )
    }
});
var Container = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {//加载数据。当加载成功，将数据存储在 state 中，触发 render 来更新你的 UI。
        this._getDatas();
    },
	_getDatas: function() {
		const that = this;
		let setData = {
            "areaId": areaId ? areaId : '',
            dataType:'json',
            type:'GET',
            needAll:true
		};
		// $.GetAjax($.getCtx()+'/rest/areaRequirement/getRequirementScale', setData, 'GET', true, function(data) {
         $.GetAjax('/TJ-province/public/data/getAreaScale.json', setData, 'GET', true, function(data) {
           if (data.infos.length>0) {
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
			<div id="content">
	       		 <HeaderComponent />
	       		 <ConComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas} />
	        </div>
		)
	}
});

/**
 * @param 添加整个Container组件到页面
 */
ReactDOM.render(
	<Container />,
	document.getElementById('con')
);