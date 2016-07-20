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
		$.ajax({			
			url: $.getCtx() + '/rest/oper/area/inner/getAreaName',
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

 export function getJson(areaid){
	var value;
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

 export function getAreaCp(areaid){
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
 
 	export function pushScrollNum(value,tag) {
		var num = $(tag);
	    num.animate({count: value}, {
	        duration: 800,
	        step: function() {
	             num.html(formatPrice(String(parseInt(this.count))));
			},complete:function(){
				 num.html(formatPrice(String(parseInt(value))));
			}
		});
	}; 

	//将数字转化成 亿万文字分开
	export function formatPrice(count,isShowEnd){
		count=parseInt(count);
		var result="";
		if(count<10000){
			result=addZero(count);
		}else if(count>10000&&count<100000000){
		    var end=count%10000;
		    var wan=parseInt(count/10000);
		    result=""+wan+"<span class='short-size-span'>万</span>"+addZero(end);
		}else if(count>100000000){
		    var yi=parseInt(count/100000000);
		    var yiEnd=count%100000000;
		    var end=yiEnd%10000;
		    var wan=parseInt(yiEnd/10000);
		    result=""+yi+"<span class='short-size-span'>亿</span>"+addZero(wan)+"<span class='short-size-span'>万</span>"+addZero(end);
		}else{
			result=count;
		}

		return isShowEnd ? result+"<span class='short-size-span'>元</span>" : result;
	};

	//补零
	export function addZero(number){
		var len=(""+number).length;
		if(len==1){
			number="000"+number;
		}else if(len==2){
			number="00"+number;
		}else if(len==3){
			number="0"+number;
		}
		return number;
	};

	//将数字转化成千分符格式
	export function toThousands(num) {
	    var result = [ ], counter = 0;
	    num = (num || 0).toString().split('');
	    for (var i = num.length - 1; i >= 0; i--) {
	        counter++;
	        result.unshift(num[i]);
	        if (!(counter % 3) && i != 0) { result.unshift(','); }
	    }
	    return result.join('');
	};

	export function show_num(type,value,isShowEnd) {
		var num = $(type);
	    num.animate({count: value}, {
	        duration: 800,
	        step: function() {
	            num.html(formatPrice(String(parseInt(this.count)),isShowEnd));
			},complete:function(){
				num.html(formatPrice(String(parseInt(value)),isShowEnd));
			}
		});
	};

	export function initAreaController(name){
		var t_pos = {};
		//position:上右下左
		var data=[
	      {name:'成都',position:['阿坝','德阳','眉山','雅安'],id:'5101'},
	      {name:'雅安',position:['阿坝','眉山','凉山','甘孜'],id:'5118'},
	      {name:'甘孜',position:['阿坝','雅安','凉山',null],id:'5133'},
	      {name:'凉山',position:['雅安','乐山','攀枝花','甘孜'],id:'5134'},
	      {name:'攀枝花',position:['凉山','凉山',null,null],id:'5104'},
	      {name:'阿坝',position:[null,'绵阳','雅安','甘孜'],id:'5132'},
	      {name:'乐山',position:['眉山','自贡','凉山','雅安'],id:'5111'},
	      {name:'眉山',position:['成都','内江','乐山','雅安'],id:'5114'},
	      {name:'德阳',position:['绵阳','遂宁','成都','阿坝'],id:'5106'},
	      {name:'绵阳',position:['广元','南充','德阳','阿坝'],id:'5107'},
	      {name:'宜宾',position:['自贡','泸州',null,'乐山'],id:'5115'},
	      {name:'泸州',position:['内江',null,null,'宜宾'],id:'5105'},
	      {name:'自贡',position:['内江','泸州','宜宾','乐山'],id:'5103'},
	      {name:'内江',position:['资阳',null,'自贡','眉山'],id:'5110'},
	      {name:'资阳',position:['德阳',null,'内江','眉山'],id:'5120'},
	      {name:'遂宁',position:['绵阳','南充','资阳','成都'],id:'5109'},
	      {name:'南充',position:['广元','达州','广安','绵阳'],id:'5113'},
	      {name:'广元',position:[null,'巴中','南充','绵阳'],id:'5108'},
	      {name:'巴中',position:[null,'达州','南充','广元'],id:'5119'},
	      {name:'达州',position:['巴中',null,'广安','南充'],id:'5117'},
	      {name:'广安',position:['南充','达州',null,'遂宁'],id:'5116'},
	    ];
		$.each(data,function(i,o){
			if (o['name'] == name) {
				t_pos = o;
			}
		});
		return t_pos;
	};
	

