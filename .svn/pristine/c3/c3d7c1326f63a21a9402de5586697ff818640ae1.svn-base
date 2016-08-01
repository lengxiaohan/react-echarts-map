var pagenum = 57;//初始化默认在第一页

var pagesize = 10;

var tabledata = new Array();

var isFirst = true;

var count = 0;

var isRequesting = false;

var content = new Array(); 

Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
} 

$(function() {
	/*findDimensions(bodydata);*/
	//异步请求平台状态统计数据，每秒请求一次
	requestPlatTrend('id_trade_region_internet');
	setInterval(function() {
		requestPlatTrend('id_trade_region_internet');
    },1000);
	
	//进入页面请求一次
	requestFirstPlatData(pagenum,100);
	//列表1秒滚动一条数据
	setInterval(function() {
		updateOneTrTableCopy(content);
		content.remove(0);
		if(content.length <= 50){
			if(!isRequesting){
				isRequesting = true;
				requestPlatDataCopy(pagenum,100);
			}
		}
    },2000)
});



/**
 * 请求平台统计信息
 * 
 * */ 
function requestPlatTrend(divId) {
	$.ajax({
		url : ctx+'/rest/plat/platTrend',
		dataType : "json",
		type : "GET",
		success : function(data) {
			// 设置平台数据源 
			$("#totalnum").text(data.totalnum);
			$("#normalnum").text(data.normalnum);
			$("#errornum").text(data.errornum);
			$("#latenum").text(data.latenum);
			$("#times").text(data.times);
			$("#prog").width(data.percent * 100 );
			$("#prog").css("width", data.percent +"%");
			$("#proglabel").text(data.percent +"%");
		}
	});
}

/**
 * 进入页面第一次请求
 * */
function requestFirstPlatData(pageNumber, pageSize) {

	$.ajax({
		url :ctx+'/rest/plat/pagePlat',
		dataType : "json",
		type : "GET",
		data : {
			pageNumber : pageNumber,
			pageSize : pageSize
		},
		success : function(data) {
			/*if(data.totalPages > 10){
				pagenum = 11;
			}*/
			content = data.content;
			
			// 动态添加表格tr
			var tabledatas = data.content;
			removeAllChild('plattable');
			addHeadToTable('plattable');
			for ( var i = 0; i < 10; i++) {
				addTrToTable(tabledatas[i], 'plattable');
				content.remove(i);
			}
		}
	});
}


function requestPlatDataCopy(pageNumber, pageSize) {

	$.ajax({
		url : ctx+'/rest/plat/pagePlat',
		dataType : "json",
		type : "GET",
		data : {
			pageNumber : pageNumber,
			pageSize : pageSize
		},
		success : function(data) {
			//控制循环分页请求
			var pagesum = data.totalPages;
			if(pagenum < pagesum){
				pagenum = pagenum + 1;
			}else{
				pagenum = 1;
			}
			isRequesting = false;
			content = content.concat(data.content)
			
		}
	});
};

function requestPlatData(pageNumber, pageSize) {

	$.ajax({
		url :ctx+'/rest/plat/pagePlat',
		dataType : "json",
		type : "GET",  
		data : {
			pageNumber : pageNumber,
			pageSize : pageSize
		},
		success : function(data) {
			//控制循环分页请求
			var pagesum = data.totalPages;
			if(pagenum < pagesum){
				pagenum = pagenum + 1;
			}else{
				pagenum = 1;
			}
			updateOneTrTable(data);
		}
	});
}
//删除第一行数据
function delFirstTr(id){
	var $tr = $("#plattable tr:eq(1)");
	var $trs = $("#plattable tr:eq(10)");
	if(typeof($trs) != "undefined"){
		$tr.remove();
	}
	
}
//更新一行数据
function updateOneTrTable(platdata){
	delFirstTr('trid'); 
	addOneLastTr('plattable',platdata);
}
//更新一条数据
function updateOneTrTableCopy(content){
	delFirstTr('trid'); 
	addOneLastTrCopy('plattable',content);
}

function addOneLastTrCopy(tableid,tdata){
	var content = tdata;
	if((typeof(content[0])) != "undefined" ){
		if(content[0].status == 1){
			$str = '';
			$str += "<tr class='jiankongtr data-success'>";
			$str += "<td class='monitor-table-tdone'>" + content[0].name + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].typename + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + formatArea(content[0].areaname) + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].domain + "</td>";
		    $str += "<td class='monitor-table-tdtwo'>" + content[0].state + "</td>";
			$str += "</tr>"; 
		}else if(content[0].status == 2){
			$str = '';
			$str += "<tr class='jiankongtr data-delay'>";
			$str += "<td class='monitor-table-tdone'>" + content[0].name + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].typename + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + formatArea(content[0].areaname) + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].domain + "</td>";
		    $str += "<td class='monitor-table-tdtwo'>" + content[0].state + "</td>";
			$str += "</tr>"; 
		}else{
			$str = '';
			$str += "<tr class='jiankongtr data-fail'>";
			$str += "<td class='monitor-table-tdone'>" + content[0].name + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].typename + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + formatArea(content[0].areaname) + "</td>";
			$str += "<td class='monitor-table-tdtwo'>" + content[0].domain + "</td>";
		    $str += "<td class='monitor-table-tdtwo' >" + content[0].state + "</td>";
			$str += "</tr>"; 
		}
		$("#" + tableid + "").append($str);
	}
	
}

function addOneLastTr(tableid,tdata){
	var content = tdata.content;
	if((typeof(content[0])) != "undefined" ){
		if(content[0].status == 1){
			$str = '';
			$str += "<tr class='jiankongtr data-success'>";
			$str += "<td class='monitor-table-tdone'     >" + content[0].name + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + content[0].typename + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + formatArea(content[0].areaname) + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + content[0].domain + "</td>";
		    $str += "<td class='monitor-table-tdtwo'     >" + content[0].state + "</td>";
			$str += "</tr>"; 
		}else if(content[0].status == 2){
			$str = '';
			$str += "<tr class='jiankongtr data-delay'>";
			$str += "<td class='monitor-table-tdone'     >" + content[0].name + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + content[0].typename + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + formatArea(content[0].areaname) + "</td>";
			$str += "<td class='monitor-table-tdtwo'     >" + content[0].domain + "</td>";
		    $str += "<td class='monitor-table-tdtwo'     >" + content[0].state + "</td>";
			$str += "</tr>"; 
		}else{
			$str = '';
			$str += "<tr class='jiankongtr data-fail'>";
			$str += "<td   class='monitor-table-tdone'   >" + content[0].name + "</td>";
			$str += "<td   class='monitor-table-tdtwo'   >" + content[0].typename + "</td>";
			$str += "<td   class='monitor-table-tdtwo'   >" + formatArea(content[0].areaname) + "</td>";
			$str += "<td   class='monitor-table-tdtwo'   >" + content[0].domain + "</td>";
		    $str += "<td   class='monitor-table-tdtwo'   >" + content[0].state + "</td>";
			$str += "</tr>"; 
		}
		$("#" + tableid + "").append($str);
	}
	
}

// 向表格动态添加表头
function addHeadToTable(tableid) {
	$str = '';
	$str += "<tr class='monitor-table-th'>" +
			"<th class='monitor-table-tdone'>名称</th>" +
			"<th class='monitor-table-tdtwo'>类型</th>" +
			"<th class='monitor-table-tdtwo'>所属地域</th>" +
			"<th class='monitor-table-tdtwo'>平台地址</th>" +
			"<th class='monitor-table-tdtwo'>访问状态</th>" +
			"</tr>";
	$("#" + tableid + "").append($str);
}

// 向表格动态添加tr
function addTrToTable(tdata, tableid) {
	if (typeof(tdata.status) != "undefined" && tdata.status == 1) {//网络正常
		$str = '';
		$str += "<tr class='jiankongtr data-success'>";
		$str += "<td class='monitor-table-tdone' >" + tdata.name + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.typename + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + formatArea(tdata.areaname) + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.domain + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.state + "</td>";
		$str += "</tr>"; 
	}else if(typeof(tdata.status) != "undefined" && tdata.status == 2){//网络延迟
		$str = '';
		$str += "<tr class='jiankongtr data-delay'>";
		$str += "<td class='monitor-table-tdone' >" + tdata.name + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.typename + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + formatArea(tdata.areaname) + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.domain + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.state + "</td>";
		$str += "</tr>";
	}else{//网络异常
		$str = '';
		$str += "<tr class='jiankongtr data-fail'>";
		$str += "<td class='monitor-table-tdone' >" + tdata.name + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.typename + "</td>";
		$str += "<td class='monitor-table-tdtwo'>" + formatArea(tdata.areaname) + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.domain + "</td>";
		$str += "<td class='monitor-table-tdtwo' >" + tdata.state + "</td>";
		$str += "</tr>";
	}  
	$("#" + tableid + "").append($str);
}

function formatArea(area){
	if(area != '攀枝花'){
		return area.substring(0,2);
	}
	return area.substring(0,3);
}

function removeAllChild(tableid) {
	var div = document.getElementById(tableid);
	while (div.hasChildNodes()) {
		div.removeChild(div.firstChild);
	}
}