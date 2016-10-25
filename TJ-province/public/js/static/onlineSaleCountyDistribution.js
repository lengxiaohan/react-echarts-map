"use strict";
import {formatPrice,splitString,getAreaCp} from "common";
import "onlineSaleCountyDis";
import "echarts-map";
import "jquery";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// sessionStorage.clear();
// 获取区域id
let areaId = $.getUrlParam('areaId');
// 获取区域name
let name = $.getUrlParam('name');
// 获取区域shortName
let shortName = $.getUrlParam('shortName');

let parentName = "";
let parentNameLong = "";
/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
class HeaderComponent extends React.Component{
    constructor(props) {
        super(props);
        this.shortName = shortName;
    }
    render() {
        return (
            <header className="header">{this.shortName || ''}&nbsp;电子商务经济运行云图</header>
        )
    }
}
/**
 * @name MapComponent 地图组件
 * @param _getName 头部信息名称
 */
class MapComponent extends React.Component{
    constructor(props) {
        super(props);
        this.geoCood = {};
    }
    componentWillReceiveProps(nextProps) {
        const that = this;
        this.data = nextProps.data;
    }
    Data(name,value){
        this.name = name;
        this.value = value;
    }
    _getDatas(first) {//加载数据方法
        const that = this;
        let setData = {
            "areaId": areaId ? areaId : '',
            dataType:'json',
            type:'GET',
            needAll:true,
            getParent: true
        };
        $.GetAjax($.getCtx()+'/rest/totals/getNextTotalsList', setData, 'GET', true, function(data,state) {

            if (state && data.code == 0) {

                var time = data.datatime;
                let arr = data.datas ? data.datas : []; //获取数据进行遍历赋值
                if(!arr.length>0||state.ready){
                    return false;
                }
                let sum = 0;
                for(let i=1; i<arr.length; i++){
                    let data = arr[i].fuwuwgamount + arr[i].shiwuwgamount;
                    that.geoCood[arr[i].areaName] = [arr[i].lng,arr[i].lat];
                    sum += data;
                }
                
                let datasum = parseInt(sum*10000*10000);
                $(".total_num").html(formatPrice(datasum))
                $(".time").html(time);
                that.getSesstion(data);
                that.__buildShadow(that.geoCood);
                that._getTextMap(that.geoCood);
                setTimeout(function(){
                    $('.onLoading').remove();
                    $("#container").css("opacity",1);
                },500);

            } else if(!state) {
               setTimeout(function() {//数据没有请求成功，就一直请求
                    that._getDatas();
                    console.log('主人，刚才服务器出了一下小差');
                }, 2000);
            } else {
                $.noDataFunc();
            }

        });
    }
    getSesstion(obj) {
        let cityMap = {};
        cityMap[obj.areaName] = obj.areaId;
        let parentName = obj.areaName;
        let data = obj["datas"]?obj["datas"]:'';
        if(data && data.length){
            let serviceArr = [],entityArr = [];//存放服务型、实物型数据数组
            let dataserviceSum = 0,dataentitySum = 0;//总数
            let dataserviceMin = data[0].fuwuwgamount,dataentityMin = data[0].shiwuwgamount;//最小值
            let dataserviceMax = 0,dataentityMax = 0;//最大值
            for (let i = 0; i < data.length; i++) {
                let serviceValue = data[i].fuwuwgamount;
                let entityValue = data[i].shiwuwgamount;
                dataserviceMin = serviceValue<dataserviceMin ? serviceValue : dataserviceMin;
                dataentityMin = entityValue<dataentityMin ? entityValue : dataentityMin;
                dataserviceMax = serviceValue>dataserviceMax ? serviceValue : dataserviceMax;
                dataentityMax = entityValue>dataentityMax ? entityValue : dataentityMax;
                dataserviceSum += serviceValue;
                dataentitySum += entityValue;

                let areaName = data[i].areaName;
                if(areaName.indexOf("归口") !=-1 || areaName.indexOf("市辖") !=-1 || areaName.indexOf("高新区") !=-1){
                    continue;
                }

                serviceArr.push(new this.Data(areaName, serviceValue));
                entityArr.push(new this.Data(areaName, entityValue));
            }
            let serviceobj = [], entityobj = [];
            serviceobj.push(dataserviceMin);
            serviceobj.push(dataserviceMax);
            serviceobj.push(serviceArr);

            entityobj.push(dataentityMin);
            entityobj.push(dataentityMax);
            entityobj.push(entityArr);
            
            this.getCanvas({
                name:name,
                parentName: parentName,
                serviceobj:serviceobj,
                entityobj:entityobj
            });
        }else{
            this.getCanvas({
                name: name,
                parentName: '',
                serviceobj:'',
                entityobj:''
            });
        };
    }
    getCanvas(obj) {//只设置地图数据
        let series =[];
        let He = $(window).height()*0.03;//图片最高度
        let HeMin = He*1/5;//图片最低高度
        let entity = obj.entityobj;
        for(let n =0; n<entity[2].length; n++){
             let HeImgtwo = entity[2][n].value/entity[1]*He > HeMin ? entity[2][n].value/entity[1]*He : HeMin;
            if(entity[2][n]){
                series.push(
                    {
                        name: '实物型',
                        type: 'map',
                        mapType: parentName,
                        mapHide: true,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                }
                            }
                        },
                        markPoint: {
                            color:"#000",
                            symbol:'image://../public/img/onlineSale/physicalhigh.png',//diamond
                            symbolSize:[15,HeImgtwo],
                            symbolPosition: 'bottom',
                            effect: {
                                show: false,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    color:"#FD7701",
                                    label: {
                                        show: false,
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false,
                                    }
                                }
                            },
                            data: [entity[2][n]]
                        },
                        geoCoord:this.geoCood,
                        data:[]
                    }
                );
            }
        };
        let service = obj.serviceobj;
        let HeImgArr=[];
        for(let i=0; i<service[2].length; i++){
            let HeImg = service[2][i].value/service[1]*He > HeMin ? service[2][i].value/service[1]*He : HeMin;
            HeImgArr.push(HeImg);
            if(service[2][i]){
                series.push(
                    {
                        name: '服务型',
                        type: 'map',
                        mapType: parentName,
                        mapHide: true,
                        markPoint: {
                            color:"#000",
                            symbol:'image://../public/img/onlineSale/servicehigh.png',//diamond
                            symbolSize:[15,HeImg],
                            symbolPosition: 'bottom',
                            effect: {
                                show: false,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    color:"#FD7701",
                                    label: {
                                        show: false,
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false,
                                    }
                                }
                            },
                            data: [service[2][i]]
                        },
                        data:[]
                    },
                );
            }
        };
        $("#mainMap").setEchartMap($.mapModule(null, series), {setParent:true, parentName:parentNameLong});
    }
    //创建有发光效果地图背景和选中地区地图
    __buildShadow(geoCood,name){
        const selectData = [{//定义选中地区
            name: name || $.getUrlParam('name'),
            selected: true
        }];
        let series = [
        {
            name: '',
            type: 'map',
            boxShadow: true,
            boxShadowColor: 'rgba(0,153,255,1)',
            data: []
        },
        {
            name: '',
            type: 'map',
            selectedMode: 'single',
            hoverable: false,
            roam: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: '微软雅黑',
                            fontSize: $(window).height()*0.015
                        }
                    },
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.5)',
                    areaStyle: {
                        // 区域图，纵向渐变填充
                        type: 'default',
                        color: 'rgba(3,20,95,1)'
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        textStyle: {
                            color: 'rgba(255,255,255,0)',
                            fontFamily: '微软雅黑',
                            fontSize: $(window).height()*0.025
                        }
                    },
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,1)',
                    areaStyle: {
                        // 区域图，纵向渐变填充
                        type: 'default',
                        color: 'rgba(2,75,144,1)'
                    }
                }
            },
            data: selectData,
            geoCoord: geoCood
        }];
        $("#mainMapShadow").setEchartMap($.mapModule(null, series), {setParent:true, parentName:parentNameLong});
    }
    _getTextMap(geoCood,name){
        const selectData = [{//定义选中地区
            name: name || $.getUrlParam('name'),
            selected: true
        }];
        let series = [ {
            name: '实物型',
            type: 'map',
            hoverable: false,
            roam: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: 'rgba(255,255,255,0)',
                            fontFamily: '微软雅黑',
                            fontSize: $(window).height()*0.015
                        }
                    },
                    borderWidth: 0,
                    borderColor: 'rgba(255,255,255,0)',
                    areaStyle: {
                        // 区域图，纵向渐变填充
                        type: 'default',
                        color: 'rgba(3,20,95,0)'
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontFamily: '微软雅黑',
                            fontSize: $(window).height()*0.025
                        }
                    },
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0)',
                    areaStyle: {
                        // 区域图，纵向渐变填充
                        type: 'default',
                        color: 'rgba(2,75,144,0)'
                    }
                }
            },
            data: selectData,
            geoCoord: geoCood
        }];
        $("#TextMap").setEchartMap($.mapModule(null, series), {setParent:true});
    }
    componentDidMount() {
        $.getAreaName(data => {
            parentName = data['data'].shortName;
            parentNameLong = data['data'].name;
            $('.sec-title .title').html(data['data'].shortName+'&nbsp;网络零售额累计&nbsp;');
            this._getDatas();
        });
        PubSub.subscribe('checkMapSelect', (topic, data) => {
            this.__buildShadow(this.geoCood,data[1]);    //传入要选中的地区名
            this._getTextMap(this.geoCood,data[1]);
            $('.header').html(data[2]+'&nbsp;电子商务经济运行云图&nbsp;');
        });
    }
    render() {
        return (
            <section>
                <div className="sec-title">
                    <span className="time"> </span>
                    <span className="title">网络零售额累计&nbsp;</span>
                    <span className="total_num">0</span>
                    <span className="yuan">元</span>
                </div>
                <div className="sec-map">
                    <div id="mainMapShadow"></div>
                    <div id="mainMap"></div>
                    <div id="TextMap"></div>
                </div>
                
            </section>
        )
    }
}

/**
 * @name LegendComponent 图例组件
 */
class LegendComponent extends React.Component{
    render(){
        return (
            <div className="legend">
                <div><img alt="Legend" src="./img/onlineSale/physical.png" className="xinxin"/><label>实物型网络零售</label></div>
                <div><img alt="Legend" src="./img/onlineSale/service.png" className="xinxin"/><label>服务型网络零售</label></div>
            </div>
        )
    }
}

class Container extends React.Component{
    render() {
        return (
            <div  className="con">
                 <HeaderComponent />
                 <MapComponent />
                 <LegendComponent/>
            </div>
        )
    }
}
/**
 * @param 添加整个Container组件到页面
 */
ReactDOM.render(
    <Container />,container
    // document.getElementById('container')
);