import 'common';
import "canvasCommon";
import "ajax-plus";
import "./common/screenPropor.js";
import doubleCircle from "./doubleCanvasModule.js";

window.android ? window.android.dismissMouse() : '';
var option = {
	areaId: $.getUrlParam('areaId'), // areaId
	canvasId: "myCanvas", // canvas画布得id
	titleId: "shortName", // title头部得id
	setUrl: "/rest/network/getSumByTypes", // 请求数据得接口
	color: ['#ff7800', '#66cc00', '#ffdd00', '#C2651C', '#ff7800'], // 绘制饼图得颜色
	setUrlConfig:{ // 调用接口得参数（依据实际接口来传递）
		areaId: $.getUrlParam('areaId')
	},
	callbackSetData:(data,callback) => {
		setTimeout(()=>{
			$('.onLoading').remove();
			$('.container').css("opacity",1);
			callback(data);
			window.android ? window.android.setData(JSON.stringify(data)) : '';
		},700);
	}, // 回调接口后生成需要进行绘制得数据
	title: { // 头部信息
		show: true,
		nameId: "JS_provin_name", // 名称id
		yearId: "JS_provin_year",
		numId: "JS_head_num" // 总数量id
	},
	font: { // 饼图中的字体样式
		auto: false, // 是否开启自适应
		// fontSize: '10', 
		color: '#fff', // 字体颜色
		fontStyle: "微软雅黑" // 字体样式
	}
}

doubleCircle.init(option);