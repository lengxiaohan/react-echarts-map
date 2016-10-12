"use strict";
import {formatPrice,addZero,show_num,splitString,toThousands} from "common";
import "ajax-plus";
import "../../less/demoMonitor.less";
import "./common/screenPropor.js";
import "echarts-map";
import React from 'react';
import ReactDOM from 'react-dom';

const autoTime = 5000;
let areaId = $.getUrlParam('areaId');
let areaName = $.getUrlParam('name');
let shortName = $.getUrlParam('shortName');
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
					<p>{areaName} 网络零售实时监控</p>
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
		setTimeout(() => {
			this._getDatas();
		}, autoTime);
	},
	componentDidMount: function() {
		this._getDatas(true,data => {
			$('header').css("opacity",1);
			$('section').css("opacity",1);
			this.start(data);
		});
	},
	start: function(data = []) {
		this.nextPropsData = data.cityOrderList;
		let [state,MAX,length,totalNum] = [this.listType + 1,Math.ceil(this.nextPropsData.length / 11),this.nextPropsData.length,data.todayCollNum];
		if (length <= MAX * 11) {
			for (let i = length + 1; i <= MAX * 11; i++) {
				this.nextPropsData.push({});
			}
		}
		this._updateDidMount(this.nextPropsData);
		this.listType = state > MAX ? 1 : state;
		show_num('.pushAnimateNum',totalNum,1);
	},
	_getDatas: function(state = false, callback) {
		let setData = {
			date: new Date().getTime(),
			areaId: areaId,
			interval: 5
		};
		$.GetAjax($.getCtx()+'/rest/info/recentInfoRealNew', setData, 'GET', true, (data,t_state) => {
			if (t_state) {
				this.ALLDATA = data;
				state ? callback(data) : this.start(data)
			}else{
				setTimeout(() => {
					this._getDatas();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
			
		});
	},
	render: function() {
		return (
			<section>
				<GetMapComponent data={this.ALLDATA}/>
	        	<div className="list-box">
	        		<p className="list-title">
	        			{areaName}{this._getTitle()}
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

var GetMapComponent = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	componentWillReceiveProps: function(nextProps) {
		this.data = nextProps.data;
		this.setState({
			status: true
		});
	},
	componentDidUpdate: function() {

		if (!this.state.status) {
			return false;
		}

		let dom = ReactDOM.findDOMNode(this.refs.JsMap);

		this.getCanvas({
			data: this.data,
			id: dom,
			size: $(window).height()*0.035
		});
	},
	getCanvas: function(obj) {
		let datas = obj.data;
		this.geoCoord = datas.geoCoordMap;
		const dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData'];
		const color = ['rgba(255, 240, 51,.4)', 'rgba(255, 240, 51,.5)', 'rgba(255, 240, 51,.6)', 'rgba(255, 240, 51,.8)', 'rgba(255, 240, 51,1)'];
		const symbolSize = [3,5,7,9,11];
		const symbolLen = [100,60,50,40,30];
		let series = [{
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
			data: [],
			geoCoord: {}
		}];

		for (let s = 0; s < datas['fivePointData'].length; s++) {
			let value = parseInt(datas['fivePointData'][s].value);
			let tempNums = value / 3000 - 1;
			let sizeTemp = tempNums > 1 ? 1 : tempNums < 0.2 ? 0.2 : tempNums;
			let size = [8*sizeTemp,16*sizeTemp,24*sizeTemp,32*sizeTemp];
			for (let m = 0; m < size.length; m++) {
				series.push({
		            name: '',
		            type: 'map',
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
		            geoCoord: this.geoCoord
				})
			}
		}

		let geoList = [];
		for (let i = dataAttr.length-1; i >= 0; i--) {
			if (datas[dataAttr[i]].length) {
				series.push({
					name: '',
					type: 'map',
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
		                    	for (let k in this.geoCoord) {
			                    	if (k == datas[dataAttr[i]][index].name) {
			                    		geoList.push({
											name: k,
											geoCoord: this.geoCoord[k]
										})
			                    	}
									
								}
							}
		                    while(len--) {
		                        var geoCoord = geoList[len % geoList.length].geoCoord;
		                        data.push({
		                            name : geoList[len % geoList.length].name,
		                            geoCoord : [
		                                Number(geoCoord[0]) + Math.random()/8 - 0.05,
		                                Number(geoCoord[1]) + Math.random()/8 - 0.05
		                            ]
		                        })
		                    }
		                    return data;
		                })()
					}
				});
			}
		}
		let config = {
			parentName:true
		}
		$("#mainMap").setEchartMap($.mapModule(null, series),config);
	},
	render: function() {
		return (
			<div className="map-box" id="JS_map_box">
				<div className="map-show" id="mainMap"></div>
			</div>
		)
	}
});

var Container = React.createClass({
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent/>
	            <SectionComponent/>
        	</div>
		)
	}
});

ReactDOM.render(
	<Container />,
	document.getElementById('myApp')
);