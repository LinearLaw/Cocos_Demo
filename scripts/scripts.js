var main = {};
var music = new Audio();

//第四个点找到时的音乐
var music2 = new Audio();
music2.src= "audio/1.mp3";
music2.loop = true;
music2.load();

var jp = new Audio();
jp.src = "audio/jp.mp3";

//四个点的位置标识
var array = [
    {
        position: {x: 50, y: 130},
        target: ".page2",
        mark: false
    },
    {
        position: {x: 590, y: 0},
        target: ".page3",
        mark: false
    },
    {
        position: {x: 973, y: 0},
        target: ".page4",
		mark: false
    },
    {
        position: {x: 1280, y: 308},
        target: ".page5",
        mark: false
    }
];

var current;

var num = 0;

(function ($) {
    main.init = function () {
        main.initEvent();

        //第一页加动画
        common.animate($(".page1").find(".ani"));

        //自动切换到第二页
        turnMap();
    };

    main.initEvent = function () {
        /**
         * 音乐播放事件
         */
        music.addEventListener('playing', function (e) {
            $('#musicBtn').removeClass('pause');
        });

        /**
         * @desc 音乐暂停事件
         */
        music.addEventListener('pause', function (e) {
            $('#musicBtn').addClass('pause');
        });

        /**
         * @desc 点击音乐按钮，控制音乐暂停和播放
         */
        $("#musicBtn").on("tap", function () {
            if ($(this).hasClass("pause")) {
                music.play();
            }
            else {
                music.pause();
            }
        });

        $(".circle").on("touchstart", function (e) {
            $(".opacity").css("-webkit-animation","none");

			//隐藏手指
			setTimeout(function() {
				$(".hand").css("-webkit-animation","fadeOut 1s").hide();
			},1500);
        });

        //移动图片
        $(".circle").on("touchend", function (e) {
            var self = $(this);
            var scrollLeft = self.scrollLeft();
            var scrollTop = self.scrollTop();

            for(var index = 0;index < array.length;index++){
                var L1 = array[index].position.x;
                var T1 = array[index].position.y;

                if(scrollLeft<(L1+50)&&scrollLeft>(L1-50)&&scrollTop<(T1+60)&&scrollTop>(T1-60)){
                    jp.play();

                    $(".mask").show();

                    self.scrollLeft(L1);
                    self.scrollTop(T1);
                    $(".opacity").css("-webkit-animation","ani1 2s linear");

                    setTimeout(function(){
                        $(".mask").hide();
                    },2100);

                    current = $(array[index].target);
                    current.show();
                    common.animate(current.find(".ani"));

                    if(array[index].mark==false){
                        num++;
						$(".successNum").find("span").html(num);
                    }

                    array[index].mark = true;

                    if(num==4){
						//四个点都找到时切换到最后一页
						setTimeout(function() {
							turnLast();
						},5500);

						//音乐替换
						setTimeout(function() {
							music.pause();
							music2.play();
						},4500);
					}

                    return;
                }else {
                    if(!current) {
                        continue;
                    }
                    current.hide();
                    common.removeAni(current.find(".ani"));
                }

            }

        });
    };

    main.initMusic = function (cfg) {
        var loop = cfg.loop || true;
        var autoplay = cfg.autoplay || true;

        music.src = cfg.url;
        music.loop = loop;
        music.autoplay = autoplay;

        music.load();
    };

    /**
     * @desc 切换到移动图片页面
     */
    function turnMap() {
        setTimeout(function () {
            var p1 = $(".page1");
            var p2 = $(".map");

            common.turnPage(p1, p2);
        }, 14000);
    }

	/**
	 * @desc 切换到最后一个页面
	 */
	function turnLast() {
		var p3 = $(".pageText");
		var p4 = $(".map");
		var p5 = $(".page6");

		p3.css("-webkit-animation", "ani4 2s forwards");
		p4.find(".successNum").css("-webkit-animation", "ani4 2s forwards");

		/*setTimeout(function() {
			p4.find(".opacity2").css("-webkit-animation","ani3 2.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards");
		},1000);*/

		setTimeout(function() {
			p4.find(".opacity2").css("-webkit-animation","ani5 2s forwards");
		},1000);

		setTimeout(function() {
			p4.css("-webkit-animation", "fadeOut 0.8s");
			$(".mask").hide();
			//p5.css("-webkit-animation","fadeIn 1s").show();
			p5.show();
			p5.find(".img7").css("-webkit-animation","ani5 2.7s forwards");
			//p5.find(".img8").css("-webkit-animation","ani5 1.5s forwards");

			p5.find(".img8").css("-webkit-animation","ani3 4.5s ease forwards");
			p4.find(".opacity2").hide();

			setTimeout(function() {
				p5.find(".img6").css("-webkit-animation","ani5 1s forwards");
				//p4.find(".opacity2").hide();
			},3200);

			setTimeout(function () {
				common.removeAni(p3.find(".ani"));
				p3.css("-webkit-animation", "none").hide();

				common.animate(p5.find(".ani"));
			}, 5500);

			setTimeout(function() {
				p5.find(".img7").css("-webkit-animation","ani4 1s forwards");
				p5.find(".img8").css("-webkit-animation","ani4 1s forwards").hide();
			}, 4500);

			/*setTimeout(function () {
				common.removeAni(p3.find(".ani"));
				p3.css("-webkit-animation", "none").hide();

				common.animate(p5.find(".ani"));
			}, 700);*/
		}, 2600);
	}
})(Zepto);