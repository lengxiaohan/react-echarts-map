import {
	show_num
} from "common";
import "../../less/ChinaMonitorScatter.less";
import "echarts-map";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// 获取区域id
let areaId = $.getUrlParam('areaId');
let areaName = $.getUrlParam('name');
let shortName = $.getUrlParam('shortName');

class HeaderComponent extends React.Component {
	constructor(props) {
		super(props);
		this.areaName = shortName;
	}
	render() {
		return (
			<header className="header">{this.areaName || ''}&nbsp;电子商务经济运行云图</header>
		)
	}
}

class SectionComponent extends React.Component {
	constructor(props) {
		super(props);
		this.pushDataSet = void 0;
	}
	getJson(first) {
		let setData = {
			areaId: areaId,
			time: new Date().getTime(),
			getParent: true
		}
		$.GetAjax($.getCtx() + '/rest/data/areaList', setData, 'GET', true, (data, state) => {

			if (state && data.code == 0) {
				clearTimeout(this.pushDataSet);
				this.getChinaMap(data.data);
				setTimeout(()=>{
					if (first) {
						$('.onLoading').remove();
						$('#container').css("opacity",1);	
					}
					let todayCollNum = data.data.todayCollNum;
					show_num('.total_num', todayCollNum);
				},500);
			} else if(!state) {
				setTimeout(() =>{
					this.getJson();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			} else {
				$.noDataFunc();
			}

		});
	}
	getChinaMap(obj) {
		this.geoCoord = obj.geoCoordMap;
		const dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData'];
		const color = ['rgba(255, 240, 51,.4)', 'rgba(255, 240, 51,.5)', 'rgba(255, 240, 51,.6)', 'rgba(255, 240, 51,.8)', 'rgba(255, 240, 51,1)'];
		const symbolSize = [2,4,6,8,10];
		const symbolLen = [300,200,100,50,30];
		let series = [];

		for (let s = 0; s < obj['fivePointData'].length; s++) {
			let value = parseInt(obj['fivePointData'][s].value);
			let tempNums = value / 40000 - 1;
			let sizeTemp = tempNums > 1 ? 1 : tempNums < 0.2 ? 0.2 : tempNums;
			let size = [8*sizeTemp,16*sizeTemp,24*sizeTemp,32*sizeTemp];
			for (let m = 0; m < size.length; m++) {
				series.push({
		            name: '',
		            type: 'map',
		            mapType: 'china',
		            z: 9,
		            mapHide: true,
		            hoverable: false,
					roam: false,
		            markPoint : {
		                symbol:'circle',
		                symbolSize : size[m],
		                effect : {
		                    show: true,
		                    shadowBlur : 0
		                },
		                itemStyle:{
			                normal:{
			                    color: color[4]
			                }
			            },
		                data: [obj['fivePointData'][s]]
		            },
		            data:[],
		            geoCoord: this.geoCoord
				})
			}
		}

		let geoList = [];
		for (let i = dataAttr.length-1; i >= 0; i--) {
			if (obj[dataAttr[i]].length) {
				series.push({
					name: '',
					type: 'map',
					mapType: 'china',
					mapHide: true,
					z: 1,
					hoverable: false,
					roam: false,
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
							for (let index = 0; index < obj[dataAttr[i]].length; index++) {
		                    	for (let k in this.geoCoord) {
			                    	if (k == obj[dataAttr[i]][index].name) {
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
		                                Number(geoCoord[0]) + Math.random() * 5 - 2.5,
		                                Number(geoCoord[1]) + Math.random() * 3 - 1.5
		                            ]
		                        })
		                    }
		                    return data;
		                })()
					}
				});
			}
		}

		$("#mainMap").pushMapEcharts($.mapModule(null, series), ecs => {
			this.pushDataSet = setTimeout(() =>{
				this.getJson();
			},3000);
		});
	}
	__buildShadow(name){
		const selectData = [{
			name: name || shortName,
			selected: true
		}];
		let series = [{
			name: '',
			type: 'map',
			mapType: 'chinaShadow',
			boxShadow: true,
			boxShadowColor: 'rgba(0,153,255,1)',
			data: []
		},{
			name: '',
			type: 'map',
			selectedMode: 'single',
			mapType: 'china',
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
							color: '#fff',
							fontFamily: '微软雅黑',
							fontSize: $(window).height()*0.025
						}
					},
					borderWidth: 1,
					borderColor: 'rgba(255,255,255,0.5)',
					areaStyle: {
						// 区域图，纵向渐变填充
						type: 'default',
						color: 'rgba(2,75,144,1)'
					}
				}
			},
			data: selectData,
			geoCoord: {}
		}];
		
		$("#mainMapShadow").pushMapEcharts($.mapModule(null, series));
	}
	componentDidMount() {
		this.__buildShadow();
		this.getJson(true);
		$.getAreaName(datas => {
			$('.sec-title .title').html(datas['data'].shortName+'&nbsp;今日累计网络零售额&nbsp;');
		});
		PubSub.subscribe('checkMapSelect', (topic, data) => {
			this.__buildShadow(data[2]);
			$('.header').html(data[2]+'&nbsp;电子商务经济运行云图&nbsp;');
		});
	}
	render() {
		return (
			<section>
				<div className="sec-title">
					<span className="title">今日累计网络零售额&nbsp;</span>
					<span className="total_num">0</span>
					<span className="yuan">元</span>
				</div>
				<div className="sec-map">
					<div id="mainMapShadow"></div>
					<div id="mainMap"></div>
				</div>
			</section>
		)
	}
}

class Container extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="container">
	    		<HeaderComponent />
	    		<SectionComponent />
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('container')
);