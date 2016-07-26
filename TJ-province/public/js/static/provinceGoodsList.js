
var CACHE_TYPE = void 0;
$(function(){
	CACHE_TYPE = $.getUrlParam('type');
    getareanName();
    init(CACHE_TYPE);
});

/**
 * @name getareanName
 * @param  获取地名areaName并赋给标题
 */
function getareanName(){
	$.ajax({
		url:ctx+'/rest/oper/area/inner/getAreaName',
		data: {areaId: $.getUrlParam("areaId")},
		type: "GET",
		success: function (data) {
			$("#areaName").html(data.name)
               }
	});
};
 
/**
 * @name setType
 * @param  Andriod调用网页方法，传入类型
 */
function setType(type){
	$("#page").val(1);
	init(type);
};

var getUrl=ctx+"/rest/businesslist/getBusinessPage"; 

/**
 * @name init
 * @param 加载此页表格数据 
 */
function init(type) {
	var type = type;
	var page = $("#page").val();
	if(type==null||"null"==type){
		type='';
	};
	$.ajax({
		url:getUrl,
		data:{"page":page,"pageSize":10,"areaId": areaId,"type":type},
		type:"GET",
		dataType:"json",
		success:function(data){
			//console.log(JSON.stringify(data));
			$("#plattable .goodsListContent").empty();  
			var html = "";
			var NUMS=0;
			var rows = data.rows;
			var pagesum = data.totalPage;
			if (rows != "" && rows != null) {
				if (page >= pagesum) {
					
					$("#Js_next_page").attr("disabled", true).removeClass("chooseSelect").css("color", "rgba(176,34,6,0.2)");
				} else {
					
					$("#Js_next_page").attr("disabled", false).addClass("chooseSelect").css("color", "#fff");
				};
				if (page <= 1) {
					
					$("#Js_pre_page").attr("disabled", true).removeClass("chooseSelect").css("color", "rgba(176,34,6,0.2)");
				} else {
				
					$("#Js_pre_page").attr("disabled", false).addClass("chooseSelect").css("color", "#fff");
				};

				$.each(rows,function(index,row){
					var url =row.url;
					NUMS=index;
				    html+= "<ul class='contentBox'>";
				    html+="<li class='contentBox-lione'><a onclick='javascript:getu(\""+url+"\")'>"+row.name+"</a></li>";
				    html+= "<li class='contentBox-litwo'>"+ (row.area ? row.area: '')+ "</li>";
				    html+= "<li class='contentBox-lithreen'>"+(row.platName　? row.platName : '' )+"</li>";
				    html+= "<li class='contentBox-lithreen'>"+(row.mainAreas ? row.mainAreas :'')+"</li>";
				    html+="<li class='contentBox-lithreen' style='margin-right:3.5%;'>"+ (row.type ? row.type : '')+"</li>";
				    html+="</ul>";
			    });
			};
			if (NUMS!=9 ) {
				for(var i = 0;i < 9 - NUMS;i++){
					html+="<ul class='contentBox'></ul>";
				};
				
			};

			var totalPage=data.totalPage;
			var showPage = data.page ;
			$("#page").html(showPage);
			$("#totalPage").val(totalPage);
	        $("#plattable .goodsListContent").append(html);
	        window.android ? window.android.setData(JSON.stringify(data)) : '';// 请求完数据后返回 android
		}
	});
};

/**
 * @name getu
 * @param 得到子页面跳转的url地址
 */
function getu(url){
	window.location.href=url;
};

/**
 * @name pre
 * @param 上一页
 */
function pre() {
	var curPage = $("#page").val();
	var prePage = parseInt(curPage) - 1;
	if (prePage < 1) {
		
		return;
	}
	$("#page").val(prePage);
	init(CACHE_TYPE);
};

/**
 *  @name next
 *  @param 下一页
 */
function next() {
	var curPage = $("#page").val();
	var nextPage = parseInt(curPage) + 1;
	var totalPage = $("#totalPage").val();
	if (nextPage > totalPage) {
		return false;
	}
	$("#page").val(nextPage);
	init(CACHE_TYPE);
};


var m=null;
function Train(num,created,lession,lessionName){
	this.num=num;
	this.created=created;
	this.lession=lession;
	this.lessionName=lessionName;
};

/**
 * @name skip
 * @param android 传入table的index,然后跳转里面的a标签
 */
function skip(index){
	var tr = $("#plattable .contentBox").eq(index-1).find('a');
	tr.click();
};
