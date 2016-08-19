"use strict";
import "common";
import "ajax-plus";
import "cookie";

import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');

/**
 * @name HeaderComponent 头部组件
 * @param _getName 头部信息名称
 */
var HeaderComponent = React.createClass({
	_getName: function() {
		const name = '网商列表';
		return name;
	},
	render: function() {
		return (
			<div className="containA">
				<p>{this._getName()}</p>
			</div>
		)
	}
});

var HeaderComponent2 = React.createClass({
	render: function() {
		return (
			<div className="containB">
				<img alt="header" src="../public/img/shop.png" />
			</div>
		)
	}
});

/**
 * @name SectionComponent 内容组件
 * @param _pushListComponent 获取列表组件
 * @param componentDidMount 渲染后执行
 */
var SectionComponent = React.createClass({
	_pushListComponent: function (data) {
		const that = this;
		this.CHECKCURRENT = $.cookie('NUMS') || 0;//初始化默认选中第一个元素
		let listArray = data ? data : []; //获取数据进行遍历赋值
		this.dom = listArray.map(function(item,list){
			return <SectionListComponent item={item} list={list} key={list} listCurrent = {that.CHECKCURRENT}/>
		});
	},
	componentDidMount: function () {
		// 接收请求返回数据
		this.props.getDatas($.cookie('PAGE') || 1,1);
		this._clickList();
	},
	_clickList: function () {
		const that = this;
		let timeout = void 0;
		let ISKEYUP = false;
		$(document).on('keydown',function(evt) {
			let e = evt ? evt : ((window.event) ? window.event : "");
			let keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			ISKEYUP = false;
			timeout = setTimeout(function(){
				ISKEYUP = true;
				clearTimeout(timeout);
				that._EventOnkeyDown(keyCode);
			}, 500);
			
		}).on('keyup',function(evt) {
			let e = evt ? evt : ((window.event) ? window.event : "");
			let keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (!ISKEYUP) {
				that._EventOnkeyDown(keyCode);
			}
			clearTimeout(timeout);
		});

	},
	_EventOnkeyDown: function(keyCode){
		if (keyCode == 37) {
			this._up();
		}else if (keyCode == 38) {
			this._up();
		}else if (keyCode == 39) {
			this._down();
		}else if (keyCode == 40) {
			this._down();
		}else if (keyCode == 13) {
			this._EventClickMe();
		}
	},
	_EventClickMe: function () {
		let t_this = $('.active-show').click();
		let localName = t_this[0].localName;
		if ( localName === 'ul' ) {
			window.android ? window.android.getMouse() : '';
		}
	},
	_ppxx: function (c) {
		$('#listContainer').find('.chooseSelect').removeClass('active-show');
		$('#listContainer').find('.chooseSelect').eq(c).addClass('active-show');
	},
	_up: function () {
		this.CHECKCURRENT > 0 ? this.CHECKCURRENT-- : 0;
		this._ppxx(this.CHECKCURRENT);
		$.cookie('NUMS',this.CHECKCURRENT);
	},

	_down: function () {
		let length = $('.chooseSelect').length - 1;
		this.CHECKCURRENT < length ? this.CHECKCURRENT++ : length;
		this._ppxx(this.CHECKCURRENT);
		$.cookie('NUMS',this.CHECKCURRENT);
	},
	render: function() {
		// 渲染列表数据
		this._pushListComponent(this.props.data);
		return (
			<div className="containC">
				<div id="plattable" className="divtable">
					<ul className="goodsListHeader">
						<li className="contentBox-lione">网商名称</li>
						<li className="contentBox-litwo" >归属地</li>
						<li className="contentBox-lithreen">所属平台</li>
						<li className="contentBox-litwo">主营范围</li>
						<li className="contentBox-lithreen listHeader_lilast">类型</li>					
					</ul>
					<div className="goodsListContent">
						{this.dom}
					</div>
				</div>
			</div>
		)
	}
});

/**
 * @name SectionListComponent 内容中列表行组件
 * @param componentWillMount 渲染前赋值
 * @param _getListDataClick 做点击事件（跳转页面）
 * @param componentWillReceiveProps 当该组件接收到新的props时更新组件
 */
var SectionListComponent = React.createClass({
	componentWillMount: function() {
		this.interval = false;
		this.listData = this.props.list;
	},
	_getListDataClick: function (event) {
		event.preventDefault();
		const url = this.props.item && this.props.item.url || "javascript:;"
		window.location.href = url;
	},
	_marquee: function () {
		const that = this;
		let dom = ReactDOM.findDOMNode(this.refs.list);
		clearInterval(this.interval);
		dom.scrollLeft = 0;
		dom.lastChild.innerHTML = '';
		this.interval = setTimeout(function(){
			let lengthParent = dom.offsetWidth;
			let lengthChild = dom.firstChild.offsetWidth;
			if( lengthChild >= lengthParent ) {
				that._scroll(dom);
			}
		},5000);

	},
	_scroll: function (obj) {
		var tmp = obj.scrollLeft;
        obj.lastChild.innerHTML += obj.firstChild.innerHTML;
    	this.interval = setInterval(function(){
        	obj.scrollLeft++;
	        //当滚动条滚动了初始内容的宽度时滚动条回到最左端
	        if (obj.scrollLeft>=obj.firstChild.offsetWidth+30) {
	        	obj.scrollLeft=0;
	        }
        },50);
	},
	componentDidUpdate: function () {
		this._marquee();
	},
	componentWillReceiveProps: function(nextProps) {
		const that = this;
		this.listData = nextProps;
	},
	render: function() {
		
		return (
			<ul className={this.listData.list == this.props.listCurrent ? 'contentBox chooseSelect active-show' : this.listData.item ? 'contentBox chooseSelect' : 'contentBox'} onClick={this._getListDataClick} >
				<li className="contentBox-lione" >{this.listData.item ? this.listData.item.name : ''}</li>
				<li className="contentBox-litwo" >{this.listData.item ? this.listData.item.area : ''}</li>
				<li className="contentBox-lithreen">{this.listData.item ? this.listData.item.platName : ''}</li>
				<li className="contentBox-litwo textOverflow" ref="list"><span>{this.listData.item ? this.listData.item.mainAreas : ''}</span><span></span></li>
				<li className="contentBox-lithreen listHeader_lilast">{this.listData.item ? this.listData.item.type : ''}</li>
			</ul>
		)
	}
});

/**
 * @name FooterComponent 底部组件（分页）
 * @param
 */
var FooterComponent = React.createClass({
	render: function() {
		return (
			<div className="pagelist">
				<div className="pagecenter">
					<div ></div>
					<div >
						<div className="pageP">
							<span className="page">{this.props.currentPage}/{this.props.totalPage}</span>
						</div>
					</div>
					<div >
						<div className="pageA">
							<span className={this.props.isCurrent == 0 ? "normalColor" : "chooseSelect"} onClick={this.props.prev} data-page="pager">&nbsp;&lt;&nbsp;上一页</span>
						</div>
						<div className="pageA">
							<span className={this.props.isCurrent == 1 ? "normalColor" : "chooseSelect"}  onClick={this.props.next} data-page="pager">下一页&nbsp;&gt;&nbsp;</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

/**
 * @name Container 总组件（渲染整个页面）
 * @param getInitialState 设置当前组件状态
 * @param componentWillMount 组件渲染前执行
 * @param _getDatas 发送请求拉取数据
 * @param _androidCallback 与安卓进行数据交互方法
 * @param _nextPage 获取下一页数据
 * @param _prevPage 获取上一页数据
 */
var Container = React.createClass({
	getInitialState: function () {
		return {
			pageNum: $.cookie('PAGE') || 1,  //当前用户所在页
			status: false //当前组件的状态，当为true时更新组件
		}
	},
	componentWillMount: function () {
		this.data = [];  //设置初始data状态，填充空数据，避免报错问题
		this.arrayGroup = []; //拉取数据回来进行分组的转换数组
		this.nextPagerNum = 1; //当前请求的页数（现在按照每页100条数据拉取，分10组）
		this.totalDataPage = $.cookie('totalDataPage') || 0;
		for (let i = 0; i < 10; i++) {
			this.data.push(''); //初始化添加空数据
		}
	},
	_getDatas: function(nums,page) {
		const that = this;
		let session = sessionStorage.getItem('sessionPage'+nums); //判断当前页是否有用户的缓存数据
		const PAGEERS = 10;   //每页总个数
		const PAGESIZE = 100; //请求每页数据
		if (!session) {
			let setData = {
				"page":page,
				"pageSize":PAGESIZE,
				"areaId": areaId ? areaId : ''
			};
			$.GetAjax($.getCtx()+'/rest/index/getBusinessPage', setData, 'GET', true, function(data) {
				if ( data && data.rows ) {

					// 进行数据组装
					for (let i = 0; i < data.rows.length/PAGEERS; i++) {
						let attr = []; //该数组用于缓存当前循环的数据信息（最多存10条数据），赋给缓存session
						for (let k = i*PAGEERS; k < i*PAGEERS+PAGEERS; k++) {
							attr.push(data.rows[k]);
						}

						// 赋值
						that.arrayGroup[i+(page*PAGEERS-PAGEERS)] = attr;
						// 缓存
						sessionStorage.setItem('sessionPage'+(page*PAGEERS-PAGEERS+1+i),JSON.stringify(that.arrayGroup[i+(page*PAGEERS-PAGEERS)]));

						// 初始化数据渲染
						if ( nums == 1 ) {
							that.data = JSON.parse(sessionStorage.getItem('sessionPage1'));
							that.totalPage = sessionStorage.length;
							that.totalDataPage=Math.ceil(data.total/PAGEERS);
							$.cookie('totalDataPage',that.totalDataPage );
							that.setState({
								status: true
							});
						}
							
					}
					

				}
				
			});
			
		}else{
			// 用缓存数据更新view达到高效的而用户体验
			session = JSON.parse(session); //将字符串转化为数组数据
			that.totalPage = sessionStorage.length;
			that.data = session;
			that.setState({
				status: true
			});
		}
		
	},
	_ppxxss: function (c) {
		$('#listContainer').find('.chooseSelect').removeClass('active-show');
		$('#listContainer').find('.chooseSelect').eq(c).addClass('active-show');
	},
	_nextPage: function(event){
		event.preventDefault();
		this.totalPage = this.totalPage ? this.totalPage : 1;  //总页数
		if (this.state.pageNum >= this.totalPage){  //超过总页数退出
			return false;
		}else{
			this.state.pageNum++;  //每次点击下一页进行累计
			if (this.state.pageNum == this.nextPagerNum*10-5) {  //判断是否发送请求数据

				// 判断缓存中是否存在该数据，如果没有则添加上
				sessionStorage.getItem('sessionPage'+(this.nextPagerNum*10+1)) ? '' : this._getDatas(this.nextPagerNum*10+1,this.nextPagerNum+1);  
				this.nextPagerNum++;
			}

			// 当前页数数据
			this._getDatas(this.state.pageNum);
			$.cookie('NUMS',0);
			this._ppxxss(0);
			$.cookie('PAGE',this.state.pageNum);
		}
	},
	_prevPage: function(event){
		event.preventDefault();
		if(this.state.pageNum <= 1){
			return false;
		} else {
			this.state.pageNum--; //依次递减
			this._getDatas(this.state.pageNum);
			$.cookie('NUMS',0);
			this._ppxxss(0);
			$.cookie('PAGE',this.state.pageNum);
		}
		
	},
	render: function() {
		return (
			<div className="containermy">
	        	<HeaderComponent/>
	        	<HeaderComponent2/>
	        	<SectionComponent data={this.data ? this.data : []} getDatas={this._getDatas}/>
	        	<FooterComponent next = {this._nextPage} prev = {this._prevPage} isCurrent = {this.state.pageNum == this.totalPage ? 1 : this.state.pageNum == 1 ? 0 : 2 } currentPage={this.state.pageNum} totalPage={this.totalDataPage}/>
        	</div>
		)
	}
});

/**
 * @param 添加整个Container组件到页面
 */
ReactDOM.render(
	<Container />,
	document.getElementById('listContainer')
);