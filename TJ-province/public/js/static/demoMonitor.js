"use strict";
import {formatPrice,addZero,show_num,splitString,toThousands} from "common";
import "ajax-plus";
import "../../less/demoMonitor.less";
import "./common/screenPropor.js";
import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Route,Link,createHistory} from "react-router";

const autoTime = 5000;
let _setTimeState = void 0;
var HeaderComponent = React.createClass({
	componentDidMount: function () {
		var windowWidth = $(window).height()*0.003;
		$('.headerLine').css({
			borderTop:''+windowWidth+ 'px solid rgba(0, 153, 255, 0.5)'
		});
	},
	render: function() {
		return (
			<header>
				<div className="head-left headerLine"></div>
				<div className="head-con">
					<img alt="header" src="./img/head-bg.png"/>
					<p>{this.props.areaName}</p>
				</div>
				<div className="head-right headerLine"></div>
			</header>
		)
	}
});

var ListFlexModule = React.createClass({

	componentDidMount: function() {
		let count = this.props.item.amount === undefined ? false : parseInt(this.props.item.amount);
		let [dom,result] = [ReactDOM.findDOMNode(this.refs.list),count === false ? "" : toThousands(count)+"元"];
		$(dom).append(result);
	},

	render: function() {
		return (
			<li>
				<p className="listFlex1">{this.props.item.areaShortName ? this.props.num+1 : ''}</p>
				<p className="listFlex2">{this.props.item.areaShortName ? this.props.item.areaShortName : ''}</p>
				<p className="listFlex2" ref="list"></p>
			</li>
		)
	}
});

var SectionComponent = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	_getTitle: function() {
		const name = '今日累计零售额';
		return name;
	},
	componentWillMount: function() {
		this.listType = 1;
		this.nextPropsData = [];
		this.ALLDATA = {};
	},
	_updateDidMount: function(nextProps) {
		let data = nextProps ? nextProps : [];
		if (data) {
			let length = data.length;
			this.dom = data.map((item, num) => {
				if (num < 11 * this.listType && num >= 11 * this.listType - 11) {
					return <ListFlexModule item={item} num={num} key={num}/>
				}
			});
		};
		this.setState({
			status: true
		});
		let dom = ReactDOM.findDOMNode(this.refs.JsMap);
		this.getCanvas({
			data: this.data,
			id: dom,
			size: $(window).height()*0.035
		});
		clearTimeout(_setTimeState);
		_setTimeState = setTimeout(() => {
			this._getDatas();
		}, autoTime);
	},
	componentDidMount: function() {
		this._getDatas(true,data => {
			$('header').css("opacity",1);
			$('section').css("opacity",1);
			this.__buildShadow();
			this.start(data);
		});
	},
	start: function(data = []) {
		this.nextPropsData = data.cityOrderList;
		let [MAX,length,totalNum] = [Math.ceil(this.nextPropsData.length / 11),this.nextPropsData.length,data.todayCollNum];
		if (length <= MAX * 11) {
			for (let i = length + 1; i <= MAX * 11; i++) {
				this.nextPropsData.push({});
			}
		}
		this.geoCoordMap = this.data.geoCoordMap;
		if (this.listType > MAX) {
			this.props.change();
		}else{
			this._updateDidMount(this.nextPropsData);
			this.listType += 1;
			show_num('.pushAnimateNum',totalNum,1);
		}
		
	},
	_getDatas: function(state = false, callback) {
		let setData = {
			date: new Date().getTime(),
			areaId: this.props.areaId,
			interval: 5
		};
		$.GetAjax($.getCtx()+'/rest/info/recentInfoRealNew', setData, 'GET', true, (data,t_state) => {
			if (t_state) {
				this.data = data;
				state ? callback(data) : this.start(data)
			}else{
				setTimeout(() => {
					this._getDatas();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
			
		});
	},
	getCanvas(obj) {
		const myChart = echarts.init(obj.id).clear();
		const dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData'];
		let datas = obj.data;
		let option = {
			series: [{
				name: '',
				type: 'map',
				selectedMode: 'single',
				mapType: this.props.address,
				hoverable: false,
				roam: false,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						borderColor: 'rgba(0,153,255,0)',
						color: 'rgba(0,153,255,0)'
					}
				},
				data: {},
				geoCoord: this.geoCoordMap
			}]
		};
		for (let i = 0; i < 5; i++) {
			option.series.push({
				name: dataAttr[i],
				type: 'map',
				mapType: this.props.address,
				data: [],
				markPoint: {
					symbol: 'image://../../img/' + (i + 1) + '.png',
					// symbol: 'image://../public/img/' + (i + 1) + '.png',
					symbolSize: obj.size,
					itemStyle: {
						normal: {
							label: {
								show: false
							}
						}
					},
					data: datas && datas[dataAttr[i]] || []
				}
			});
		}
		myChart.setOption(option);
	},
	__buildShadow(){
		let dom = ReactDOM.findDOMNode(this.refs.JsMapBg);
		const myChart = echarts.init(dom).clear();
		let option = {
			series: [{
				name: '',
				type: 'map',
				selectedMode: 'single',
				mapType: this.props.address,
				hoverable: false,
				roam: false,
				nameMap:{
	            	'宜宾市' : '宜宾',
	            	'成都市' : '成都',	
	            	'德阳市' : '德阳',
	            	'眉山市' : '眉山',
	            	'资阳市' : '资阳',
	            	'乐山市' : '乐山',
	            	'自贡市' : '自贡',
	            	'泸州市' : '泸州',
	            	'雅安市' : '雅安',
	            	'广安市' : '广安',
	            	'遂宁市' : '遂宁',
	            	'南充市' : '南充',
	            	'达州市' : '达州',
	            	'绵阳市' : '绵阳',
	            	'巴中市' : '巴中',
	            	'内江市' : '内江',
	            	'广元市' : '广元',
	            	'攀枝花市' : '攀枝花',
	            	'阿坝藏族羌族自治州' : '阿坝',
	            	'甘孜藏族自治州' : '甘孜',
	            	'凉山彝族自治州' : '凉山',
    	        },
				itemStyle: {
					normal: {
						label: {
							show: true,
							textStyle: {
								color: 'rgba(0,153,255,1)',
								fontFamily: '微软雅黑',
								fontSize: $(window).height()*0.014
							}
						},
						borderWidth: 1,
						borderColor: 'rgba(0,153,255,.5)',
						color: 'rgba(0,153,255,.1)'
					}
				},
				data: {},
				geoCoord: this.geoCoordMap
			}]
		};
		myChart.setOption(option);
	},
	render: function() {
		let dataAttrs = [];
		if (this.props.address=="china") {
			dataAttrs = ['40000元以上','30000元~40000元','16000元~30000元','4000元~16000元','4000元以下'];
		}else{
			dataAttrs = ['10000元以上','7500元~10000元','4000元~7500元','1000元~4000元','1000元以下'];
		}
		return (
			<section>
				<div className="map-box" id="JS_map_box">
					<div className="map-show" ref="JsMap" ></div>
					<div className="map-show-bg" ref="JsMapBg" ></div>
					<ul className="map-msg-box">
						<li><img src="../../img/5.png" />&nbsp;&nbsp;{dataAttrs[0]}</li>
						<li><img src="../../img/3.png" />&nbsp;&nbsp;{dataAttrs[1]}</li>
						<li><img src="../../img/2.png" />&nbsp;&nbsp;{dataAttrs[2]}</li>
					    <li><img src="../../img/4.png" />&nbsp;&nbsp;{dataAttrs[3]}</li>
						<li><img src="../../img/1.png" />&nbsp;&nbsp;{dataAttrs[4]}</li>
					</ul>
					{/*<ul className="map-msg-box">
						<li><img src="../public/img/5.png" />&nbsp;&nbsp;20000元以上</li>
						<li><img src="../public/img/3.png" />&nbsp;&nbsp;15000 元~20000元</li>
						<li><img src="../public/img/2.png" />&nbsp;&nbsp;8000 元~15000元</li>
					    <li><img src="../public/img/4.png" />&nbsp;&nbsp;2000 元~8000元</li>
						<li><img src="../public/img/1.png" />&nbsp;&nbsp;2000元以下</li>
					</ul>*/}
				</div>
	        	<div className="list-box">
	        		<p className="list-title">
	        			{this.props.areaName}{this._getTitle()}
	        		</p>
	        		<div className="pushAnimateNum" ref="aniNum"></div>
	        		<ul className="pushListBox">
	        			{this.dom}
	        		</ul>
	        	</div>
	        </section>
		);
	}
});


var SectionComponent2 = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	_getTitle: function() {
		const name = '今日累计零售额';
		return name;
	},
	componentWillMount: function() {
		this.listType = 1;
		this.nextPropsData = [];
		this.ALLDATA = {};
	},
	_updateDidMount: function(nextProps) {
		let data = nextProps ? nextProps : [];
		if (data) {
			let length = data.length;
			this.dom = data.map((item, num) => {
				if (num < 11 * this.listType && num >= 11 * this.listType - 11) {
					return <ListFlexModule item={item} num={num} key={num}/>
				}
			});
		};
		this.setState({
			status: true
		});
		let dom = ReactDOM.findDOMNode(this.refs.JsMap);
		this.getCanvas({
			data: this.data,
			id: dom,
			size: $(window).height()*0.035
		});
		clearTimeout(_setTimeState);
		_setTimeState = setTimeout(() => {
			this._getDatas();
		}, autoTime);
	},
	componentDidMount: function() {
		this._getDatas(true,data => {
			$('header').css("opacity",1);
			$('section').css("opacity",1);
			this.start(data);
			this.__buildShadow();
		});
	},
	start: function(data = {}) {
		this.nextPropsData = data.cityOrderList;
		let [MAX,length,totalNum] = [Math.ceil(this.nextPropsData.length / 11),this.nextPropsData.length,data.todayCollNum];
		if (length <= MAX * 11) {
			for (let i = length + 1; i <= MAX * 11; i++) {
				this.nextPropsData.push({});
			}
		}
		this.geoCoordMap = this.data.geoCoordMap;
		this.lengendDatas = [];
		for (let kk in data.cityOrderList) {
			if (data.cityOrderList[kk].areaName) {
				this.lengendDatas.push({"name":data.cityOrderList[kk].areaName,"value":data.cityOrderList[kk].amount});
				this.geoCoordMap[data.cityOrderList[kk].areaName] = data.cityOrderList[kk].location;
			}
			
		}
		if (this.listType > MAX) {
			this.props.change();
		}else{
			this._updateDidMount(this.nextPropsData);
			this.listType += 1;
			show_num('.pushAnimateNum',totalNum,1);
		}
		
	},
	_getDatas: function(state = false, callback) {
		let setData = {
			timestamp: new Date().getTime(),
			type: this.props.countryId,
			interval: 5
		};
		$.GetAjax($.getCtx()+'/rest/info/countrySumInfo', setData, 'GET', true, (data,t_state) => {
			if (t_state) {
				this.data = data.info;
				state ? callback(this.data) : this.start(this.data)
			}else{
				setTimeout(() => {
					this._getDatas();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
			
		});
	},
	getCanvas: function(obj) {
		const datas = obj.data;
		const myChart = echarts.init(obj.id).clear();
		const dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData'];
		const color = ['rgba(255, 240, 51,.4)', 'rgba(255, 240, 51,.5)', 'rgba(255, 240, 51,.6)', 'rgba(255, 240, 51,.8)', 'rgba(255, 240, 51,1)'];
		const symbolSize = [2,4,6,8,10];
		const symbolLen = [100,60,40,30,20];
		let option = {
			series: [{
				name: '',
				type: 'map',
				selectedMode: 'single',
				mapType: this.props.address,
				hoverable: false,
				roam: false,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						borderColor: 'rgba(0,153,255,0)',
						color: 'rgba(0,153,255,0)'
					}
				},
				data: {},
				geoCoord: this.geoCoordMap
			}]
		};
		for (let s = 0; s < datas['fivePointData'].length; s++) {
			let value = parseInt(datas['fivePointData'][s].value);
			let tempNums = value / 3000 - 1;
			let sizeTemp = tempNums > 1 ? 1 : tempNums < 0.2 ? 0.2 : tempNums;
			let size = [8*sizeTemp,16*sizeTemp,24*sizeTemp,32*sizeTemp];
			for (let m = 0; m < size.length; m++) {
				series.push({
		            name: '',
		            type: 'map',
		            mapType: this.props.address,
		            z: 9,
		            markPoint : {
		                symbol:'circle',
		                symbolSize : size[m],
		                effect : {
		                    show: true,
		                    shadowBlur: 0
		                },
		                itemStyle:{
			                normal:{
			                    color: color[4]
			                }
			            },
		                data: [datas['fivePointData'][s]]
		            },
		            data:[],
		            geoCoord: this.geoCoordMap
				})
			}
		}

		let geoList = [];
		for (let i = dataAttr.length-1; i >= 0; i--) {
			if (datas[dataAttr[i]].length) {
				option.series.push({
					name: '',
					type: 'map',
					mapType: this.props.address,
					z: 1,
					data: [],
					markPoint: {
						symbol : 'diamond',
						symbolSize: symbolSize[i],
						large: true,
		                effect : {
		                    show: true
		                },
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								color: color[i]
							}
						},
						data : (() => {
		                    var data = [];
		                    var len = symbolLen[i];
		                    var value;
							for (let index = 0; index < datas[dataAttr[i]].length; index++) {
		                    	for (let k in this.geoCoordMap) {
			                    	if (k == datas[dataAttr[i]][index].name) {
			                    		geoList.push({
											name: k,
											geoCoord: this.geoCoordMap[k]
										})
			                    	}
									
								}
							}
		                    while(len--) {
		                        var geoCoord = geoList[len % geoList.length].geoCoord;
		                        data.push({
		                            name : geoList[len % geoList.length].name,
		                            geoCoord : [
		                                Number(geoCoord[0]) + Math.random()/1.15 - 0.5,
		                                Number(geoCoord[1]) + Math.random()/1.8 - 0.25
		                            ]
		                        })
		                    }
		                    return data;
		                })()
					}
				});
			}
		}
		myChart.setOption(option);
	},
	__buildShadow(){
		let dom = ReactDOM.findDOMNode(this.refs.JsMapBg);
		const myChart = echarts.init(dom).clear();
		let option = {
			series: [{
				name: '',
				type: 'map',
				selectedMode: 'single',
				mapType: this.props.address,
				hoverable: false,
				roam: false,
				itemStyle: {
					normal: {
						label: {
							show: true,
							textStyle: {
								color: 'rgba(0,153,255,1)',
								fontFamily: '微软雅黑',
								fontSize: $(window).height()*0.014
							}
						},
						borderWidth: 1,
						borderColor: 'rgba(0,153,255,.5)',
						color: 'rgba(0,153,255,.1)'
					}
				},
				data: {},
				geoCoord: this.geoCoordMap
			},{
                name: '',
                type: 'map',
                mapType: this.props.address,
                data: [],
                animation: false,
                markPoint: {
                    symbol: 'Circle',
                    symbolSize: 1,
                    effect: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            label: {
                            	show: false,
                                formatter: v => {
		                        	return v.name;
		                        },
		                        textStyle: {
		                        	color: '#fff',
		                        	fontSize: $(window).height()*0.001,
									fontFamily: 'Microsoft Yahei ui'
		                        }
                            },
                            color: '#ffcc00'
                        }
                    },
                    data: this.lengendDatas
                }
            }]
		};
		myChart.setOption(option);
	},
	render: function() {
		return (
			<section>
				<div className="map-box" id="JS_map_box">
					<div className="map-show" ref="JsMap" ></div>
					<div className="map-show-bg" ref="JsMapBg" ></div>
				</div>
	        	<div className="list-box">
	        		<p className="list-title">
	        			{this.props.areaName}{this._getTitle()}
	        		</p>
	        		<div className="pushAnimateNum" ref="aniNum"></div>
	        		<ul className="pushListBox">
	        			{this.dom}
	        		</ul>
	        	</div>
	        </section>
		);
	}
});

var Container = React.createClass({
	changeHasher: function () {
		this.props.history.pushState(null, '/sichuan');
	},
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent areaName={"全国 网络零售实时监控"}/>
	            <SectionComponent change={this.changeHasher} address={"china"} areaId={"0"} areaName={"全国"}/>
        	</div>
		)
	}
});
var ContainerSichuan = React.createClass({
	changeHasher: function () {
		this.props.history.pushState(null, '/coutry');
	},
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent areaName={"四川 网络零售实时监控"}/>
	            <SectionComponent change={this.changeHasher} address={"四川"} areaId={"51"} areaName={"四川"}/>
        	</div>
		)
	}
});
var ContainerCountry = React.createClass({
	changeHasher: function () {
		this.props.history.pushState(null, '/coutryPool');
	},
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent areaName={"四川 农村电商网络零售实时监控"}/>
	            <SectionComponent2 change={this.changeHasher} address={"四川"} countryId={"1"} areaName={"四川农村电子商务"}/>
        	</div>
		)
	}
});

var ContainerCountryPool = React.createClass({
	changeHasher: function () {
		this.props.history.pushState(null, '/');
	},
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent areaName={"四川 88个贫困县网络零售实时监控"}/>
	            <SectionComponent2 change={this.changeHasher} address={"四川"} countryId={"2"} areaName={"四川88个贫困县"}/>
        	</div>
		)
	}
});

ReactDOM.render(
	<Router history={createHistory}>
		<Route path="/" component={Container}/>
		<Route path="/sichuan" component={ContainerSichuan}/>
		<Route path="/coutry" component={ContainerCountry}/>
		<Route path="/coutryPool" component={ContainerCountryPool}/>
	</Router>,
	document.getElementById('myApp')
);