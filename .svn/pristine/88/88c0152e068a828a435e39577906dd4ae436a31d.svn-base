(function($){
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	};


	Number.prototype.addPlaceHolder = function(length){
		var  oldLength =  new String(this).length;
		var buf = "";
		if(oldLength<length) {
			var needLength = length - oldLength;
			for(var i = 0 ; i<needLength ;i++){
				buf += "0";
			}
		}
		return (buf+=this);
	};

	$.getCtx =  function getWebRootPath() {
		var webroot=document.location.href;
		webroot=webroot.substring(webroot.indexOf('//')+2,webroot.length);
		webroot=webroot.substring(webroot.indexOf('/')+1,webroot.length);
		webroot=webroot.substring(0,webroot.indexOf('/'));
		var rootpath="/"+webroot;
		return rootpath;
	}

	$.getAreaById = function(id){
		var value;
		$.ajax({			url: $.getCtx() + '/rest/oper/area/inner/getAreaName',
			data:{areaId:id},
			dataType: 'json',
			async:false,
			success: function(data){
				value = data;
			}
		});
		return value;
	}

})(jQuery)

function getJson(areaid){
	var 	value;
	var data =	$.ajax({
		url: $.getCtx() +'/js/chart/geoJson/'+areaid+'.json',
		dataType: 'json',
		async:false,
		success: function(data){
			value = data;
		}
	});
	return value;
}

function getAreaCp(areaid){
	var jsonObject = getJson(areaid);
	var mapAreaCpObject =  '{';
	for(var i in jsonObject.features)
	{
		var feature = jsonObject.features[i];
		mapAreaCpObject += '"'+feature.properties.name+'"'+':';
		mapAreaCpObject += JSON.stringify(feature.properties.cp);
		if(i != jsonObject.features.length-1)
		{
			mapAreaCpObject +=',';
		}
	}
	mapAreaCpObject = mapAreaCpObject+'}';
	return JSON.parse(mapAreaCpObject);
}


