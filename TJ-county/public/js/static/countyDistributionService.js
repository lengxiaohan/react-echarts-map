import "common";
import "ajax-plus";
import "echarts-map";
import "DisSeverLess";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';
import {coordinates} from "coordinates";

// 获取区域id
let areaId = $.getUrlParam('areaId');

class MapComponent extends React.Component {
	componentDidMount() {
		const that = this;
		this.pubsub_token = PubSub.subscribe('showMap', function(topic, data) {
			that._showMap(data);
		}.bind(this));
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	_showMap(data) {
		const that = this;
		let config = {
			msymbol : 'image://../public/img/Disservice.png',
			mdata : data || []
		}

		const objMsg = {
			id:'echarts-map',
			areaName:'资中县'
		};
		
		var setting = {
	        series: [{
                name: '',
                type: 'map',
                data: [],
                roam: false, //不允许缩放
                hoverable: false,//非数值显示（如仅用于显示标注标线时），可以通过hoverable:false关闭区域悬浮高亮
                itemStyle: {
                    normal: {
                    	show: true,
                        borderColor:'#000738',
                        label: {
                            show: true,
                            formatter:"{a}",
                            textStyle: {
                            	fontSize:($(window).height() / 50 > 20 ? 20 : $(window).height() / 50),
                                color: "#99A6B9"
                            }
                        },
						areaStyle:{
							color: '#122756'
						}
                        
                    }
                },
                geoCoord: coordinates(),
                markPoint: {
                    symbol: config.msymbol,
                    symbolSize: $(window).height() / 16,
                    effect: {
                        show: false,
                        shadowBlur: 0
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#FAFCF9",
                                    fontSize:$(window).height() / 30,
                                    baseline:'bottom',
                                    align:'right'
                                }
                            }
                        },
                        emphasis:{
                            label: {
                                show: false
                            }
                        }
                    },
                    data: config.mdata
                }
            }]
	    };
		$.getSmallMap(objMsg,setting);
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
		this.setPage = 1;
		this.totalPage = 0;
		this.currentPage = 1;
	}
	componentDidMount() {
		this._getDataList();
	}
	_pushListComponent(data) {
		const that = this;
		let listArray = data ? data : []; //获取数据进行遍历赋值
		let LENGTH = listArray.length;
		if (LENGTH < 10) {
			for(let i = 0;i<10-LENGTH;i++){
				listArray.push([]);
			}
		}
		this.dom = listArray.map(function(item, list) {
			return <ListLiComponent item={item} list={list+10*(that.currentPage-1)} key={list}/>
		});
	}
	_getDataList() {
		const that = this;
		const PAGEERS = 10; //每页总个数
		let totalNums = 0;
		let setData = {
			"areaId": areaId
		};
		$.GetAjax($.getCtx() + '/rest/site/findAllServiceRegisterRanking', setData, 'GET', true, function(data, state) {
			if (state && data[0]) {

				// 进行数据组装
				for (let i = 0; i < data.length / PAGEERS; i++) {
					let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
					for (let k = i * PAGEERS; k < i * PAGEERS + PAGEERS; k++) {
						attr.push(data[k]);
						totalNums += data[k] && data[k].value || 0;
					}

					// 赋值
					that.arrayGroup[i] = attr;
					// 缓存
					sessionStorage.setItem('DATALIST_PAGE' + (i+1), JSON.stringify(that.arrayGroup[i]));

					// 初始化数据渲染
					if (i == 0) {
						that.superData = that.arrayGroup[i];
						that.totalPage = data.length / PAGEERS;
						
					}

				}
				that.setState({
					show: true,
					totalNum: totalNums
				});

				PubSub.publish('showMap',data);

			} else if (!state) {
				setTimeout(() => {
					that._getDataList();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}
		});
	}
	componentDidUpdate() {
		const that = this;
		setTimeout(() => {
			if (that.currentPage<that.totalPage) {
				that.currentPage++;
			}else{
				that.currentPage = 1;
			}
			that.superData = JSON.parse(sessionStorage.getItem('DATALIST_PAGE'+that.currentPage));
			that.setState({
				show: true
			});
		},2000);
	}
	render() {
		this._pushListComponent(this.superData);
		return (
			<div className="echarts-list-show">
				<div className="list-box">
					<header>
						<div className="list-title">接收量总计</div>
						<div className="list-total-num"><p>{this.state.totalNum || 0}<span>个</span></p></div>
					</header>
					<section>
						<div className="nav-title">
							<span>排名</span>
							<span>城市</span>
							<span>注册个数</span>
						</div>
						<ul>
							{this.dom}
						</ul>
					</section>
				</div>
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
		const that = this;
		this.listData = nextProps;
	}
	render() {
		return (
			<li>
				<span>{this.listData.item && this.listData.item.value ? (this.listData.list+1 < 10 ? "0"+(this.listData.list+1) : this.listData.list+1) : '-' || '-'}</span>
				<span>{this.listData.item && this.listData.item.name || '-'}</span>
				<span>{this.listData.item && this.listData.item.value || '-'}</span>
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