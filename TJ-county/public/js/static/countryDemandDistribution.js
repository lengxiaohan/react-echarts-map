import {GetAnimateNum,RegExpThatName} from "common";
import "ajax-plus";
import "distributionLess";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// 获取区域id
let areaId = $.getUrlParam('areaId');

class ListComponent extends React.Component {
	state = {
		show: false
	}
	constructor(props) {
		super(props);
		this.superData = [];
		this.arrayGroup = [];
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

		if(sessionStorage.getItem('DATALIST_DEMANDALL')){
			const data = JSON.parse(sessionStorage.getItem('DATALIST_DEMANDALL'));
			this.showMapComponent(data,true);
		}else{
			let setData = {
				"type":0,
				"areaId": areaId
			};
			$.GetAjax($.getCtx() + '/rest/logistics/getTbLogisticsList', setData, 'GET', true, (data, state) => {
				if (state && data.list && data.list[0]) {
					// 缓存全部数据到本地
					sessionStorage.setItem('DATALIST_DEMANDALL', JSON.stringify(data));
					this.showMapComponent(data,false);
				} else if (!state) {
					setTimeout(() => {
						this._getDataList();
						console.log('主人，刚才服务器出了一下小差');
					}, 2000);
				}
			});
		};
		
	}
	showMapComponent(data,state) {
		let [PAGEERS,totalNums] = [10,0];
		$.onloadJavascript("./js/dist/echarts-all.js", false, true);
		const callBackJson = data.list;
		// 进行数据组装
		for (let i = 0; i < callBackJson.length / PAGEERS; i++) {
			let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
			for (let k = i * PAGEERS; k < i * PAGEERS + PAGEERS; k++) {
				attr.push(callBackJson[k]);
				totalNums += callBackJson[k] && callBackJson[k].sendNum || 0;
			}

			// 赋值
			this.arrayGroup[i] = attr;
			// 缓存
			sessionStorage.setItem('DATALIST_DEMAND' + (i+1), JSON.stringify(this.arrayGroup[i]));

			// 初始化数据渲染
			if (i == 0) {
				this.superData = this.arrayGroup[i];
				this.totalPage = Math.ceil(callBackJson.length / PAGEERS);

				this.setState({
					show: true
				});
			}

		}

		const setTimeDates = state ? 0 : 1000;
		PubSub.publish('show-Map',data);
		setTimeout(() => {
			$('.echarts-loding').hide();
			$('.echarts-map-show').css("opacity",1);
			$('.echarts-list-show').css("opacity",1);
		},setTimeDates);
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
			this.superData = JSON.parse(sessionStorage.getItem('DATALIST_DEMAND' + this.currentPage));
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
					<div className="nav-title">
						<span>排名</span>
						<span>地域</span>
						<span>需求指数</span>
					</div>
					<ul>
						{this.listShowDom || ''}
					</ul>
				</div>
				<MapComponent />
			</div>
		)
	}
}

class ListLiComponent extends React.Component {
	constructor(props) {
		super(props);
		this.listData = props;
	}
	componentWillReceiveProps(nextProps) {
		this.listData = nextProps;
	}
	render() {
		return (
			<li ref={"list"+this.listData.key2}>
				<span>{this.listData.item && this.listData.item.sendNum ? (this.listData.list+1 < 10 ? "0"+(this.listData.list+1) : this.listData.list+1) : ''}</span>
				<span>{this.listData.item && this.listData.item.regionName || ''}</span>
				<span>{this.listData.item && this.listData.item.sendNum || ''}</span>
			</li>
		)
	}
}

class MapComponent extends React.Component {
	componentDidMount() {
		this.pubsub_token = PubSub.subscribe('show-Map', (topic, data) => {
			const callBackJson = data && data.list;
			console.log(callBackJson);
			let ObjectTokenData = {
				hotData:[]
			};
			for (var i = 0; i < callBackJson.length; i++) {
				const number = Number(callBackJson[i].sendNum);
				for (var k = 0; k < number/500; k++) {
					ObjectTokenData.hotData.push([
	                	Number(callBackJson[i].location[0])-3+Math.random()*6,
	                	Number(callBackJson[i].location[1])-2+Math.random()*4,
	                	number-10+Math.random()*20
	                ]);
				}
                
            }
            console.log(ObjectTokenData);
            this._showMap(ObjectTokenData);
		});
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	_showMap(obj) {
		const myChart = echarts.init(document.getElementById('echarts-map'));
		var heatData = obj.hotData;
		// for (var i = 0; i < 200; ++i) {
		//     heatData.push([
		//         100 + Math.random() * 20,
		//         24 + Math.random() * 16,
		//         Math.random() *1000
		//     ]);
		// }
		// for (var j = 0; j < 10; ++j) {
		//     var x = 100 + Math.random() * 16;
		//     var y = 24 + Math.random() * 12;
		//     var cnt = 30 * Math.random();
		//     for (var i = 0; i < cnt; ++i) {
		//         heatData.push([
		//             x + Math.random() * 2,
		//             y + Math.random() * 2,
		//             Math.random()*1000
		//         ]);
		//     }
		// }
		console.log(heatData);
		let option = {
		    title : {
		        text: '热力图结合地图',
		        x:'center',
		        textStyle: {
		            color: 'white'
		        }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: '{b}'
		    },
		    toolbox: {
		        show : true,
		        orient : 'vertical',
		        x: 'right',
		        y: 'center',
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		        {
		            name: '全国',
		            type: 'map',
		            mapType: 'china',
		            roam: true,
		            hoverable: false,
		            data:[{
						name: "南海诸岛",
						selected: true
					}],
			        // 文本位置修正
			        textFixed: {
			            '南海诸岛' : [0, -$(window).height() / 15]
			        },
		            heatmap: {
		                minAlpha: 0.1,
		                data: heatData
		            },
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
									fontSize: $(window).height()*0.028,
									fontFamily: 'Microsoft Yahei ui'
								}
							},
							borderColor:'#000738',
							borderWidth:1,
							areaStyle:{
								color: '#122756'
							}
						}
					}
		        }
		    ]
		};
		myChart.setOption(option);
	}
	render() {
		return (
			<div className="echarts-map-show" id="echarts-map"></div>
		)
	}
}

class LodingComponent extends React.Component {
	render() {
		return (
			<div className= {sessionStorage.getItem('DATALIST_DEMANDALL') ? "echarts-loding hide" : "echarts-loding"}>
				<img src="img/svg/bar.svg"/>
				<p className="puffLoading">正在从云端获取数据</p>
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
	    		<ListComponent />
	    		<LodingComponent />
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('myMap')
);