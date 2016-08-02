#TJ1.0县域版
##web前端静态资源、
#####TJ1.0-countys --总项目
#####public前端静态资源目录
	#####css前端静态资源 --css样式表
	#####less前端css模板
	#####img前端静态资源 --图片管理
	#####js前端静态资源js文件存放路径
		#####dist 插件文件夹echarts插件存放路径
		#####plus 插件文件夹 其他常用插件目录
		#####static js文件管理 自定义js文件存放路径
		#####zrender echarts底层插件 zrender插件路径
		#####config.js echarts配置信息
	#####others 其他文件存放路径（备用）
	
	
###/public/js/static/echarts.line.exports.js 自定义echarts插件（2次封装）

####快捷配置信息
```javascript	
config.noyAxis = true;			//不绘制纵坐标及其属性
config.noxAxis = true;			//不绘制横坐标及其属性
config.noxAxisLine = true;		//不绘制横坐标线
config.noyAxisLine = true;		//不绘制纵坐标线
config.noBorder = true;			//不绘制边框线
config.color = ["#f60","#f30","#eee","red","rgba(0,0,0,.5)"];	//配置总体颜色风格
config.title = "测试";			//快捷设置图形标题
config.title2 = "测试2";			//快捷设置图形副标题
config.legendShow = true;		//显示legend
config.legendHide = true;		//隐藏legend
```

####js书写格式参见/public/js/static/test.js
```javascript

	//模块名称
	var setCanvasLine = {
		//初始化
        init: function() {
        	//ajax请求数据
            this.data = $.GetAjax('','','');
			//判断数据的真实性，判断结构和数据是否为你想要的，如果成立再执行配置信息
            if (this.data){
                this.options();
            }
        },
        //配置信息设置
        options: function() {
        
        	//此处变量自定义，config为你如果要使用快捷配置方式配置时才定义
            var that = this,
                xAxisData = [],
                maxData = [],
                minData = [],
                config = {};

			//echarts基本信息配置
            var setting = {
                xAxis: [{
                    type: 'category'
                }],
                yAxis: [
                    {
                        type : 'value',
                        scale:true,
                        boundaryGap: [0.01, 0.01]
                    }
                ]
            };

			//echarts数据信息配置
            var series = [{
                name: '最高气温'
            }, {
                name: '最低气温'
            }];

			//数据处理，此处根据数据格式和绘图格式自定义
            $.each(that.data,function(i,o){
                xAxisData.push(o.days);
                maxData.push(o.maxNum);
                minData.push(o.minNum);
            });

			//将数据添加到你想添加的配置中
            setting.xAxis[0].data = xAxisData;
            series[0].data = maxData;
            series[1].data = minData;

			// $('#module1')是你要将该图绘制到哪里 ，
			// pushEcharts绘制图形函数，
			// $.module('line', setting, series,config)为整合配置信息模块，
			//line为绘图类型，
			//setting为基本配置信息，
			//series为数据配置信息，
			//config为快捷配置信息，要用才传，不用可以不传
			// ['line']为echarts绘制加载模块可以传多个
            $('#module1').pushEcharts($.module('line', setting, series,config), ['line']);

            $('#module2').pushEcharts($.module('bar', setting, series,config), ['bar']);

            // $('#module3').pushEcharts($.module('scatter', setting, series,config), ['scatter']);

            // $('#module4').pushEcharts($.module('k', setting, series,config), ['k']);

        }
    };
```
	
		
