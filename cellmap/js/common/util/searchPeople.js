$.util_treeAboutOrg = {
	'$area': undefined
	, '$original': undefined
	, 'init': function(_$obj, _$original){
		var $this = this
		;
		
		//기본 세팅
		$this.$area = _$obj;
		$this.$original = _$original;
		
		//tree 그리기
		$this.makeTree();
	}
	, 'makeTree': function(_deptCode){
		var $this = this
		, $area = $this.$area
		, companyCode = 'C60'
		, companyName = '삼성 SDS'
		, deptCode = _deptCode || 'TOP'
		, $tree = undefined
		;

		$tree = $('<ul class="lst_chart" id="tree_menu"></ul>')
			.data('companyCode',companyCode)
			.append($('<li></li>')
					.addClass('closed')
					.append($('<a href="#"></a>')
							.attr('id',deptCode)
							.data('deptCode',deptCode)
							.text(companyName)
							.prepend($('<span></span>').addClass('ico_minus'))
							.click(function(event){
								event.preventDefault();
								$this.getOrgMember(companyCode, $(this).data('deptCode'), $(this).html());
								if(($(this).parent().find('ul').length < 1)){
									$this.getOrgList(companyCode, $(this).data('deptCode'));
								}
									var temp_el = $(this).parent().find('>ul');
									if (temp_el.css('display') == 'none'){
										temp_el.slideDown(100);
										$(this).parent().removeClass('closed');
										$(this).find('span').removeClass('ico_minus').addClass('ico_plus');
										return false;
									} else {
										temp_el.slideUp(100);
										$(this).parent().addClass('closed');
										$(this).find('span').removeClass('ico_plus').addClass('ico_minus');
										return false;
									}
								
							})
					)
				)
				;

		$area.find('#orgSearchResultOrgList').empty().append($tree);
		
		//1depth open
		$('#'+deptCode).click();
		$area.find('#orgSearchResultMemberList').empty().append($('<p class="no_result"></p>').text($.util_message.search.pleaseSelectOrg));
	}
	, 'setTree': function(companyCode, deptCode, data, _groupId){
		var $this = this
		, $obj = $('#'+deptCode)
		, $ul = $('<ul></ul>')
		;
		
		for(var i = 0; i < data.length ; i++){
			var $a = undefined
			, $li = $('<li></li>')
			;
			
			if(data[i].lowdept == 'T'){

				$li.addClass('closed');
				$a = $('<a href="#"></a>')
						.attr('id', data[i].deptCode)
						.data('deptCode', data[i].deptCode)
						.html(data[i].deptName)
						.prepend($('<span></span>').addClass('ico_minus'))
						.click(function(event){
							event.preventDefault();
							$this.getOrgMember(companyCode, $(this).data('deptCode'), $(this).html(), _groupId);
							
							if(($(this).parent().find('ul').length < 1)){
								$this.getOrgList(companyCode, $(this).data('deptCode'), _groupId);
							}
								var temp_el = $(this).parent().find('>ul');
								if (temp_el.css('display') == 'none'){
									temp_el.slideDown(100);
									$(this).parent().removeClass('closed');
									$(this).find('span').removeClass('ico_minus').addClass('ico_plus');
									return false;
								} else {
									temp_el.slideUp(100);
									$(this).parent().addClass('closed');
									$(this).find('span').removeClass('ico_plus').addClass('ico_minus');
									return false;
								}
							
						})
						;
			}else{
				$a = $('<a href="#"></a> ')
				.attr('id', data[i].deptCode)
				.data('deptCode', data[i].deptCode)
				.text(data[i].deptName)
				.click(function(event){
					event.preventDefault();
					$this.getOrgMember(companyCode, $(this).data('deptCode'), $(this).html(), _groupId);
				})
				;
			}
			$li.append($a);
			$ul.append($li).hide();
		}
		$obj.parent().append($ul);		
	}
	, 'getOrgList': function(_companyCode, _deptCode, _groupId){
		var $this = this;
		$.ajax({
			url: Cellz.API_URL.GROUP.GETCHILDRENORG,
			async: false,
			type: 'POST',
			timeout: 10000,
			cache: false,
			data: {
				'companyCode': _companyCode,
				'deptCode': _deptCode
			},
			success: function(result){
				if(result.result_code != '1'){
					return;
				}else{
					if(result.data.length > 0){
						//dept sorting
						var sortedResult = result.data.sort(function(a, b) {
					    	a = Number(a.deptOrder),
					        b = Number(b.deptOrder);
//						    	return a.localeCompare(b);
					    	return a-b;
					    });
						$this.setTree(_companyCode, _deptCode, sortedResult, _groupId);
					}else{
						return;
					}
				}
			}
		});
	}
	, 'getOrgMember': function(_companyCode, _deptCode, _deptName, _groupId){
		var $this = this;
		$.ajax({
			url: Cellz.API_URL.GROUP.GETORGMEMBER,
			timeout: 10000,
			cache: false,
			async: false,
			type: 'POST',
			data: {
				'companyCode': _companyCode,
				'deptCode': _deptCode
			},
			success: function(result){
				if(result.result_code != '1'){
					$this.noOrgPeople($.util_message.search.error);
					return;
				}else{
					if(result.data.length > 0){
						//sorting
						var sortedResult = result.data.sort(function(a,b){
//								return [a.positionCode, a.name] < [b.positionCode, b.name] ? -1 : 1;
							
							//IE9에서 안되서 localeCompare로 변경
							if((a.positionCode).localeCompare(b.positionCode) == -1){
								return -1;
							}else if((a.positionCode).localeCompare(b.positionCode) == 1){
								return 1;
							}else if((a.name).localeCompare(b.name) == -1){
								return -1;
							}else if((a.name).localeCompare(b.name) == 1){
								return 1;
							}else{
								return 0;
							}
						});
						$this.printOrgMember(sortedResult, _groupId, _deptName);
					}else{
						$this.noOrgPeople($.util_message.search.noSearchResult);
						return;
					}
				}
			}
		});
	}
	, 'printOrgMember': function(data, _groupId, _deptName){
		var $this = this 
		, $area = $this.$area
		, $li = $('<li></li>')
					.addClass('title')
					.append($('<span></span>').addClass('th3_1').text('성명'))
					.append($('<span></span>').addClass('th3_2').text('직급'))
					.append($('<span></span>').addClass('th3_3').text('이메일'))
					//.append($('<span></span>').addClass('th3_4').text('휴대폰'))
		, $ul = $('<ul></ul>').addClass("lst_result_member").append($li)
		, $div = $('<div class="group_name_area"></div>')
				.append($('<a href="#"></a>')
						.html('<span class="ico_check"></span>' + _deptName)
						.click(function(event){
							event.preventDefault();
							if($(this).hasClass('on')){
								$(this).removeClass('on');
								$area.find('#orgSearchResultMemberList li[name=selected]:not(.title)').removeClass('on').attr('name','');
							}else{
								$(this).addClass('on');
								$area.find('#orgSearchResultMemberList li:not(.title)').addClass('on').attr('name','selected');
							}
							
							$this.$original.checkEnableAddbtn();
						}))
		;
		
		for(var i =0; i < data.length ; i++){
			$li = $('<li></li>')
					.data('param', {
						'gubun': 'user'
						, 'epId': data[i].epId
						, 'userId': undefined
						, 'name': data[i].name
						, 'positionName': data[i].positionName
						, 'deptName': data[i].deptName
						, 'groupIds': data[i].groupIds
						, 'companyIds': data[i].companyIds
					})
					.attr('epId', data[i].epId)
					.attr('name', '')
					.append($('<a></a>')
							.append($('<span></span>').addClass('th3_1').html('<span class="ico_check"></span>'+data[i].name))
							.append($('<span></span>').addClass('th3_2').text(data[i].positionName))
							.append($('<span></span>').addClass('th3_3').text(data[i].email))
							//.append($('<span></span>').addClass('th3_4').text(data[i].cellPhone))
							)
					.on({
						'dblclick': function(event){
							event.preventDefault();
							
							$(this).removeClass('on')
								.attr('name', '');
							
							$this.$original.selectMember($(this).data('param'));
						}
						, 'click': function(event){
							event.preventDefault();
							if($(this).hasClass('on')){
								$(this).removeClass('on')
								.attr('name', '');
							}else{
								$(this).addClass('on')
								.attr('name', 'selected');
							}

							// 전체 선택시 그룹 선택
							if($area.find('#orgSearchResultMemberList li[name=selected]:not(.title)').length == $area.find('#orgSearchResultMemberList li:not(.title)').length){
								$area.find('#orgSearchResultMemberList .group_name_area a').addClass('on');
							}else{
								$area.find('#orgSearchResultMemberList .group_name_area a').removeClass('on');
							}
							
							$this.$original.checkEnableAddbtn();
						}
					})
					;
			$ul.append($li);
		}

		$area.find('#orgSearchResultMemberList').empty().append($div).append($ul);
	}
	, 'noOrgPeople': function(message){
		var $this = this
		, $area = $this.$area
		;
		$area.find('#orgSearchResultMemberList').empty().append($('<p class="no_result"></p>').text(message));
	}
};

$.util_instantSearch = {
	'$area': undefined
	, '$original': undefined
	, 'init': function($obj, $original){
		var $this = this
		;

		//기본 세팅
		$this.$area = $obj;
		$this.$original = $original;
		
		$this.setSearch();
	}
	, 'setSearch': function(){
		var $this = this
		, $area = $this.$area
		, _hangle =  /ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅇ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ|ㄲ|ㄸ|ㅆ|ㅃ|ㅉ/
		, _hangle2 =  /ㅏ|ㅑ|ㅓ|ㅕ|ㅗ|ㅛ|ㅜ|ㅠ|ㅡ|ㅣ/
		, _hangleCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]||[0-9a-z]/
		, _emailCheck =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
		, _searchType = 'name'
		;
		
		$area.find('#searchMemberTxt').on({
			'keyup': function(event){
				var _name = $.trim($area.find('#searchMemberTxt').val());

				if(!_name || _name == ''){
					$area.find('#searchResultList').empty().addClass('displayNone');
					$this.noPeople();
					return;
				}
				
				if (event.which == 32) { //32 : space
				}else if (event.which == 38 || event.which == 40) {  // 38 : up, 40 : down
					$this.choosePeople(event.which);
					return false;
				}else if (event.which == 13) {	// 13 : enter
					// poeple list 중 선택된 사람 있으면 추가
					if($area.find('#searchResultList li.selected').length == 1){ 
						$area.find('#searchResultList li.selected').click();
					}else{
						$area.find('#searchResultList').empty().addClass('displayNone');
						if(!!_name && _emailCheck.test(_name)){
							_searchType = 'email';
						}
						$this.getEsbSearchMember(_name, _searchType);
					}
				}else{ //순간검색
					if(!!_name && _name.search(_hangle) == -1 && _name.search(_hangle2) == -1 && _hangleCheck.test(_name)){
						$this.getNameTag(_name);
					}else{
						$this.noPeople();
					}
				}
			}
		});		

		$area.find('.btn_search').click(function(event){
			event.preventDefault();
			$area.find('#searchResultList').empty().addClass('displayNone');
			var _name = $.trim($area.find('#searchMemberTxt').val());

			if(!_name || _name == ''){
				$area.find('#searchResultList').empty().addClass('displayNone');
				$this.noPeople();
				return;
			}
			if(!!_name && _emailCheck.test(_name)){
				_searchType = 'email';
			}
			$this.getEsbSearchMember(_name, _searchType);
			
		});
	}
	, 'getNameTag': function(_name, _email){
		var $this = this
		;

		$.ajax({
			url : Cellz.API_URL.SOMETHING.NAME	
			, type: 'GET'
			, async: true
			, timeout : 10000
			, dataType: 'JSON'
			, data: {
				'name': _name,
				'email': _email
			}
			, beforeSend: function(xhr) {
			}
			, error: function(data, status, err) {
				if (status == 'timeout') {
					alert('시간이 초과 하였습니다.');
				}
			}
			, success: function(result) {
				if(result.result_code != '1'){
					$this.noPeople();
				}else{
					if (undefined !== result.data.user && result.data.user.length > 0) {
						$this.showPeople(result.data.user);
					}else if(result.data.user.length == 0){
						$this.noPeople();
					}
				}
			}
		});	// $.ajax({
	}
	,'showPeople' : function(data){	// ajax call, show peopleList's Div
		var $this = this
		, $area = $this.$area
		, $ul = $('<ul/>').addClass('lst')
		, $li
		, $img
		, $a
		, str = ''
		;
		for (var i=0; i < data.length ; i++ ) {		
			str = APPLICATION_CONTEXT + 'resources/images/img_noimg_timeline.png';
			if(data[i].profileImage && data[i].profileImage != ''){
				str =  Cellz.API_URL.FILE.THUMBNAIL + data[i].profileImage + '&w=22&h=22';
			}
			$img = $('<img></img>')
					.attr('src', str)
					.attr('width', 22)
					.attr('height', 22);
			$a = $('<a/>').attr('href','#')
					.append($('<span/>').addClass('thmb')
						.append($img)
					.append($('<span></span>')
							.addClass('mask')))
					.append($('<strong/>').addClass('u_name').html(data[i].name + ' ' + ((data[i].positionName)?data[i].positionName:'')))
					.append($('<span/>').addClass('u_info')
						.append($('<span/>').html(data[i].mainCompany.companyName))
						.append($('<span/>').addClass('bar').html(' | '))
						.append($('<span/>').html(data[i].deptGroup.deptName)));
			$li = $('<li/>')
					.append($a)
//					.data('id',data[i].userId)
					.data('param', {
						'gubun': 'user'
						, 'epId': undefined
						, 'userId': data[i].userId
						, 'name': data[i].name
						, 'positionName': data[i].positionName
						, 'deptName': data[i].deptGroup.deptName
						, 'groupIds': data[i].groupIds
						, 'companyIds': data[i].companyIds
					})
					.bind({
						'click':function(event){
							event.preventDefault();
							var _userId = $(this).data('id')
							;
							if($this.checkMemberInSelectedMemberArea(_userId)){
								$this.$original.selectMember($(this).data('param'));
							}
							$area.find('#searchResultList').empty().addClass('displayNone');
							$area.find('#searchMemberTxt').val('');
						}
						, 'mouseover': function(evemt){
							$(this).parent().find('li.selected').removeClass('selected');
							$(this).addClass('selected mover');
						}
						, 'mouseout': function(evemt){
							$(this).removeClass('selected mover');
						}
					});
			$ul.append($li);
		}
		$area.find('#searchResultList')
			.empty()
			.removeClass('displayNone')
			.append($ul)
			;			
		
		// group member invitation 일때 recomment area 영역이 가변적이라 갯수에 따라 top 지정함.
		if($area.find('#recommendMemberList').length > 0){
			if($area.find('#recommendMemberList li').length > 3){
				$area.find('#searchResultList').css({
					top: 252
				});
			}else if($area.find('#recommendMemberList li').length > 0){
				$area.find('#searchResultList').css({
					top: 195
				});
			}else{ //0
				$area.find('#searchResultList').css({
					top: 138
				});
			}
		}
	}
	, 'getEsbSearchMember': function(_searchStr, _searchType){
		var $this = this;
		$.ajax({
			url: Cellz.API_URL.GROUP.ESBSEARCH,
			type: 'POST',
			async: false,
			data: {
				'searchvalue': _searchStr,
				'searchtype': _searchType
			},
			success: function(result){
				if(result.result_code != '1'){
					$this.$original.noEsbPeople($.util_message.search.error);
					return;
				}else{
					if(result.data.length > 0){
						$this.$original.printEsbSearchMember(result.data);
					}else{
						$this.$original.noEsbPeople($.util_message.search.noSearchResult);
					}
				}
			}
		});
	}
	, 'checkMemberInSelectedMemberArea': function(_userId){
		var $this = this
		, $area = $this.$area
		, result = true
		; //추가가능
		
		$area.find('#selectedMemberArea').find('li').each(function(){
			var $li = $(this);
			if($li.data('userId') == _userId){
				result = false; //추가 못함. 이미존재 해서
				//$.util_notice($('#content'), '이미 선택된 User입니다.');
			}
		});
		return result;
	} 
	, 'noPeople': function(){
		var $this = this
		, $area = $this.$area
		;
		
		$area.find('#searchResultList').empty().append($('<p></p>').text($.util_message.search.noSearchResult));
	} 
	, 'noEsbPeople': function(){
		var $this = this
		, $area = $this.$area
		;
		
		$area.find('#ebsSearchResultList').empty().parent().show();
		$area.find('#peopleSearch').next().next().show();
		$area.find('#ebsSearchResultList').empty().append($('<p class="no_result"></p>').text($.util_message.search.noSearchResult));
	}
	, 'choosePeople' : function(key){
		var $this = this
		, $area = $this.$area
		, $poeple = $area.find('#searchResultList')
		, $li = $poeple.find('li')
		, isMouseover = ($poeple.find('li.mover').length > 0)?true:false
		, isSelected = ($poeple.find('li.selected').length > 0)?true:false
		, KEY = { down : 40, up : 38}
		, i
		, ii = $li.length
		, pivot = undefined
		, next = undefined
		, _scrollTop = 0
		, $SCROLLBASE			= 2		// nameTag 에서 scroll 없이 나오는 개수의 index 값 0, 1, 2, 3, 4 => 5개
		, $SCROLLHEIGHT			= 44	// nameTag 에서 li 의 height
		;

		if (isMouseover){
			// mouseover로 select 상태일떄는 방향키 못움직임
			return;
		}else if (!isSelected) {
			if (key == KEY.down) {
				$poeple.find('li:first').addClass('selected');
				$poeple.find('li:first').find('a').toggleClass('mouseover_peoplelist');
			}
		} else {					
			// find cellz_name_selected
			if (key == KEY.down || key == KEY.up) {
				for (i=0;i<ii ;i++ ) {
					if ($($li[i]).hasClass('selected')) {
						pivot = i;
						break;
					}
				}
				if (key == KEY.down && pivot == ii -1 ) {
					return;
				}
				if (key == KEY.up && pivot == 0 ) {
					return;
				}
				if (key == KEY.down && pivot < ii-1) {
					next = 	pivot + 1;
				}
				if (key == KEY.up && pivot>=0) {							
					next = pivot - 1;
				}
				if (next !== undefined) {
					_scrollTop = next - $SCROLLBASE;
					_scrollTop = _scrollTop > 0 ? _scrollTop : 0;
					$poeple.scrollTop(_scrollTop * $SCROLLHEIGHT);
	
					for (i=0;i<ii ;i++ ) {
						if (i===pivot) {
							$($li[i]).removeClass('selected');
							$($li[i]).find('a').toggleClass('mouseover_peoplelist');
						}
						if (i===next) {
							$($li[i]).addClass('selected');
							$($li[i]).find('a').toggleClass('mouseover_peoplelist');
						}
					}
				}
			}	// if (key == KEY.down || key == KEY.up) {
		}	// if ($_selected.length === 0) {
	}	// choosePeople
};