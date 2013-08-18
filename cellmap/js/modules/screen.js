/*
 * screen change
 * */
(function($, cz, w) {
	cz.Screen = function(options) {
		var	base = this
		,	DURATION = 200
		,	EASING = 'easeInQuint'
		,	currentScreen
		,	$outer = $('#tnc_outer')
		,	$wrap = $('#tnc_wrap')
		,	$tl = $wrap.find('#timeline_wrap')
		,	$cm = $wrap.find('#cellmap_wrap')
		,	$loader;
		$tl.css({			
			'width': '50%',
			'float': 'left'
		}).show();
		$cm.css({			
			'width': '50%',
			'float': 'left',
			'height': '100%'
		}).show();
		this.initalize = function() {
			base._setResize();
			$(w).resize(function() {
				base._setResize();
			});
		}
		this.setLoader = function() {
			base.$loader = $('<div class="pageLoader" />');
			base.$dim = $('<div class="dim" />');
			$('body').append(base.$loader).append(base.$dim);
		}
		this.deleteLoader = function() {
			//base.$loader.remove();
			//base.$dim.remove();
			if ($('.pageLoader').length > 0) $('.pageLoader').remove();
			if ($('.dim').length > 0) $('.dim').remove();
		}
		this._setResize = function() {
			$wrap.css({
				width: $outer.width()*2
			});
		}
		this.openedCellbox = function() {
			base._setResize();
		}
		
		this.moveToCellmap = function(_cellId, _cellUserId) {
			$('body').mCustomScrollbar("disable", true);
			var windowSizeX = $('#cellmap_wrap').width();
			var windowSizeY = $('body').height();
			$wrap
//			.height(windowSizeY-100)
//			.height(windowSizeY-50) // 2013-05-21 add to hide footer 
			.height(windowSizeY) // 2013-06-03 add to hide footer 
			.width(windowSizeX*2)
			.css('minHeight' , 430)
			.animate({
				'left': -$tl.width()
			},DURATION, EASING, function() {
				base.currentScreen = 'cellmap';
				//$(window).scrollTop(0);

			});

			$('#footer').hide(); // 2013-05-21 add to hide footer 
			if ($('.section_topicview').length > 0) {
				$('.positionFixElem').animate({
					'left': -$tl.width()
				}, DURATION, EASING);
			};

			
			cz.Config.screen = 'CELLMAP';
			
//			position fixed로 바꿀 경우
//			$('#wrapCellMap').animate({
//				'right':  0
//			})
		}

		this.moveToTimeline = function(_callback) {		
			$('body').mCustomScrollbar("update");
			if ($('.topicTopWrap').length > 0) {
				$('.topicTopWrap').show();
			} else {
				var $section_create = $('.section_create')
				if(url === 'group'){//todo : me page가 아니면 실행..
					$section_create.addClass('section_create2');
//				$('#contentsWrap .section_timeline').prepend($section_create);
					$('.section_timeline').prepend($section_create);
				}else if(url === 'user'){
					$section_create.hide();
				}else{
					$('#timeline_wrap').prepend($section_create);
				}
			}
			
			$('#cellMapNavi').css({
				top: 0
			});
			
			$wrap.height('auto').css({
				minHeight : 'auto'
			});
			
			if ($('.section_topicview').length > 0) {
				$('.topicTopMenu, .topicTop').animate({
					'left': 0
				}, DURATION, EASING);
				$('.section_topicview').animate({
					'left': '50%'
				}, DURATION, EASING);
			};
			$wrap.animate({
				'left': 0
			},DURATION, EASING, function() {
				base.currentScreen = 'timeline';
				//$('#cellmap_wrap .tnc_inner').hide();
				_callback();

				$('#footer').show(); // 2013-05-21 add to hide footer
			});
			cz.Config.screen = 'TIMELINE';
//			position fixed로 바꿀 경우
//			$('#wrapCellMap').animate({
//				'right':  -$tl.width()
//			})
		}
		this.showLoader = function() {
		}
		this.initalize();
	}
})(jQuery, Cellz, window);