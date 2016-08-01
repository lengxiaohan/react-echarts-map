
import 'common';
import "canvasCommon";
import "ajax-plus";

(function($){
	/**
	 * Created by zhouxinjian on 2016/6/28.
	 * doubleCircle is a 双饼图虚线模块
	 */
	var doubleCircle = {

		/**
		 * @name 该插件共有以下方法
		 * @param init 初始化
		 * @param getData 异步加载数据
		 * @param setCicleMsg 计算绘制饼图的信息 位置 坐标 圆心 等
		 * @param getEventPosition 获取当前鼠标所在canvas画布中的坐标
		 * @param addEvent 添加监听事件
		 * @param pushAniCircle 绘制动态态饼图
		 * @param pushCircle 绘制动态饼图初始化绘制方法
		 * @param setAniCircle 动态饼图模块
		 * @param setPubCircle 静态饼图模块
		 * @param pushLineShow 绘制虚线
		 * @param setFontShow 添加文本模型
		 * @param pushFontShow 绘制文本信息
		 * @param clear 清除画布
		 */
		canvas: document.getElementById("myCanvas"),

		/**
		 * @name init
		 * @param 初始化方法
		 */
		init: function() {
			this.areaId = $.getUrlParam('areaId');
			this.WIDTH = $('#myCanvas').width();
			this.HEIGHT = $('#myCanvas').height();
			this.c_width = this.WIDTH;
			this.c_height = this.HEIGHT;
			this.canvas.width = this.c_width;
			this.canvas.height = this.c_height;
			this.shortName = $.getUrlParam('shortName');
			this.datas = void 0;
			this.ROTATENUMS = 0; //从逆时针90开始画圆
			this.DOMLENGTH = 0;
			this.fillColor = ['#ff3333', '#6600ff','#0099ff', '#ffcc33', '#ff7800', '#ff3333', '#faa'];
			this.canvasAttrBox = []; //存放扇形绘制数据
			this.canvasDashBox = []; //存放虚线绘制数据
			this.datas = {max: [],min: []};
			this.canvasFontBox = {max:[],min:[]}; //存放文字说明数据
			if (this.canvas.getContext) {
				//获取对应的CanvasRenderingContext2D对象(画笔)
				this.ctx = this.canvas.getContext("2d");
				this.getData(); //获取数据
			} else {
				return false;
			}

		},

		/**
		 * @name getData
		 * @param 异步获取数据
		 */
		getData: function() {
			var that = this;
			$.GetAjax($.getCtx()+'/rest/ntworkbusiness/getSumByTypes',{areaId:that.areaId},'GET',true,function(data){
				callpack(data);
				window.android ? window.android.setData(JSON.stringify(data)) : '';
			});
			
			function callpack(data){
				var nums = 0;
				if( data && data.infos[0] && data.code === 0){
					for( var k = 0; k < data.infos.length; k++ ){
						if( data.infos[k].parentId ){
							that.datas.min.push({
								name: data.infos[k].typeName,
								value: data.infos[k].numbers
							})
						}else{
							nums+=data.infos[k].numbers;
							that.datas.max.push({
								name: data.infos[k].typeName,
								value: data.infos[k].numbers
							})
						}
					}

					$('#JS_provin_name').html(that.shortName);
					$('#JS_head_num').html(nums);

					that.setCicleMsg();

					that.pushAniCircle();
					
				}else{

					that.ctx.beginPath();
					that.ctx.font="normal 20px arial"
					that.ctx.fillStyle='#f00';
					that.ctx.textAlign="center";
					that.ctx.fillText('数据异常或无数据',that.c_width/2,that.c_height/2-20);

				}
			}
			
		},

		/**
		 * @name setCicleMsg
		 * @param 计算饼图一些的信息
		 */
		setCicleMsg: function(newCanvas) {
			var that = this;
			var RSW = this.c_width / 2;
			var RSH = this.c_height / 2;
			var radius_1 = void 0;
			var radius_2 = void 0;
			var central_1 = void 0;
			var central_2 = void 0;
			var firstCircle = 0;

			var largeCircleArry = this.datas['max']; //获取大圆中的数据
			var smallCircleArry = this.datas['min']; //获取小圆中的数据
			var largeBox = []; //大圆百分比的转化数据
			var smallBox = []; //小圆百分比的转化数据
			var largeArray = []; //大圆数据缓存
			var smallArray = []; //小圆数据缓存
			var largeTotal = 0; //大圆总数据和
			var smallTotal = 0; //小圆总数据和
			var temp = 0; //中介参数

			// 大圆半径
			radius_1 = (RSW / 2) - (RSW / 5);
			// 小圆半径
			radius_2 = (RSW / 2) - (RSW / 3.5);

			radius_1 = radius_1 <= 0 ? 10 : radius_1 >= RSH ? RSH - 10 : radius_1;
			radius_2 = radius_2 <= 0 ? 10 : radius_2 >= RSH-10 ? RSH - 20 : radius_2;

			// 大圆圆心
			central_1 = {
				'w': RSW - radius_1,
				'h': RSH
			};
			// 小圆圆心
			central_2 = {
				'w': RSW + radius_2 * 2,
				'h': RSH
			}

			// largeTotal为计算大圆的数据总和（目的：求各个数据对应的比例）
			// largeArray为取出大圆的独立数据生成的数组（目的: 求和，求后面绘制扇形的弧度）
			$.each(largeCircleArry, function(i, o) {
				largeTotal += o['value'];
				firstCircle = largeCircleArry[0].value;
				largeArray.push(o['value']);
			});

			// smallTotal为计算小圆的数据总和（目的：求各个数据对应的比例）
			// smallArray为取出小圆的独立数据生成的数组（目的: 求和，求后面绘制扇形的弧度）

			$.each(smallCircleArry, function(i, o) {
				smallTotal += o['value'];
				smallArray.push(o['value']);
			});

			// 此处计算大圆的旋转度数
			$.each(largeArray, function(i, o) {
				var t_sq = 0; 
				t_sq = firstCircle / largeTotal * 360; //计算得出第一个弧度位置的结束位置
				that.ROTATENUMS = -(t_sq-t_sq/2); //根据最大弧度计算出均分点进行旋转
			});

			// 求大圆弧度，求比例，绘制圆弧
			$.each(largeArray, function(i, o) {
				var t_sq = 0; //初始化要绘制弧度的结束点（就是结束弧度位置 注：总弧度为360度）
				var attr = {};

				temp += o; //叠加之前绘制的弧度（从上一个图形绘制结束点开始）
				t_sq = temp / largeTotal * 360; //计算得出结束弧度位置

				largeBox[i] = that.ROTATENUMS + t_sq; //从that.ROTATENUMS点开始绘制，就是加上这个点的位置

				attr.x = central_1.w;
				attr.y = central_1.h;
				attr.r = radius_1;
				attr.color = that.fillColor[i];
				attr.end = largeBox[i];

				// 判断是不是刚开始绘制（有没有上一个位置）
				if (largeBox[i - 1]) {
					attr.start = largeBox[i - 1];
				} else {
					attr.start = that.ROTATENUMS;
				}
				var starts = attr.start;
				var ends = attr.end;
				var tempHd = 0;
				tempHd = i == 0 ? ends-(ends-starts)/2 : i == 1 ? ends-starts>15 ? ends-15 : ends-(ends-starts)/2: ends-starts>15 ? starts+15 : ends-(ends-starts)/2;
				that.canvasFontBox['max'].push({
					x: attr.x + (attr.r * Math.cos(2*Math.PI/360*tempHd)),
					y: attr.y + (attr.r * Math.sin(2*Math.PI/360*tempHd)),
					deg: tempHd,
					parentX: attr.x,
					parentY: attr.y,
					parentR: attr.r
				});

				that.canvasAttrBox.push(attr);

			});

			// 初始化temp，继续绘制小圆
			temp = 0;
			// 求小圆弧度，求比例，绘制圆弧
			$.each(smallArray, function(i, o) {
				var t_sq = 0;
				var length = 0;
				var attr = {};
				var ROTATENUMS = -90; // 小圆旋转度数

				// 计算大圆消耗了前几个颜色值
				for (var k in that.datas['max']) {
					length++;
				}

				temp += o;
				t_sq = temp / smallTotal * 360;

				smallBox[i] = ROTATENUMS + t_sq;

				attr.x = central_2.w;
				attr.y = central_2.h;
				attr.r = radius_2;
				attr.color = that.fillColor[i + length];
				attr.end = smallBox[i];

				if (largeBox[i - 1]) {
					attr.start = smallBox[i - 1];
				} else {
					attr.start = ROTATENUMS;
				}

				var starts = attr.start;
				var ends = attr.end;
				var tempHd = 0;
				tempHd = i == 0 ? ends-15 : starts+15;

				that.canvasFontBox['min'].push({
					x: attr.x + (attr.r * Math.cos(2*Math.PI/360*tempHd)),
					y: attr.y + (attr.r * Math.sin(2*Math.PI/360*tempHd)),
					deg: tempHd,
					parentX: attr.x,
					parentY: attr.y,
					parentR: attr.r
				});

				that.canvasAttrBox.push(attr);

			});

			that.canvasDashBox.push({
				fromX: central_1.w,
				fromY: central_1.h - radius_1,
				toX: central_2.w,
				toY: central_2.h - radius_2,
				pattern: 5,
				color: that.fillColor[0]
			}, {
				fromX: central_1.w,
				fromY: central_1.h + radius_1,
				toX: central_2.w,
				toY: central_2.h + radius_2,
				pattern: 5,
				color: that.fillColor[0]
			});

		},

		/**
		 * @name getEventPosition
		 * @param 获取当前鼠标所在canvas中的位置
		 */
		getEventPosition: function(ev) {
			var x, y;
			if (ev.layerX || ev.layerX == 0) {
				x = ev.layerX;
				y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX == 0) { // Opera
				x = ev.offsetX;
				y = ev.offsetY;
			}
			return {
				x: x,
				y: y
			};
		},

		/**
		 * @name addEvent
		 * @param canvas事件监听
		 */
		addEvent: function(x, y) {
			var that = this;
			this.canvas.addEventListener('mousemove', function(e) {
				var p = that.getEventPosition(e);
				that.pushCircle(p.x, p.y);
			}, false);
		},

		/**
		 * @name pushAniCircle
		 * @param 绘制动态饼图
		 */
		pushAniCircle: function() {
			var circleArr = this.canvasAttrBox;
			// 清除画布
			this.clear();
			// 再绘制饼图
			for (var i = 0; i < circleArr.length; i++) {
				this.setAniCircle(circleArr[i].x, circleArr[i].y, circleArr[i].r, circleArr[i].color, circleArr[i].start, circleArr[i].end);
			}
		},

		/**
		 * @name pushCircle
		 * @param 具体图形的绘制
		 */
		pushCircle: function(x, y) {
			var circleArr = this.canvasAttrBox;
			// 清除画布
			this.clear();
			// 先绘制曲线
			this.pushLineShow();
			// 再绘制饼图
			for (var i = 0; i < circleArr.length; i++) {
				this.setPubCircle(circleArr[i].x, circleArr[i].y, circleArr[i].r, circleArr[i].color, circleArr[i].start, circleArr[i].end);
				if (this.ctx.isPointInPath(x, y)) {
					this.setPubCircle(circleArr[i].x, circleArr[i].y, circleArr[i].r + 5, circleArr[i].color, circleArr[i].start, circleArr[i].end);
					// this.ctx.fillStyle = '#333';

					// TODO:此处可以获取到你当前移动上去的饼图的索引
					// SO:
				}
				this.ctx.fill();
			}
			// 绘制文本
			this.setFontShow();
		},

		/**
		 * @name setAniCircle
		 * @param 动态饼图模型canvas自带requestAnimationFrame动画(效率高些)
		 */
		setAniCircle: function(x, y, r, color, start, end) {
			var that = this;
			var num = start;
			requestAnimationFrame(animate);
			function animate(time){
				num+=(end-start<10?(end-start)/5:10);
				num>=end?num=end:'';

				that.ctx.fillStyle = color; //填充当前绘制区域颜色
				that.ctx.sector(x, y, r, start, num, color).fill();
				if(num>=end){
					that.DOMLENGTH++;
					cancelAnimationFrame(animate);
					if(that.DOMLENGTH == 5){
						that.addEvent();
						that.pushCircle();
					}
				}else{
					requestAnimationFrame(animate);
				}
			}
		},

		/**
		 * @name setAniCircle2
		 * @param 动态饼图模型setInterval方法(效率低些)
		 */
		setAniCircle2: function(x, y, r, color, start, end) {
			var that = this;
			var angle = start; //绘图初始起点值
			var timer = null; //动画开启
			var SPEED = 1; //绘制速度
			var DEFAULT = 3; //一次绘制弧度
			timer = setInterval(function() {
				angle += DEFAULT;
				that.ctx.fillStyle = color; //填充当前绘制区域颜色
				that.ctx.sector(x, y, r, start, angle, color).fill();
				// 结束当前绘制
				if (angle >= end) {
					clearInterval(timer);
				}
			}, SPEED);
		},

		/**
		 * @name setPubCircle
		 * @param 绘制静态饼图
		 */
		setPubCircle: function(x, y, r, color, start, end) {
			this.ctx.beginPath();
			this.ctx.fillStyle = color; //填充当前绘制区域颜色
			this.ctx.sector(x, y, r, start, end);
			this.ctx.closePath();
		},

		/**
		 * @name pushLineShow
		 * @param 绘制虚线方法
		 */
		pushLineShow: function() {
			var daseArr = this.canvasDashBox;
			// 绘制虚线
			for (var i = 0; i < daseArr.length; i++) {
				this.ctx.dashedLineTo(daseArr[i].fromX, daseArr[i].fromY, daseArr[i].toX, daseArr[i].toY, daseArr[i].pattern, '#f50');
			}

		},

		/**
		 * @name setFontShow
		 * @param 填充文字和线条
		 */
		setFontShow: function() {
			var that = this;
			var attrs = this.canvasFontBox;
			var maxAttr = attrs['max'];
			var minAttr = attrs['min'];
			var data = this.datas; //数据获取
			var C_LENGTH = 0; //颜色填充使用情况
			var NUMUSS = 20;

			// 大圆中文字线条填充
			$.each(maxAttr,function(i,o){
				var color = that.fillColor[C_LENGTH];
				C_LENGTH ++;
				var values = data['max'][i].value / 10000;

				// 字符串拼接
				values = values > 1 ? values.toFixed(2)+'万家' : data['max'][i].value+'家';
				var left = o.parentX - (o.parentX-o.x)/2;
				var top = o.parentY -5;

				// 线条文字填充
				if (i == 0) {
					that.pushFontShow('max',data['max'][i].name,left-20,top,'#fff');
					that.pushFontShow('max',values,left-20,top+15,'#fff');
				}else if(i == 1){
					that.ctx.dashedLineTo(o.x, o.y, o.x-10, o.y+NUMUSS,0.1,color);
					that.ctx.dashedLineTo(o.x-10, o.y+NUMUSS, 10, o.y+NUMUSS,0.1,color);
					that.pushFontShow('max',data['max'][i].name,10,o.y,color);
					that.pushFontShow('max',values,10,o.y+15,color);
				}else{
					that.ctx.dashedLineTo(o.x, o.y, o.x-10, o.y-NUMUSS,0.1,color);
					that.ctx.dashedLineTo(o.x-10, o.y-NUMUSS, 10, o.y-NUMUSS,0.1,color);
					that.pushFontShow('max',data['max'][i].name,10,o.y-40,color);
					that.pushFontShow('max',values,10,o.y-25,color);
				}
			});

			// 小圆中文字线条填充
			$.each(minAttr,function(i,o){
				
				var color = that.fillColor[C_LENGTH]; //同步饼图颜色
				C_LENGTH ++;

				var values = data['min'][i].value / 10000; //获取到的value值
				// 字符串拼接
				values = values > 1 ? values.toFixed(2)+'万家' : data['min'][i].value+'家';

				// 线条文字填充
				if (i == 0) {
					that.ctx.dashedLineTo(o.x, o.y, o.x+10, o.y-NUMUSS,0.1,color);
					that.ctx.dashedLineTo(o.x+10, o.y-NUMUSS, that.WIDTH-10, o.y-NUMUSS,0.1,color);
					that.pushFontShow('min',data['min'][i].name,that.WIDTH-10,o.y-40,color);
					that.pushFontShow('min',values,that.WIDTH-10,o.y-25,color);
				}else{
					that.ctx.dashedLineTo(o.x, o.y, o.x+10, o.y+NUMUSS,0.1,color);
					that.ctx.dashedLineTo(o.x+10, o.y+NUMUSS, that.WIDTH-10, o.y+NUMUSS,0.1,color);
					that.pushFontShow('min',data['min'][i].name,that.WIDTH-10,o.y,color);
					that.pushFontShow('min',values,that.WIDTH-10,o.y+15,color);
				}
			});
		},

		/**
		 * @name pushFontShow
		 * @param 绘制文本方法
		 */
		pushFontShow: function(type,text,x,y,color) {
			var fontSize = this.WIDTH / 50;
			var textWidth = 0;
			fontSize = fontSize > 16 ? 16 : fontSize;
			//设置字体样式
		    this.ctx.font = fontSize+"px 微软雅黑";
		    //设置字体填充颜色
		    this.ctx.fillStyle = color;
		    textWidth = this.ctx.measureText(text).width;
		    //从坐标点开始绘制文字
		    type == 'max' ? this.ctx.fillText(text, x, y) : this.ctx.fillText(text, x-textWidth, y);

		},

		/**
		 * @name clear
		 * @param 清除整个画布
		 */
		clear: function() {
			this.ctx.clearRect(0, 0, this.c_width, this.c_height);
		}
	}

	doubleCircle.init();
})(jQuery)
