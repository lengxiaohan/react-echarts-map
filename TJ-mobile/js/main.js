
var containerObj = {
    init: function() {
        this.onStartState = true;
        this.pageTimer = {};
        this.index();
        this.onClicked();
        this.resizeCallback();
        this.resizeBody();
    },
    index: function(){
        var that = this;
        $('.containerIndex').addClass('active');
        setTimeout(function(){
            $('.containerIndex.active')
            .find('.state1').animate({
                opacity: 0
            },400);
            $('.containerIndex.active')
            .find('.state2').animate({
                opacity: 0
            },400);
            $('.containerIndex.active')
            .find('.state3').animate({
                opacity: 0
            },400);
        },10000);
    },
    onClicked: function(){
        var that = this;
        $('.containerIndex').off().on('click',function(){
            if (that.onStartState) {
                that.onStartState = false;
                $(this).animate({
                    opacity: 0
                },300,'swing');
                setTimeout(function(){
                    $('.containerIndex').css({display:'none'});
                },300);
                $('.page1.swiper-slide-active').addClass('active');
                that.start();
            }
        });
        $('.page1.swiper-slide-active').off().on('click',function(){
            if (that.onStartState) {
                that.onStartState = false;
                $(this).addClass('active');
                that.start();
            }
        });
    },
    start: function() {
        var that = this;
        var fontArray = ['专注于大数据的','创新型企业'];
        $('.page1.active')
        .find('.logo').animate({
            opacity: 0
        },300);

        this.pageTimer["timer1"] = setTimeout(function(){
            $('.page1.swiper-slide-active')
            .find('.font')
            .animate({
                height:'5%',
                top: '40%'
            },300);
            $('.page1.active .fontlist1').html('');
            $('.page1.active .fontlist2').html('');
            that.pageTimer["timer2"] = setTimeout(function(){
                $('.page1.active').find('.fontlist1').css({opacity:1});
                input_type.init(fontArray[0], $('.page1.active .fontlist1'));
            },300);
            
            that.pageTimer["timer3"] = setTimeout(function(){
                $('.page1.active').find('.fontlist2').css({opacity:1});
                input_type.init(fontArray[1], $('.page1.active .fontlist2'));
            },1000);

            that.pageTimer["timer4"] = setTimeout(function(){
                $('.page1.active')
                .find('.font')
                .animate({
                    top: '2%'
                },300);

                $('.page1.active')
                .find('.fontlist1')
                .animate({
                    bottom: '8%'
                },300);

                $('.page1.active')
                .find('.fontlist2')
                .animate({
                    bottom: '2%'
                },300);
            },1600);

            that.pageTimer["timer5"] = setTimeout(function(){
                $('.page1.active').find('.huo').animate({
                    opacity:1,
                    top: '20%'
                },800);

                that.pageTimer["timer6"] = setTimeout(function(){
                    $('.page1.active').find('.star').animate({
                        opacity: 1,
                        top: '20%'
                    },800);
                },800)

            },2000);

        },300)
    },
    clearPage1: function () {
        $('.page1').find('.logo').attr('style','');
        $('.page1').find('.font').attr('style','');
        $('.page1').find('.huo').attr('style','');
        $('.page1').find('.star').attr('style','');
        $('.page1').find('.fontlist1').attr('style','');
        $('.page1').find('.fontlist2').attr('style','');
        $('.page1').css({
            background:'-webkit-linear-gradient(top right, #074177, #022440)',
            background:'linear-gradient(top right,#074177,#022440)'
        });
    },
    PageChecked1: function() {
        this.onStartState = true;
        this.clearPage1();
    },
    PageChecked2: function() {
        var that = this;
        setTimeout(function(){
            that.clearPage1();
        },300);
        $('.page1').removeClass('active');
        for(var each in this.pageTimer){
            clearTimeout(this.pageTimer[each]);
        }
    },
    resizeBody: function(){
        var that= this;
        $(window).resize(function(){
            that.resizeCallback();
        });
    },
    resizeCallback: function(){
        if ( $(window).width()/$(window).height() > 0.8 ) {
            $('body,html').css({
                width: $(window).height()*0.66
            });
            $('.page1 > .fontlist1,.page1 > .fontlist2,.page3 > div,.page7 > div,.page8 > div,.page9 > div,.page10 > div,.page11 > div,.page12 > div,.page13 > div,.page14 > div').css({
                zoom: $(window).height()*0.66 / 320
            })
        }else{
            $('body,html').css({
                width: $(window).width()
            });
            $('.page1 > .fontlist1,.page1 > .fontlist2,.page3 > div,.page7 > div,.page8 > div,.page9 > div,.page10 > div,.page11 > div,.page12 > div,.page13 > div,.page14 > div').css({
                zoom: 1
            })
        }
        swiper.onResize();
    }
}

var swiper = new Swiper('.swiper-container', {
    // pagination: '.swiper-pagination',
    // nextButton: '.swiper-button-next',
    // prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    // effect:"slide",
    paginationClickable: true,
    observe: true,
    observeParents: true,
    // spaceBetween: 30,
    // loop: true,
    // onInit: function(swiper){
    //     alert('ok');
    // },
    onTouchMove: function (swiper){
        if (swiper.activeIndex == 3) {
            if (swiper.swipeDirection == 'prev') {
                $('.cloneBg').css({
                    display:'none'
                });
                $('.page4').attr('style','');
                $('.page4 .title').attr('style','');
                $('.page4').find('.bg-repeat-others').show(0);
            }else{
                $('.cloneBg').css({
                    display:'block'
                });
                $('.page4').css({
                    background: 'none'
                }).find('.title').css({
                    display:'none'
                });
                $('.page4').find('.bg-repeat-others').hide(0);
            }
            
        }else if(swiper.activeIndex == 5){
            if (swiper.swipeDirection == 'next') {
                $('.cloneBg').css({
                    display:'none'
                });
                $('.page6').attr('style','');
                $('.page6 .title').attr('style','');
                $('.page6').find('.bg-repeat-others').show(0);
            }else{
                $('.cloneBg').css({
                    display:'block'
                });
                $('.page6').css({
                    background: 'none'
                }).find('.title').css({
                    display:'none'
                });
                $('.page6').find('.bg-repeat-others').hide(0);
            }
        }
    },
    // onTouchEnd: function () {
    //     console.log('onTouchEnd@@@@@@@@@@@');
    //     console.log(swiper.activeIndex);
    //     console.log(swiper.swipeDirection);
    // },
    onSlideChangeStart: function(swiper){
        if (swiper.activeIndex == 0) {
            containerObj.PageChecked1();
        }else if (swiper.activeIndex == 1) {
            containerObj.PageChecked2();
        }else if (swiper.activeIndex == 3) {
            if (swiper.swipeDirection = 'next') {
                setTimeout(function(){
                    $('.cloneBg').css({
                        display:'block'
                    });
                    $('.page4').css({
                        background: 'none'
                    }).find('.title').css({
                        display:'none'
                    });

                    $('.page5').css({
                        background: 'none'
                    }).find('.title').css({
                        display:'none'
                    });

                    $('.page6').css({
                        background: 'none'
                    }).find('.title').css({
                        display:'none'
                    });
                    $('.page4').find('.bg-repeat-others').hide(0);
                    $('.page6').find('.bg-repeat-others').hide(0);
                },300);
            }
        }
    }
});

var input_type = {
    init:function (arrays,$obj) {
        this.name = arrays;
        this.obj = $obj;
        this.length = this.name.length;
        this.i = 0;
        this.Go = false;
        this.pri();
    },
    pri:function () {
        var $this = this;
        if ($this.i > $this.length) {
            window.clearTimeout($this.Go);
            return false;
        }
        $this.obj.append($this.name[$this.i]);
        $this.i++;
        $this.Go = window.setTimeout('input_type.pri()', 100);
    }
}


var preLoadImg = {
    init: function() {
        this.images = [];
        this.imgNum = 0;
        this.getImg();
    },
    getImg: function() {
        var imgs = document.images;
        for (var i = 0; i < imgs.length; i++) {
            this.images.push(imgs[i].src);
        }

        var cssImages = this.getallBgimages();
        for (var j = 0; j < cssImages.length; j++) {
            this.images.push(cssImages[j]);
        }

        this.start();
    },
    start: function() {
        var that = this;
        var images = this.images;
        var loader = new WxMoment.Loader();

        //声明资源文件列表
        var fileList = images;

        for (var i = 0; i < fileList.length; i++) {
            loader.addImage(fileList[i]);
        }

        //进度监听
        loader.addProgressListener(function (e) {
            var percent = Math.round((e.completedCount / e.totalCount) * 100);
            //Loading 页面中百分比的显示
            $("#loadShow").html(percent + "%");
            
        });

        //加载完成
        loader.addCompletionListener(function () {
            $("#loading").find('p').addClass('active');
            setTimeout(function(){
                $("#loading").fadeOut(1000);
                $('.containerIndex').fadeIn(1000);
                setTimeout(function(){
                    $('.swiper-container').css('opacity',1);
                    containerObj.init();
                },1000)
            },700);
            
        });

        //启动加载
        loader.start();
    },
    getallBgimages: function() {
        var that = this;
        var url, 
            B = [], 
            A = document.getElementsByTagName('*');
        A = B.slice.call(A, 0, A.length);
        while (A.length) {
            url = this.deepCss(A.shift(), 'background-image');
            if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
            url = url[1];
            if (url && B.indexOf(url) == -1) B[B.length] = url;
        }
        return B;
    },
    deepCss: function (who, css) {
        if (!who || !who.style) return '';
        var sty = css.replace(/\-([a-z])/g, function (a, b) {
            return b.toUpperCase();
        });
        if (who.currentStyle) {
            return who.style[sty] || who.currentStyle[sty] || '';
        }
        var dv = document.defaultView || window;

        return who.style[sty] || dv.getComputedStyle(who, "").getPropertyValue(css) || '';

        Array.prototype.indexOf = Array.prototype.indexOf || function (what, index) {
            index = index || 0;
            var L = this.length;
            while (index < L) {
                if (this[index] === what) return index;
                ++index;
            }
            return -1;
        }
    }
}

window.addEventListener('orientationchange', function(event){
    if ( window.orientation == 180 || window.orientation==0 ) {
        // alert("竖屏");
    }
    if( window.orientation == 90 || window.orientation == -90 ) {
        // alert("横屏");
    }
});

preLoadImg.init();
// containerObj.init();