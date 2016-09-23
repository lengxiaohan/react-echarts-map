/**
 * Created by zhouxinjian on 2016/9/19.
 * ProvinceRadarChart.js 农特产品全国经销商经销热力图
 */
import 'common';
import "ajax-plus";
import "./common/screenPropor.js";
import "canvasCommon";
import "../../less/ProvinceRadarChart.less";
import radarChart from "./ProvinceRadarChartModule.js";

var config = {
	canvasId: 'radarMap', // canvas画布对应得id（必须）
	setUrl: '/rest/distribute/direction', // 调用得接口（必须）
	setUrlConfig:{ // 调用接口得参数（依据实际接口来传递）
		areaId: $.getUrlParam('areaId'),
		type: 2
	},
	callbackSetData:(data,callback) => {
		let [setDatar=[],listName=[]] = [];
		if (data && data.datas) {
			let [length,result] = [data.datas.length || 0,data.datas];
			for (var i = 0; i < length; i++) {
				setDatar.push(result[i] && result[i].value || 0);
				listName.push(result[i] && result[i].toAreaName || '无数据');
			}
		}else{
			return false;
		}
		setTimeout(()=>{
			let name = $.getUrlParam('name') || false;
			let title = "农特产品全国经销商经销热力图";
			$('.onLoading').remove();
			$('#headerContent').html((name ? name+"&nbsp;" : "") + (data.datatime && data.datatime+"&nbsp;" || "") + title);
			$('.container').css("opacity",1);
			callback(setDatar,listName);
		},700);
	}, // 回调接口后生成需要进行绘制得数据
	borderColor: '#09f', // 雷达图得边框颜色 (非必需 默认 #09f)
	canvasRangeColor: ['rgba(255,120,0,1)','rgba(255,120,0,.4)'], // 雷达图数据展示得渐变样式 (非必需 默认['rgba(17,246,117,1)','rgba(17,246,117,.4)'])
	font:{ // 非必需参数（可配）
		auto:false,
		// fontSize:'1',
		fontStyle:'微软雅黑',
		color:'#fff'
	}
}

radarChart.init(config);