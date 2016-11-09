"use strict";
import {getAreaName,addPlaceHolder,splitString} from "common";
import "jquery";
import "ajax-plus";
import "./common/screenPropor.js";
import "expressDot";
import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');
// 获取区域name
let name = $.getUrlParam('name');
// 获取区域shortName
let shortName = $.getUrlParam('shortName');

// let pointSize;
// console.log(areaId.toString().length);

/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
    componentDidUpdate:function(){
        $("#name").html(shortName);
    },
    render: function() {
        return (
            <div className="header">
                <p>
                    <span id="name"></span>&nbsp;&nbsp;
                   {/* <span id="types"></span>*/}
                    快递网点分布
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
                <NavComponent data={this.props.data} />
                <LeftMapComponent data={this.props.data}/>
               {/* <RightCountComponent data={this.props.data}/>*/}
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
    componentWillMount:function(){
         this.setState({
            data:""
        });
    },
    componentWillUpdate:function(props,state){//在接收到新的 props 或者 state 之前立刻调用。
        var data=props.data.data;
        let arr = data.sum ? data.sum : []; //获取数据进行遍历赋值
        if(!arr.length>0||state.ready){
            return false;
        }
        let sum = 0;
        for(let i = 0;i<arr.length; i++){
            if(arr[i].name == "物流" || arr[i].name == "快递"){
                 sum += arr[i].num;
            }
        }
        let datatime = arr[0].datatime.toString();
        let year = splitString(datatime,0,4);
        let SumPeople = (sum > 0) ? sum : '--';
        $(".year").html(year?(year+"年") : "");
        $("#sum").html(SumPeople);
    },
    componentDidUpdate:function(){
        $(".name").html(shortName);
    },
    render: function() {
        return (
            <div className="nav">
                <p >
                    <span className="name"></span>&nbsp;&nbsp;
                    <span className="year"></span>&nbsp;&nbsp;
                    {/*<span className="types"></span>*/}
                    快递网点总数&nbsp;&nbsp;
                    <span id="sum">--</span>
                    个
                </p>
            </div>
        )
    }
});

/**
 * @name LeftMapComponent 左边地图组件
 * @param _getName 头部信息名称
 */
var LeftMapComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {//在接收到新的 props 或者 state 之前立刻调用。
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getInit:function(){
        const that = this;
        let dom = that.refs['map'];//findDOMNode从组件获取真实 DOM 的节点
        let arr = that.data ? that.data.data : []; //获取数据进行遍历赋值
        let markerExp = [];
        let point = [];
        if(arr){
            markerExp = arr.list["快递"] ? arr.list["快递"] : "" ;
            point = arr.express ? arr.express : (103.9526, 30.7617);
            this.getCanvas({
                id: dom,
                markerExp:markerExp,
                point: point
            });
        }else{
            this.getCanvas({
                id: dom,
                markerExp:'',
                point: (103.9526, 30.7617)
            });
        }
    },  
    getCanvas:function(obj) {

        let map = new BMap.Map(obj.id);
        let point = new BMap.Point(obj.point);
        map.centerAndZoom(point, 16);//标注中心点
        map.enableScrollWheelZoom(true);//鼠标缩放
        
        //地图样式设置
        var styleJson = [{
                "featureType": "background",
                "elementType": "all",
                "stylers": {}
            }, {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                    "color": "#000033",
                    "hue": "#000033"
                }
            }, {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#000033",
                    "hue": "#000033"
                }
            }, {
                "featureType": "green",
                "elementType": "all",
                "stylers": {
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "1.5",
                    "visibility": "off"
                }
            }, {
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                    "color": "#000033",
                    "hue": "#000033"
                }
            }, {
                "featureType": "building",
                "elementType": "all",
                "stylers": {
                    "color": "#000033",
                    "hue": "#000033"
                }
            }, {
                "featureType": "road",
                "elementType": "all",
                "stylers": {
                    "color": "#292988 ",
                    "hue": "#292988"
                }
            }, {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#bb2b2b",
                    "hue": "#c32f2f",
                    "visibility": "off"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#292988",
                    "hue": "#292988",
                    "visibility": "off"
                }
            },
            [{
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#bb2b2b",
                    "hue": "#c32f2f",
                    "visibility": "off"
                }
            }, {
                "featureType": "arterial",
                "elementType": "all",
                "stylers": {
                    "color": "#292988",
                    "hue": "#292988",
                    "weight": "1.5",
                    "visibility": "on"
                }
            }], {
                "featureType": "local",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },
            [{
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#bb2b2b",
                    "hue": "#c32f2f",
                    "visibility": "off"
                }
            }, {
                "featureType": "railway",
                "elementType": "all",
                "stylers": {
                    "color": "#292988",
                    "hue": "#292988",
                    "weight": "1.5",
                    "visibility": "on"
                }
            }], {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                    "color": "#292988",
                    "hue": "#292988"
                }
            },
            [{
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#bb2b2b",
                    "hue": "#c32f2f",
                    "visibility": "off"
                }
            }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "1.5",
                    "visibility": "off"
                }
            }], {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "3.5",
                    "visibility": "on"
                }
            }, {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "3.5",
                    "visibility": "on"
                }
            },
            
            {
                    "featureType": "administrative",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#000368",
                              "hue": "#000368",
                              "visibility": "off"
                    }
           },
            {
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b"
                }
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#bb2b2b",
                    "hue": "#c32f2f",
                    "visibility": "off"
                }
            }
          
        ]
        map.setMapStyle({
            styleJson: styleJson
        });
        //行政区域覆盖图
        function getBoundary() {
            let bdary = new BMap.Boundary();
            bdary.get(name? (name).toString() : '', function(rs) { //获取行政区域
                // map.clearOverlays(); //清除地图覆盖物       
                let count = rs.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    // alert('未能获取当前输入行政区域');
                    return;
                }
                let pointArray = [];
                for (let i = 0; i < count; i++) {
                    let ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 1,
                        strokeColor: "rgba(0,153,255,1)",
                        fillColor: "rgba(0,153,255,0.1)"
                    }); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
                map.setViewport(pointArray); //调整视野  
                // addlabel();
            });
            
        }; 

        getBoundary();
        let markerExp = obj.markerExp;//快递
        points(markerExp);

        // 添加海量点数据方法
        function points(markerExp){
            let pointsExp = [];  //快递(方块)
            let express = {//快递（方块）
                size: (2,2),
                shape: BMAP_POINT_SHAPE_WATERDROP,//BMap_Symbol_SHAPE_STAR
                color: 'rgba(102,204,0,0.6)'
            }
            for (let i = 0; i < markerExp.length; i++) {//快递
                pointsExp.push(new BMap.Point(markerExp[i][0], markerExp[i][1])); 
            }; 

            let pointExp = new BMap.PointCollection(pointsExp, express);  // 初始化PointCollection
            map.addOverlay(pointExp);  // 添加Overlay
        }
    },
    componentDidUpdate: function() {
        this.getInit();
        $(".map").css("background-color","#000033");
    },
    render: function() {
        return (
            <div className="map" ref="map">
            </div>
        )
    }
});

/**
 * @name RightCountComponent 左边地图组件
 * @param _getName 头部信息名称
 */
// var RightCountComponent = React.createClass({
//     componentWillMount:function(){
//          this.setState({
//             data:""
//         });
//     },
//     componentWillUpdate:function(props,state){//在接收到新的 props 或者 state 之前立刻调用。
//         var data=props.data.data;
//         let arr = data.sum ? data.sum : []; //获取数据进行遍历赋值
//         if(!arr.length>0||state.ready){
//             return false;
//         }
//         let logsum,expsum;
//         for(let i = 0;i<arr.length; i++){
//             if(arr[i].name == "物流"){
//                 logsum = (arr[i].num>0) ? arr[i].num : '' ;
//             }
//             if(arr[i].name == "快递"){
//                 expsum = (arr[i].num>0) ? arr[i].num : '' ;
//             }
//         }
//         let LogisticalSum = logsum ? logsum :'--';
//         let expressSum = expsum ? expsum :'--';
//         $(".LogisticalSum").html(LogisticalSum);
//         $(".expressSum").html(expressSum);
//     },  
//     render: function() {
//         return (
//             <div className="count">
//                 <div className="Logistical">
//                     <div>
//                         <p>物流网点数</p>
//                         <p><span className="LogisticalSum">--</span>个</p>
//                     </div>
//                 </div>
//                 <div className="express">
//                      <div>
//                         <p>快递网点数</p>
//                         <p><span className="expressSum">--</span>个</p>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// });


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
            // "page": 1,
            // "pageSize": 1000,
            "needRows":50,
            "areaId": areaId ? areaId : '',
        };
        $.GetAjax($.getCtx()+'/rest/logistics/sumsAndSingleList', setData, 'GET', true, function(data,state) {
        // $.GetAjax('/TJ-province/public/data/sumsAndList.json', setData, 'GET', true, function(data,state) {
            if (state && data.code == 0) {

                $.onloadJavascript("http://api.map.baidu.com/getscript?v=2.0&ak=p1HvozA9RVGAH0paTm61GRzRRAnfTeHQ&services=&t=20160913114210", true, true,function(){
                    that.setState({
                        data:data
                    });
                });
                setTimeout(function(){
                    $('.onLoading').remove();
                    $(".con").css("opacity","1",);
                    $('.largeScreen').css("background","rgba(0, 0, 51, 0)");
                    $('.smallScreen').css("background","rgba(0, 0, 51, 0)");
                    $('body').css("border","0px");
                },1000);

            } else if(!state) {
               setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('主人，刚才服务器出了一下小差');
                }, 2000);
            } else {
                $.noDataFunc();
            }

        });
    },
    render: function() {
        return (
            <div  id="content">
                 <HeaderComponent />
                 <ConComponent data={this.state.data ? this.state.data : []}  getDatas={this._getDatas}/>
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