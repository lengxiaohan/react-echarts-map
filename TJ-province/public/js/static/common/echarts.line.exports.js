(function($) {

	/**
	 * @name echarts插件
	 * @param type 绘制图形的类型
	 * @param setting 绘制图形的基本配置信息
	 * @param series 绘制图形的数据配置信息
	 * @param config 其他快捷配置信息
	 */
	$.module = function(type, setting, series, config) {

		var setting = setting || {},
			config = config || {},
			series = series || [],
			seriesData = [],
			legendArr = [],
			thisType = void 0;

		//	绘图类型判断
		switch (type) {

			// 折线（面积）图
			case 'line':
				thisType = 'line';
				break;

				// 柱状（条形）图
			case 'bar':
				thisType = 'bar';
				break;

				// 散点（气泡）图
			case 'scatter':
				thisType = 'scatter';
				break;

				// k图
			case 'k':
				thisType = 'k';
				break;

				// 饼状（圆环）图
			case 'pie':
				thisType = 'pie';
				break;

				// 雷达（面积）图
			case 'radar':
				thisType = 'radar';
				break;

				// 和弦图
			case 'chord':
				thisType = 'chord';
				break;

				// 和弦图
			case 'map':
				thisType = 'map';
				break;

				// 其他图
			default:
				break;
		};

		//	基本配置信息初始化
		var option = {
			color: [],
			title: {},
			tooltip: {},
			grid: {
				borderWidth: 0 //默认不展示边框
			},
			xAxis: [],
			yAxis: [],
			legend: {
				show: false, //默认不展示legend
				data: []
			},
			series: setting.series || []
		};

		$.extend(true, option, setting);

		updateEchartsMessageFun();

		var cal = {
			/**
			 * 折线图  注形图  散点图
			 * @param len 行/列数据长度
			 * @param d 行/列数据系列数组
			 */
			paintBrokenLine: function(len, d) {

				if (len > 0) {
					$.each(d, function(i, o) {
						var data = {};
						$.each(o, function(n, con) {
							data[n] = con;
						});
						seriesData.push(data);
						legendArr.push(o.name);
						// 合并series数据到option
						$.extend(true, option.series, seriesData);
						// 合并legend数据到option
						$.extend(true, option.legend.data, legendArr);
					});
				}
			},
			/**
			 * 饼状图
			 * @param len 行/列数据长度
			 * @param d 行/列数据系列数组
			 */
			paintBrokenPie: function(len, d) {

				if (len > 0) {
					$.each(d, function(i, o) {
						var data = {};
						$.each(o, function(n, con) {
							data[n] = con;
						});
						seriesData.push(data);

						$.each(o.data, function(ii, oo) {
							legendArr.push(oo.name || '');
						});

						// 合并series数据到option
						$.extend(true, option.series, seriesData);

						// 合并legend数据到option
						$.extend(true, option.legend.data, legendArr);
					});
				}
			},
			/**
			 * 雷达图
			 * @param len 行/列数据长度
			 * @param d 行/列数据系列数组
			 */
			paintBrokenRadar: function(len, d) {

				if (len > 0) {
					$.each(d, function(i, o) {
						var data = {};
						$.each(o, function(n, con) {
							data[n] = con;
						});
						seriesData.push(data);

						$.each(o.data, function(ii, oo) {
							legendArr.push(oo.name || '');
						});

						// 合并series数据到option
						$.extend(true, option.series, seriesData);

						// 合并legend数据到option
						$.extend(true, option.legend.data, legendArr);
					});
				}
			},
			/**
			 * 和弦图
			 * @param len 行/列数据长度
			 * @param d 行/列数据系列数组
			 */
			paintBrokenChord: function(len, d) {

				if (len > 0) {
					$.each(d, function(i, o) {
						var data = {};
						$.each(o, function(n, con) {
							data[n] = con;
						});
						seriesData.push(data);

						$.each(o.data, function(ii, oo) {
							legendArr.push(oo.name || '');
						});

						// 合并series数据到option
						$.extend(true, option.series, seriesData);

						// 合并legend数据到option
						$.extend(true, option.legend.data, legendArr);
					});
				}
			}
		};
		switch (type) {

			// 折线（面积）图
			case 'line':
				cal.paintBrokenLine(series.length, series);
				break;

				// 柱状（条形）图
			case 'bar':
				cal.paintBrokenLine(series.length, series);
				break;

				// 散点（气泡）图
			case 'scatter':
				cal.paintBrokenLine(series.length, series);
				break;

				// k图
			case 'k':
				cal.paintBrokenLine(series.length, series);
				break;

				// 饼状（圆环）图
			case 'pie':
				cal.paintBrokenPie(series.length, series);
				break;

				// 雷达（面积）图
			case 'radar':
				cal.paintBrokenRadar(series.length, series);
				break;

			case 'chord':
				cal.paintBrokenChord(series.length, series);

			default:
				break;

		};

		function updateEchartsMessageFun() {

			if (config.noxAxis) {
				$.each(option.xAxis, function(a, b) {
					option.xAxis[a].show = false;
				});
			};

			if (config.noxAxisLine) {
				$.each(option.xAxis, function(a, b) {
					option.xAxis[a].splitLine = {
						show: false
					};
				});
			};

			if (config.noyAxis) {
				$.each(option.yAxis, function(a, b) {
					option.yAxis[a].show = false;
				});
			};

			if (config.noyAxisLine) {
				$.each(option.xAxis, function(a, b) {
					option.yAxis[a].splitLine = {
						show: false
					};
				});
			};

			if (config.noBorder) {
				option.grid.borderWidth = 0;
			};

			if (config.color) {
				option.color = config.color;
			};

			if (config.title) {
				option.title.text = config.title;
			};

			if (config.title2) {
				option.title.subtext = config.title2;
			};

			if (config.legendShow) {
				option.legend.show = true;
			};

			if (config.legendHide) {
				option.legend.show = false;
			};

		};

		return option;
	};

	$.fn.pushEcharts = function(option, callpack) {
		var el = this[0].id;
		var myChart;
		//	基于准备好的dom，初始化echarts图表
		if (callpack && typeof(callpack) === 'function') {
			myChart = $.requireFun(callpack, echarts, el);
		} else {
			
			myChart = echarts.init(document.getElementById(el));
		}
		// 为echarts对象加载数据 
		myChart.setOption(option);
		myChart.resize();
	};

	$.requireFun = function(fun, ec, el) {
		var myChart = null;
		myChart = ec.init(document.getElementById(el));
		//异步加载返回当前charts对象
		fun(myChart);
		return myChart;
	}

})(jQuery);