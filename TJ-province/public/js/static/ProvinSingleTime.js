import {
	getJson,
	getAreaCp,
	pushScrollNum,
	formatPrice,
	toThousands,
	addZero
} from "common";
import "echarts-line";
import "echarts-map";
import "ajax-plus";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// 获取区域id
let areaId = $.getUrlParam('areaId');

class HeaderComponent extends React.Component {
	render() {
		return (
			<img src="img/head-bg.png" className="header-ng" alt="顶部背景图"/>
		)
	}
}

class SmallComponent extends React.Component {
	state = {
		status: false
	}
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const obj = {
			id: 'JS_smallMap'
		};
		let setting = {
			series: [{
				name: '地图',
				type: 'map',
				data: [],
				hoverable: false,
				roam: false,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						borderWidth: 0.1,
						areaStyle: {
							type: 'default',
							color: function() {
								var zrColor = zrender.tool.color;
								return zrColor.getLinearGradient(0, 0, 0, $(window).height() / 3 * 2, [
									[0, 'rgba(239,184,4,.8)'],
									[.8, 'rgba(76,64,39,.1)']
								]);
							}()
						}
					},
					emphasis: {
						label: {
							show: true
						}
					}
				},
				data: []
			}]
		};
		setTimeout(function() {
			$.getSmallMap(obj, setting);
		}, 0)

	}
	render() {
		return (
			<div className="mapShowBox">
				<img src="img/mapsBg.png" alt="背景图"/>
				<div id="JS_smallMap" className="smallMapDv"></div>
			</div>
		)
	}
}

class SectionComponent extends React.Component {
	constructor(props) {
		super(props);
		this.ECs = void 0;
		this.pushDataSet = void 0;
	}
	componentDidMount() {
		this.getJsonData();
	}
	getJsonData() {
		const that = this;
		const config = {
			areaId: areaId,
			time: new Date().getTime()
		}
		$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoListReal', config, 'GET', true, (data, state) => {
			if (state) {
				that.callpack(data);
			} else {
				setTimeout(function() {
					that.getJsonData();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
		});
	}
	callpack(data) {
		const that = this;
		let config = [];
		if (data && data[0]) {
			let data_x = data[0].x;
			let data_y = data[0].y;
			let onetodayNum = data[0].todayNum;
			$("#JS_get_areaName").html(data[0].area.shortName);

			pushScrollNum(onetodayNum, "#JS_get_aniNum");

			let setting = {
				grid: {
					x: 0,
					y: 50,
					x2: 0,
					y2: 30
				},
				tooltip: {
					trigger: 'axis',
					formatter: '{b}</br>{a}:{c}'
				},
				animationDuration: 2000,
				animationDurationUpdate: 250,
				xAxis: [{
					show: true,
					type: 'category',
					boundaryGap: false,
					data: data_x,
					splitLine: {
						show: false,
						lineStyle: {
							color: ['rgba(255,255,255,.6)']
						}
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: 'rgba(108,123,144,0.8)'
						}
					},
					axisLabel: {
						textStyle: {
							color: '#fff',
							fontFamily: '微软雅黑',
							fontSize: $(window).width() / 70 < 16 ? $(window).width() / 70 : 16,
							align: 'left'
						}
					}
				}],
				yAxis: [{
					show: false,
					name: '/元',
					nameLocation: 'end',
					type: 'value',
					splitLine: {
						show: false
					},
					nameTextStyle: {
						color: '#6c7b90',
						fontFamily: '微软雅黑',
						fontSize: $(window).width() / 70
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: 'rgba(108,123,144,0.8)'
						}
					},
					axisLabel: {
						formatter: function formatter(value) {
							return value;
						},
						textStyle: {
							color: '#6c7b90',
							fontFamily: '微软雅黑',
							fontSize: $(window).width() / 70,
							align: 'left'
						}
					},
					splitArea: {
						show: false,
						areaStyle: {
							color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']
						}
					}
				}]
			};

			let seriesData = data_y;
			let seriesLength = seriesData[seriesData.length - 1];
			seriesData.pop();
			seriesData.push({
				value: seriesLength,
				symbol: '',
				symbolSize: 0,
				symbolRotate: ''
			});

			let series = [{
				symbolSize: 0,
				smooth: true,
				name: '交易额',
				type: 'line',
				stack: 'group',
				data: seriesData,
				itemStyle: {
					normal: {
						label: {
							show: true,
							textStyle: {
								color: '#fff'
							}
						},
						color: "#FFC900",
						lineStyle: { // 系列级个性化折线样式
							type: 'solid',
							width: 5,
							shadowBlur: 5
						},
						label: {
							show: true,
							formatter: function formatter(value) {
								return value.value;
							},
							textStyle: {
								fontSize: $(window).width() / 60,
								color: '#fff',
								align: 'left'
							}
						},
						areaStyle: {
							// 区域图，纵向渐变填充
							type: 'default',
							color: function() {
								var zrColor = zrender.tool.color;
								return zrColor.getLinearGradient(0, 0, 0, $(window).height() / 1.2, [
									[0, 'rgba(239,184,4,.8)'],
									[0.8, 'rgba(239,184,4,0.1)']
								]);
							}()
						}
					}
				}
			}];

			$('#Js_canvas_cont').pushEcharts($.module('line', setting, series, config), callback);

			function callback(ec) {
				that.ECs = ec;
				that.pushDataSet = setTimeout(function() {
					that.addDatas(that.ECs);
				}, 2000);
			}
		}
	}
	addDatas(ecs) {
		const that = this;
		//获取毫秒数
		let d = new Date();
		let h = d.getHours(); //获取当前小时数(0-23)
		let m = d.getMinutes(); //获取当前分钟数(0-59)
		let s = d.getSeconds(); //获取当前秒数(0-59)
		if ((m + "").length == 1) {
			m = 0 + "" + m;
		}
		if ((s + "").length == 1) {
			s = 0 + "" + s;
		}

		function callpack(data) {
			const one = data[0].infos[0];
			const oneAmount = one.amount ? one.amount : 0;
			const oneTodayNum = data[0].todayNum;

			pushScrollNum(oneTodayNum, "#JS_get_aniNum");

			that.pushDataSet = setTimeout(function() {
				that.addDatas(ecs);
			}, 5000);

			ecs.addData([
				[0, // 系列索引
					{
						value: oneAmount,
						symbol: '',
						symbolSize: 0
					}, // 新增数据
					false, // 新增数据是否从队列头部插入
					false, // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
					h + ":" + m + ":" + s // 坐标轴标签
				]
			]);

		}
		const config = {
			areaId: areaId,
			time: new Date().getTime()
		}
		$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoReal', config, 'GET', true, (data, state) => {
			if (state) {
				callpack(data);
			} else {
				setTimeout(function() {
					that.addDatas(ecs);
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
		});
	}
	render() {
		return (
			<div className="timeLineBox">
				<div className="navNameShow">
					<div className="navHeadBox">
						<span id="JS_get_areaName"></span>
						<span>今日累计网络零售额&nbsp;&nbsp;</span>
						<span id="JS_get_aniNum" className="get-ani-num">0</span>元
					</div>
				</div>
				<div className="sectionBox" id="Js_canvas_cont"></div>
				<div className="xuniBg"></div>
			</div>
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
	    		<SmallComponent />
	    		<SectionComponent/>
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('container')
);