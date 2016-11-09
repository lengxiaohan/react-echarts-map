import 'common';
import "canvasCommon";
import "ajax-plus";
import "./common/screenPropor.js";
import doubleCircle from "./doubleCanvasModule.js";

import React from 'react';
import ReactDOM from 'react-dom';

window.android ? window.android.dismissMouse() : '';
var option = {
	areaId: $.getUrlParam('areaId'), // areaId
	canvasId: "myCanvas", // canvas画布得id
	titleId: "shortName", // title头部得id
	setUrl: "/rest/network/getSumByTypes", // 请求数据得接口
	color: ['#ff7800', '#66cc00', '#ffdd00', '#C2651C', '#ff7800'], // 绘制饼图得颜色
	circleWidth: $.getUrlParam('times') == 0.25 ? "small" : "large",
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
	errorCallback:() => {
		window.android ? window.android.setData(JSON.stringify({})) : '';
	},
	title: { // 头部信息
		show: true,
		yearId: "JS_provin_year",
		numId: "JS_head_num" // 总数量id
	},
	font: { // 饼图中的字体样式
		auto: true, // 是否开启自适应
		// fontSize: '10', 
		// color: '#fff', // 字体颜色
		fontStyle: "微软雅黑" // 字体样式
	}
}

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.areaName = $.getUrlParam('shortName') || "";
	}
	componentDidMount() {
		setTimeout(()=>{
			doubleCircle.init(option);
		},500);
	}
	render() {
		return (
			<div className="container-box">
	    		<header>{this.areaName}&nbsp;网商监控&nbsp;</header>
				<div className="large_header">
					<div className="head-left headerLine"></div>
					<div className="head-con">
						<img alt="header" src="./img/head-bg.png"/>
						<p>{this.areaName}&nbsp;网商监控&nbsp;</p>
					</div>
					<div className="head-right headerLine"></div>
				</div>
				<div className="container">
					<div className="head_title">{this.areaName}<span className="JS_provin_year"></span>&nbsp;网商总数&nbsp;<span className="head-num" id="JS_head_num">0</span>&nbsp;家</div>
					<canvas id="myCanvas" className="myCanvas"></canvas>
				</div>
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('main')
);

