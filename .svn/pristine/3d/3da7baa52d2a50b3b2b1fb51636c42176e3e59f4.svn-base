(function($) {

	$.mapModule = function(setting, series, config) {

		var setting = setting || {},
			config = config || {},
			series = series || [],
			seriesData = [],
			legendArr = [];

		//	基本配置信息初始化
		var option = {
			color: [],
			title: {},
			tooltip: {},
			series: setting.series || []
		};

		$.extend(true, option, setting);

		updateEchartsMessageFun();

		var cal = {
			/**
			 * 地图
			 * @param len 行/列数据长度
			 * @param d 行/列数据系列数组
			 */
			paintBrokenMap: function(len, d) {

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
						option.legend ? $.extend(true, option.legend.data, legendArr) : '';
					});
				}
			}
		};
		cal.paintBrokenMap(series.length, series);

		function updateEchartsMessageFun() {

			if (config.color) {
				option.color = config.color;
			};

			if (config.title) {
				option.title.text = config.title;
			};

			if (config.title2) {
				option.title.subtext = config.title2;
			};

		};

		return option;
	};

	$.fn.pushMapEcharts = function(option, callpack) {
		var el = this[0].id;
		var myChart;
		//	基于准备好的dom，初始化echarts图表
		if (callpack && typeof(callpack) === 'function') {
			myChart = $.requireMapFun(callpack, echarts, el);
		} else {
			myChart = echarts.init(document.getElementById(el));
		}
		// 为echarts对象加载数据 
		myChart.setOption(option);
	};

	$.requireMapFun = function(fun, ec, el) {
		var myChart = null;
		myChart = ec.init(document.getElementById(el));
		//异步加载返回当前charts对象
		fun(myChart);
		return myChart;
	}

	$.getSmallMap = function(config, setting, id) {

		var setting = setting ? setting : {};
		//全国所有省市县的轮廓图
		if (!id) {
			id = $.getUrlParam("areaId");
		}
		if (!config.id || !setting.series) {
			return false;
		}
		// 基于准备好的dom，初始化echarts图表
		var myChart = echarts.init(document.getElementById(config.id));
		var name = $.getUrlParam('name');

		$.each(setting.series, function(o, c) {
			this.mapType = 'countyMap';
		});

		echarts.util.mapData.params.params.countyMap = {
			getGeoJson: function(callback) {
				$.getJSON('/mapJson/' + name + '.json', function(data) {
					// 压缩后的地图数据必须使用 decode 函数转换
					callback(echarts.util.mapData.params.decode(data));
				});
			}
		};
		myChart.setOption(setting);
		myChart.resize();
	}
})(jQuery);