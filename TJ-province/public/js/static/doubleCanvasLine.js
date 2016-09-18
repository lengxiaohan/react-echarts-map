import 'common';
import "canvasCommon";
import "ajax-plus";
import doubleCircle from "./doubleCanvasModule.js";

var option = {
	onLoading: true,
	loadingClassName: "container",
	areaId: $.getUrlParam('areaId'),
	canvasId: "myCanvas",
	titleId: "shortName",
	setUrl: "/rest/network/getSumByTypes",
	color: ['#ff7800', '#ffdd00', '#66cc00', '#ff8c27', '#cd6000'],
	title: {
		show: true,
		nameId: "JS_provin_name",
		numId: "JS_head_num"
	},
	font: {
		auto: true,
		fontSize: '100',
		color: 'auto',
		fontStyle: "微软雅黑"
	}
}

doubleCircle.init(option);