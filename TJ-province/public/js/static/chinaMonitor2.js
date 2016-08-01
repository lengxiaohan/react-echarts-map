
import {getJson,getAreaCp,pushScrollNum,formatPrice,toThousands,addZero,Maps,show_num} from "common";
import "echarts-map";
import "ajax-plus";

var ScatterModule = {
		init: function(){
			var that = this;
			this.selectData = [];
			this.pageSize = 2;
			this.curPage = 1;
			// setTimeout控制变量
			this.pushDataSet = void 0;
			this.flexWindow();
			this.buildMark();
			this.timestamp = new Date().getTime();
			this.m = new Maps();
			this.requestRecentInfo(this.timestamp);
			this.setCityOrder();
			this.getHeaderTypes();
		},
		/**
		 * @name flexWindow
		 * @param 窗口改变重新绘图，更改div大小
		 */
		flexWindow:function(){
			var winWidth = $(window).width(),
			winHeight = $(window).height();

			$('.sec-map').css({
				height:$(window).height()-115
			});

		},
		setOptionSelection:function(name){
			var that = this;
			if( !name ){
				return false;
			}
			this.selectData = [{name:name,selected:true}];
		},

		getHeaderTypes:function(){
			var t_id = $.getUrlParam('areaId') ? $.getUrlParam('areaId').substr(0,2) : 51;
			$.GetAjax(
					$.getCtx() + '/rest/oper/area/inner/getAreaName', 
					{areaId:t_id}, 
					'GET', 
					true, 
					function (data) {
						callpack(data);
					}
			);

			function callpack(data){
				$('#JS_cont_header').html(data.name+"电子商务经济运行云图");
			}
		},

		getChinaMap: function(obj){
			var that = this;
			var data=obj.data;
			var dataAttr = ['onePointData', 'threePointData', 'fourPointData', 'twoPointData', 'fivePointData'];
			var color = ['#646e7a','#f9d33c','#ed8953','#50c4eb','#db4453'];
			var series = [{
				name: '中国',
				type: 'map',
				selectedMode : 'single',
				mapType: 'china',
				hoverable: false,
				roam:false,
				itemStyle:{
					normal:{
						label:{
							show:true,
							textStyle:{
								color:'#fff',
								fontSize:($(window).width()/55 > 25 ? 25 : $(window).width()/55)
							}
						},
						borderWidth:1,
						borderColor:'#000033',
						areaStyle: {
							// 区域图，纵向渐变填充
							type:'default',
							color : (function (){
								var zrColor = zrender.tool.color;
								return zrColor.getLinearGradient(
										0, 200, 0, 400,
										[[0,'rgba(0,102,255,0.4)'],[0.4, 'rgba(0,102,255,0.4)']]
								)
							})()
						}
					},
					emphasis:{label:{show:true,textStyle: {color: '#fff',fontSize:($(window).width()/30 > 35 ? 35 : $(window).width()/30)}},color:'#0066ff',opacity:0.2}
				},
				data:obj.select,
				geoCoord: that.geoCoord()
			}];

			for (let i = 0; i < 5; i++) {
				series.push({
					name: '',
					type: 'map',
					mapType: 'china',
					data:[],
					markPoint : {
						symbol:'image://../public/img/' + (i + 1) + '.png',
						symbolSize : obj.size,
						itemStyle:{
							normal:{
								label:{show:false},
								color: color[i]
							}
						},
						data : data[dataAttr[i]]
					}
				});
			}

			$("#mainMap").pushMapEcharts($.mapModule(null,series),callback);
			function callback(ec){
				that.pushDataSet = setTimeout(function () {
					var timestamp = new Date().getTime()
					that.requestRecentInfo(timestamp);
				}, 2500);
			}
		},
		requestRecentInfo:function(time){
			var that = this;
			var pageSize = this.pageSize;
			$.GetAjax(
					$.getCtx() + '/rest/info/recentInfoChinaReal', 
					{date:time}, 
					'GET', 
					true, 
					function (data) {
						callpack(data);
						$('.legend').show();
					}
			);

			function callpack(data){
				var geoCoordMap = data.geoCoordMap;
				var lowPointData = data.lowPointData;
				var middlePointData = data.middlePointData;
				var highPointData = data.highPointData;
				var todayCollNum = data.todayCollNum;
				//总量
				$(".t_num").html("");
				show_num(todayCollNum);
				//城市排行
				var cityOrderList=data.cityOrderList;
				var len=cityOrderList.length;
				var num = parseInt(len/pageSize);
				var mod=len%pageSize;
				if(mod!=0){
					num++;
				}
				that.m=new Maps();
				var objs=new Array();
				var curPage=1;
				for(var i=0;i<len;i++){
					var obj=cityOrderList[i];
					if(i%pageSize==0&&i!=0){
						that.m.put(curPage,objs);
						curPage++;
						objs=new Array();
					}
					objs.push(obj);
				}
				if(objs.length>0){
					that.m.put(curPage,objs);
				}
				that.getChinaMap({data:data,size:25,select:that.selectData});
			}
		},
		setCityOrder: function(){
			var that = this;
			setInterval(function(){
				var list=that.m.get(that.curPage);
				if(list==null){
					that.curPage=1;
				}else{
					$("#cityOrder").empty();
					var num=(that.curPage-1)*that.pageSize;
					$(list).each(function(i){
						$("#cityOrder").append("<tr><td nowrap class='td1'>"+(num+i+1)+"</td><td nowrap class='td2'>"+this.areaName+"</td><td nowrap class='td3' style='color:#ffc000;'>"+formatPrice(this.amount)+"</td></tr>");	
					});
					that.curPage++;
				}
			},5000);
		},
		buildMark:function(){
			var name=$.getUrlParam("shortName");
			if( name ){
				this.setOptionSelection(name);
			}
		},
		geoCoord:function(){
			var data =  {
					"北京市": [115.4551, 41.2539],
					"浙江省": [121.5313,27.8773],
					"天津市": [117.4219,39.4189],
					"安徽省": [117.29,32.0581],
					"上海市": [121.4648,31.2891],
					"福建省": [119.4543,25.9222],
					"重庆市": [107.7539,30.1904],
					"江西省": [116.0046,28.6633],
					"香港特别行政区":[null,null],
					"山东省":[121.1582,36.8701],
					"澳门特别行政区":[null,null],
					"河南省":[111.4668,34.6234],
					"内蒙古自治区":[113.4124,44.4901],
					"湖北省":[114.3896,30.6628],
					"新疆维吾尔自治区":[80.9236,42.5883],
					"湖南省":[111.0823,29.2568],
					"宁夏回族自治区":[104.4586,39.7775],
					"广东省":[113.5107,23.0196],
					"西藏自治区":[85.1865,31.9465],
					"海南省":[107.4893,19.4516],
					"广西壮族自治区":[105.379,24.0152],
					"四川省":[100.2526,30.3617],
					"河北省":[115.4995,37.1006],
					"贵州省":[103.3992,27.9682],
					"山西省":[111.3352,39.3413],
					"云南省":[98.7000,25.2663],
					"辽宁省":[122.1238,42.8216],
					"陕西省":[106.2162,35.8004],
					"吉林省":[126.2154,45.2584],
					"甘肃省": [92.5901,41.0043],
					"黑龙江省":[127.9688,49.368],
					"青海省":[93.0038,36.2207],
					"江苏省":[119.8062,34.4208],
					"台湾省":[null,null]
			}
			return data;
		}
};
ScatterModule.init();