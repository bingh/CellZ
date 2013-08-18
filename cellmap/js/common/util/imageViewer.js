(function($, cz, w) {

	$(document).on('click', '.imageViewer .btnImage', function(e){
		e.preventDefault();
		e.stopPropagation();
		var $imgGroup = $(this).parents('.img_group')
		,	idx = $imgGroup.find('.btnImage').index($(this));
		$.imageViewer($imgGroup, idx);
	});
	
	$.imageViewer = function(_$elem, _idx) {
		var $imgGroup = _$elem.clone()
		,	$dialog = $('#multiImageView').clone().appendTo('body')
		,	viewerInit = function(slider) {
			slider.$controls.css('top',slider.$currentPage.find('.btnImageWrap').height() + 200);
			slider.$back.css('top',(slider.$currentPage.find('.btnImageWrap').height() + 300) / 2);
			slider.$forward.css('top',(slider.$currentPage.find('.btnImageWrap').height() + 300) / 2);
			
			(slider.currentPage === slider.$items.length) ? slider.$forward.hide() : slider.$forward.show();
			(slider.currentPage === 1) ? slider.$back.hide() : slider.$back.show();
		};
		$imgGroup.find('li').each(function() {
			if ($(this).attr('auth').indexOf('tx_box') != -1) { //권한이 없거나 삭제된 이미지는 제거
				$(this).remove();
			}
			$(this).find('.btnImageWrap').css({
				height: $(w).height() - 150, //title height
				width: $(w).width() - 200 
			});
		});
		$imgGroup.removeClass('imageViewer'); //이미지뷰어 중복실행방지
		//$('body').css('overflow-y', 'hidden');
		$dialog.dialog({
			width: $(w).width() - 50,
			position: {
				my: 'left top',
				at: 'left top'
			},
			dialogClass: 'multiImageViewDialog',
			modal: true,
			open: function() {
				$("body").mCustomScrollbar("disable");
				var arrImgSrc = []
				,	$overlay = $('.ui-widget-overlay')
				,	$slider = $('<div id="slider"  />');
				$imgGroup.find('li').each(function() {
					var $innerSection = $(this).find('.imgInnerSection')
					,	$img = $(this).find('.btnImage img')
					,	$imgBig = $('<img />')
					,	$loader = $('<img src="/resources/images/image-loader.gif" class="imageLoader" />')
					,	fileName = $img.attr('file_name')
					,	w = $(this).find('.btnImageWrap').width()
					,	h = $(this).find('.btnImageWrap').height()
					,	$title = $(this).find('.imgTitle .fileTitle');
					;
//					arrImgSrc.push(API_VERSION+'file/thumbnail?fname='+fileName+'&h='+h+'&w='+w+'&crop=true');
					$img.hide();
					$loader.appendTo($innerSection);
					$imgBig.attr('src',API_VERSION+'file/thumbnail?fname='+fileName+'&w='+w+'&isMax=true');
					$imgBig.hide();
					$imgBig.load(function() {
						$img.after($imgBig);
						$imgBig.fadeIn('normal');
						$img.remove();
						$loader.remove();
					});
					
					$title.after($(this).find('.img_ln'));
					
					//포커스 이동 방지
					$(this).find('.btnImage').click(function(e) {
						e.preventDefault();
					});
				});
				
				$overlay.css({
					background: '#000',
					opacity: 0.86
				});
				$slider.css({
					width: $(w).width() - 50,
					height: $(w).height()
				})
				$slider.appendTo($dialog).html($imgGroup);
				
				$imgGroup.anythingSlider({
					buildArrows: true,
					buildNavigation: false,
					buildStartStop: false,
					enableArrows: true,
					enableNavigation: true,
					expand: true,
					hashTags: false,
					infiniteSlides: false,
					startPanel: _idx+1,
					enableKeyboard: false,
					navigationFormatter : function(i, panel){ // add thumbnails as navigation links
						return '<img src="'+arrImgSrc[i - 1]+'"><span class="mask"></span>';
					},
					onInitialized: function(e, slider) {
						viewerInit(slider);
					},
					onSlideInit: function(e, slider) {
						viewerInit(slider);
					},
					onSlideComplete: function(slider) {
						viewerInit(slider);
					}
				});
				$dialog.find('.btnClose').click(function(e) {
					e.preventDefault();
					$dialog.dialog('close').dialog('destroy');
					$dialog.remove();
				});
			},
			close: function() {
				$("body").mCustomScrollbar("update");
				//$('body').css('overflow-y', 'scroll');
				$dialog.dialog('destroy');
				$dialog.remove();
			}
		});
		$dialog.dialog('open');
	}
})(jQuery, Cellz, window);