/**
 * $obj		: count을 담고 있는 $('<span></span>')을 줘야 합니다
 * gubun	: fileFollower
 * param	: fname
 * 
 */
$.util_peopleList = {
	'offsetTime': undefined
	, 'isShow': function($obj){
		var ll_position = $obj.offset();

		ll_position.right = parseInt(ll_position.left) + parseInt($obj.width()) + 1;
		ll_position.bottom = parseInt(ll_position.top) + parseInt($obj.height());
		
		if( ( ll_position.left <= e.pageX && e.pageX <= ll_position.right )
				&& ( ll_position.top <= e.pageY && e.pageY <= ll_position.bottom ) ){
			console.log('click: number');
			return true;
		}
	}
	, 'show':	function($obj, gubun, param){
		var $this = this 
		, $list = $('#peopleList')
		, $ul= $('<ul></ul>')
		, $more = undefined
		, ajaxUrl = ''
		, ajaxType = 'POST'
		, ajaxData = undefined
		;
	
		//count check
		if(Number($obj.html()) < 1 ){
			return;
		}
		
		//gubun
		switch(gubun){
		case 'fileFollower':
			ajaxUrl = Cellz.API_URL.FILE.FOLLOWERLIST;
			ajaxType = 'POST';
			ajaxData = {
				'fname': param,
				'size': 10
			};
			break;
		default:
			break;
		}
		$.ajax({
			url: ajaxUrl,
			sync: false,
			cache: false,
			type: ajaxType,
			data: ajaxData,
			success: function(result){
				if(result.result_code != '1'){
					alert('error: peopleList');
				}else{
					if(result.data != undefined){
						if(result.data.total < 1){
							return;
						}else if(result.data.total > 10){
							$more = $('<div class="more_view"></div>')
									.append($('<span class="tx">더보기</span>'))
									.css({
										'cursor': 'pointer'
									})
									.click(function(event){
										event.preventDefault();
										console.log($this.offsetTime);
										$ul.addClass('num_over');
										ajaxData = {
												'fname': param,
												'size': 10,
												'offset': $this.offsetTime || undefined
											};
										$.ajax({
											url: ajaxUrl,
											sync: false,
											cache: false,
											type: ajaxType,
											data: ajaxData,
											success: function(result){
												if(result.result_code != '1'){
													alert('error: peopleList more');
												}else{
													if(result.data != undefined){
														$this.printPeople($ul, result.data.follower);
														//더이상 없으면 more 버튼 삭제
														if($ul.find('li').length >= result.data.total){
															$('.more_view').hide();
														}
													}
												}
											}
										});
									});
						}
						
						$ul = $this.printPeople($ul, result.data.follower);
						
						$list
							.append($('<div class="ly_tit"></div>')
									.html('<strong>'+ result.data.total +'</strong>&nbsp;People'))
							.append($ul)
							.append($more)
							.append($('<a href="#" class="clse">레이어 닫기</a>')
									.click(function(event){
										event.preventDefault();
										$('#peopleList').empty().hide();
									}))
							.append($('<span class="arr"></span>'))
							;
					}
				}
			}
		});
	
		$list.css({
			top: $obj.offset().top + 20,
			left: $obj.offset().left - 19,
			position: 'absolute'
		}).show();
		
		$(document).mousedown(function(e){
			if( $('#peopleList').css('display') == 'block' ) {
				var l_position = $('#peopleList').offset()
//				, ll_position = $obj.offset()
				;
				l_position.right = parseInt(l_position.left) + parseInt($('#peopleList').width());
				l_position.bottom = parseInt(l_position.top) + parseInt($('#peopleList').height());
//				ll_position.right = parseInt(ll_position.left) + parseInt($obj.width()) + 1;
//				ll_position.bottom = parseInt(ll_position.top) + parseInt($obj.height());
//				
//				console.log(ll_position.left + '<=' + e.pageX);
//				console.log(e.pageX + '<=' + ll_position.right);
//				console.log(ll_position.top + '<=' + e.pageY);
//				console.log(e.pageY + '<=' + ll_position.bottom);
				if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
						&& ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) ){//popup in click
//				}else if( ( ll_position.left <= e.pageX && e.pageX <= ll_position.right )
//						&& ( ll_position.top <= e.pageY && e.pageY <= ll_position.bottom ) ){
//					console.log('click: number');
				}else{//popup out click
					$('#peopleList').empty().hide();
				}
			}
		});
	}
	, 'printPeople': function($ul, data){
		var $this = this;
		for(var i = 0; i < data.length ; i++){
			var people = data[i] 
			, $li = $('<li></li>')
			, $img
			;
			
			if(people.profileImage && people.profileImage != ''){
				$img = $('<img width="22" height="22" alt=""></img>')
						.attr('src', Cellz.API_URL.FILE.THUMBNAIL + people.profileImage + '&w=22&h=22')
						;
			}else{
				$img = $('<img width="22" height="22" alt="" class="no_img"></img>')
						.attr('src', APPLICATION_CONTEXT + 'resources/images/img_noimg22.png');
			}
			
			$li
				.data('userId', people.userId)
				.data('deptCode', people.deptCode)
				.append($('<div class="img_area" style="cursor:pointer"></div>')
						.append($img)
						.append('<span class="mask"></span>')
						.click(function(event){
							event.preventDefault();
							$.util_pageMover.moveToMe($(this).parent().data('userId'));
						}))
				.append($('<div class="people_info"></div>')
						.append($('<strong style="cursor:pointer"></strong>')
									.html(people.name + ' ' + people.positionName)
									.click(function(event){
										event.preventDefault();
										$.util_nameCard($(this), $(this).parent().parent().data('userId'));
									}))
						.append($('<span></span>')
								.html(people.deptName)
								.click(function(event){
									event.preventDefault();
									//TODO: 나중에 그룹 매거진 생기면 그룹으로 이동 style="cursor:pointer" 추가
//									$.util_pageMover.moveToDept($(this).parent().parent().data('deptCode'));
								})))
				;
			$ul.append($li);
			$this.offsetTime = people.offsetTime;
		}
		return $ul;
	}
};