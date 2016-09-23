(function($){
	var screenProporMoudle = {
		init(){
			this.times = $.getUrlParam('times') || 1;
			this.creatElement();
		},
		creatElement(){
			var windowWidth = $(window).height()*0.003;
			if (this.times == 0.25) {
				$('body').addClass('smallScreen').css({
					border:''+windowWidth+ 'px solid rgba(0, 153, 255, 0.5)',
					borderTop: 'none',
				    boxSizing: 'border-box',
				    background: 'rgba(0,0,51,.1)'
				});
			}else{
				$('body').addClass('largeScreen').css({
					border:''+windowWidth+ 'px solid rgba(0, 153, 255, 0.5)',
					borderTop: 'none',
					boxSizing: 'border-box',
				    background: 'rgba(0,0,51,.1)'
				});
			}
			$('.headerLine').css({
				borderTop:''+windowWidth+ 'px solid rgba(0, 153, 255, 0.5)'
			});
		}
	}
	screenProporMoudle.init();
})(jQuery)