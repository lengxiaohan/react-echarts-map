import "common";
import "ajax-plus";
import "receiveLess";
import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

// 获取区域id
let areaId = $.getUrlParam('areaId');

class MapComponent extends React.Component {
	componentDidMount() {
		const that = this;
		// this._showMap({});
		this.pubsub_token = PubSub.subscribe('showMap', function(topic, data) {
			let ObjectTokenData = {
				data1:[],
				data2:[],
				data3:[],
				dataRangeMax:0,
				dataRangeMin:0
			};
			for (var i = 0; i < data.length; i++) {
                if (i == data.length - 1) {
                	ObjectTokenData.dataRangeMax = data[0].nums;
                    ObjectTokenData.dataRangeMin = data[i].nums;
                }
                ObjectTokenData.data1.push([{
                	name:'资中'
                },{
                	name: data[i].region,
                	value: data[i].nums 
                }]);
                ObjectTokenData.data2.push({
                	name: data[i].region,
                	value: data[i].nums
                });
                ObjectTokenData.data3.push([{
                	name:'资中'
                },{
                	name: data[i].region
                }]);
            }
            console.log(ObjectTokenData);
			that._showMap(ObjectTokenData);
		}.bind(this));
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	_showMap(obj) {
		const that = this;
		const myChart = echarts.init(document.getElementById('echarts-map'));
		let period = 30;
        var option = {
				backgroundColor: '#191A2F',
				color: ['gold','aqua','lime'],
				tooltip : {
					trigger: 'item',
					formatter: '{b}'
				}, 
				dataRange: {
					show:false,
					min : 0,
					max : obj && obj.dataRangeMax || 0,
					calculable : true,
					color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
					textStyle:{
						color:'#fff'
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
							borderColor:'rgba(100,149,237,1)',
							borderWidth:0.5,
							areaStyle:{
								color: 'rgba(255, 255, 255, 0)'
							}
						},
						emphasis: {
							label: {
								show: true,
								textStyle: {
									color: '#fff',
									fontSize: ($(window).height() / 50 > 20 ? 20 : $(window).height() / 50)
								}
							},
							borderColor:'rgba(100,149,237,1)',
							borderWidth:0.5,
							areaStyle:{
								color: 'rgba(255, 255, 255, 0)'
							}
						}
					},
					data:[{
						name: "南海诸岛",
						selected: true
					}],
			        // 文本位置修正
			        textFixed : {
			            '南海诸岛' : [0, 0]
			        },
					markLine : {
					    smooth:true,
					    symbol: ['none', 'circle'],  
					    symbolSize : 1,
					    itemStyle : {
					        normal: {
					        	label:{
									show:true
								},
					            color:'#fff',
					            borderWidth:1,
					            borderColor:'rgba(30,144,255,0.5)'
					        }
					  	},
					    data : that.bgDashLineCp()
					},
					geoCoord: {}
                },
                {
                zlevel: 0,
                name: '资中',
                type: 'map',
                mapType: 'china',
                roam:false,//是否开启滚轮缩放和拖拽漫游，默认为false（关闭）
                data: [],
                geoCoord: { //通过绝对经纬度指定地区的名称文本位置(必须)
                    '云南': [101.35599, 24.514199],
                    '资中': [104.85, 29.81],
                    '上海': [121.4648, 31.2891],
                    '东莞': [113.8953, 22.901],
                    '东营': [118.7073, 37.5513],
                    '中山': [113.4229, 22.478],
                    '临汾': [111.4783, 36.1615],
                    '临沂': [118.3118, 35.2936],
                    '丹东': [124.541, 40.4242],
                    '丽水': [119.5642, 28.1854],
                    '乌鲁木齐': [87.9236, 43.5883],
                    '佛山': [112.8955, 23.1097],
                    '保定': [115.0488, 39.0948],
                    '兰州': [103.5901, 36.3043],
                    '包头': [110.3467, 41.4899],
                    '北京': [116.4551, 40.2539],
                    '北海': [109.314, 21.6211],
                    '南京': [118.8062, 31.9208],
                    '南宁': [108.479, 23.1152],
                    '南昌': [116.0046, 28.6633],
                    '南通': [121.1023, 32.1625],
                    '厦门': [118.1689, 24.6478],
                    '台州': [121.1353, 28.6688],
                    '合肥': [117.29, 32.0581],
                    '呼和浩特': [111.4124, 40.4901],
                    '咸阳': [108.4131, 34.8706],
                    '哈尔滨': [127.9688, 45.368],
                    '唐山': [118.4766, 39.6826],
                    '嘉兴': [120.9155, 30.6354],
                    '大同': [113.7854, 39.8035],
                    '大连': [122.2229, 39.4409],
                    '天津': [117.4219, 39.4189],
                    '太原': [112.3352, 37.9413],
                    '威海': [121.9482, 37.1393],
                    '宁波': [121.5967, 29.6466],
                    '宝鸡': [107.1826, 34.3433],
                    '宿迁': [118.5535, 33.7775],
                    '常州': [119.4543, 31.5582],
                    '广州': [113.5107, 23.2196],
                    '廊坊': [116.521, 39.0509],
                    '延安': [109.1052, 36.4252],
                    '张家口': [115.1477, 40.8527],
                    '徐州': [117.5208, 34.3268],
                    '德州': [116.6858, 37.2107],
                    '惠州': [114.6204, 23.1647],
                    '成都': [103.9526, 30.7617],
                    '扬州': [119.4653, 32.8162],
                    '承德': [117.5757, 41.4075],
                    '拉萨': [91.1865, 30.1465],
                    '无锡': [120.3442, 31.5527],
                    '日照': [119.2786, 35.5023],
                    '昆明': [102.9199, 25.4663],
                    '杭州': [119.5313, 29.8773],
                    '枣庄': [117.323, 34.8926],
                    '柳州': [109.3799, 24.9774],
                    '株洲': [113.5327, 27.0319],
                    '武汉': [114.3896, 30.6628],
                    '汕头': [117.1692, 23.3405],
                    '江门': [112.6318, 22.1484],
                    '沈阳': [123.1238, 42.1216],
                    '沧州': [116.8286, 38.2104],
                    '河源': [114.917, 23.9722],
                    '泉州': [118.3228, 25.1147],
                    '泰安': [117.0264, 36.0516],
                    '泰州': [120.0586, 32.5525],
                    '济南': [117.1582, 36.8701],
                    '济宁': [116.8286, 35.3375],
                    '海口': [110.3893, 19.8516],
                    '淄博': [118.0371, 36.6064],
                    '淮安': [118.927, 33.4039],
                    '深圳': [114.5435, 22.5439],
                    '清远': [112.9175, 24.3292],
                    '温州': [120.498, 27.8119],
                    '渭南': [109.7864, 35.0299],
                    '湖州': [119.8608, 30.7782],
                    '湘潭': [112.5439, 27.7075],
                    '滨州': [117.8174, 37.4963],
                    '潍坊': [119.0918, 36.524],
                    '烟台': [120.7397, 37.5128],
                    '玉溪': [101.9312, 23.8898],
                    '珠海': [113.7305, 22.1155],
                    '盐城': [120.2234, 33.5577],
                    '盘锦': [121.9482, 41.0449],
                    '石家庄': [114.4995, 38.1006],
                    '福州': [119.4543, 25.9222],
                    '秦皇岛': [119.2126, 40.0232],
                    '绍兴': [120.564, 29.7565],
                    '聊城': [115.9167, 36.4032],
                    '肇庆': [112.1265, 23.5822],
                    '舟山': [122.2559, 30.2234],
                    '苏州': [120.6519, 31.3989],
                    '莱芜': [117.6526, 36.2714],
                    '菏泽': [115.6201, 35.2057],
                    '营口': [122.4316, 40.4297],
                    '葫芦岛': [120.1575, 40.578],
                    '衡水': [115.8838, 37.7161],
                    '衢州': [118.6853, 28.8666],
                    '西宁': [101.4038, 36.8207],
                    '西安': [109.1162, 34.2004],
                    '贵阳': [106.6992, 26.7682],
                    '连云港': [119.1248, 34.552],
                    '邢台': [114.8071, 37.2821],
                    '邯郸': [114.4775, 36.535],
                    '郑州': [113.4668, 34.6234],
                    '鄂尔多斯': [108.9734, 39.2487],
                    '重庆': [107.7539, 30.1904],
                    '金华': [120.0037, 29.1028],
                    '铜川': [109.0393, 35.1947],
                    '银川': [106.3586, 38.1775],
                    '镇江': [119.4763, 31.9702],
                    '长春': [125.8154, 44.2584],
                    '长沙': [113.0823, 28.2568],
                    '长治': [112.8625, 36.4746],
                    '阳泉': [113.4778, 38.0951],
                    '青岛': [120.4651, 36.3373],
                    '韶关': [113.7964, 24.7028]
                },
                markLine: { //运输迁徙效果
                    smooth: true,
                    symbol: 'arrow',
                    effect: {
                        show: true,
                        scaleSize: 3,
                        period: period,
                        color: '#fff',
                        shadowBlur: 5
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            label:{
                                show:false,
                            },
                            lineStyle: {
                                type: 'solid',
                                shadowBlur: 5
                            }
                        }
                    },
                    data: obj && obj.data1 || []
                },
                markPoint: { //气泡效果(不断显示隐藏交替)
                    symbol: 'emptyCircle',
                    symbolSize: function(v) {
                        return 10 + v / 800000
                    },
                    effect: {
                        show: true,
                        shadowBlur: 0
                    },
                    itemStyle: {
                        normal: {
                            label: { show: false }
                        }
                    },
                    data: obj && obj.data2 || []
                }
            },{
                name: '资中背景线',
                type: 'map',
                mapType: 'china',
                roam:false,//是否开启滚轮缩放和拖拽漫游，默认为false（关闭）
                data: [],
                markLine: {
                    smooth: true,
                    symbol: ['none', 'circle'],
                    symbolSize: 0.1,
                    data: obj && obj.data3 || []
                }
            }]
	    };
	    // 为echarts对象加载数据
	    myChart.setOption(option);
	}
	bgDashLineCp() {
		let data = [
			[{name:'北京'},{name:'包头'}],
			[{name:'北京'},{name:'北海'}],
			[{name:'北京'},{name:'广州'}],
			[{name:'北京'},{name:'郑州'}],
			[{name:'北京'},{name:'长春'}],
			[{name:'北京'},{name:'长治'}],
			[{name:'北京'},{name:'重庆'}],
			[{name:'北京'},{name:'长沙'}],
			[{name:'北京'},{name:'成都'}],
			[{name:'北京'},{name:'常州'}],
			[{name:'北京'},{name:'丹东'}],
			[{name:'北京'},{name:'大连'}],
			[{name:'北京'},{name:'东营'}],
			[{name:'北京'},{name:'延安'}],
			[{name:'北京'},{name:'福州'}],
			[{name:'北京'},{name:'海口'}],
			[{name:'北京'},{name:'呼和浩特'}],
			[{name:'北京'},{name:'合肥'}],
			[{name:'北京'},{name:'杭州'}],
			[{name:'北京'},{name:'哈尔滨'}],
			[{name:'北京'},{name:'舟山'}],
			[{name:'北京'},{name:'银川'}],
			[{name:'北京'},{name:'衢州'}],
			[{name:'北京'},{name:'南昌'}],
			[{name:'北京'},{name:'昆明'}],
			[{name:'北京'},{name:'贵阳'}],
			[{name:'北京'},{name:'兰州'}],
			[{name:'北京'},{name:'拉萨'}],
			[{name:'北京'},{name:'连云港'}],
			[{name:'北京'},{name:'临沂'}],
			[{name:'北京'},{name:'柳州'}],
			[{name:'北京'},{name:'宁波'}],
			[{name:'北京'},{name:'南京'}],
			[{name:'北京'},{name:'南宁'}],
			[{name:'北京'},{name:'南通'}],
			[{name:'北京'},{name:'上海'}],
			[{name:'北京'},{name:'沈阳'}],
			[{name:'北京'},{name:'西安'}],
			[{name:'北京'},{name:'汕头'}],
			[{name:'北京'},{name:'深圳'}],
			[{name:'北京'},{name:'青岛'}],
			[{name:'北京'},{name:'济南'}],
			[{name:'北京'},{name:'太原'}],
			[{name:'北京'},{name:'乌鲁木齐'}],
			[{name:'北京'},{name:'潍坊'}],
			[{name:'北京'},{name:'威海'}],
			[{name:'北京'},{name:'温州'}],
			[{name:'北京'},{name:'武汉'}],
			[{name:'北京'},{name:'无锡'}],
			[{name:'北京'},{name:'厦门'}],
			[{name:'北京'},{name:'西宁'}],
			[{name:'北京'},{name:'徐州'}],
			[{name:'北京'},{name:'烟台'}],
			[{name:'北京'},{name:'盐城'}],
			[{name:'北京'},{name:'珠海'}],
			[{name:'上海'},{name:'包头'}],
			[{name:'上海'},{name:'北海'}],
			[{name:'上海'},{name:'广州'}],
			[{name:'上海'},{name:'郑州'}],
			[{name:'上海'},{name:'长春'}],
			[{name:'上海'},{name:'重庆'}],
			[{name:'上海'},{name:'长沙'}],
			[{name:'上海'},{name:'成都'}],
			[{name:'上海'},{name:'丹东'}],
			[{name:'上海'},{name:'大连'}],
			[{name:'上海'},{name:'福州'}],
			[{name:'上海'},{name:'海口'}],
			[{name:'上海'},{name:'呼和浩特'}],
			[{name:'上海'},{name:'合肥'}],
			[{name:'上海'},{name:'哈尔滨'}],
			[{name:'上海'},{name:'舟山'}],
			[{name:'上海'},{name:'银川'}],
			[{name:'上海'},{name:'南昌'}],
			[{name:'上海'},{name:'昆明'}],
			[{name:'上海'},{name:'贵阳'}],
			[{name:'上海'},{name:'兰州'}],
			[{name:'上海'},{name:'拉萨'}],
			[{name:'上海'},{name:'连云港'}],
			[{name:'上海'},{name:'临沂'}],
			[{name:'上海'},{name:'柳州'}],
			[{name:'上海'},{name:'宁波'}],
			[{name:'上海'},{name:'南宁'}],
			[{name:'上海'},{name:'北京'}],
			[{name:'上海'},{name:'沈阳'}],
			[{name:'上海'},{name:'秦皇岛'}],
			[{name:'上海'},{name:'西安'}],
			[{name:'上海'},{name:'石家庄'}],
			[{name:'上海'},{name:'汕头'}],
			[{name:'上海'},{name:'深圳'}],
			[{name:'上海'},{name:'青岛'}],
			[{name:'上海'},{name:'济南'}],
			[{name:'上海'},{name:'天津'}],
			[{name:'上海'},{name:'太原'}],
			[{name:'上海'},{name:'乌鲁木齐'}],
			[{name:'上海'},{name:'潍坊'}],
			[{name:'上海'},{name:'威海'}],
			[{name:'上海'},{name:'温州'}],
			[{name:'上海'},{name:'武汉'}],
			[{name:'上海'},{name:'厦门'}],
			[{name:'上海'},{name:'西宁'}],
			[{name:'上海'},{name:'徐州'}],
			[{name:'上海'},{name:'烟台'}],
			[{name:'上海'},{name:'珠海'}],
			[{name:'广州'},{name:'北海'}],
			[{name:'广州'},{name:'郑州'}],
			[{name:'广州'},{name:'长春'}],
			[{name:'广州'},{name:'重庆'}],
			[{name:'广州'},{name:'长沙'}],
			[{name:'广州'},{name:'成都'}],
			[{name:'广州'},{name:'常州'}],
			[{name:'广州'},{name:'大连'}],
			[{name:'广州'},{name:'福州'}],
			[{name:'广州'},{name:'海口'}],
			[{name:'广州'},{name:'呼和浩特'}],
			[{name:'广州'},{name:'合肥'}],
			[{name:'广州'},{name:'杭州'}],
			[{name:'广州'},{name:'哈尔滨'}],
			[{name:'广州'},{name:'舟山'}],
			[{name:'广州'},{name:'银川'}],
			[{name:'广州'},{name:'南昌'}],
			[{name:'广州'},{name:'昆明'}],
			[{name:'广州'},{name:'贵阳'}],
			[{name:'广州'},{name:'兰州'}],
			[{name:'广州'},{name:'拉萨'}],
			[{name:'广州'},{name:'连云港'}],
			[{name:'广州'},{name:'临沂'}],
			[{name:'广州'},{name:'柳州'}],
			[{name:'广州'},{name:'宁波'}],
			[{name:'广州'},{name:'南京'}],
			[{name:'广州'},{name:'南宁'}],
			[{name:'广州'},{name:'南通'}],
			[{name:'广州'},{name:'北京'}],
			[{name:'广州'},{name:'上海'}],
			[{name:'广州'},{name:'沈阳'}],
			[{name:'广州'},{name:'西安'}],
			[{name:'广州'},{name:'石家庄'}],
			[{name:'广州'},{name:'汕头'}],
			[{name:'广州'},{name:'青岛'}],
			[{name:'广州'},{name:'济南'}],
			[{name:'广州'},{name:'天津'}],
			[{name:'广州'},{name:'太原'}],
			[{name:'广州'},{name:'乌鲁木齐'}],
			[{name:'广州'},{name:'温州'}],
			[{name:'广州'},{name:'武汉'}],
			[{name:'广州'},{name:'无锡'}],
			[{name:'广州'},{name:'厦门'}],
			[{name:'广州'},{name:'西宁'}],
			[{name:'广州'},{name:'徐州'}],
			[{name:'广州'},{name:'烟台'}],
			[{name:'广州'},{name:'盐城'}]
	    ];
	    return data; 
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
		const PAGESIZE = 10000; //请求每页数据
		let setData = {
			"sort": 'receive_num',
			"order": 'desc',
			"page": 1,
			"pageSize":PAGESIZE,
			"areaId": areaId
		};
		$.GetAjax($.getCtx() + '/rest/logistics/getLogisticsPage', setData, 'GET', true, function(data, state) {
			if (state && data.rows) {

				// 进行数据组装
				for (let i = 0; i < data.rows.length / PAGEERS; i++) {
					let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
					for (let k = i * PAGEERS; k < i * PAGEERS + PAGEERS; k++) {
						attr.push(data.rows[k]);
					}

					// 赋值
					that.arrayGroup[i] = attr;
					// 缓存
					sessionStorage.setItem('DATALIST_PAGE' + (i+1), JSON.stringify(that.arrayGroup[i]));

					// 初始化数据渲染
					if (i == 0) {
						that.superData = that.arrayGroup[i];
						that.totalPage = data.rows.length / PAGEERS;
						that.setState({
							show: true
						});
					}

				}
				PubSub.publish('showMap',data.rows);

			} else if (!state) {
				setTimeout(function() {
					that._getDatas(nums, type, page);
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
						<div className="list-title">发出量总计</div>
						<div className="list-total-num">7116845</div>
					</header>
					<section>
						<div className="nav-title">
							<span>排行</span>
							<span>省份</span>
							<span>发出量(单)</span>
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
				<span>{this.listData.item && (this.listData.list+1 < 10 ? "0"+(this.listData.list+1) : this.listData.list+1) || '-'}</span>
				<span>{this.listData.item && this.listData.item.region || '-'}</span>
				<span>{this.listData.item && this.listData.item.nums || '-'}</span>
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