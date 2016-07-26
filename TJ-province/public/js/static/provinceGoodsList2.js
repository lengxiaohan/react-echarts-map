"use strict";
import "common";
import "ajax-plus";

import React from 'react';
import ReactDOM from 'react-dom';

// 获取区域id
let areaId = $.getUrlParam('areaId');
// 获取网商列表类型
let areaType = $.getUrlParam('type') || '';


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
				<div className="head-left"></div>
				<div className="head-con">
					<img alt="header" src="./img/head-bg.png"/>
					<p>{this._getName()}</p>
				</div>
				<div className="head-right"></div>
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
		let listArray = data ? data : []; //获取数据进行遍历赋值
		this.dom = listArray.map(function(item,list){
			return <SectionListComponent item={item} list={list} key={list}/>
		})
	},
	componentDidMount: function () {
		// 接收请求返回数据
		this.props.getDatas(1,areaType,1);
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
						<li className="contentBox-lithreen">主营范围</li>
						<li className="contentBox-lithreen">类型 </li>							
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
		this.listData = this.props.list;
	},
	_getListDataClick: function (event) {
		event.preventDefault();
		const url = this.props.item && this.props.item.url || "javascript:;"
		window.location.href = url;
	},
	componentWillReceiveProps: function(nextProps) {
		const that = this;
		this.listData = nextProps;
	},
	render: function() {
		return (
			<ul className="contentBox" onClick={this._getListDataClick}>
				<li className="contentBox-lione" >{this.listData.item ? this.listData.item.name : ''}</li>
				<li className="contentBox-litwo" >{this.listData.item ? this.listData.item.area : ''}</li>
				<li className="contentBox-lithreen">{this.listData.item ? this.listData.item.platName : ''}</li>
				<li className="contentBox-lithreen">{this.listData.item ? this.listData.item.mainAreas : ''}</li>
				<li className="contentBox-lithreen">{this.listData.item ? this.listData.item.type : ''}</li>
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
					<div className="pageA">
						<span id="Js_pre_page" className={this.props.currentPage == 1 ? "" : "chooseSelect"} onClick={this.props.prev} disabled={this.props.currentPage == 1 ? "true" : "false"}>&nbsp;&lt;&nbsp;上一页</span>
					</div>
					<div className="pageA">
						<input type="button" className="page" value={this.props.currentPage}/>
					</div>
					<div className="pageA">
						<span id="Js_next_page" className="chooseSelect"  onClick={this.props.next}>下一页&nbsp;&gt;&nbsp;</span>
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
			pageNum: 1,  //当前用户所在页
			status: false //当前组件的状态，当为true时更新组件
		}
	},
	componentWillMount: function () {
		this.data = [];  //设置初始data状态，填充空数据，避免报错问题
		this.arrayGroup = []; //拉取数据回来进行分组的转换数组
		this.nextPagerNum = 1; //当前请求的页数（现在按照每页100条数据拉取，分10组）
		for (let i = 0; i < 10; i++) {
			this.data.push(''); //初始化添加空数据
		}
	},
	_getDatas: function(nums,type,page) {
		const that = this;
		let session = sessionStorage.getItem('sessionPage'+type+nums); //判断当前页是否有用户的缓存数据
		const PAGEERS = 10;   //每页总个数
		const PAGESIZE = 100; //请求每页数据
		if (!session) {
			let setData = {
				"page":page,
				"pageSize":PAGESIZE,
				"areaId": areaId ? areaId : '',
				"type":type ? type : ''
			};
			$.GetAjax($.getCtx()+'/rest/businesslist/getBusinessPage', setData, 'GET', true, function(data) {
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
						sessionStorage.setItem('sessionPage'+type+(page*PAGEERS-PAGEERS+1+i),JSON.stringify(that.arrayGroup[i+(page*PAGEERS-PAGEERS)]));

						// 初始化数据渲染
						if ( nums == 1 ) {
							that._androidCallback(JSON.stringify(that.arrayGroup[i+(page*PAGEERS-PAGEERS)]));
							that.data = that.arrayGroup[i+(page*PAGEERS-PAGEERS)];
							that.totalPage = sessionStorage.length;
							that.setState({
								status: true
							});
						}
							
					}
					
				}
				
			});
			
		}else{
			// 用缓存数据更新view达到高效的而用户体验
			that._androidCallback(session); //数据传给安卓
			session = JSON.parse(session); //将字符串转化为数组数据
			that.totalPage = sessionStorage.length;
			that.data = session;
			that.setState({
				status: true
			});
		}
		
	},

	// android数据交换
	_androidCallback: function (data) {
		window.android ? window.android.setData(JSON.stringify(data)) : '';
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
				sessionStorage.getItem('sessionPage'+areaType+(this.nextPagerNum*10+1)) ? '' : this._getDatas(this.nextPagerNum*10+1,areaType,this.nextPagerNum+1);  
				this.nextPagerNum++;
			}

			// 当前页数数据
			this._getDatas(this.state.pageNum,areaType);
			
		}
	},
	_prevPage: function(event){
		event.preventDefault();
		if(this.state.pageNum <= 1){
			return false;
		} else {
			this.state.pageNum--; //依次递减
			this._getDatas(this.state.pageNum,areaType);
		}
		
	},
	render: function() {
		return (
			<div className="content-cp">
	        	<HeaderComponent/>
	        	<SectionComponent data={this.data ? this.data : []} getDatas={this._getDatas} />
	        	<FooterComponent next = {this._nextPage} prev = {this._prevPage} currentPage = {this.state.pageNum} />
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