/**
 * $obj		: 이름을 담고 있는 $('<strong><strong>')을 줘야 합니다
 * userId	: 해당 userId
 * 
 * userId가 나이면 follow 버튼 안보입니다
 * userId가 undefined면 내 nameCard가 보입니다
 */
$.util_nameCard = function($obj, userId, doScroll){
	var $nameCard = $('#nameCardTemp').clone().attr('id','nameCard')
	, $img = undefined
	, $btn = undefined
	, $div = undefined
	, $thm = undefined
	;
	$.ajax({
		url: Cellz.API_URL.ME.PROFILE,
		sync: false,
		type: 'GET',
		data: {
			'userId': userId
		},
		success: function(result){
			if(result.result_code != '1'){
				return;
			}else{			
				if(result.data.profileImage && result.data.profileImage != ''){
					$img = $('<img width="54" height="54" alt=""></img>').attr('src', Cellz.API_URL.FILE.THUMBNAIL + result.data.profileImage + '&h=54&w=54');
				}else{
					$img = $('<img width="54" height="54" alt=""></img>').attr('src', APPLICATION_CONTEXT + 'resources/images/no_img54.gif');
				}
				
				$thm = $('<div class="thm_area"></div>')
				.css('margin-top','1px') //cellz_varication.css 때문에 8px 생기는거  1px로 되돌림
				.append($('<a href="#"></a>')
					.click(function(event){
						event.preventDefault();
						$.util_pageMover.moveToMe(result.data.userId);
					})
					.append($img)
					.append($('<span class="mask"></span>')));
				
				if(result.data.userId == $('#gnbProfileImage').attr('userId')){
					$nameCard
						.addClass('layer_info2')
						.addClass('line2');
					$btn = undefined;
					$div = undefined;
					$thm.css({'margin-top': '-34px'});
				}else{
					$nameCard.removeClass('layer_info2');
					$nameCard.removeClass('line2');
					$div = $('<div class="btn_area2"></div>');
					if(result.data.following){
						$btn = $('<a href="#"></a>').addClass('btn_following').html('following');
					}else{
						$btn = $('<a href="#"></a>').addClass('btn_follow').html('follow');
					}
					$btn.attr('following', result.data.following)
						.on({
							'mouseover': function(){
								if($(this).attr('following') == 'true'){
									$(this).removeClass('btn_following')
										.addClass('btn_unfollow')
										.html('Unfollow');
								} 
							},
							'mouseout': function(){
								if($(this).attr('following') == 'true'){
									$(this).removeClass('btn_unfollow')
										.addClass('btn_following')
										.html('Following');
								}
							},
							'click': function(e){
								e.preventDefault();
								var $this = $(this)
									, actionUrl = ""
									;
								if($this.hasClass('btn_unfollow')){
									actionUrl = Cellz.API_URL.ME.UNFOLLOW;
								}else if($this.hasClass('btn_follow')){
									actionUrl = Cellz.API_URL.ME.FOLLOW;
								}
								$.ajax({
									url: actionUrl,
									type: 'POST',
									async: false,
									data: {
										'followingUserId': result.data.userId
									},
									success: function(result) {
										if(result.result_code != '1') {
											return;
										} else {
											if($this.hasClass('btn_unfollow')){
												$this.removeClass('btn_unfollow')
													.removeClass('btn_following')
													.addClass('btn_follow')
													.html('Follow')
													.attr('following', false);
											}else if($this.hasClass('btn_follow')){
												$this
													.removeClass('btn_follow')
													.removeClass('btn_unfollow')
													.addClass('btn_following')
													.html('Following')
													.attr('following', true);
											}
										}
									}
								});
							}
						});
					$div
	//					.append($('<a href="#" class="btn_send">보내기</a>'))
						.append($btn)
	//					.append($('<a href="#" class="btn_msg">Message</a>'))
						;
				}
				
				$nameCard.empty()
					.append($thm)
					.append($('<div class="people_info"></div>')
							.append($('<strong></strong>')
									.append($('<a href="#"></a>')
										.text(result.data.name + ((result.data.positionName)?(' ' + result.data.positionName):''))
										.click(function(event){
											event.preventDefault();
											$.util_pageMover.moveToMe(result.data.userId);
										})))
							.append($('<span></span>')
									.text(result.data.deptName)
									.css('cursor','pointer')
									.click(function(event){
										event.preventDefault();
										$.util_pageMover.moveToDept(result.data.deptCode);
									}))
//							.append($('<span class="bar">|</span>'))
//							.append($('<span>플러스엑스</span>'))
							)
					.append($div
							)
					.append($('<span class="arr"></span>'))
					;
				
			}
		}
	});


	if(doScroll){
		$obj.parent().parent()
			.append($nameCard
					.css({
						top: 42
						, left: 65
						, position: 'absolute'
						, 'z-index': '900'})
					.show("fast"));
	}else{
		$('#nameCardTemp').parent().append($nameCard);
		$nameCard.css({
		'z-index': '900',
		top: $obj.offset().top + 24,
		left: $obj.offset().left, 
		position: 'absolute'
		}).show("fast");
	}
	
	$(document).mousedown(function(e){
		if( $('#nameCard').css('display') == 'block' ) {
			var l_position = $('#nameCard').offset();
			l_position.right = parseInt(l_position.left) + parseInt($('#nameCard').width());
			l_position.bottom = parseInt(l_position.top) + parseInt($('#nameCard').height()) + 15; //layer가 작아서 15 더함
			if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
					&& ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) ){//popup in click
			}else{//popup out click
				$('#nameCard').empty().hide("fast");
				$('#nameCard').remove();
			}
		}
	}); 
};