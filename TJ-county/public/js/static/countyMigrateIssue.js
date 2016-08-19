import {GetAnimateNum,RegExpThatName} from "common";
import "ajax-plus";
import "issueLess";
import "animateCss";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// 获取区域id
let areaId = $.getUrlParam('areaId');

class MapComponent extends React.Component {
	componentDidMount() {
		this._showMap({});
		this.pubsub_token = PubSub.subscribe('showMap', (topic, data) => {
			const callBackJson = data && data.list;
			const startArea = data.areaShortName.replace(RegExpThatName(data.areaShortName), "" );
			let ObjectTokenData = {
				data1:[],
				data2:[{
					name: startArea,
					value: 0
				}],
				pos: {},
				dataRangeMax:0,
				dataRangeMin:0
			};
			ObjectTokenData.pos[startArea] = data.location;
			for (var i = 0; i < callBackJson.length; i++) {
				const endArea = callBackJson[i].regionName && callBackJson[i].regionName.replace(RegExpThatName(callBackJson[i].regionName), "");
				const receiveNum = callBackJson[i].receiveNum;
                if (i == callBackJson.length - 1) {
                	ObjectTokenData.dataRangeMax = Math.ceil(callBackJson[0].receiveNum);
                    ObjectTokenData.dataRangeMin = Math.ceil(callBackJson[i].receiveNum);
                }
                ObjectTokenData.data1.push([{
                	name: endArea,
                	value: receiveNum
                },{
                	name: startArea
                }]);
                ObjectTokenData.data2.push({
                	name: endArea,
                	value: receiveNum
                });
                ObjectTokenData.pos[endArea] = callBackJson[i].location;

            }
			this._showMap(ObjectTokenData);
		});
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	_showMap(obj) {
		const myChart = echarts.init(document.getElementById('echarts-map'));
		let config = {
			dataRangeColor: ['#ff3333', 'orange', 'yellow','lime','aqua'],
			period: 30,
			quertFont: 1,
			shadowBlur: 5
		};
        var option = {
				color: ['gold','aqua','lime'],
				tooltip : {
					trigger: 'item',
					formatter: '{b}'
				}, 
				dataRange: {
					x:$(window).width()-$(window).width()*0.95,
					y:$(window).height()-$(window).height()*0.15,
					orient: 'horizontal',
					min : 0,
					max : obj && obj.dataRangeMax || "MAX",
					calculable : false,
					splitNumber:0,   // 主要配置，可以将各个色系合并，不是单独分开的
					text:['高','低'],
					itemWidth: $(window).width() / 100,
					color: config.dataRangeColor,
					textStyle:{
						color:'#fff',
						fontFamily: 'Microsoft Yahei ui'
					}
				},
				series : [{
					name: '全国',
					type: 'map',
					roam: false,
					hoverable: false,
					mapType: 'china',
					itemStyle:{
						normal:{
							label: { 
                            	show: false
                            },
							areaStyle:{
								color: '#122756'
							},
							borderColor:'#000738',
							borderWidth:1
						},
						emphasis: {
							label: {
								show: true,
								textStyle: {
									color: '#5B6279',
									fontSize: ($(window).height() / 50 > 20 ? 20 : $(window).height() / 50),
									fontFamily: 'Microsoft Yahei ui'
								}
							},
							borderColor:'#000738',
							borderWidth:1,
							areaStyle:{
								color: '#122756'
							}
						}
					},
					data:[{
						name: "南海诸岛",
						selected: true
					}],
			        // 文本位置修正
			        textFixed: {
			            '南海诸岛' : [0, -$(window).height() / 15]
			        },
					markLine: {
					    smooth:true,
					    symbol: ['none', 'circle'],  
					    symbolSize : 1,
					    itemStyle : {
					        normal: {
					        	label:{
									show:false
								},
					            color:'#fff',
					            borderWidth:1,
					            borderColor:'rgba(30,144,255,0.5)'
					        }
					  	},
					    data: []
					},
					geoCoord: obj.pos
                },
                {
	                name: '',
	                type: 'map',
	                mapType: 'china',
	                roam:false,//是否开启滚轮缩放和拖拽漫游，默认为false（关闭）
	                data: [],
	                markLine: { //运输迁徙效果
	                    smooth: true,
	                    symbol: 'arrow',
	                    effect: {
	                        show: true,
	                        scaleSize: config.quertFont,
	                        period: config.period,
	                        color: '#fff',
	                        shadowBlur: config.shadowBlur
	                    },
	                    itemStyle: {
	                        normal: {
	                            borderWidth: 1,
	                            label: { 
	                            	show: false
	                            },
	                            lineStyle: {
	                                type: 'solid',
	                                shadowBlur: config.shadowBlur
	                            }
	                        }
	                    },
	                    data: obj && obj.data1 || []
	                },
	                markPoint: { //气泡效果(不断显示隐藏交替)
	                    symbol: 'emptyCircle',
	                    effect: {
	                        show: true,
	                        shadowBlur: 0
	                    },
	                    itemStyle: {
	                        normal: {
	                            label: { 
	                            	show: false
	                            }
	                        }
	                    },
	                    data: obj && obj.data2 || []
	                }
	            },
	            {
	                name: '',
	                type: 'map',
	                mapType: 'china',
	                data: [],
	                animation: false,
	                // 标注地名
	                markPoint: {
	                    symbol: 'emptyCircle',
	                    symbolSize: 0,
	                    itemStyle: {
	                        normal: {
	                            label: {
	                            	show: true,
	                                formatter: v => {
			                        	return v.name;
			                        },
			                        textStyle: {
			                        	align: 'left',
			                        	color: '#fff',
			                        	fontSize: ($(window).height() / 50 > 20 ? 20 : $(window).height() / 50),
			                        	fontFamily: 'Microsoft Yahei ui'
			                        }
	                            }
	                        }
	                    },
	                    data: obj && obj.data2 || []
	                }
	            }
	        ]
	    };
	    // 为echarts对象加载数据
	    myChart.setOption(option);
	}
	render() {
		return (
			<div className="echarts-map-show" id="echarts-map"></div>
		)
	}
}

class ListComponent extends React.Component {
	state = {
		show: false
	}
	constructor(props) {
		super(props);
		this.superData = [];
		this.arrayGroup = []; //拉取数据回来进行分组的转换数组
		this.totalPage = 0;
		this.currentPage = 1;
		this.listShowDom = '';
	}
	componentDidMount() {
		this._getDataList();
	}
	_pushListComponent(data = []) {
		let listArray = data; //获取数据进行遍历赋值
		let LENGTH = listArray.length;
		if (LENGTH < 10) {
			for(let i = 0; i < 10 - LENGTH; i++){
				listArray.push([]);
			}
		}
		this.listShowDom = listArray.map((item, list) => {
			return <ListLiComponent item={item} list={list+10*(this.currentPage-1)} key={list} key2={list} total={this.totalPage}/>
		});
	}
	_getDataList() {
		let [PAGEERS,totalNums] = [10,0];
		let setData = {
			"type":1,
			"areaId": areaId
		};
		$.GetAjax($.getCtx() + '/rest/logistics/getTbLogisticsList', setData, 'GET', true, (data, state) => {
			if (state && data.list[0]) {
				const callBackJson = data.list;
				// 进行数据组装
				for (let i = 0; i < callBackJson.length / PAGEERS; i++) {
					let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
					for (let k = i * PAGEERS; k < i * PAGEERS + PAGEERS; k++) {
						attr.push(callBackJson[k]);
						totalNums += callBackJson[k] && callBackJson[k].receiveNum || 0;
					}

					// 赋值
					this.arrayGroup[i] = attr;
					// 缓存
					sessionStorage.setItem('DATALIST_PAGE' + (i+1), JSON.stringify(this.arrayGroup[i]));

					// 初始化数据渲染
					if (i == 0) {
						this.superData = this.arrayGroup[i];
						this.totalPage = Math.ceil(callBackJson.length / PAGEERS);

						this.setState({
							show: true
						});
					}

				}

				// 2016-8-18日新增，动态加载数字，并处理在页面上，封装了新方法ReactGetAniNumId
				// ReactGetAniNumId可传虚拟dom的节点,或者jquery的id,如'#id'
				let ReactGetAniNumId = ReactDOM.findDOMNode(this.refs.ReactGetAniNumId);
				GetAnimateNum(ReactGetAniNumId,totalNums,'单');
				PubSub.publish('showMap',data);

			} else if (!state) {
				setTimeout(() => {
					this._getDataList();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
		});
	}
	componentDidUpdate() {
		if (this.totalPage <= 1) {
			return false;
		};
		setTimeout(() => {
			if (this.currentPage < this.totalPage) {
				this.currentPage ++;
			} else {
				this.currentPage = 1;
			}
			this.superData = JSON.parse(sessionStorage.getItem('DATALIST_PAGE' + this.currentPage));
			this.setState({
				show: true
			});
		},5000);
	}
	render() {
		this._pushListComponent(this.superData);
		return (
			<div className="echarts-list-show">
				<div className="list-box">
					<header>
						<div className="list-title">接收量总计</div>
						<div className="list-total-num"><p ref="ReactGetAniNumId"><span>数据获取中...</span></p></div>
					</header>
					<section>
						<div className="nav-title">
							<span>排名</span>
							<span>地域</span>
							<span>包裹接收量</span>
						</div>
						<ul>
							{this.listShowDom}
						</ul>
					</section>
				</div>
			</div>
		)
	}
}

class ListLiComponent extends React.Component {
	state = {
		start: false,
		classNamed: ''
	}
	constructor(props) {
		super(props);
		this.listData = props;
	}
	componentWillReceiveProps(nextProps) {
		this.listData = nextProps;
		this.timeoutEnd();
	}
	timeoutEnd(){
		setTimeout(()=>{
			let classNamed = 'animated bounceIn showList';
			this.setState({
				start: true,
				classNamed: classNamed
			});
		},this.listData.key2*100);

		if (this.listData.total <= 1) {
			return false;
		}

		setTimeout(()=>{
			let classNamed = 'animated bounceOut';
			this.setState({
				start: true,
				classNamed: classNamed
			});
		},this.listData.key2*100+4000);
	}
	render() {
		return (
			<li>
				<span className={this.state.classNamed}>{this.listData.item && this.listData.item.receiveNum ? (this.listData.list+1 < 10 ? "0"+(this.listData.list+1) : this.listData.list+1) : ' '}</span>
				<span className={this.state.classNamed}>{this.listData.item && this.listData.item.regionName || ' '}</span>
				<span className={this.state.classNamed}>{this.listData.item && this.listData.item.receiveNum || ' '}</span>
			</li>
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
	    		<MapComponent />
	    		<ListComponent />
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('myMap')
);