"use strict";
import {getAreaName,getMapPosition,splitString,addPlaceHolder } from "common";
import "expressDotDetails";
import "./common/screenPropor.js";
import "jquery";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');
// 获取区域name
let name = $.getUrlParam('name');
// 获取区域shortName
let shortName = $.getUrlParam('shortName');

/**
 * @name HeaderComponent 头部组件
 */
var HeaderComponent = React.createClass({
    componentWillMount:function(){
         this.setState({
            data:""
        });
    },
    componentDidMount: function () {
        var windowWidth = $(window).height()*0.003;
        $('.headerLine').css({
            borderTop:''+windowWidth+ 'px solid rgba(0, 153, 255, 0.5)'
        });
    },
    componentWillUpdate:function(props,state){//在接收到新的 props 或者 state 之前立刻调用。
        var data=props.data.data;
        let arr = data.sum ? data.sum : []; //获取数据进行遍历赋值
        if(!arr.length>0||state.ready){
            return false;
        }
        let typeone = arr[0].name? arr[0].name : " ";
        let typetwo = arr[1].name? arr[1].name : " ";
        let types= typeone + typetwo;
        $("#types").html(types);
    },
    componentDidUpdate:function(){
        $("#areaName").html(name);
    },
    render: function() {
        return (
            <div className="header">
                <div className="head-left headerLine"></div>
                <div className="head-con">
                    <img alt="header" src="./img/head-bg.png"/>
                    <p><label id="areaName"></label>&nbsp;&nbsp;<span id="types"></span>网点分布</p>
                </div>
                <div className="head-right headerLine"></div>
            </div>
        )
    }
});

/**
 * @name CountComponent 统计信息与地图组件
 * @param _getName 头部信息名称
 */
var CountComponent = React.createClass({
    render: function() {
        return (
            <div className="left">
                <ExpressComponent data={this.props.data}/>
                <GetMapComponent  data={this.props.data}/>
                <LegendComponent/>
            </div>
        )
    }
});


/**
 * @name ExpressComponent 左边统计组件
 * @param _getName 头部信息名称
 */
var ExpressComponent = React.createClass({
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
        let datatime = arr[0].datatime.toString();
        let year = splitString(datatime,0,4);
        let month = addPlaceHolder(splitString(datatime,4,6));
        let types= arr[0].name + arr[1].name;
        let sum = arr[0].num + arr[1].num;
        $(".year").html(year);
        $(".types").html(types);
        $("#sum").html(sum);
    },
    componentDidUpdate:function(){
        $(".name").html(name);
    },
    render: function() {
        return (
            <div className="count">
                <div className="express">
                     <div>
                        <p><span className="name"></span>&nbsp;&nbsp;<span className="year"></span>年</p>
                        <p> <span className="types"></span>网点总数&nbsp;&nbsp;</p>
                        <p> <span id="sum"></span>个</p>
                    </div>
                </div>
            </div>
        )
    }
});

/**
 * @name GetMapComponent 地图部分组件
 * @param getInitialState 初始化执行一次添加当前组件状态的state
 * @param componentDidMount在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。
 * @param componentDidUpdate 初始化渲染不会调用，更新后调用。
 * @param componentWillReceiveProps 初始化渲染不会调用，在接收到新的props时，会调用这个方法。
 * @param getCanvas 计算生成echarts的option属性
 */
var GetMapComponent = React.createClass({
    componentWillReceiveProps: function(nextProps) {//在接收到新的 props 或者 state 之前立刻调用。
        const that = this;
        this.data = nextProps.data?nextProps.data:'';
    },
    getInit:function(){
        const that = this;
        let dom = that.refs['map'];//findDOMNode从组件获取真实 DOM 的节点
        let arr = that.data.data ? that.data.data.list : []; //获取数据进行遍历赋值
        let markerLog = [],markerExp = [],Other = [];
        if(arr && arr.length>0){
            for(let i= 0; i<arr.length; i++){
                let lng,lat;
                if(arr[i].datatype == "物流"){
                    lng = arr[i].lng;
                    lat = arr[i].lat;
                    let logist = [arr[i].branchAddress,lng,lat ];
                    markerLog.push(logist,logist);
                }else if(arr[i].datatype == "快递"){
                    lng = arr[i].lng;
                    lat = arr[i].lat;
                    let express = [arr[i].branchAddress,lng,lat ];
                    markerExp.push(express);
                }else{
                    lng = arr[i].lng;
                    lat = arr[i].lat;
                    let other = [arr[i].branchAddress,lng,lat ];
                    Other.push(other);
                }
                
            }
            this.getCanvas({
                // data: that.data.infos,
                id: dom,
                markerLog:markerLog,
                markerExp:markerExp,
                Other:Other
            });
        }else{
            this.getCanvas({
                // data:'',
                id: dom,
                markerLog:'',
                markerExp:'',
                Other:''
            });
        }
    },  
    getCanvas:function(obj) {
        // var map = new BMap.Map("map");
        var map = new BMap.Map(obj.id);
        var point = new BMap.Point(103.9526, 30.7617);
        map.centerAndZoom(point, 15);//标注中心点
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
                    "color": "#190079",
                    "hue": "#190079"
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
                    "color": "#000368",
                    "hue": "#000368",
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
                    "color": "#000368",
                    "hue": "#000368",
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
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "1.5",
                    "visibility": "on"
                }
            }], {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                    "color": "#190079",
                    "hue": "#190079"
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
            }, {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": {
                    "color": "#0c003b",
                    "hue": "#0c003b",
                    "visibility": "off"
                }
            }, {
                "featureType": "boundary",
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
                "featureType": "label",
                "elementType": "labels.icon",
                "stylers": {
                    "color": "#000368",
                    "hue": "#000368",
                    "weight": "1.5",
                    "visibility": "off"
                }
            }]
        ]
        map.setMapStyle({
            styleJson: styleJson
        });
        //行政区域覆盖图
        function getBoundary() {
            let bdary = new BMap.Boundary();
            bdary.get( (name).toString() , function(rs) { //获取行政区域
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
        let markerLog = obj.markerLog;
        let markerExp = obj.markerExp;
        // 添加物流标注方法
        function PointLog(point, index) {  
            let Logistical = new BMap.Icon("img/logistical.png",  //物流
                new BMap.Size(22, 24), {  
                    // 指定定位位置
                    offset: new BMap.Size(10, 25),  
                    // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置   
                    // imageOffset: new BMap.Size(0, 0 - index * 25)  // 设置图片偏移  
                });  
            let markerLogistical = new BMap.Marker(point, { icon: Logistical });  
            map.addOverlay(markerLogistical); 
            return markerLogistical;  
        };
         // 添加快递标注方法
        function PointExp(point, index) {  
            let express = new BMap.Icon("img/express.png",  //快递
                new BMap.Size(22, 24), {  
                    // 指定定位位置
                    offset: new BMap.Size(10, 25),  
                    // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置   
                    // imageOffset: new BMap.Size(0, 0 - index * 25)  // 设置图片偏移  
                });  
            let markerExpress = new BMap.Marker(point, { icon: express });  
            map.addOverlay(markerExpress); 
            return markerExpress;  
        };
        getBoundary();
        //执行行政区域覆盖图和添加标注方法
        for (let i = 0; i < markerLog.length; i++) {
            let p0 = markerLog[i][1];  
            let p1 = markerLog[i][2];  
            let maker = PointLog(new window.BMap.Point(p0, p1), i);  
        };
        for (let i = 0; i < markerExp.length; i++) {  
            let p0 = markerExp[i][1];  
            let p1 = markerExp[i][2];  
            let maker = PointExp(new window.BMap.Point(p0, p1), i);  
        };
    },
    componentDidUpdate: function() {
        this.getInit();
    },
    render: function() {
        return (
            <div className="map" ref="map">
            </div>
        )
    }
});

/**
 * @name LegendComponent 图例组件
 */
var LegendComponent = React.createClass({
    render: function(){
        return (
            <div className="legend">
                <div><img alt="Legend" src="./img/logistical.png" className="xinxin"/><label>物流网点</label></div>
                <div><img alt="Legend" src="./img/express.png" className="xinxin"/><label>快递网点</label></div>
            </div>
        )
    }
});
/**
 * @name ConComponent 列表总组件
 * @param componentWillMount 初始化渲染前调用
 * @param componentWillUpdate 在接收到新的 props 或者 state 之前立刻调用。
 */
var ConListComponent =React.createClass({
    getInitialState: function() {
        return {
            page: 1, //当前用户所在页
            pageTotal:'',
            status: false //当前组件的状态，当为true时更新组件
        }
    },
    componentWillMount:function(){
        this.listArray = [];//存放每一页数据
        this.dip={};
        this.setState({
            dom:"",
        });
    },
    componentWillUpdate:function(props,state){//在接收到新的 props 或者 state 之前立刻调用。
        const that = this;
        let size=10;//每页行数
        let data=props.data;
        let arr = data.data ? data.data.list : []; //获取数据
        if(!arr.length>0||state.ready){
            return false;
        }
        // 缓存全部数据
        sessionStorage.setItem("arr", JSON.stringify(arr)); 
        sessionStorage.setItem('pageTotal',Math.ceil(arr.length/size));
        //总页数
        that.state.pageTotal=Math.ceil(arr.length/size);
        
        this._getDatas(that.state.page, arr, that.state.pageTotal);
        that.setState({
            status: true,
            pageTotal: that.state.pageTotal
        });
    },

    _getDatas:function(page,arr,pageTotal){
        const that = this;
        var value = sessionStorage.getItem("arr");
        value = JSON.parse(value);
        let size=10;//每页行数
        let listArray=[];//存放每一页数据
        let startPoint=(page-1)*size;
        let endPoint=page*size;
        for(let i=startPoint;i<endPoint;i++){
            listArray.push(value[i]);
        }
        //加入订阅数组
        let dipfun=function(key,item){
            that.dip[key]=item;
        }
        //发布消息，排除自己之外都收到回掉
        let fbfun=function(key,event){   
            for(let i in that.dip){
                if(i!=key){
                   that.dip[i].callback(event);
                }
            }
        }
        var dom = listArray.map(function(item,list){
            return <SectionListComponent item={item} list={list} dipfun={dipfun} fbfun={fbfun}/>
        });
        that.setState({
            dom:dom,
            ready:true
        });
    },
    // android数据交换
    _androidCallback: function(data) {
        window.android ? window.android.setData(data) : '';
    },
    clearAll:function(){
        const that = this;
        for(let i in that.dip){
             that.dip[i].callback();
         }
         that.dip={}
    },
    //下一页
    _nextPage: function(event) {
        event.preventDefault();
        this.pageTotal = this.state.pageTotal ? this.state.pageTotal : 1; //总页数
        if (this.state.page >= this.pageTotal) { //超过总页数退出
            return false;
        } else {
            this.state.page++; //每次点击下一页进行累计
            // 当前页数数据
            this.clearAll();
            this._getDatas(this.state.page);
        }
    },
    //上一页
    _prevPage: function(event) {
        event.preventDefault();
        if (this.state.page <= 1) {
            return false;
        } else {
            this.state.page--; //依次递减
             this.clearAll();
            this._getDatas(this.state.page);
        }
    },
    render: function() {
        return (
            <div className="list">
                <div className="table" >
                    <div className="thead">
                        <ul>
                            <li >网点名称</li>
                            <li >类型</li>
                            <li >所属机构</li>
                            <li >网点地址</li>
                            <li >联系电话</li>
                        </ul>
                    </div>
                    <div className="tbody">
                        {this.state.dom}
                    </div>
                </div>
                <PagingComponent next = {this._nextPage} prev = {this._prevPage} isCurrent = {this.state.page == this.state.pageTotal ? 1 : this.state.page == 1 ? 0 : 2 } currentPage={this.state.page} totalPage={this.state.pageTotal}/>
            </div>
        )
    }
});

/**
 * @name SectionListComponent 内容中列表行组件
 * @param componentWillMount 渲染前赋值
 * @param componentWillReceiveProps 当该组件接收到新的props时更新组件
 */
var SectionListComponent = React.createClass({
    getInitialState:function(){
        return {
            fclass:"contentBox"
        }
    },
    componentWillMount: function() {
        this.interval = {};//存放超出li
        this.timeouts = [];//存放定时器
        this.item = this.props.item;
        this.props.dipfun("x"+this.props.list,this);//注册消息
    },
    componentWillReceiveProps: function(nextProps) {
        this.item=nextProps.item;
        this.interval = {};//清空原来超出li
        this.timeouts = [];//清空原来的定时器
        this.props.dipfun("x"+this.props.list,this);//翻页后重新注册
        this.setState({
            updata:true
        });
    },
    callback:function(event){
        this.clearAll();
        this.setState({
            fclass:"contentBox"
        });
    },
    //清除定时器
    clearAll:function( ){
        const that = this;
        for(let i in that.interval){
            var obj=that.interval[i];
            obj.scrollLeft=0;
            obj.lastChild.innerHTML="";
            clearInterval(i);
        }
        that.interval={};
        for(let i of that.timeouts){
             clearTimeout(i);
        }
        that.timeouts=[];
    },
    //跑马灯方法
    _marquee: function () {
        const that = this;
        let dom = ReactDOM.findDOMNode(this.refs.list);
        that.clearAll( );
        dom.scrollLeft = 0;
        for( let domx of dom.children){
            let t = setTimeout(function(){
                let lengthParent = domx.offsetWidth;
                let lengthChild = domx.firstChild.offsetWidth;;
                if( lengthChild >= lengthParent ) {
                    that._scroll(domx);
                }
            },2000);
          that.timeouts.push(t);
        }
    },
    _scroll: function (obj) {
        var tmp = obj.scrollLeft;
        obj.lastChild.innerHTML = obj.firstChild.innerHTML;
        let x= setInterval(function(){
            obj.scrollLeft++;
            //当滚动条滚动了初始内容的宽度时滚动条回到最左端
            if (obj.scrollLeft>=obj.firstChild.offsetWidth+30) {
                obj.scrollLeft=0;
            }
        },50);
       this.interval[x]=obj;
    },
    _getUlClick: function(event) {
        event.preventDefault();
        this.props.fbfun("x"+this.props.list,"事件");//调用发布方法，事件因为不处理所以随便给了一个
        this._marquee();
        this.setState({
            fclass:"contentBox active-show",
        });
    },
    render: function() {
        return (
            <ul className={this.state.fclass} onClick={this._getUlClick} ref="list" >
                <li ><span>{this.item? this.item.name: ''}</span><span></span></li>
                <li ><span>{this.item ? this.item.type  : ''}</span><span></span></li>
                <li ><span>{this.item ? this.item.organizationName : ''}</span><span></span></li>
                <li ><span>{this.item ? this.item.branchAddress  : ''}</span><span></span></li>
                <li ><span>{this.item ? this.item.mobile : ''}</span><span></span></li>
            </ul>
        )
    }
});

/**
 * @name  PagingComponent 分页组件
 */
var PagingComponent = React.createClass({
    render: function() {
        return (
            <footer>
                <div className="pager">
                    <div className="pager-list">
                        <span id="Js_pre_page" className={this.props.isCurrent == 0 ? "normalColor" : "chooseSelect"} onClick={this.props.prev} disabled={this.props.isCurrent == 0 ? "true" : "false"}>&nbsp;&lt;&nbsp;上一页</span>
                    </div>
                    <div className="pager-list">
                        <span className="page">{this.props.currentPage}/{this.props.totalPage}</span>
                    </div>
                    <div className="pager-list">
                        <span id="Js_next_page" className={this.props.isCurrent == 1 ? "normalColor" : "chooseSelect"}  onClick={this.props.next} disabled={this.props.isCurrent == 0 ? "true" : "false"}>下一页&nbsp;&gt;&nbsp;</span>
                    </div>
                </div>
            </footer>
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
        $.GetAjax($.getCtx()+'/rest/logistics/sumsandlist', setData, 'GET', true, function(data , state) {
        // $.GetAjax('/TJ-province/public/data/sumsandlist.json', setData, 'GET', true, function(data,state) {
           if (state && data.data.list.length>0) {
                that.setState({
                    data:data  
                });
                setTimeout(function(){
                    $('.onLoading').remove();
                    $("#con").css("opacity",1);
                },1000);
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
                 <HeaderComponent data={this.state.data ? this.state.data : []} getDatas={this._getDatas}/>
                 <CountComponent data={this.state.data ? this.state.data : []} />
                 <ConListComponent data={this.state.data ? this.state.data : []}/>
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