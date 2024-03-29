import {formatPrice,addZero,show_num,initAreaController} from "common";
import "ajax-plus";
import "cityRealDataListLess";
import React from 'react';
import ReactDOM from 'react-dom';


// 获取区域id
let areaId = $.getUrlParam('areaId');
/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
	_getName: function() {
		const name = '网络零售实时监控';
		return name;
	},
	render: function() {
		return (
			<header>{this._getName()}</header>
		);
	}
});

/**
 * @name SectionComponent 内容部分组件
 * @param componentWillMount 渲染前调用一次，这个时候DOM结构还没有渲染。
 * @param componentDidUpdate 初始化渲染不会调用，更新后调用。
 * @param componentWillReceiveProps 初始化渲染不会调用，在接收到新的props时，会调用这个方法。
 * @param _getTitle 添加标题数据
 */
var SectionComponent = React.createClass({
	getInitialState: function() {
		return {
			status: false
		};
	},
	_getTitle: function() {
		const name = '今日累计网络交易额:';
		return name;
	},
	componentWillMount: function() {
		this.listType = 1;
		this.ALLDATA = {};
	},
	componentDidMount: function() {
		this._getDatas(true,data => {
			setTimeout(() => {
				$('.echarts-loding').remove();
				$('header').css("opacity",1);
				$('section').css("opacity",1);
				this.start(data);
			},1000);
			
		});
	},
	start: function(data = []) {
		let totalNum = data.todayCollNum;
		show_num('.pushAnimateNum',totalNum,1);
		this.setState({
			status: true
		});
		setTimeout(() => {
			this._getDatas();
		}, 2000);
	},
	_getDatas: function(state = false, callback) {
		let setData = {
			areaId: areaId,
			date: new Date().getTime()
		};
		$.GetAjax($.getCtx()+'/rest/info/recentInfoReal', setData, 'GET', true, (data,t_state) => {
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
	        	<div className="list-box">
	        		<p className="list-title">
	        			{this._getTitle()}
	        		</p>
	        		<div className="pushAnimateNum" ref="aniNum">0<span className="short-size-span">元</span></div>
	        		{/*<ul className="pushListBox">
						<li><img src="../../img/5.png"/>&nbsp;&nbsp;20000元以上</li>
						<li><img src="../../img/3.png"/>&nbsp;&nbsp;15000 元~20000元</li>
						<li><img src="../../img/2.png"/>&nbsp;&nbsp;8000 元~15000元</li>
					    <li><img src="../../img/4.png"/>&nbsp;&nbsp;2000 元~8000元</li>
						<li><img src="../../img/1.png"/>&nbsp;&nbsp;2000元以下</li>
	        		</ul>*/}
	        		<ul className="pushListBox">
						<li><img src="../public/img/5.png"/>&nbsp;&nbsp;20000元以上</li>
						<li><img src="../public/img/3.png"/>&nbsp;&nbsp;15000 元~20000元</li>
						<li><img src="../public/img/2.png"/>&nbsp;&nbsp;8000 元~15000元</li>
					    <li><img src="../public/img/4.png"/>&nbsp;&nbsp;2000 元~8000元</li>
						<li><img src="../public/img/1.png"/>&nbsp;&nbsp;2000元以下</li>
	        		</ul>
	        	</div>
	        	<GetMapComponent data={this.ALLDATA}/>
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
	_setOptionSelection: function(name) {
		if(!name){
		 	return false;
		}
		this.selectData = [{
			name: name,
			selected: true
		}];

		this.setState({
			status: true
		});
	},
	componentWillMount:function(){
		const that = this;
		this.selectData = [{
			name: '成都',
			selected: true
		}];

		//监听键盘事件
	    $(document).keydown(function (event) {
	        let name=that.selectData[0].name;
	        let position = initAreaController(name).position;
	        let id = initAreaController(name).id;
	    	switch (event.keyCode) {
		    	case 38:
		    		name=position[0];
		    		that._setOptionSelection(name);
		    		break;
		    	case 39:
		    		name=position[1];
		    		that._setOptionSelection(name);
		    		break;
		    	case 40:
		    		name=position[2];
		    		that._setOptionSelection(name);
		    		break;
		    	case 37:
		    		name=position[3];
		    		that._setOptionSelection(name);
		    		break;
		     	case 13:
		     		if(!name){
		     			return false;
		     		}
		     		// window.location="/show/TJ1.0-countys/public/countyRealtimeOne.jsp?areaId="+id;
		     		window.location="countyRealtimeOne.html?areaId="+id;
		    		break;
		    	default:
		    		break;
		    }
	    });
	},
	componentWillReceiveProps: function(nextProps) {
		const that = this;
		this.data = nextProps.data;
		this.setState({
			status: true
		});
	},
	componentDidUpdate: function() {
		const that = this;
		if (!this.state.status) {
			return false;
		}
		// var dom = this.refs.JsMap.getDOMNode();
		let dom = ReactDOM.findDOMNode(this.refs.JsMap);
		this.getCanvas({
			data: that.data,
			id: dom,
			size: $(window).height()/30,
			select: that.selectData
		});
	},
	getCanvas: function(obj) {
		const myChart = echarts.init(obj.id).clear();
		const dataAttr = ['onePointData', 'twoPointData', 'threePointData', 'fourPointData', 'fivePointData'];
		let data = obj.data;

		let option = {
			series: [{
	            name: '四川',
	            type: 'map',
	            selectedMode : 'single',
	            mapType: '四川',
	            hoverable: false,
	            roam:false,
	            itemStyle:{
	                normal:{label:{show:true,textStyle:{color:'#fff',fontSize:15}},borderWidth:1,borderColor:'#15162b',color:'#262b3f'},
	                emphasis:{label:{show:true,textStyle: {color: '#fff',fontSize:15}},color:'#1184ed'}
	            },
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
	            data: obj.select ,
	            markPoint : {
	                symbolSize: 5,
	                itemStyle: {
	                    normal: {
	                        borderColor: '#87cefa',
	                        borderWidth: 1,
	                        label: {
	                            show: false
	                        }
	                    },
	                    emphasis: {
	                        borderColor: '#ff6600',
	                        borderWidth: 5,
	                        label: {
	                            show: false
	                        }
	                    }
	                },
	                data : []
	            },
	            geoCoord: {
	                "成都市": [
                        104.06,
                        30.67
                    ],
                    "德阳市": [
                        104.38,
                        31.13
                    ],
                    "绵阳市": [
                        104.73,
                        31.87
                    ],
                    "泸州市": [
                        105.46,
                        28.49
                    ],
                    "广元市": [
                        105.83,
                        32.43
                    ],
                    "攀枝花市": [
                        101.72,
                        26.58
                    ],
                    "内江市": [
                        105.05,
                        29.58
                    ],
                    "眉山市": [
                        104.15,
                        30
                    ],
                    "乐山市": [
                        103.58,
                        29.17
                    ],
                    "南充市": [
                        106.2,
                        31.15
                    ],
                    "阿坝藏族羌族自治州": [
                        102.22,
                        31.9
                    ],
                    "雅安市": [
                        102.67,
                        29.89
                    ],
                    "资阳市": [
                        104.97,
                        30.16
                    ],
                    "凉山彝族自治州": [
                        102.27,
                        27.9
                    ],
                    "自贡市": [
                        104.78,
                        29.35
                    ],
                    "甘孜藏族自治州": [
                        99.92,
                        31.08
                    ],
                    "遂宁市": [
                        105.57,
                        30.52
                    ],
                    "广安市": [
                        106.63,
                        30.47
                    ],
                    "宜宾市": [
                        104.62,
                        28.77
                    ],
                    "巴中市": [
                        106.77,
                        31.85
                    ],
                    "达州市": [
                        107.5,
                        31.22
                    ]
                }
			}]
		};
		for (let i = 0; i < 5; i++) {
			option.series.push({
				name: dataAttr[i],
				type: 'map',
				mapType: '四川',
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
				<div className="map-show" ref="JsMap"></div>
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
	render: function() {
		return (
			<div className="container-cp">
	        	<HeaderComponent/>
	            <SectionComponent/>
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