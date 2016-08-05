import {
	show_num
} from "common";
import "echarts-map";
import "ajax-plus";

import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';


class HeaderComponent extends React.Component {
	state = {
		value: ''
	}
	constructor(props) {
		super(props);
		const that = this;
		$.getAreaName(data => {
			let name = data.name ? data.name : '';
			that.setState({
				value: name
			});
		});
	}
	render() {
		return (
			<header className="header">{this.state.value}电子商务经济运行云图</header>
		)
	}
}

class SectionComponent extends React.Component {
	constructor(props) {
		super(props);
		this.pushDataSet = void 0;
	}
	getJson() {
		const that = this;
		let setData = {
			date: new Date().getTime()
		}
		$.GetAjax($.getCtx() + '/rest/info/recentInfoChinaReal', setData, 'GET', true, (data, state) => {

			if (state) {
				clearTimeout(that.pushDataSet);
				that.getChinaMap(data);
			} else {
				setTimeout(function() {
					that.getJson();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}

		});
	}
	getChinaMap = obj => {
		const that = this;
		let todayCollNum = obj.todayCollNum;
		show_num('.t_num', todayCollNum);
		const selectData = [{
			name: $.getUrlParam("shortName"),
			selected: true
		}];
		const dataAttr = ['onePointData', 'threePointData', 'fourPointData', 'twoPointData', 'fivePointData'];
		const color = ['#646e7a', '#f9d33c', '#ed8953', '#50c4eb', '#db4453'];
		const size = 25;
		let series = [{
			name: '中国',
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
							color: '#fff',
							fontSize: ($(window).width() / 55 > 25 ? 25 : $(window).width() / 55)
						}
					},
					borderWidth: 1,
					borderColor: '#000033',
					areaStyle: {
						// 区域图，纵向渐变填充
						type: 'default',
						color: (function() {
							var zrColor = zrender.tool.color;
							return zrColor.getLinearGradient(
								0, 200, 0, 400, [
									[0, 'rgba(0,102,255,0.4)'],
									[0.4, 'rgba(0,102,255,0.4)']
								]
							)
						})()
					}
				},
				emphasis: {
					label: {
						show: true,
						textStyle: {
							color: '#fff',
							fontSize: ($(window).width() / 30 > 35 ? 35 : $(window).width() / 30)
						}
					},
					color: '#0066ff',
					opacity: 0.2
				}
			},
			data: selectData,
			geoCoord: that.geoCoord()
		}];

		for (let i = 0; i < 5; i++) {
			series.push({
				name: '',
				type: 'map',
				mapType: 'china',
				data: [],
				markPoint: {
					symbol: 'image://../public/img/' + (i + 1) + '.png',
					symbolSize: size,
					itemStyle: {
						normal: {
							label: {
								show: false
							},
							color: color[i]
						}
					},
					data: obj[dataAttr[i]]
				}
			});
		}

		$("#mainMap").pushMapEcharts($.mapModule(null, series), callback);

		function callback(ec) {
			PubSub.publish('showLegend', 'show');
			that.pushDataSet = setTimeout(function() {
				that.getJson();
			}, 3000);
		}
	}
	geoCoord() {
		let data = {
			"北京市": [115.4551, 41.2539],
			"浙江省": [121.5313, 27.8773],
			"天津市": [117.4219, 39.4189],
			"安徽省": [117.29, 32.0581],
			"上海市": [121.4648, 31.2891],
			"福建省": [119.4543, 25.9222],
			"重庆市": [107.7539, 30.1904],
			"江西省": [116.0046, 28.6633],
			"香港特别行政区": [null, null],
			"山东省": [121.1582, 36.8701],
			"澳门特别行政区": [null, null],
			"河南省": [111.4668, 34.6234],
			"内蒙古自治区": [113.4124, 44.4901],
			"湖北省": [114.3896, 30.6628],
			"新疆维吾尔自治区": [80.9236, 42.5883],
			"湖南省": [111.0823, 29.2568],
			"宁夏回族自治区": [104.4586, 39.7775],
			"广东省": [113.5107, 23.0196],
			"西藏自治区": [85.1865, 31.9465],
			"海南省": [107.4893, 19.4516],
			"广西壮族自治区": [105.379, 24.0152],
			"四川省": [100.2526, 30.3617],
			"河北省": [115.4995, 37.1006],
			"贵州省": [103.3992, 27.9682],
			"山西省": [111.3352, 39.3413],
			"云南省": [98.7000, 25.2663],
			"辽宁省": [122.1238, 42.8216],
			"陕西省": [106.2162, 35.8004],
			"吉林省": [126.2154, 45.2584],
			"甘肃省": [92.5901, 41.0043],
			"黑龙江省": [127.9688, 49.368],
			"青海省": [93.0038, 36.2207],
			"江苏省": [119.8062, 34.4208],
			"台湾省": [null, null]
		}
		return data;
	}
	componentDidMount() {
		this.getJson();
	}
	render() {
		return (
			<section>
				<div className="sec-title">
					<span className="title">全国今日累计网络零售额&nbsp;</span>
					<span className="t_num">0</span>
					<span className="yuan">元</span>
				</div>
				<div className="sec-map" id="mainMap"></div>
			</section>
		)
	}
}

class LegendComponent extends React.Component {
	state = {
		show: 'legend'
	}
	componentDidMount() {
		this.pubsub_token = PubSub.subscribe('showLegend', function(topic, data) {
			this.setState({
				show: 'legend legendShow'
			});
		}.bind(this));
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	render() {
		return (
			<ul className={this.state.show}>
				<li><img alt="img" src="img/5.png" width="25" height="25"/>&nbsp;&nbsp;&nbsp;40000元以上</li>
				<li><img alt="img" src="img/3.png" width="25" height="25"/>&nbsp;&nbsp;&nbsp;30000元~40000元</li>
				<li><img alt="img" src="img/2.png" width="25" height="25"/>&nbsp;&nbsp;&nbsp;16000元~30000元</li>
				<li><img alt="img" src="img/4.png" width="25" height="25"/>&nbsp;&nbsp;&nbsp;4000元~16000元</li>
				<li><img alt="img" src="img/1.png" width="25" height="25"/>&nbsp;&nbsp;&nbsp;4000元以下</li>
			</ul>
		)
	}
}


class Container extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="container-box">
	    		<HeaderComponent />
	    		<SectionComponent />
	    		<LegendComponent />
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('container')
);