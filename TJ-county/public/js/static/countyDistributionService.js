import {GetAnimateNum} from "common";
import "ajax-plus";
import "echarts-map";
import "DisSeverLess";
import "animateCss";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';
import {coordinates} from "coordinates";

// 获取区域id
let areaId = $.getUrlParam('areaId');

class MapComponent extends React.Component {
	componentDidMount() {
		// =>函数可以省略.bind(this)来绑定当前this值，否则为undefined
		this.pubsub_token = PubSub.subscribe('showMap', (topic, data) => {
			this._showMap(data);
		});
		
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	_showMap(data = []) {
		let config = {
			msymbol : 'image://../public/img/Disservice.png',
			legendPic: 'image://../public/img/serviceIco.png',
			mdata : data
		}

		const objMsg = {
			id:'echarts-map',
			areaName: data[0] && data[0].areaName || ''
		};
		var setting = {
			legend: {
		        x: $(window).width()*0.08,
		        y: $(window).height() - $(window).height()*0.12,
		        itemHeight: $(window).height()*0.05,
		        itemWidth: $(window).height()*0.05,
				data: [{
					name : '服务站数量', 
					textStyle : {
						fontSize:$(window).height()*0.03,
						color: "#6c7b90",
						fontFamily: 'Microsoft Yahei ui'
					}, 
					icon : config.legendPic
				}]
			},
	        series: [{
                name: '服务站数量',
                type: 'map',
                data: [],
                roam: false, //不允许缩放
                hoverable: false,// 不允许hover
                itemStyle: {
                    normal: {
                        borderColor:'#000738',
                        label: {
                            show: true,
                            textStyle: {
                            	fontSize:$(window).height()*0.03,
                                color: "#aeb6c1",
                                fontFamily: 'Microsoft Yahei ui'
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
                                    color: "#fff",
                                    fontSize:$(window).height() *0.03,
                                    baseline:'bottom',
                                    align:'right',
                                	fontFamily: 'Microsoft Yahei ui'
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
	constructor(props) {
		super(props);
		this.superData = [];  // 用于存储请求回来的数据
		this.arrayGroup = []; // 拉取数据回来进行分组的转换数组
		this.totalPage = 0;   // 用于细分请求回来的数据的总页数
		this.currentPage = 1; // 当前页面上展示的某页的数据(默认第一页)
		this.listShowDom = '';
	}
	componentDidMount() {
		this._getDataList();
	}
	_pushListComponent(data = []) {
		let listArray = data; // 获取数据进行遍历赋值
		let LENGTH = listArray.length;
		if (LENGTH < 10) {
			for( let i = 0; i < 10 - LENGTH; i++ ) {
				listArray.push([]); // 无数据的置空
			}
		}
	  	this.listShowDom = listArray.map((item, list) => {
			return <ListLiComponent item={item} list={list+10*(this.currentPage-1)} key={list} key2={list} total={this.totalPage}/>
		});

		this.setState({
			show: true
		});
	}
	_getDataList() {
		let [PAGEERS,totalNums] = [10,0];
		let setData = {
			"areaId": areaId
		};
		$.GetAjax($.getCtx() + '/rest/site/findAllTBServiceRegisterRanking', setData, 'GET', true, (data, state) => {
			if (state && data[0]) {
				// 进行数据组装
				for (let i = 0; i < data.length / PAGEERS; i++) {
					let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
					for (let k = i * PAGEERS; k < i * PAGEERS + PAGEERS; k++) {
						attr.push(data[k]);
						totalNums += data[k] && data[k].value || 0;
					}

					// 赋值
					this.arrayGroup[i] = attr;
					// 缓存
					sessionStorage.setItem('DATALIST_PAGE' + (i+1), JSON.stringify(this.arrayGroup[i]));

					// 初始化数据渲染
					if ( i == 0 ) {
						this.superData = this.arrayGroup[i];
						this.totalPage = Math.ceil(data.length / PAGEERS);

						this._pushListComponent(this.superData);
					}
				}

				let ReactGetAniNumId = ReactDOM.findDOMNode(this.refs.ReactGetAniNumId);
				GetAnimateNum(ReactGetAniNumId,totalNums,'个');
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
			if ( this.currentPage < this.totalPage ) {
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
		console.log(this.listShowDom);
		return (
			<div className="echarts-list-show">
				<div className="list-box">
					<header>
						<div className="list-title">电商服务站总计</div>
						<div className="list-total-num">
							<p ref="ReactGetAniNumId"><span>数据获取中...</span></p>
						</div>
					</header>
					<section>
						<div className="nav-title">
							<span>排名</span>
							<span>所属乡镇</span>
							<span>站点数</span>
						</div>
						<ul>
							{this.listShowDom || ''}
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
		this.classNamed = '';
	}
	componentWillReceiveProps(nextProps) {
		this.listData = nextProps;
		this.timeoutEnd();
	}
	componentDidMount() {
		this.timeoutEnd();
	}
	timeoutEnd(){
		let listId = "list"+this.listData.key2;
		let listDom = ReactDOM.findDOMNode(this.refs[listId]);
		setTimeout(()=>{
			$(listDom).find('span').addClass('animated bounceIn showList');
		},this.listData.key2*100);

		if (this.listData.total <= 1) {
			return false;
		}

		setTimeout(()=>{
			$(listDom).find('span').addClass('animated bounceOut');
		},this.listData.key2*100+4000);
	}
	render() {
		return (
			<li ref={"list"+this.listData.key2}>
				<span>{this.listData.item && this.listData.item.value ? (this.listData.list+1 < 10 ? "0"+(this.listData.list+1) : this.listData.list+1) : '' || ''}</span>
				<span>{this.listData.item && this.listData.item.name || ''}</span>
				<span>{this.listData.item && this.listData.item.value || ''}</span>
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