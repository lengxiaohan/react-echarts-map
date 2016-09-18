"use strict";
import "expressDot";
import {getAreaName,getMapPosition} from "common";
import "jquery";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');

// 获取区域name
let name = $.getUrlParam('name');
/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
    componentDidUpdate:function(){
        $("#name").html(name);
    },
    render: function() {
        console.log(name);
        return (
            <div className="header">
                <p>
                    <span id="name"></span>
                    <span >&nbsp;&nbsp;2025年12月</span>
                    <span >&nbsp;&nbsp;快递物流网点分布</span>
                </p>
            </div>
        )
    }
});

/**
 * @name NavComponent Nav标题组件
 * @param _getName 列表表头信息
 * @param componentWillMount 初始化渲染前调用
 * @param componentWillUpdate 在接收到新的 props 或者 state 之前立刻调用。
 */
var NavComponent =React.createClass({
    componentDidUpdate:function(){
        $(".name").html(name);
    },
    render: function() {
        console.log(name);
        return (
            <div className="nav">
                <p >
                    <span className="name"></span>
                    <span >&nbsp;&nbsp;2025年</span>
                    <span >&nbsp;&nbsp;快递物流网点总数</span>
                    <span >&nbsp;&nbsp;146</span>
                </p>
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
                <LeftMapComponent/>
                <RightCountComponent/>
            </div>
        )
    }
});

/**
 * @name LeftMapComponent 左边地图组件
 * @param _getName 头部信息名称
 */
var LeftMapComponent = React.createClass({
    getInit() {
       var map = new BMap.Map("map");
        var point = new BMap.Point(103.9526, 30.7617);
        map.centerAndZoom(point, 15);//标注中心点
        map.enableScrollWheelZoom(true);//鼠标缩放

        //地图样式设置
        var styleJson = [{
                    "featureType": "background",
                    "elementType": "all",
                    "stylers": {}
            },{
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },{
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },{
                "featureType": "green",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },{
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                          "color": "#000000",
                          "hue": "#000000"
                }
            },{
                "featureType": "building",
                "elementType": "all",
                "stylers": {
                          "color": "#000000",
                          "hue": "#000000"
                }
            },{
                "featureType": "road",
                "elementType": "all",
                "stylers": {
                          "color": "#190079",
                          "hue": "#190079"
                }
            },{
                "featureType": "highway",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
                }
            },{
                "featureType": "arterial",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },{
                "featureType": "local",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            }, {
                "featureType": "railway",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
                }
            }, {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
                }
            }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
                }
            },{
                "featureType": "administrative",
                "elementType": "all",
                "stylers": {
                          "color": "#0c003b",
                          "hue": "#0c003b"
                }
            },{
                "featureType": "label",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
                }
            },{
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            }
        ]
        map.setMapStyle({
            styleJson: styleJson
        });
        //行政区域覆盖图
        function getBoundary() {
            let bdary = new BMap.Boundary();
            bdary.get("成都市", function(rs) { //获取行政区域
                // map.clearOverlays(); //清除地图覆盖物       
                let count = rs.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                }
                let pointArray = [];
                for (let i = 0; i < count; i++) {
                    let ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 4,
                        strokeColor: "rgba(65,148,253,1)",
                        fillColor: "rgba(17,18,77,0.7)"
                    }); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
                map.setViewport(pointArray); //调整视野  
                // addlabel();
            });
        };
        //添加物流标注坐标
        let markerLog = [  
            { title: "名称：双流县", point: "103.92,30.58"},  
            { title: "名称：锦江区", point: "104.08,30.67"},  
            { title: "名称：青羊区", point: "104.05,30.68"}  
        ];  
        //添加快递标注坐标
        let markerExp = [  
            { title: "名称：金牛区 ", point: "104.05 ,30.70"},
            { title: "名称：新都 ", point: "104.13,30.82"},
            { title: "名称：郫县  ", point: "103.88 ,30.82"}
        ];  
        // 添加物流标注方法
        function PointLog(point, index) {  
            // var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png",  
            let Logistical = new BMap.Icon("img/redxin.png",  //物流
                new BMap.Size('50%', '50%'), {  
                    // 指定定位位置
                    offset: new BMap.Size(25, 25),  
                    // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置   
                    imageOffset: new BMap.Size(0, 0 - index * 25)  // 设置图片偏移  
                });  
            let markerLogistical = new BMap.Marker(point, { icon: Logistical });  
            map.addOverlay(markerLogistical); 
            return markerLogistical;  
        };
         // 添加快递标注方法
        function PointExp(point, index) {  
            let express = new BMap.Icon("img/bulexin.png",  //快递
                new BMap.Size('50%', '50%'), {  
                    // 指定定位位置
                    offset: new BMap.Size(25, 25),  
                    // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置   
                    imageOffset: new BMap.Size(0, 0 - index * 25)  // 设置图片偏移  
                });  
            let markerExpress = new BMap.Marker(point, { icon: express });  
            map.addOverlay(markerExpress); 
            return markerExpress;  
        };
        getBoundary();
        //执行行政区域覆盖图和添加标注方法
        for (let i = 0; i < markerLog.length; i++) {  
            let p0 = markerLog[i].point.split(",")[0];  
            let p1 = markerLog[i].point.split(",")[1];  
            let maker = PointLog(new window.BMap.Point(p0, p1), i);  
        };
        for (let i = 0; i < markerExp.length; i++) {  
            let p0 = markerExp[i].point.split(",")[0];  
            let p1 = markerExp[i].point.split(",")[1];  
            let maker = PointExp(new window.BMap.Point(p0, p1), i);  
        };
    },
    componentDidUpdate: function() {
        this.getInit();
    },
    render: function() {
        return (
            <div className="map" id="map">
            </div>
        )
    }
});

/**
 * @name RightCountComponent 左边地图组件
 * @param _getName 头部信息名称
 */
var RightCountComponent = React.createClass({
    render: function() {
        return (
            <div className="count">
                <div className="Logistical">
                    <div>
                        <p>物流网点数</p>
                        <p><span>36</span>个</p>
                    </div>
                </div>
                <div className="express">
                     <div>
                        <p>快递网点数</p>
                        <p><span>107</span>个</p>
                    </div>
                </div>
            </div>
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
    _getDatas: function() {//加载数据方法
        const that = this;
        let setData = {
            "areaId": areaId ? areaId : '',
            dataType:'json',
            type:'GET',
            needAll:true
        };
        // $.GetAjax($.getCtx()+'/rest/areaSale/getAreaScale', setData, 'GET', true, function(data) {
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
            <div  id="content">
                 <HeaderComponent/>
                 <NavComponent/>
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