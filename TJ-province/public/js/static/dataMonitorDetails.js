import "common";
import "ajax-plus";

import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';

class HeaderComponent extends React.Component {
	render() {
		return (
			<div className="header">
				<div className="head-left"></div>
				<div className="head-con">
					<img alt="img" src="img/head-bg.png"/> 
					<p>数据源状态监控</p>
				</div>
				<div className="head-right"></div>
			</div>
		)
	}
}

class NavComponent extends React.Component {
	state = {
		isSuccess: false
	}
	constructor(props) {
		super(props);
		this.data = {};
	}
	getSesstion() {
		const that = this;
		$.GetAjax($.getCtx() + '/rest/plat/platTrend', null, 'GET', true, function(data, state) {
			if (state) {
				that.data = data;
				that.setState({
					isSuccess: true
				});
			} else {
				setTimeout(function() {
					that.getSesstion();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
			}

		});
	}
	componentDidMount() {
		this.getSesstion();
	}
	componentDidUpdate() {
		const that = this;
		setTimeout(() => {
			that.getSesstion();
		}, 1000)
	}
	render() {
		return (
			<div className="navContainer">
				<div className="navBox">
					<div className="navBoxList">
						<p>正常响应平台数</p>
						<div className="boxListRight">
							<b className="success">{this.data.normalnum || 0}</b>
							<span>个</span>
						</div>
					</div>
				</div>
				<div className="navBox">
					<div className="navBoxList">
						<p>延迟响应平台数</p>
						<div className="boxListRight">
							<b className="delay">{this.data.latenum || 0}</b>
							<span>个</span>
						</div>
					</div>
				</div>
				<div className="navBox">
					<div className="navBoxList">
						<p >异常响应平台数</p>
						<div className="boxListRight">
							<b className="errors">{this.data.errornum || 0}</b>
							<span>个</span>
						</div>
					</div>

				</div>
			</div>
		)
	}
}

class SecListComponent extends React.Component {
	state = {
		start: false
	}
	constructor(props) {
		super(props);
		this.data = {};
		this.pageNumber = 1; //当前页
		this.totalPage = 0; //总页数
		this.pageSize = 100; //一次请求的数据个数
		this.currentStartNums = 0; //开始的位置
		this.totalElements = 0; //总个数
		this.isNotAjax = true; //判断是否发送ajax
	}
	getSesstion() {
		const that = this;
		let config = {
			pageNumber: this.pageNumber,
			pageSize: this.pageSize
		}
		if (!this.isNotAjax) {
			return false;
		}
		$.GetAjax($.getCtx() + '/rest/plat/pagePlat', config, 'GET', true, function(data, t_state) {
			if (!t_state) {
				setTimeout(function() {
					that.getSesstion();
					console.log('主人，刚才服务器出了一下小差');
				}, 2000);
				return false;
			}
			if (data && data.content && data.content.length) {
				that.totalPage = data.totalPages;
				that.totalElements = data.totalPages
				data.content.forEach((list, item) => {
					let currentItem = (that.pageNumber - 1) * that.pageSize + item;
					sessionStorage.setItem('currentlist' + currentItem, JSON.stringify(list));
				});
				if (that.pageNumber == 1) {
					that.getListMount();
					that.setState({
						start: true
					});
				}

			}

		});
	}
	componentDidMount() {
		this.getSesstion();
	}
	componentDidUpdate() {
		const that = this;
		setTimeout(() => {
			if (that.currentStartNums >= that.totalElements) {
				that.currentStartNums = 0;
			} else {
				that.currentStartNums++;
			}
			that.setState({
				start: true
			});
			if (that.currentStartNums == (that.pageSize * that.pageNumber) - 10) {
				if (that.pageNumber >= that.totalPage) {
					that.pageNumber = 1;
					that.isNotAjax = false;
				} else {
					that.pageNumber++;
				}
				that.getSesstion();
			}
		}, 1000)
	}
	getListMount() {
		let attr = [];
		for (let i = this.currentStartNums; i < 10 + this.currentStartNums; i++) {
			let listSession = JSON.parse(sessionStorage.getItem('currentlist' + i)) || {};
			attr.push(listSession);
		}
		this.currentListDom = attr.map(function(item, list) {
			return <SectionListComponent item={item} list={list} key={list}/>
		});
	}
	render() {
		this.getListMount(this.props.data);
		return (
			<div className="sectionList">
				<div className="sectionListBox">
					<ul className="goodsListHeader">
						<li className="contentBox-lione">名称</li>
						<li className="contentBox-litwo" >类型</li>
						<li className="contentBox-lithreen">所属地域</li>
						<li className="contentBox-lithreen">平台地址</li>
						<li className="contentBox-lithreen">访问状态</li>
					</ul>
					<div className="goodsListContent">
						{this.currentListDom || null}
					</div>
				</div>
			</div>
		)
	}
}

class SectionListComponent extends React.Component {
	componentWillMount() {
		this.listData = this.props.list;
	}
	_getListDataClick(event) {
		event.preventDefault();
		const url = this.props.item && this.props.item.url || "javascript:;"
		window.location.href = url;
	}
	componentWillReceiveProps(nextProps) {
		const that = this;
		this.listData = nextProps;
	}
	render() {
		let list = this.listData.item;
		let boxClass = list ? list.status == 1 ? 'contentBox data-success' : list.status == 2 ? 'contentBox data-delay' : 'contentBox data-error' : 'contentBox data-success';
		return (
			<ul className={boxClass}>
				<li className="contentBox-lione">{list && list.name || null}</li>
				<li className="contentBox-litwo">{list && list.typename || null}</li>
				<li className="contentBox-lithreen">{list && list.areaname || null}</li>
				<li className="contentBox-lithreen">{list && list.domain || null}</li>
				<li className="contentBox-lithreen">{list && list.state || null}</li>							
			</ul>
		)
	}
}

class Container extends React.Component {
	render() {
		return (
			<div className="container">
	    		<HeaderComponent />
	    		<NavComponent />
	    		<SecListComponent/>
	    	</div>
		)
	}
}

ReactDOM.render(
	<Container />,
	document.getElementById('myApp')
);