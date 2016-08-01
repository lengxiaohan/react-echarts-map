<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ include file="../../pages/taglibs.jsp"%>
<!DOCTYPE html>
<html>
<head lang="en">
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>本地农产品全国需求热点分布图</title>
<link href="${county }/css/countrySaleDistribution.min.css" rel="stylesheet">
</head>
<body>
<%@ include file="../../pages/header.jsp"%>

	<div class=" buser" id="chinaxin">
		<div class="tittop ">
			<div class="head-left"></div>
			<div class="head-con">
				<img alt="" src="img/head-bg.png"/> 
				<p>全国消费者对<label id="areaName"></label><label id="farm"></label>农产品需求热度分布</p>
			</div>
			<div class="head-right"></div>
		</div>
		<div class="andiv">
			<div class="lpai">
				<div class="lpaiu-top"></div>
				<div class="onelp">
				     <div><img alt="" src="${county }/img/redxin.png" class="xinxin"><label>需求度&nbsp;高</label></div>
			         <div><img alt="" src="${county }/img/yellowxin.png" class="xinxin"><label>需求度&nbsp;中</label></div>
			         <div><img alt="" src="${county }/img/bulexin.png" class="xinxin"><label>需求度&nbsp;低</label></div>
				</div>
				<table class="lpaiu" id="senfe">
					<thead>
						<tr >
							<td  colspan="3">省份需求指数</td>
						</tr> 
					</thead>
					<tbody id="group_one"> 
					
					</tbody>
				</table>
			</div>
			<div id="main" class="mapxin" style="width: 70%; height: 100%; float: left;"></div>
		</div>
	</div>
	
	<script type="text/javascript">
		<%
			String itemName = request.getParameter("itemName");
		 %>
		 var itemName = <%=itemName%>; 
		 var urlCtx = '${ctx }';
	</script>
	<script type="text/javascript" src="${county }/js/plus/jquery-3.0.0.min.js"></script>
	<script type="text/javascript" src="${county }/js/dist/echarts.js"></script>
	<script type="text/javascript" src="${county }/build/countryDemandDistribution.min.js"></script> 
</body>
</html>