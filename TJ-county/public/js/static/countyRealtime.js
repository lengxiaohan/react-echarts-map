
import {getJson,getAreaCp,pushScrollNum,formatPrice,toThousands,addZero} from "common";
import "echarts-line";
import "echarts-map";
import "ajax-plus";

let areaId = $.getUrlParam('areaId');
(function($){
	
	/**
	 * @name realTimeobj 网络零售实时监控模块
	 * @param init 初始化
	 */
	var realTimeobj = {
			
		/**
		 * @name init
		 * @param 网络零售实时监控模块初始化
		 */
		init: function() {
			var that = this;
			this.flexWindow();
			this.getDatas();
			this.resized();
			
			//	缓存实时数据echarts对象集
			this.ECs = void 0;
			this.pushDataSet = void 0;
		},
		
		/**
		 * @name flexWindow
		 * @param 窗口改变重新绘图，更改div大小
		 */
		flexWindow:function(){
			var winWidth = $(window).width(),
				winHeight = $(window).height();
			var resultHei = winHeight*(100-36.6) / 100;
			$('body').css({
				width:$(window).width(),
				height:$(window).height()
			});
			
			$('#main').css({
				width:$(window).width(),
				height:resultHei-30
			});
			
		},
		
		/**
		 * @name resized
		 * @param 视窗监听
		 */
		resized: function(){
			var that = this;
			$(window).resize(function(){
				that.flexWindow();
				that.pushCountyMap({id:'countyMap'});
				clearTimeout(that.pushDataSet);
				
				that.pushDataSet = setTimeout(function () {
					that.getDatas();
				}, 2000);
				
			});
		},
		
		/**
		 * @name getCurrenTime
		 * @param 获取当前系统时间戳
		 */
		getCurrenTime:function(){
			var d=new Date();
			var lon=Date.parse(d); //获取时间戳
			return lon;
		},
		
		/**
		 * @name getDatas
		 * @param 获取实时数据
		 */
		getDatas: function(){
			var that = this;
			var config = {};
//			var data = $.GetAjax(ctx+'/rest/info/recentAreaInfoListNew',{areaId:areaId,time:that.getCurrenTime()}); //同步
			//异步
/*			$.GetAjax(ctx+'/rest/info/recentAreaInfoListNew',{areaId:areaId,time:that.getCurrenTime()},'GET',true,function(data){
				callpack(data);
			});*/
			
			$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoListReal', { areaId: areaId, time: that.getCurrenTime(), getParent: true }, 'GET', true, function (data) {
				$.onloadJavascript("./js/dist/echarts-all.js", false, true);
				callpack(data);
				that.pushCountyMap({id:'countyMap'});
			});
			
			function callpack(data){

				if(data && data[0] && data[1]){
					var onex = data[0].x;
					var oney = data[0].y;

					var onetodayNum=data[0].todayNum;
					var onearea=data[0].area;
					var name = onearea.shortName;
					$("#oneTitle").css({
						fontSize: name.length<=5?4+'vw':4-0.5*(name.length-4)+'vw'
					}).html(name);
				   
					var twox=data[1].x;
					var twoy=data[1].y;
					var twotodayNum=data[1].todayNum-onetodayNum;
					var twoarea=data[1].area;
					$("#twoTitle").html(twoarea.shortName);
					
					var setting = {
						grid: {
							x: 85,
							y: 45,
							x2: 85,
							y2: 30
						},
						tooltip: {
							trigger: 'axis',
							formatter: '{b}</br>{a}:{c}'
						},
						legend: {
					    	show: true,
					        data:[onearea.shortName+'网络零售额(/元)',twoarea.shortName+'网络零售额(/元)'],
					        x: $(window).width()-360,
					        textStyle: {
					        	color:'#6c7b90'
					        }
					    },
						animationDuration: 2000,
						animationDurationUpdate: 250,
						xAxis: [{
							show: true,
							type: 'category',
							boundaryGap: false,
							data: onex,
							splitLine: {
								show: true,
								lineStyle: {
									color: ['rgba(255,255,255,0.05)']
								}
							},
							axisLine: { show: true, lineStyle: { color: 'rgba(108,123,144,0.8)' } },
							axisLabel: {
								textStyle: {
									color: '#6c7b90',
									fontFamily: '微软雅黑',
									fontSize: 15
								},
								interval: 0
							}
						}],
						yAxis: [{
							name: twoarea.shortName+'网络零售额(/元)',
							nameLocation: 'end',
							type: 'value',
							splitLine: {
								show: false
							},
							nameTextStyle: {
								color: '#6c7b90',
								fontFamily: '微软雅黑',
								fontSize: 15,
								show: false
							},
							axisLine: { show: false, lineStyle: { color: 'rgba(108,123,144,0.8)' } },
							axisLabel: {
								show: false,
								formatter: function formatter(value) {
									return value;
								},
								textStyle: {
									color: '#6c7b90',
									fontFamily: '微软雅黑',
									fontSize: 15
								}
							},
							splitArea: {
								show: true,
								areaStyle: {
									color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']
								}
							}
						}]
					};
					
					
					var one=[],two=[];
					for (var i = 0; i < twoy.length; i++) {
						one.push(oney[i]);
						two.push({
							value:twoy[i]-oney[i]+"",
							temp: twoy[i]
						});
					}
					// two.push({value:d, symbol:'',symbolSize:0,symbolRotate: ''});
					// var y=twoy;
					// var d=y[y.length-1];
					// y.pop();
					// y.push({value:d, symbol:'',symbolSize:0,symbolRotate: ''});

					// var one=oney;
					// var o=one[one.length-1];
					// one.pop();
					// one.push({value:o, symbol:'',symbolSize:0,symbolRotate: ''});
					// console.log(oney);
					// console.log(one);
					// console.log(twoy);
					// console.log(two);

					var series = [{
						symbolSize: 0,
						smooth: true,
						name: onearea.shortName+'网络零售额(/元)',
						type: 'line',
						stack: 'group',
						data: one,
						itemStyle: {
							normal: { label: { show: true, textStyle: { color: '#fff' } },
								color: "#ff5411",
								lineStyle: { // 系列级个性化折线样式
									type: 'solid',
									width: 5,
									shadowBlur: 5
								},
								label: {
									show: true,
									formatter: function formatter(value) {
										return value.value == 0 ? '' : value.value;
									},
									textStyle: {
										fontSize: 15,
										color: '#fff',
										baseline: 'top'
									}
								},
								areaStyle: {
									// 区域图，纵向渐变填充
									type: 'default',
									color: function () {
										var zrColor = zrender.tool.color;
										return zrColor.getLinearGradient(0, 0, 0, $('#main').height(), [[0, 'rgba(255,84,17,.9)'], [0.9, 'rgba(255,84,17,.1)']]);
									}()
								}
							}
						}
					}, {
						symbolSize: 0,
						name: twoarea.shortName+'网络零售额(/元)',
						smooth: true,
						stack: 'group',
						type: 'line',
						data: two,
						itemStyle: {
							normal: {

								color: '#ffa800',
								lineStyle: { // 系列级个性化折线样式
									type: 'solid',
									width: 5,
									shadowBlur: 5
								},

								label: {
									show: true,
									formatter: function formatter(value) {
										return value.data.temp == 0 ? '' : value.data.temp;
									},
									textStyle: {
										fontSize: 15,
										color: '#fcde10',
										baseline: 'bottom'
									}
								},
								areaStyle: {
									// 区域图，纵向渐变填充
									type: 'default',
									color: function () {
										var zrColor = zrender.tool.color;
										return zrColor.getLinearGradient(0, 0, 0, $('#main').height(), [[0, 'rgba(255,168,0,.9)'], [0.9, 'rgba(255,168,0,.1)']]);
									}()
								}
							}
						}
					}];
					
					setTimeout(function(){
						$('.echarts-loding').remove();
						$('.containermy').css("opacity",1);
						pushScrollNum(onetodayNum,"#onetotal");
						pushScrollNum(twotodayNum,"#twototal");
						$('#main').pushEcharts($.module('line', setting, series,config),callback);
					},1000);
					
					function callback(ec){
						that.ECs = ec;
						that.pushDataSet = setTimeout(function () {
							that.addDatas(that.ECs);
						}, 4000);
					}
				}
			}
			
		},
		
		/**
		 * @name pushCountyMap
		 * @param 小地图更新
		 */
		pushCountyMap:function(obj,id){
		    
		    var setting = {
			        series : [{
		                name:'地图',
		                type:'map',
		                data:[],
		                hoverable: false,
			            roam:false,
			            itemStyle:{
			                normal:{label:{show:false},borderWidth:0.1,
			                	 areaStyle: {
				       				   type:'default',
			                           color :'#ff5411'
			                      }
			                },
			                emphasis:{label:{show:true}}
			            },
			            data:[]
		
		            }]
		    };
		    
		    $.getSmallMap(obj,setting);

		},
		
		/**
		 * @name addDatas
		 * @param 动态实时数据获取
		 */
		addDatas: function(ecs) {
			var that = this;
			//获取毫秒数
			var d=new Date();
			var h=d.getHours();       //获取当前小时数(0-23)
			var m=d.getMinutes();     //获取当前分钟数(0-59)
			var s=d.getSeconds();     //获取当前秒数(0-59)
			if((m+"").length==1){
				m=0+""+m;
			}
			if((s+"").length==1){
				s=0+""+s;
			}
			
			function callpack(data){
				var one=data[0].infos[0];
				var two=data[1].infos[0];
				var oneAmount=one.amount;
				var twoAmount=two.amount-oneAmount;
			    if(oneAmount==null){
				   oneAmount="0";
			    }
			    if(twoAmount==null){
				   twoAmount="0";
			    }
			    
			    var oneTodayNum=data[0].todayNum;
			    var twoTodayNum=data[1].todayNum;
			    
			    pushScrollNum(oneTodayNum,"#onetotal"); 
			    pushScrollNum(twoTodayNum,"#twototal"); 

			    that.pushDataSet = setTimeout(function () {
					that.addDatas(ecs);
				}, 5000);

			    ecs.addData([
	              [1,			// 系列索引
	               {value:twoAmount, symbol:'',symbolSize:0,temp:two.amount}, // 新增数据
	               false,    	// 新增数据是否从队列头部插入
	               false,    	// 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
	               h+":"+m+":"+s// 坐标轴标签
	               ],
	               [
	                0,        	// 系列索引
	                {value:oneAmount, symbol:'',symbolSize:0}, // 新增数据
	                false,    	// 新增数据是否从队列头部插入
	                false  		// 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
	                ]
			    ]);
			    
			}
			
			$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoReal', { areaId: areaId, time: that.getCurrenTime(),getParent :true }, 'GET', true, function (data,state) {
				if (state) {
					callpack(data);
				}else{
					setTimeout(function () {
						that.addDatas(ecs);
						console.log('主人，刚才服务器出了一下小差');
					}, 3000);
				}
			});
			
			
		}
	};
	
	realTimeobj.init();
	
})(jQuery)
