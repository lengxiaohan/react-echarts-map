
import {pushScrollNum,formatPrice,toThousands,addZero} from "common";
import "echarts-line";
import "echarts-map";
import "ajax-plus";


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
			this.areaId = $.getUrlParam('areaId');
			this.flexWindow();
			this.getDatas();
			this.resized();
			
			//	缓存实时数据echarts对象集
			this.ECs = void 0;
			
			// setTimeout控制变量
			this.pushDataSet = void 0;
		},
		
		/**
		 * @name flexWindow
		 * @param 窗口改变重新绘图，更改div大小
		 */
		flexWindow:function(){
			var winWidth = $(window).width(),
				winHeight = $(window).height();
			
			$('.container').css({
				width:$(window).width(),
				height:$(window).height()
			});
			
		},
		
		/**
		 * @name resized
		 * @param 视窗监听
		 */
		resized: function(){
			var that = this;
			clearTimeout(that.pushDataSet);
			$(window).resize(function(){
				that.flexWindow();
				that.pushCountyMap({id:'JS_smallMap'});
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

			//异步
			$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoListReal', { areaId: that.areaId, time: that.getCurrenTime(), getParent: true }, 'GET', true, function (data) {
				callpack(data);
				that.pushCountyMap({id:'JS_smallMap'});
			});
			
			function callpack(data){

				if(data && data[0] && data[1]){

					var onex = data[0].x;
					var oney = data[0].y;
					var onetodayNum = data[0].todayNum;
					$("#JS_get_areaName").html("");
					$("#JS_get_areaName").html(data[0].areaName);
					
					var twox=data[1].x;
					var twoy=data[1].y;
					var twotodayNum=data[1].todayNum;
					$("#JS_get_areaName2").html("");
					$("#JS_get_areaName2").html(data[1].areaName);
				   
					pushScrollNum(onetodayNum,"#JS_get_aniNum");
					pushScrollNum(twotodayNum,"#JS_get_aniNum2");
					
					var setting = {
						grid: {
							x: 0,
							y: 50,
							x2: 0,
							y2: 30
						},
						tooltip: {
							trigger: 'axis',
							formatter: '{b}</br>{a}:{c}'
						},
						animationDuration: 2000,
						animationDurationUpdate: 250,
						xAxis: [{
							show: true,
							type: 'category',
							boundaryGap: false,
							data: onex,
							splitLine: {
								show: false,
								lineStyle: {
									color: ['rgba(255,255,255,0.05)']
								}
							},
							axisLine: { show: false, lineStyle: { color: 'rgba(108,123,144,0.8)' } },
							axisLabel: {
								textStyle: {
									color: '#fff',
									fontFamily: '微软雅黑',
									fontSize: $(window).width()/70,
									align: 'left'
								}
							}
						}],
						yAxis: [{
							show: false,
							name: '/元',
							nameLocation: 'end',
							type: 'value',
							splitLine: {
								show: false
							},
							nameTextStyle: {
								color: '#6c7b90',
								fontFamily: '微软雅黑',
								fontSize: 15
							},
							axisLine: { show: true, lineStyle: { color: 'rgba(108,123,144,0.8)' } },
							axisLabel: {
								formatter: function formatter(value) {
									return value;
								},
								textStyle: {
									color: '#6c7b90',
									fontFamily: '微软雅黑',
									fontSize: 15,
									align:'left'
								}
							},
							splitArea: {
								show: false,
								areaStyle: {
									color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']
								}
							}
						}]
					};

					var y=twoy;
					var d=y[y.length-1];
					y.pop();
					var o={value:d, symbol:'',symbolSize:0,symbolRotate: ''};
					y.push(o);

					var one=oney;
					var o=one[one.length-1];
					one.pop();
					one.push({value:o, symbol:'',symbolSize:0,symbolRotate: ''});

					var series = [{
						symbolSize: 0,
						smooth: true,
						name: '交易额',
						type: 'line',
						stack: 'group',
						data: one,
						itemStyle: {
							normal: { label: { show: true, textStyle: { color: '#fff' } },
								color: "#ff7800",
								lineStyle: { // 系列级个性化折线样式
									type: 'solid',
									width: 5,
									shadowBlur: 5
								},
								label: {
									show: true,
									formatter: function formatter(value) {
										return value.value;
									},
									textStyle: {
										fontSize: $(window).width()/60,
										color: '#fff',
										align: 'left'
									}
								},
								areaStyle: {
									// 区域图，纵向渐变填充
									type: 'default',
									color: function () {
										var zrColor = zrender.tool.color;
										return zrColor.getLinearGradient(0, 0, 0, $(window).height(), [[0, 'rgba(255,120,0,.8)'], [0.8, 'rgba(255,120,0,.1)']]);
									}()
								}
							}
						}
					}, {
						symbolSize: 0,
						name: '交易额',
						smooth: true,
						stack: 'group',
						type: 'line',
						data: y,
						itemStyle: {
							normal: {

								color: '#ffcc33',
								lineStyle: { // 系列级个性化折线样式
									type: 'solid',
									width: 5,
									shadowBlur: 5
								},

								label: {
									show: true,
									formatter: function formatter(value) {
										return value.value;
									},
									textStyle: {
										fontSize: $(window).width()/60,
										color: '#fff',
										align: 'left'
									}
								},
								areaStyle: {
									// 区域图，纵向渐变填充
									type: 'default',
									color: function () {
										var zrColor = zrender.tool.color;
										return zrColor.getLinearGradient(0, 0, 0, $(window).height(), [[0, 'rgba(255,240,51,0.8)'], [0.8, 'rgba(255,240,51,0.1)']]);
									}()
								}
							}
						}
					}];
					
					$('#Js_canvas_cont').pushEcharts($.module('line', setting, series,config),callback);
					
					function callback(ec){
						that.ECs = ec;
						that.pushDataSet = setTimeout(function () {
							that.addDatas(that.ECs);
						}, 2000);
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
		//		                mapType:'countyMap',
		                data:[],
		                hoverable: false,
			            roam:false,
			            itemStyle:{
			                normal:{label:{show:false},borderWidth:0.1,
			                	 areaStyle: {
				       				    type:'default',
			                            color: function () {
											var zrColor = zrender.tool.color;
											return zrColor.getLinearGradient(0, 0, 0, $(window).height()/3*2, [[0, 'rgba(239,184,4,.8)'], [.8, 'rgba(76,64,39,.1)']]);
										}()
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
				var twoAmount=two.amount;
			    if(oneAmount==null){
				   oneAmount="0";
			    }
			    if(twoAmount==null){
				   twoAmount="0";
			    }
			    
			    var oneTodayNum=data[0].todayNum;
			    var twoTodayNum=data[1].todayNum;
			    
			    pushScrollNum(oneTodayNum,"#JS_get_aniNum");
			    pushScrollNum(twoTodayNum,"#JS_get_aniNum2");
			    
			    ecs.addData([
	              [1,			// 系列索引
	               {value:twoAmount, symbol:'',symbolSize:0}, // 新增数据
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
			    
			    that.pushDataSet = setTimeout(function () {
					that.addDatas(ecs);
				}, 5000);
			}

			$.GetAjax($.getCtx() + '/rest/info/recentAreaInfoReal', { areaId: that.areaId, time: that.getCurrenTime(),getParent :true }, 'GET', true, function (data) {
				callpack(data);
			});
			
		}
	};
	
	realTimeobj.init();
	
})(jQuery)
