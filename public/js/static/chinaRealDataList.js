import {formatPrice,addZero,show_num} from "common";
import "ajax-plus";

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
	_getName: function() {
		var name = '网络零售实时监控';
		return name;
	},
	render: function() {
		return (
			<header>{this._getName()}</header>
		);
	}
});

/**
 * @name ListFlexModule 列表组件
 * @param componentDidMount 渲染完成后调用一次，这个时候DOM结构已经渲染了。这个时候就可以初始化其他框架的设置了，如果利用jQuery绑定事件等等。
 * @param ReactDOM.findDOMNode(this.refs.list) 获取列表的真实dom节点
 */
var ListFlexModule = React.createClass({

	componentDidMount: function() {
		var count=parseInt(this.props.item.amount);
		var result="";
		var dom = ReactDOM.findDOMNode(this.refs.list);
		if(count<10000){
			result=addZero(count);
		}else if(count>10000&&count<100000000){
		    var end=count%10000;
		    var wan=parseInt(count/10000);
		    result="<span>"+wan+"</span><span class='short-size-span'>万</span>"+addZero(end)+"<span class='short-size-span'>元</span>";
		}else if(count>100000000){
		    var yi=parseInt(count/100000000);
		    var yiEnd=count%100000000;
		    var end=yiEnd%10000;
		    var wan=parseInt(yiEnd/10000);
		    result="<span>"+yi+"</span><span class='short-size-span'>亿</span>"+addZero(wan)+"<span class='short-size-span'>万</span>"+addZero(end)+"<span class='short-size-span'>元</span>";
		}else{
			result=count;
		}
		$(dom).append(result);
	},

	render: function() {
		return (
			<li>
				<p className="listFlex1">{this.props.item.areaName ? this.props.num+1 : ''}</p>
				<p className="listFlex1">{this.props.item.areaName ? this.props.item.areaName : ''}</p>
				<p className="listFlex2" ref="list"></p>
			</li>
		)
	}
});


/**
 * @name SectionComponent 内容部分组件
 * @param componentWillMount 渲染前调用一次，这个时候DOM结构还没有渲染。
 * @param componentDidUpdate 初始化渲染不会调用，更新后调用。
 * @param componentWillReceiveProps 初始化渲染不会调用，在接收到新的props时，会调用这个方法。
 * @param _getTitle 添加标题数据
 * @param _updateDidMount 获取数据生成列表的行 ListFlexModule为列表行组件
 */
var SectionComponent = React.createClass({
	_getTitle: function() {
		var name = '今日累计网络交易额:';
		return name;
	},
	componentWillMount: function() {
		this.listType = 1;
	},
	_updateDidMount: function(nextProps) {
		var that = this;
		var data = nextProps ? nextProps : false;
		if (data) {
			var length = data.length;
			this.dom = data.map(function(item, num) {
				if (num < 12 * that.listType && num >= 12 * that.listType - 12) {
					return <ListFlexModule item={item} num={num} key={num}/>
				}

			});
		};
	},
	componentDidUpdate: function() {
		var state = this.listType + 1;
		var MAX = Math.ceil(this.nextProps.length / 12);
		var totalNum = this.props.data.todayCollNum;
		this.listType = state > MAX ? 1 : state;
		show_num('.pushAnimateNum',totalNum,1);
	},
	componentWillReceiveProps: function(nextProps) {
		var that = this;
		this.nextProps = nextProps.data.cityOrderList;
		var MAX = Math.ceil(this.nextProps.length / 12); //最大多少页
		var state = that.listType + 1;
		if (this.nextProps.length <= MAX * 12) {
			for (var i = this.nextProps.length + 1; i <= MAX * 12; i++) {
				this.nextProps.push({});
			}
		}
		return true;
	},
	render: function() {
		this._updateDidMount(this.nextProps);
		return (
			<section>
				<GetMapComponent data={this.props.data}/>
	        	<div className="list-box">
	        		<p className="list-title">
	        			{this._getTitle()}
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


/**
 * @name GetMapComponent 地图部分组件
 * @param getInitialState 初始化执行一次添加当前组件状态的state
 * @param componentDidUpdate 初始化渲染不会调用，更新后调用。
 * @param componentWillReceiveProps 初始化渲染不会调用，在接收到新的props时，会调用这个方法。
 * @param getCanvas 计算生成echarts的option属性
 */
var GetMapComponent = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var that = this;
		this.data = nextProps.data;
		this.setState({
			status: true
		});
	},
	componentDidUpdate: function() {

		if (!this.state.status) {
			return false;
		}

		var that = this;
		// var dom = this.refs.JsMap.getDOMNode();
		var dom = ReactDOM.findDOMNode(this.refs.JsMap);

		this.getCanvas({
			data: that.data,
			id: dom,
			size: 25,
			select: that.selectData
		});
	},
	_setOptionSelection: function() {
		this.selectData = [{
			name: '四川',
			selected: true
		}];

		this.setState({
			status: true
		});
	},
	componentWillMount:function(){
		var that = this;
		this.selectData = [{
			name: '四川',
			selected: true
		}];

		//监听键盘事件
	    $(document).keydown(function (event) {
	        var name=that.selectData[0].name;
	        var position = ['四川','四川','四川','四川'];
	        var id = 5101;
	    	switch (event.keyCode) {
		    	case 38:
		    		var name=position[0];
		    		that._setOptionSelection(name);
		    		break;
		    	case 39:
		    		var name=position[1];
		    		that._setOptionSelection(name);
		    		break;
		    	case 40:
		    		var name=position[2];
		    		that._setOptionSelection(name);
		    		break;
		    	case 37:
		    		var name=position[3];
		    		that._setOptionSelection(name);
		    		break;
		     	case 13:
		     		if(!name){
		     			return false;
		     		}
		     		window.location="/show/TJ1.0-countys/public/cityRealDataList.jsp?areaId="+id;
		    		break;
		    	default:
		    		break;
		    }
	    });
	},
	getCanvas: function(obj) {
		var myChart = echarts.init(obj.id);
		myChart.clear();
		var data = obj.data;
		var dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData']

		var option = {
			series: [{
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
								color: '#fff'
							}
						},
						borderWidth: 1,
						borderColor: '#15162b',
						color: '#262b3f'
					},
					emphasis: {
						label: {
							show: true,
							textStyle: {
								color: '#fff'
							}
						},
						color: '#1184ed'
					}
				},
				data: obj.select,
				geoCoord: {
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
			}]
		};
		for (var i = 0; i < 5; i++) {
			option.series.push({
				name: dataAttr[i],
				type: 'map',
				mapType: 'china',
				data: [],
				markPoint: {
					// symbol: 'image://../../img/' + (i + 1) + '.png',
					symbol: 'image://../public/img/' + (i + 1) + '.png',
					symbolSize: obj.size,
					itemStyle: {
						normal: {
							label: {
								show: false
							}
						}
					},
					data: data[dataAttr[i]]
				}
			});
		}
		myChart.setOption(option);
	},
	render: function() {
		return (
			<div className="map-box" id="JS_map_box">
				<div className="map-show" ref="JsMap" ></div>
				{/*<ul className="map-msg-box">
					<li><img src="../../img/5.png" width="22" height="22"/>&nbsp;&nbsp;20000元以上</li>
					<li><img src="../../img/3.png" width="22" height="22"/>&nbsp;&nbsp;15000 元~20000元</li>
					<li><img src="../../img/2.png" width="22" height="22"/>&nbsp;&nbsp;8000 元~15000元</li>
				    <li><img src="../../img/4.png" width="22" height="22"/>&nbsp;&nbsp;2000 元~8000元</li>
					<li><img src="../../img/1.png" width="22" height="22"/>&nbsp;&nbsp;2000元以下</li>
				</ul>*/}
				<ul className="map-msg-box">
					<li><img src="../public/img/5.png" width="22" height="22"/>&nbsp;&nbsp;20000元以上</li>
					<li><img src="../public/img/3.png" width="22" height="22"/>&nbsp;&nbsp;15000 元~20000元</li>
					<li><img src="../public/img/2.png" width="22" height="22"/>&nbsp;&nbsp;8000 元~15000元</li>
				    <li><img src="../public/img/4.png" width="22" height="22"/>&nbsp;&nbsp;2000 元~8000元</li>
					<li><img src="../public/img/1.png" width="22" height="22"/>&nbsp;&nbsp;2000元以下</li>
				</ul>
			</div>
		)
	}
});


/**
 * @name Container 整个页面组件
 * @param getInitialState 初始化执行一次添加当前组件状态的state
 * @param componentDidMount 渲染完成后调用一次，这个时候DOM结构已经渲染了。这个时候就可以初始化其他框架的设置了，如果利用jQuery绑定事件等等。
 * @param _getDatas 获取数据
 */
var Container = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	_getDatas: function() {
		var that = this;
		var setData = {
			date: new Date().getTime()
		};
		// /public/others/data1.json
		// /show/rest/info/recentInfoChinaReal
		$.GetAjax('/public/others/data1.json', setData, 'GET', true, function(data) {
			that.state.status = true;
			that.setState({
				data: data
			});
			setTimeout(function() {
				that._getDatas();
			}, 2000);
		});
	},
	componentDidMount: function() {
		this._getDatas();
	},
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent/>
	            <SectionComponent data={this.state.data || false}/>
        	</div>
		)
	}
});

/**
 * @param 添加整个Container组件到页面
 */
ReactDOM.render(
	<Container />,
	document.getElementById('myApp')
);