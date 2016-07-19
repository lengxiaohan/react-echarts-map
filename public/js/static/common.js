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
	

