/*
	jor4071
	2012-03-28 beta open
*/

(function ($) {

	var before$companyName		= $('div.inner_section #companyName').val()
		, before$companyNameEn	= $('div.inner_section #companyNameEn').val()
		, before$companyId		= $('div.inner_section #companyId').val()
		, companyName			= !!before$companyName ? before$companyName : !!before$companyNameEn ? before$companyNameEn : ''
		, before$group			= $('.group_wrap .tit_area h3').text()
//		, $First$Say			= !!before$group ? ('To .' +before$group ) : !!companyName ? ('To. ' + companyName ): 'Say Something ...'
		, $First$Say			= '이곳을 클릭하면 새로운 Topic을 작성할 수 있습니다.'
		, $group$List			= []
		
		, $bye					= '작성중이던 내용이 삭제 됩니다.  이동하시겠습니까?'		// 4071 : 2013-07-04

		, $First$Poll			= '질문을 입력하세요.'
		, $First$Vote			= '선택지를 입력하세요.'
		, $Height$Base			= 23
		, $Height$Cell			= '18px'
		, $Height$Poll			= '59px'

		, $CLIP$None			= '해당 URL의 정보가 제공되지 않습니다.'
		, $TIMEOUT$url			= 'URL clipping 검색 시간이 지연되어 강제 종료 하였습니다.'
		, $TIMEOUT$name			= 'People Tag 검색 시간이 지연되어 강제 종료 하였습니다.'
		, $MSG$created			= '새로운 Cell Map을 생성하였습니다.'
		, $MSG$file				= '등록 가능한 첨부 파일의 개수가 초과되었습니다'	//'파일은 '+Cellz.CONFIG.maxNumberOfFiles+'개까지 등록가능합니다.'
		, $MSG$other			= '"읽기"권한이 없는 사람을 언급하였습니다.'
		, $MSG$input			= '입력 가능한 길이를 초과 하셨습니다.'
		, $max$INPUT			= 5000

		, $user$ID				= $('#gnbProfileImage').attr('userId')
		, LEN$TITLE				= 30	// url clipping title length
		, LEN$CONG				= 100	// url clipping content length

		, color$Blur			= '#a0a0a0'
		, color$Focus			= ''

		, FistofTheFirstMen		= undefined

		, $SCROLLBASE			= 2		// nameTag 에서 scroll 없이 나오는 개수의 index 값 0, 1, 2, 3, 4 => 5개
		, $SCROLLHEIGHT			= 44	// nameTag 에서 li 의 height

		, $Map$Size				= 7		// 지도 검색 결과 페이지당 표시 개수

		, $company$ID			= 1
		, $url$Image			= '/api/v1/file/thumbnailFromUrl?url='

		, $map$delimeter		= '<BR>'

		, $time$DEFAULT			= 10000
		, $time$HALF			= 500		

		, $caret$ID				= '_caret'
		, $CORE$caret			= '<span id='+$caret$ID+'>&nbsp; </span>'
		, $LINE$empty			= _browserInfo_.chrome ? '<br>' : ''	// chrome <br>, others(ie) : ''

///////////// 4071 : 2013-05-09 START ////
//	create 영역에 사용자가 처음 마우스 커서를 click 했을때
//	내용을 div 로 $First$Base 초기화 하여
//	이후의 새로운 줄이 div 로 시작 되도록 한다.
//	ie, chrome 은 적용 되나.. ff의 경우는 <br>로 새로운 줄이 구분됨
//	(이후 ff 적용 필요)
//	추가 되는 내용이 처음줄과 같으므로 다른 이름으로 바꾸는 작업이 필요, enter 입력시 처리
//	name 같은것이 2개 있으면 마지막 나오는 name을 timeStamp를 이용해서 바꾸고..  caret 위치를 구하기 위해 
//	해당 이름을 저장 한다.

		, $BASE					= _browserInfo_.chrome ? 'div' : 'p'	// chrome div, others(ie) : p
		, $CONTENTEDITABLE		= _browserInfo_.ie ? 'true' : 'false'
		, $First$Name			= 'ens'
		, $First$Base			= '<'+$BASE+' name='+$First$Name+'>'+$CORE$caret+$LINE$empty+'</'+$BASE+'>'
		
		, $PANNEL$url			= 'urlPannel'
		, $PANNEL$map			= 'mapPannel'
 ///////////// 4071 : 2013-05-09 END ////
	
		, _charCode = function(c){
				return c.charCodeAt(0);
			}

		, KEY = {
				backSpace : 8
				, tab : 9
				, enter : 13
				, shift : 16
				, ctrl : 17
				, alt : 18
				, space : 32
				, pageUp : 33
				, pageDown : 34
				, end : 35
				, home : 36
				, left : 37
				, up : 38
				, right : 39
				, down : 40
				, insert : 45
				, del : 46
				, b : 66
				, c : 67
				, i : 73
				, u : 85
				, v : 86
				, chromeSpace : 160
				, ctrlDown : false
				, shiftDown : false
			}

		, namePrefix			= '@'	//@# @ 검색의 접두어
		, nameRegExp			= /^@/	//@# @ 검색 접두어 관련 정규식
		
		, _jaumMoum				= /[ㄱ-ㅎ|ㅏ-ㅣ]/	// 자음, 모음 만 확인 할 경우 ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅇ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ|ㄲ|ㄸ|ㅆ|ㅃ|ㅉ|ㅏ|ㅑ|ㅓ|ㅕ|ㅡ|ㅣ|ㅗ|ㅛ|ㅜ|ㅠ|ㅘ|ㅙ|ㅟ|	//@# @ 검색이 사용하는 자음, 모음 정규식
		, _hangleCheck			= /[가-힣]/	// 온전한 글자 [ㄱ-ㅎ|ㅏ-ㅣ|가-힣]	//@# @ 검색시 사용하는 한글 정규식

		, $findCellz			= $('#findCellz')	// fileUpload.jsp
		, $cellzArea			= $findCellz.find('#findCellzViewType')	//@# Recent, Following, 내파일, 공유 받은 파일 : 분류 탭	// fileUpload.jsp
		, $cellzTab				= $findCellz.find('#findCellzFileType')	//@# All, Open-Docs, Office, Image, Etc : 분류 탭	// fileUpload.jsp
		, $cellzResult			= $findCellz.find('#findCellzULResult')	//@# 'Cellz 에서 찾기' 결과 목록	// fileUpload.jsp
		, $resultTpl			= $findCellz.find('li[name=findCellzLiTpl]')	//@# 'Cellz 에서 찾기' 결과 template	// fileUpload.jsp
		, $cellNoResult			= $findCellz.find('div.result_box p.no_result')	//@# 'Cellz 에서 찾기' 결과 값 없을때 출력 문구	// fileUpload.jsp
		, $btnSearchCellz		= $findCellz.find('#findCellzBtnSearch')		//@# 'Cellz 에서 찾기' 검색 버튼	// fileUpload.jsp
		, $btnConfirmCellz		= $findCellz.find('#findCellzBtnConfirm')		//@# 'Cellz 에서 찾기' 확인 버튼	// fileUpload.jsp
		, $btnCancelCellz		= $findCellz.find('#findCellzBtnCancel')		//@# 'Cellz 에서 찾기' 취소 버튼	// fileUpload.jsp
		, $btnCloseCellz		= $findCellz.find('#findCellzBtnClose')		//@# 'Cellz 에서 찾기' 닫기 버튼	// fileUpload.jsp
		/* 2013-07-18 파일 순간검색 삽입  by 정호진  시작*/
		, $searchArea			= $findCellz.find('.input_wrap .input_area .input_txt')
		/* 끝*/
		, $findCellzDialog		= undefined

		, POLLMAXLENGTH			= 50
		, VOTEMAXLENGTH			= 50

		//$$  url clipping 의 content 를 일정 길이로 자른다.
		, con$scissors = function(kong, len){
			var _percentU = /%u/	// 
				, bong = ''
				, i				
				, c
				, l = 0	// 그냥 길이
				, k = 0	// 한글 길이
				;

			for (i=0; ;i++) {
				c = kong.substring(i, i+1);
				
				if (!c){
					break;
				}
				_percentU.test(escape(c)) && (k++);
				
				_charCode(c)===10 && (c = ' ');
				if (l >= len-3 && l <= len) {
					c = '.';
				}
				bong += c;
				l++;
				if (l===len){
					break;
				}
			}	
			return bong;
		}

		//$$  'cellz 에서 찾기' 해당 tab의 초기 안내 문구 출력(결과 없음) 
		, _cellzDefaultResult = function(name){	
			$cellNoResult.find('span').not('.disnone').addClass('disnone');
			
			if (!!name) {
				$cellNoResult.find('span[name='+name+']').removeClass('disnone');
			}
		}

///////////////////// 4071 : 2013-06-18 START 'Cellz 에서 찾기' 여러 탭에서 선택한 결과 적용을 위해서 ///////////////
		//$$  'Cellz 에서 찾기' cellzSearch 의 결과 출력
		, cellzShowResult = function(files, area, tab){	// 결과 출력
			var t = Cellz.some$thing.t
				, i
				, ii=files.length
				, j
				, x, xx, y
				, $clone
				, f	// a file
				, _checked
				, _p	// previous file list
				;
			if (t.cellzFileList[area] === undefined) {
				t.cellzFileList[area] = {};
			}

			if (t.cellzFileList[area][tab] === undefined ) {
				t.cellzFileList[area][tab] = files;	// 처음이니까 선택 된것(t.cellzSelected) 관리 필요 없음
			} else {	// 이전에 데이타를 가져온적이 있다.. 비교 처리 필요
				// 비교해서 처리 해야 함
				// 기존 데이타에 있고 새것에 있는것만 저장
				// 기존에 있었는데 없어졌다면.. 삭제하고 .. 선택된것도 삭제 처리
				_p = t.cellzFileList[area][tab];
				for (x=0, xx=_p.length;x<xx ;x++ ) {
					y = _p[x];
					y.same = false;	// 이전 결과 초기화
					for (i=0;i<ii ;i++ ) {
						j = files[i];
						// y, j 를 비교하고 없는것을 어떻게 할래 우선 같으면.. same = true;
						if (y.fileName === j.fileName) {
							y.same = true;
						}
					}
				}

				// A B C , A C D 일때 없는것 B는 선택 목록에서 지운다.
				for (x=0; x<xx ;x++ ){
					y = _p[x];
					if (!y.same) {						
						if (t.cellzSelected[y.fileName] !== undefined) {
							delete t.cellzSelected[y.fileName];
						}
					}
				}
			}

			// checked 는 t.cellzSelected 에 있는지 확인해서..
			for (i=0 ;i<ii ;i++ ) {
				$clone = $resultTpl.clone().removeClass('disnone');
				f = files[i];	// file info

				_checked = false;
				if (t.cellzSelected[f.fileName] !== undefined) {
					_checked = true;
				}
			
				$clone.attr('name','cellz')
					.attr('idx',f.fileId)	// Cellz.API_URL.FILE.THUMBNAIL
					.attr('code',f.fileName)
					.data('file',{
									'name':f.fileTitle
									, 'origin':f.fileOrigin
									, 'version':f.version
									, 'substitute':(''+f.fileKind).getIconName()	// 4071 : 2013-07-12
									, 'size':f.fileSize
									, 'from':'cellz'	// upload 한 file 과 cellz 의 file을 구분
									, 'code':f.fileName
									, 'delete_url': f.fileName	// Cellz.API_URL.FILE.DELETE + 
									, 'delete_type':'DELETE'})
					.find('span[name=name]').html( f.fileTitle).end()
					.find('.version').html(new Date(f.updatedTime).format('yyyy-MM-dd HH:mm')).end()
					.find('.writer').html(''+f.ownerName+'').end()
					.find(':checkbox').prop({'checked':_checked}).bind('click',function(event){	// checkbox
							var me = this
								, _c = !!$(me).prop('checked')
								, _that = $(me).parent().parent().parent()
								, _code = $(_that).attr('code')
								, _file = $(_that).data('file')
								, _maxNumberOfFiles = t.$uploader.maxNumberOfFiles
								, currentSelected = Object.keys(t.cellzSelected).length
								;

							if (_c) {
								if (_maxNumberOfFiles > currentSelected) {								
									t.cellzSelected[_code] = _file;
								} else {
									if (t.cellzSelected[_code] !== undefined) {
										delete t.cellzSelected[_code];
									}
									$(me).prop({'checked':false});
									alert($MSG$file);
								}
							} else {
								if (t.cellzSelected[_code] !== undefined) {
									delete t.cellzSelected[_code];
								}
							}
						}).end()
					;

				$cellzResult.append($clone);
			}
		}
/////////#####/ 4071 : 2013-06-18 END 'Cellz 에서 찾기' 여러 탭에서 선택한 결과 적용을 위해서 ///////////////

		//$$  'Cellz 에서 찾기' 사용자가 선택한 tab 에 따라서 ajax call(Cellz.API_URL.FILE.LIST) 성공시 cellzShowResult call
		/* 수정 by 정호진 function 의 파라메타 삽입 추후 server의 코드 변경가능하면 삭제요망*/
		, cellzSearch = function(searchVal){	// cellz 에서 찾기 search .. ajax call
			var _area = $cellzArea.find('li.on').attr('name')
				, _tab = $cellzTab.find('li.on').attr('name');
			$.ajax({
				url : Cellz.API_URL.FILE.LIST	
				, type: 'GET'
				, async: true
				, timeout : $time$DEFAULT
				, dataType: 'JSON'
				, data: {
					'userId': $user$ID
					, 'viewType': _area
					, 'fileType': _tab
//					, 'size':5
				}
				, beforeSend: function(xhr) {
					$cellzResult.find('li[name=cellz]').remove();	// 이전 결과 지우기
					_cellzDefaultResult(_area);
				}
				, error: function(data, status, err) {
						console.log(300, 'Error', status, err, data);
				}
				, success: function(result) {
					if (result 
						&& result.data !== undefined
						&& result.data !== null
						&& result.data.files !== undefined
						&& result.data.files !== null							
						&& result.data.files.length > 0) {
						_cellzDefaultResult();
						/* 서버단에서 해결 가능하면 취소하고 서버 java코드 변경               */
						var filteredFiles = new Array();
						if (undefined !== searchVal && searchVal !== '') {
							for (var i = 0; i < result.data.files.length; i++) {
								var file = result.data.files[i];
								if (file.fileTitle.indexOf(searchVal) >= 0 ){
									filteredFiles.push(file);
								}
							}
							result.data.files = filteredFiles;
						}
						////////////////////////////////////////////
						
						cellzShowResult(result.data.files, _area, _tab);	// 새로운 결과 print
					} else {
//						console.log(312, '결과 없음');
					}
				}
			});	// $.ajax({
		}	// cellzSearch

		, $somethingMap			= $('#somethingMap')	// fileUpload.jsp
		, $btnCloseMap 			= $somethingMap.find('#somethingMapBtnClose')	//@# 지도 popup 닫기 버튼
		, $mapDialog			= undefined

		, GoogleMap = {
			'selected' : {}
			, 'characters' : []
			, 'currentPage' : 0
			, 'pivot' : 0
			, 'displaySize' : 7
			, 'listSize' : 0
			, 'searchChecker' : {}
			, inited : false
			//$$  초기화
			, 'init' : function() {
				var t = this
					, startMap
					, successInit = function(tong){
						var i
							, ii
							, bong
							, cong
							, _location
							;
						t.characters = [];	// reinitialize

						for (i=0,ii=tong.length;i<ii ;i++ ) {
							bong = tong[i];
							cong = bong.address.split($map$delimeter);
							_location = new google.maps.LatLng(Number(bong.latitude), Number(bong.longitude));
							t.characters.push({
								'name':cong[0]
								, 'formatted_address':cong[1]
								, 'geometry':{'location':_location}
								, 'search':bong.search
							});
						}	// for
						t.showTime(' init > success ');
					}
					, firstInit = function(){
						$.ajax({
							url : Cellz.API_URL.BOX.MAP
							, type: 'POST'
							, async: true
							, timeout : $time$DEFAULT
							, dataType: 'JSON'			
							, error: function(data, status, err) {
									firstInit();
							}
							, success: function(result) {
								if (!!result) {
									successInit(result.data);
								}
							}
						});
					}
					, address = document.getElementById("somethingMapList")
					, $pageList = $(address).find('div.page_area')
					, $prev = $pageList.find('a.prev') 
					, $next = $pageList.find('a.next')
					;

				t.selected = {};
				$somethingMap.find('span[name=mapConfirm]').removeClass('mapConfirm_on');	// 4071 : 2013-07-10 init : o.k button 
				t.input = document.getElementById("somethingMapInput");		// fileUpload.jsp
				t.address = address;		// fileUpload.jsp
//				this.geocoder = new google.maps.Geocoder();	// 4071 : 2013-06-26
				t.infowindow = new google.maps.InfoWindow();  

				t.characters = [];
				t.inited = true;
				t.searchChecker = {};
					 
				//지도 생성.(기본 위치 서울시청.)  // 최근 검색 위치로 ~~~	37.56647, kb: 126.97796300000005
				t.firstMap = new google.maps.LatLng(37.56647, 126.97796300000005);
				startMap = {  
					zoom: 16,  
					center: t.firstMap,  
					mapTypeId: google.maps.MapTypeId.ROADMAP  
				};  
				t.map = new google.maps.Map(document.getElementById("somethingMapArea"), startMap);
				//마커 생성.  
				t.marker = new google.maps.Marker({  
					map : t.map,
					animation: google.maps.Animation.DROP
				});
				t.service = new google.maps.places.PlacesService(t.map);	// 4071 : 2013-06-26
				$prev.bind({'click':function(){t.prev();}});
				$next.bind({'click':function(){t.next();}});

				firstInit();
			}
			, 'clearList' : function(){
				var $mapList = $somethingMap.find('#mapList')
					, $list = $mapList.find('ul')
					;
				$list.empty();
				$mapList.hide();
			}
			, 'isthereMap' : function(){
				var $mapList = $somethingMap.find('#mapList')
					, $list = $mapList.find('ul li')
					;

				return $list.length > 0 ? true : false;
			}
			//$$  map 정보가 선택 되었는지 판별
			, 'selectedMap' : function(){
				var $_selected = $somethingMap.find('#mapList li.cellz_name_selected')
					;

				return $_selected.length > 0 ? true : false;
			}

			//$$  사용자의 enter 입력을 받아 map 정보 설정
			, 'setMapInfo' : function(kong){
				var t = this
					, $_selected
					, _cong
					, _a
					, _o
					, loc
					, name
					, content
					, search
					;

				if (kong !==undefined && kong.mong !==undefined) {	// 검색 결과 목록에서 온 경우	
					// {'mong':{'loc':loc, 'name':name, 'content':content, 'search':search}}
					loc = kong.mong.loc;
					name = kong.mong.name;
					content = kong.mong.content;
					search = kong.mong.search;
				} else {
					if (kong !==undefined ) {	// 순간 검색
						$_selected = kong;
					} else {
						$_selected = $somethingMap.find('#mapList li.cellz_name_selected');
					}					
					_a = Number($_selected.data('latitude'));
					_o = Number($_selected.data('longitude'));
					_cong = $_selected.data('address').split($map$delimeter);

					loc = new google.maps.LatLng(_a, _o);
					name = _cong[0];
					content = _cong[1];
					search = $_selected.data('search');
				}
				
				t.selected.loc = loc;
				t.selected.address = name+$map$delimeter+content;
				if (!!search) {
					t.selected.search = search;
				}
				$somethingMap.find('span[name=mapConfirm]').addClass('mapConfirm_on');
				//지도와 마커이동.  
				t.map.setCenter(loc);  
				t.marker.setPosition(loc);  
				t.marker.setAnimation(google.maps.Animation.DROP);  
				t.infowindow.setContent(name+$map$delimeter+content);  
				t.infowindow.open(t.map, t.marker);
				$somethingMap.find('#somethingMapInput').val(name);	//검색창에 내용 넣기
				if (t.selectedMap()) {
					t.clearList();
				}
			}

			//$$  방향키에 따라 map 목록 이동
			, 'chooseMap' : function(key){
				var t = this
					, $_map = $somethingMap.find('#mapList li')
					, isSelected = t.selectedMap()
					, i
					, ii = $_map.length
					, pivot = undefined
					, next = undefined
					, _scrollTop = 0
					;

				if (!isSelected) {
					if (key == KEY.down) {
						$somethingMap.find('#mapList li:first').addClass('cellz_name_selected');
					}
				} else {					
					// find cellz_name_selected
					if (key == KEY.down || key == KEY.up) {
						for (i=0;i<ii ;i++ ) {
							if ($($_map[i]).hasClass('cellz_name_selected')) {
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

							$_map.scrollTop(_scrollTop * $SCROLLHEIGHT);						

							for (i=0;i<ii ;i++ ) {
								if (i===pivot) {
									$($_map[i]).removeClass('cellz_name_selected');
								}
								if (i===next) {
									$($_map[i]).addClass('cellz_name_selected');
								}
							}
						}
					}	// if (key == KEY.down || key == KEY.up) {
				}	// if ($_selected.length === 0) {
			}	// chooseMap
			, 'search' : function(which){
				var t = this
					, $mapList = $somethingMap.find('#mapList')
					, $list = $mapList.find('ul')
					, date = new Date()
					, timeStamp = date.getTime()
					, mapStamp = $user$ID + '_' + timeStamp	// 4071 : 2013-07-09 검색 결과 지연 check 와 연속 검색으로 인한 결과 충돌 방지
					, makeList = function(data){
						var i
							, ii
							, cong
							, $li 
							, $a
							;

						t.clearList();

						for (i=0, ii=data.length;i<ii ;i++ ) {
							cong = data[i];
							$a = $('<a/>').attr('href','#')
								.html(cong.search);
							$li = $('<li/>')
								.append($a)
								.data('search', cong.search)
								.data('latitude', cong.latitude)
								.data('longitude', cong.longitude)
								.data('address', cong.address)
								.bind({
									'click' : function(event){
										t.setMapInfo($(this));
									}
									, 'mouseover':function(){								
										$(this).addClass('cellz_name_selected');
									}
									, 'mouseout':function(){						
										$(this).removeClass('cellz_name_selected');								
									}
								
								});
							$list.append($li);
						}	// for
						$mapList.show();
					};

				if (t.isthereMap() && t.searchChecker.search !== undefined && t.searchChecker.search === which) {
					return false;
				}

				t.searchChecker = {'search':which, 'stamp':mapStamp };

				$.ajax({	// query
					url : Cellz.API_URL.BOX.MAPQUERY
					, type: 'POST'
					, async: true
					, timeout : $time$DEFAULT
					, dataType: 'JSON'
					, data : {
						'query' : which
						, 'stamp': mapStamp
					}
					, error: function(data, status, err) {
//						console.log(607, 'Error', status, err, data);
					}
					, success: function(result) {
						if (result.data !== undefined && result.data.stamp !== undefined ) {
							if (result.data.stamp === t.searchChecker.stamp) {
								makeList(result.data.list);
							} else {
								t.clearList();
							}
						} else {
							t.clearList();
						}
					}
				});
			}
			, 'start' : function(){
				var t = this;				
				t.input.value = '';
			}
			, 'showMapList' : function(page){
				var t = this
					, $list = $(t.address)
					;
				t.currentPage = page/1;	// Number(page)

				$list.find('li[name=map]').hide().end()
					.find('li[page='+page+']').show();
			
			}
			, 'prev' : function(){
				var t = this
					, $pageList = $(t.address).find('div.page_area')
					, $prev = $pageList.find('a.prev') 
					, $next = $pageList.find('a.next')
					, _last = t.pivot + t.displaySize -1
					;

				// _last hide 처리하고
				$pageList.find('span[idx='+(_last-1)+']').hide().end()
						.find('a[idx='+_last+']').hide().end();
				// pivot - 1 하고
				t.pivot -= 1;
				_last = t.pivot + t.displaySize -1;

				if (t.pivot > t.currentPage) {
					t.showMapList(t.pivot);
				}
				
				// pivot == 0 이면 $prev 보이게 하고
				if (t.pivot == 0) {
					$prev.hide();
				} else {
					$prev.show();
				}

				if ( _last < t.currentPage) {
					t.showMapList(_last);
				}

				$pageList.find('span[idx='+t.pivot+']').show().end()
						.find('a[idx='+t.pivot+']').show().end();

				// 마지막보다 작으면 $next 안보이게 한다.
				if (_last < t.listSize -1) {
					$next.show();
				} else {
					$next.hide();
				}
			}
			, 'next' : function(){
				var t = this
					, $pageList = $(t.address).find('div.page_area')
					, $prev = $pageList.find('a.prev') 
					, $next = $pageList.find('a.next')
					, _next
					;

				// pivot hide 처리하고
				$pageList.find('span[idx='+t.pivot+']').hide().end()
						.find('a[idx='+t.pivot+']').hide().end();
				// pivot + 1 하고
				t.pivot += 1;
				if (t.pivot > t.currentPage) {
					t.showMapList(t.pivot);
				}
				
				// pivot > 0 이면 $prev 보이게 하고
				if (t.pivot>0) {
					$prev.show();
				} else {
					$prev.hide();
				}
				// currentPage + displaySize show 하고
				_next = t.pivot + t.displaySize -1;	// t.currentPage += 1; 했으므로
				if ( _next< t.currentPage) {
					t.showMapList(_next);
				}
				$pageList.find('span[idx='+(_next-1)+']').show().end()
					.find('a[idx='+_next+']').show().end();

				// 마지막으로 같으면 $next 안보이게 한다.
				if (_next == t.listSize -1) {
					$next.hide();
				} else {
					$next.show();
				}
			}
			, 'makePageList' : function(size){
				var t = this
					, i
					, ii = ( (size/$Map$Size) >> 0 ) + 1
					, $pageList = $(t.address).find('div.page_area')
					, $page
					, $bar
					, $prev = $pageList.find('a.prev') 
					, $next = $pageList.find('a.next')	
					;

				t.listSize = ii;
				for (i=0; i<ii ;i++ ) {
					$page = $pageList.find('a[name=pageTpl]').clone().removeClass('disnone');
					$page.html(i+1)
						.attr('name', 'page')	
						.attr('idx', i)
						.hide()
						.bind({
							'click':function(){
								var me = this
									, idx = $(me).attr('idx');
								t.showMapList(idx);
							}
						});
					if (i < t.displaySize) {
						$page.show();
					}
					$next.before($page);
					
					$bar = $pageList.find('span[name=barTpl]').clone();
					$bar.attr('name','b')
						.attr('idx', i)
						.css('display','')
						;
					if (i >= t.displaySize-1) {
						$bar.hide();
					}
					$next.before($bar);
				}

				$prev.hide();
				$next.hide();

				(i >= t.displaySize) && $next.show();
				(i > 0) && $pageList.show() ;
			}
			//$$ 결과 보여주기
			, 'showTime' : function(from){
				var t = this
					, i
					, ii
					, _address
					, _name
					, _search
					, $list = $(t.address)
					, ul = $list.find('ul')
					, $resultTpl = $list.find('li[name=mapTpl]')	//@# 'Cellz 에서 찾기' 결과 template	// fileUpload.jsp
					, $clone
					, _page
					;

				$list.find('li[name=map]').remove();	// clear previous result..

				for(i=0, ii=t.characters.length; i<ii; i++){
					$clone = $resultTpl.clone().removeClass('disnone');

					_search = '';
					if (!!t.characters[i].search) {
						_search = t.characters[i].search;
					}

					_name = t.characters[i].name;
					_address = t.characters[i].formatted_address.replace('대한민국 ', '');
					_address = _address.replace(/특별시|광역시/,'시');
					_page = (i/$Map$Size) >> 0 ;					

					$clone
						.data('loc',t.characters[i].geometry.location)
						.attr('name','map')
						.data('search',_search)
						.attr('page', _page)
						.find('a strong').html(_name).end()
						.find('span').html(_address).end()
						.bind({
							'click':function(){
								var me = this
									, loc = $(me).data('loc')
									, name = $(me).find('a strong').html()
									, content = $(me).find('span').html()
									, search = $(me).data('search')
									;

								t.setMapInfo({'mong':{'loc':loc, 'name':name, 'content':content, 'search':search}});
							}
						});
					ul.append($clone);
				}	// for

				$list.find('div[name=searching]').hide().end()
					.find('ul').show();

				if (ii > $Map$Size) {
					t.pivot = 0;	// 기준점 설정
					t.makePageList(ii);					
					t.showMapList(0);
				}
			}
			//$$ 무대 정리
			, 'readyToShow' : function(){
				var t = this;
				t.inited = true;
				t.characters = [];
				$(t.address).find('li[name=map]').remove().end()
							.find('div.page_area')
									.find('a[name=page]').remove().end()
									.find('span[name=b]').remove().end()
									.end()
							.find('div[name=searching]').show().end()
							.find('div[name=noResult]').hide().end()			
							.find('ul').hide().end()
							.find('div.page_area').hide()
							;
			}
			//$$  주소 검색.(지오코딩)
			, 'codeAddress' : function(address) {  
				var t  = this					
					, request = {
						'location': t.firstMap
						, 'radius': '500000'	// 50km 단위 m
						, 'query': address
						}
					;

				if (t.inited) {
					t.selected.search = address;
					t.inited = false;
				}

				t.service.textSearch(request, function(results, status, pagination){
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						if (results.length > 0) {
							if (t.characters.length == 0 ) {
								t.characters = results;
							} else {
								t.characters = t.characters.concat(results);
							}
						}
						if (pagination.hasNextPage) {
							pagination.nextPage();
						} else {
							t.showTime('codeAddress');
						}
					} else {
						t.characters = [];
						$(t.address).find('div[name=searching]').hide().end()
									.find('div[name=noResult]').show();
					}	// if
				});
			}
		}	// GoogleMap

		, Blow$SOME = function ($el, name){
			var	t = this
				, date = new Date()
				, timeStamp = date.getTime()
				, _whoamI = 'some$'+ name + '_' + timeStamp
				;

			KEY.ctrlDown = false;	// 2013-06-03
			KEY.shiftDown = false;	// 2013-06-03

			$el.data('name', name);

			t.$NAME = name;

			t.$ENS = $el;

			t.$group$Initilized = false;

			t.$tab				= $el.find('#say_tab_pannel');	//@# create 영역 상단 부분
			t.$sayTab			= t.$tab.find('.tab');
			t.$pollTab			= t.$tab.find('.tab2');
			t.$comTab			= t.$tab.find('.tab3');

			t.$groupNotice		= t.$tab.find('span.check_group');

			t.$groupNotice.hide();

			if (name === 'detail' ){
				t.$comTab.hide();
				t.$tab.find('.group_lyr_lst').hide();	// 2013-06-10
			} else {
				t.$comTab.show();
			}

			t.$loadingBar		= $el.find('#say_loading');

			t.$sayAndPoll		= $el.find('#say_and_poll');
			t.$firstSomething	= $el.find('#say_first_step');
			t.$saySomething		= t.$sayAndPoll.find('#say_something');
			t.$pollSomething	= t.$sayAndPoll.find('#poll_something');

			t.$hydeSomething	= t.$sayAndPoll.find('#hyde_something');		// 4071 : 2013-06-13 $saySomething focus 후 file upload 시 발생하는 caret focus 관련 error 처리용

			t.$indicator		= t.$sayAndPoll.find('#say_indicator_pannel');	//@# create 영역
			t.$button			= t.$sayAndPoll.find('#say_button_pannel');		//@# create 영역의 say 관련 button
			t.$votePannel		= t.$sayAndPoll.find('#poll_vote_pannel');		//@# create 영역의 poll 관련 부분
			t.$voteName			= t.$sayAndPoll.find('#poll_name_pannel');		//@# create 영역의 poll 실명/익명 부분
			t.$voteName$real	= t.$voteName.find('.btn_type a#poll_name');		//@# 실명
			t.$voteName$mous	= t.$voteName.find('.btn_type a#poll_anonymous');	//@# 익명
			t.$voteTpl			= t.$sayAndPoll.find('#li_poll_template');		//@# craete 영역의 vote template
			t.$peopleList		= t.$sayAndPoll.find('#say_people_list');		//@# create 영역의 @검색 결과 출력 부분
			t.$urlPannel		= t.$sayAndPoll.find('#say_url_pannel');		//@# url clipping 시 사용하는 url 관련 template
			t.$mapPannel		= t.$sayAndPoll.find('#say_map_pannel');		//@# map template

			t.$fileDescPannel	= $el.find('.dsc_upload');						//@# file upload 목록 부분의 설명 부분
			t.$btnDescNone		= $el.find('.btn_review_none');					//@# file upload 목록 부분의 설명 부분 닫기 버튼
			t.$filePannel		= $el.find('#somethingFile');					//@# file upload 목록
			t.$now$Uploading		= false;										//@# 4071 : _fileChange event 발생시 true, _fileStopped 발생시 false

			t.$cellBtnCreate	= t.$sayAndPoll.find('#say_btn_create');		//@# say O.K button
			t.$cellBtnPoll		= t.$sayAndPoll.find('#say_btn_poll');			//@# poll O.K button

			t.$btnFileInput		= t.$sayAndPoll.find('input[type=file]');		//@# 'PC에서 찾기' 의 upload file
			t.$openBtnFile		= t.$sayAndPoll.find('div.file_input_div');		//@# 'PC에서 찾기' 부분
			t.$openBtnCellz		= t.$sayAndPoll.find('#openCellz');				//@# 'Cellz 에서 찾기' popup 열기 버튼
			t.$openBtnMaps		= t.$sayAndPoll.find('#openMaps');				//@# 지도 popup 열기 버튼

			t.cellzFileList		= {};											//@# 4071 : 2013-06-18 'Cellz 에서 찾기' 결과 목록 
			t.cellzSelected		= {};											//@# 4071 : 2013-06-18 'Cellz 에서 찾기' 사용자 선택 목록

			t.last$successName	= undefined;									//@# 'getNameTag' 에서 성공한 검색어
			t.last$word			= undefined;

//			if ($el.find('#fileupload').length == 0) {
//				return;
//			}
//			console.log(594, '여기가 실행 되지 않으면 error');

			$el.find('#fileupload').fileupload({
				xhrFields: {withCredentials: true}
			}).fileupload(
				'option',
				'redirect',
				window.location.href.replace(
					/\/[^\/]*$/,
					'/cors/result.html?%s'
				)
			);

			$.ajax({
				// Uncomment the following to send cross-domain cookies:
				// xhrFields: {withCredentials: true},
				url: $el.find('#fileupload').fileupload('option', 'url'),
				dataType: 'json',
				context: $el.find('#fileupload')[0]
			}).done(function (result) {
				$(this).fileupload('option', 'done')
					.call(this, null, {result: result});
			});			

			t.$fileUpload		= $el.find('#fileupload');
			t.$uploader			= t.$fileUpload.data('blueimp-fileupload').options;

			t.house				= undefined;									// 사용자가 선택한(입력중인) $BASE (div/p) 의 name
			t.maison			= undefined;									// enter 입력시의 house 이전 줄			

			t.isfasteBlur		= false;
//			t.isFileUpload		= false;										// 4071 : 2013-06-12 파일 선택 창이 열렸는지 확인하기 위함
			t.nameTagChecker	= {};											// 2013-05-01 getNameTag 할때 검색어와 검색시점 기록

			t.pollIdx			= 10;
			t.anything			= {'last':'','kind':''};						//@# caret 에 있는 paragraph 상의 마지막 단어
			t.houseStory		= {};											//@# caret이 위치한 줄의 정보
			t.markerStory		= {};											//@# url clipping 관련 정보

			t.isFromCellz		= false;
			t.cellMaps			= {};

			t.queue				= undefined;									//@$$

			t.itsMe(_whoamI);

			t.$firstSomething.text($First$Say).bind('click', function(event){
				var $ul
					, $li					
					, i
					, ii = $group$List.length
					, one
					, _clicker = function(me, parent){
							var id = me.data('id')
								, type = me.data('type')
								, name = me.text()
								, toName = 'To. ' + name
								;

							t.$comTab.find('span[name=title]').html(toName);
							if ($First$Say != toName) {
								if (type=='group') {
									t.cellMaps = {'groupId':id};
									t.$groupNotice.show();
								} else {
									t.cellMaps = {'groupId':''};
									t.$groupNotice.hide();
								}
							}							
							parent.hide();							
						}
					;

				event.preventDefault();
				event.stopPropagation();
				$(this).hide();

				if ((t.$NAME === 'timeline' || t.$NAME === 'topic') && !t.$group$Initilized) {
					if (ii > 1) {
						// 1. 회사명 처리
						one = $group$List[0];
						t.$tab
							.find('div.group_lyr_lst').hide()
							.find('div.lyr_scroll p.tit')
								.html(one.name)
								.data('id', one.id)
								.data('type', one.type)
								.bind({
									'click':function(){
										_clicker( $(this), $(this).parent().parent());
									}
								})
								;						
						if (!before$group) {
							t.$comTab.find('span[name=title]').html('To. '+one.name);
						}

						// 2. 그룹처리
						$ul =$('<ul/>');
						for (i=1;i<ii ;i++ ) {
							one = $group$List[i];
							$li = $('<li/>')
								.append(one.name)
								.data('id', one.id)
								.data('type', one.type)
								.bind({
									'click':function(){
										_clicker( $(this), $(this).parent().parent().parent());										
									}
								});
							$ul.append($li);
						}	// for

						t.$tab
							.find('div.group_lyr_lst').hide()
							.find('div.lyr_scroll').append($ul);

						t.$comTab.bind('click',function(){							
							_browserInfo_.chrome && (t.caret('list'));
							t.$comTab.toggleClass('on');
							t.$tab.find('div.group_lyr_lst').toggle();
						});
					}	// if
					t.$group$Initilized = true;
				}	// if (t.$NAME === 'timeline') {
				t.say();
			});

			t.$sayTab.bind('click',function(event){
				event.preventDefault();
				event.stopPropagation();
				t.itsMe(_whoamI);
				t.say();
			});

			t.$pollTab.bind('click',function(event){
				event.preventDefault();
				event.stopPropagation();
				t.itsMe(_whoamI);
				t.poll();
			});
			
			t.$openBtnCellz.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				
				if (!$(this).hasClass('disabled')) {
					t.itsMe();	// set current Blow$SOME	to Cellz.some$thing 새창에서 create 이외의 동작으로 timeline으로 돌아올수 있다.
					t.openFiles();					
				} else {
//					t._showFileError($MSG$file);
					alert($MSG$file);	// 4071 : 2013-06-18 Ticket #1144
				}
			});

			t.$btnFileInput.bind('click', function(event){
				if (t.$openBtnFile.hasClass('disabled')) {
					event.preventDefault();
					event.stopPropagation();
//					t._showFileError($MSG$file);
					alert($MSG$file);	// 4071 : 2013-06-18 Ticket #1144
					return false;
				}

				_browserInfo_.chrome && (t.caret('Hyde'));	// 4071 : 2013-06-13 $saySomething에 있는 caret 관련 처리

				t.itsMe();	// set current Blow$SOME	to Cellz.some$thing
			});

			t.$openBtnMaps.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				t.itsMe();	// set current Blow$SOME	to Cellz.some$thing
				t.openMaps();
			});

			// 4071 : 2013-03-01
			// 0. something 영역의 내용 parsing
			// 1. 값 분류 : text, div, span, br 등 구분
			// 2. json 변환
			t.$cellBtnCreate.bind('click', function(event){
				var c = undefined
					, _say
					, $files = t.$filePannel.find('table .template-download .name')	// upload 한 파일만
					, i, ii
					, _file	
					, _fileList = []						
					, _authList = []
					, _attachments = {}
					, _attachmentsAuth = {}
					, _bong
					, _checkTong = t.pumpUpTheCell('say something')
					;

				if (!_checkTong) {
					return false;
				}

				event.preventDefault();
				event.stopPropagation();

				c = t._con2Json();

				if (c !== undefined) {
					_say = JSON.stringify(c);
				} else {
					return false;
				}

				for (i=0, ii=$files.length;i<ii ;i++ ) {
					_file = $($files[i]);

// 4071 : 2013-03-18 START
//				* fileId : "1_18dg38f93e" (서버에저장된 파일이름)
//				* authType : (READ|WRITE|OWN)
//				* authTargetId : 권한부여 대상 ID(user id | group id | company id | note user id)
//				* authTargetSubId : ''
//				* authTargetObject : 권한부여 대상 Type (USER | GROUP | COMPANY | NOTE); 전체공개의 경우 COMPANY 로 전달
					if (!!_file.attr('code')) {
						_authList.push({
							'fileId':_file.attr('code')
							, 'authType':_file.parent().find('td.btn_auth div').hasClass('auth_read') ? 'READ' : 'WRITE'
//								, 'authTargetObject': 'COMPANY'
//								, 'authTargetId': '1'
//								, 'authTargetSubId':''
							});
						_fileList.push(_file.attr('code'));	
					}
				}
// 4071 : 2013-03-18 END

				$cellzResult.find('li').removeClass('cellz_file_selected');	// cellz 에서 찾기 선택 해제

				$.extend(_attachments, _fileList);
				$.extend(_attachmentsAuth, _authList); 
				_bong = {
					'cellType':'CELL'
					, 'from':t._comeFrom()
					, 'contents':_say
					, 'attachments':_attachments
					, 'attachmentsAuth':_attachmentsAuth
				};

				t.create(_bong);
			});	// t.$cellBtnCreate.bind(.............

			t.$voteName.find('div a').bind('click', function(event){
				var me = this
					, $_parent = $(me).parent();
				event.preventDefault();
				event.stopPropagation();
				if ($_parent.hasClass('anonymity')) {
					$_parent.removeClass('anonymity');
				} else {
					$_parent.addClass('anonymity');
				}
			});

			t.$voteName$real.bind({
				'mouseover' : function(){					
					$(this).parent().find('span[name=noti_real]').show();
				}
				, 'mouseout' : function(){
					$(this).parent().find('span[name=noti_real]').hide();
				}
			});

			t.$voteName$mous.bind({
				'mouseover' : function(){					
					$(this).parent().find('span[name=noti_mous]').show();
				}
				, 'mouseout' : function(){
					$(this).parent().find('span[name=noti_mous]').hide();
				}
			});

			t.$cellBtnPoll.bind('click',function(event){
				var $polls = t.$votePannel.find('li[name=poll]')						
					, _p = []
					, _poll = {}
					, i
					, ii = t.pumpUpThePoll(' $cellBtnPoll ')
					, _bong
					, _anonymity = t.$voteName.find('div').hasClass('anonymity') ? true : false
//					, _pollval = t.$pollSomething.find('div.input_area textarea').val()
					, _pollval = t.$pollSomething.find('div.input_area input').val()
					, _vote
					;

				if (ii <= 1 ) {
					return false;
				}

				event.preventDefault();
				event.stopPropagation();

				for (i=0 ;i<ii ;i++ ) {
					_vote = $($polls[i]).find('input').val();
					if (_vote.indexOf($First$Vote) == -1) {
						_p.push(_vote);
					}
				}

				$.extend(_poll, _p);

				_bong = {
					'cellType':'ENQUETE'	// _cellType						
					, 'from':t._comeFrom()
					, 'contents':JSON.stringify({'type':'text', 'content':_pollval})
					, 'surveyAnonymity':_anonymity
					, 'surveyContents':_poll
				};

				t.create(_bong);	
			});	// t.$cellBtnPoll.bind(...................

			t.first(name);

			// @@@@@@@ 2013-04-23
			// ie의 경우 입력할때 keyup 으로 값을 check 가능하나
			// ie 이외의 브라우저에서는 input event 와 keydown event를 조합해야 한다.
			if (_browserInfo_.ie) {
				t.$saySomething.bind({
					'keydown' : function(event){
						var which
						, text =  $.trim(t.$saySomething.text());

						event = window.event || event;
						which = event.keyCode || event.which;
						
						if (text.length >= $max$INPUT && which != KEY.del && which != KEY.backSpace) {
//							console.log(1285, ' overFlowed ');
							alert($MSG$input);
							return false;
						}
					}
					, 'keyup' : function(event){
						var which;

						event = window.event || event;
						which = event.keyCode || event.which;

						if (KEY.ctrlDown && (which == KEY.b || which == KEY.i || which == KEY.u || which == KEY.v || which == KEY.c)) {
							return false;
						}

						if (t.istherePeople() && ( which == KEY.up || which == KEY.down) ) { // || which == KEY.left || which == KEY.right
							t.choosePeople(which);
							return false;
						}

						if (t.istherePeople() && t.selectedPeople() && which === KEY.enter) {
							return false;					
						}
						t.danceWithInput(which);
					}
				});
			} else {
				t.$saySomething.bind({
					'input' : function(event){
						var which
							, text =  $.trim(t.$saySomething.text());

						event = window.event || event;
						which = event.keyCode || event.which;

						if (text.length >= $max$INPUT && which != KEY.del && which != KEY.backSpace) {
//							console.log(1321, ' overFlowed ', text.length);
							alert($MSG$input);
							return false;
						} else {
							t.danceWithInput(t.queue);	// keydown event 처리부분에서 t.queue setting 한글의 경우 chrome 에서 229 code 값
						}						
					}	// input
					
					// 4071 : 2013-04-26
					//$$  input 이 일어나지 않는 key code 에 대한 처리
					, 'keyup' : function(event){
						var which
							, text = $.trim(t.$saySomething.text());

						event = window.event || event;
						which = event.keyCode || event.which;

						if (which == KEY.home || which == KEY.end 
							|| which == KEY.left || which == KEY.up || which == KEY.right || which == KEY.down) {
							if (t.istherePeople() && ( which == KEY.up || which == KEY.down) ) { // || which == KEY.left || which == KEY.right
								t.choosePeople(which);
								return false;
							} else {
								t.danceWithInput(which, true);
							}
						}
					}	// keyup
					, 'keydown' : function(event){
						var which
							, text = $.trim(t.$saySomething.text());

						event = window.event || event;
						which = event.keyCode || event.which;

						if (text.length >= $max$INPUT && which != KEY.del && which != KEY.backSpace) {
//							console.log(1355, ' overFlowed ', text.length);
							alert($MSG$input);
							return false;
						}
					}
				});
			}	// if (_browserInfo_.ie) {

//////////////////////////4071: 2013-03-11 START //////////////////////////////////////////////////////////////////////
			// 4071 2013-02-21
			t.$saySomething.bind({
				//$$  
				'keydown' : function(event){
					var me = this
						, faste = function(){
								var v = undefined
									; 

								v = t.aStoryOfHouse(true);

								t.houseStory = v;

								t.isfasteBlur = true;	// to escape default $saySomething's blur 2013-04-10
								t.$sayAndPoll.find('#pasteBuffer').css("display","block");							
								t.$sayAndPoll.find('#pasteBuffer').focus();						

								setTimeout(function(){
									t.$saySomething.trigger('faste');
								}, 10);
							}
						, which						
						;

					event = window.event || event;
					which = event.keyCode || event.which;

					t.queue = which;

					if (which == KEY.space) {
						t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
						if (t.istherePeople()) {
							t.hidePeople();
						}
					}

					if (_browserInfo_.chrome && $(me).text() == '' && which == KEY.backSpace) {
						$(me).html($First$Base);
						t.caret();
						return false;
					}

					if (t.istherePeople() && ( which == KEY.up || which == KEY.down) ) { // || which == KEY.left || which == KEY.right
						return false;
					}

					if (t.istherePeople() && t.selectedPeople() && which === KEY.enter) {
						t.setPeopleInfo();
						return false;					
					}

					if (KEY.ctrlDown) {
						if (which == KEY.b || which == KEY.i || which == KEY.u) {
							return false;
						}
						if (which == KEY.v ) {
							faste();
						}
					}

					if (KEY.shiftDown && (which == KEY.insert)) {
						faste();
					}			
				}	// 'keydown'

				// 4071
				// 2013-04-04
				// 1. 현재 caret이 위치한 줄
				// 2. 1번에서 구한 다음줄에 browser 마다 다르게 내용 추가
				// 3. 내용 추가한 이후에 caret 위치시키기
				// 4. clip map 의 경우 buffer 에 새로 입력 되므로 2013-05-13
				, 'faste' : function(){
					var $paste = t.$sayAndPoll.find('#pasteBuffer')
						, buffer = $paste.val()
						, text = $.trim(t.$saySomething.text())
						, totalLength = buffer.length + text.length
						;

					if (totalLength < $max$INPUT) {
						t.isfasteBlur = false;	// restore 2013-04-10
						t._con2New(t.houseStory, 'faste');
					} else {
						$paste.val('');
						alert($MSG$input);
					}
				}	// faste
				
				, 'focus' : function(){
					var me = this
						;

					if ( $(me).text() === $First$Say ) {
						if (_browserInfo_.chrome) {
							$(me).css('color', color$Focus).html($First$Base);
							t.caret();	// $(me)
						}

						if (_browserInfo_.ie) {
							$(me).css('color', color$Focus).text('');
						}					
					}
				}
				, 'blur' : function(){
					var me = this;

					if ( $(me).text() === '' && !t.isfasteBlur ) {
						$(me).text($First$Say).css('color', color$Blur);
					}
				}
			});

//			t.$pollSomething.find('div.input_area textarea').bind({
			t.$pollSomething.find('div.input_area input').bind({	
				'focus' : function(){
					var me = this;

					if ( $(me).val() === $First$Poll ) {
						$(me).css('color', color$Focus).val('');
					}
					$(me).parent().parent().find('span.num_box').show();
//					$(me).parent().find('span.num_box').show();

				}
				, 'blur' : function(){
					var me = this;
					if ( $(me).val() === '' ) {
						$(me).css('color', color$Blur).val($First$Poll);
					}
					$(me).parent().parent().find('span.num_box').hide();
//					$(me).parent().find('span.num_box').hide();
				}			
				, 'keyup' : function(event){
					var me = this
						, _poll = $(me).val()
						, _len = checkStrLen(_poll);
					t.pumpUpThePoll('poll');
					$(me).parent().parent().find('span.num_box').text(_len.sum+'/'+POLLMAXLENGTH);
//					$(me).parent().find('span.num_box').text(_len.sum+'/'+POLLMAXLENGTH);
				}
			});

			if (_browserInfo_.ie) {
//			t.$pollSomething.find('div.input_area textarea').bind({
			t.$pollSomething.find('div.input_area input').bind({
				'keydown' : function(event){
					var me = this
						, _poll = $(me).val()
						, _len = checkStrLen(_poll)
						, which					
						;

					event = window.event || event;
					which = event.keyCode || event.which;

					if (_len.sum == POLLMAXLENGTH && which != KEY.del && which != KEY.backSpace) {
						return false;
					}
				}			
			});
			}	// if (_browserInfo_.ie) {


			Cellz[t.whoamI+'$youTube']	= t.youtube;			
			Cellz[t.whoamI+'$clipping']	= t.clipping;

			////////// initialize just once
			if (FistofTheFirstMen === undefined) {
				FistofTheFirstMen = {'t':t, 'w':_whoamI};	// save first $el's Blow$SOME
			}	// if (FistofTheFirstMen === undefined) {


			$(document)
				.keydown(function(event){
					var which;

					event = window.event || event;
					which = event.keyCode || event.which;

					if (event.ctrlKey) {				
						KEY.ctrlDown = true;
					} else {
						KEY.ctrlDown = false;
					}

					if (event.shiftKey) {
						KEY.shiftDown = true;
					} else {
						KEY.shiftDown = false;
					}

					if (t.istherePeople() && ( which == KEY.up || which == KEY.down) ) { // || which == KEY.left || which == KEY.right
						return false;
					}

					if (t.istherePeople() && t.selectedPeople() && which === KEY.enter) {
						return false;					
					}

					if (KEY.ctrlDown && (which == KEY.b || which == KEY.i || which == KEY.u) ) {	// || which == KEY.v || which == KEY.c	// 2013-06-03 t.ctrlDown => KEY.ctrlDown
						event.preventDefault();            
						event.stopPropagation();
						return false;
					}								
				})
				.keyup(function(event)	{

					KEY.ctrlDown = false;	// 4071 : 2013-07-08
					KEY.shiftDown = false;	// 4071 : 2013-07-08

//					event = window.event || event;

//					if (event.ctrlKey) {
//						KEY.ctrlDown = false;
//					}

//					if (event.shiftKey) {
//						KEY.shiftDown = false;
//					}
				});
//////////////////////////4071: 2013-03-11 END //////////////////////////////////////////////////////////////////////

//////////////////////////@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		}	// Blow$SOME = function ($el)
		;

	Blow$SOME.prototype = {
		'constructor' : Blow$SOME

		//$$  글이 작성된 곳이 CELL, CELLMAP 인지 구분해서 해당 값(CELL, CELLMAP) return
		, '_comeFrom' : function(){
			return ($('#cellmap_wrap .section_create').length > 0 ? 'CELLMAP' : 'CELL' );
		}

		//$$ 현재 Blow$SOME 관련 정보를 Cellz.some$thing 에 저장
		, 'itsMe': function(whoamI){
			var t = this;

			if (whoamI !== undefined) {
				t.whoamI			= whoamI;
			}			
			Cellz.some$thing	= {'t':t, 'w':t.whoamI};
		}

		//$$  'Cellz 에서 찾기' popup 열기
		, 'openFiles' : function(){	// cellz 에서 찾기 popup 열기
			var $cellz = $cellzResult.find('li[name=cellz]') 
				;
			if (!$findCellzDialog) {
				$findCellzDialog = $findCellz.dialog({
										resizable: false
										, dragable: false
										, autoOpen: false
										, modal: true
										, width: 710
										, height: 517
									});				
			}

			$findCellzDialog.dialog( "open" );
			//검색창 초기화 by 정호진
			if ($.trim($searchArea.val()) !== ''){
				$searchArea.val('');
			}
			$searchArea.trigger('blur');
			///////////끝
			if (!$cellz.length) {	// 이전 결과가 없다면 search
				cellzSearch();
			}
		}

		//$$  'Cellz 에서 찾기' popup 닫기
		, 'cellzClose' : function(){	// cellz 에서 찾기 popup 닫기
			$findCellzDialog.dialog( "close" );
			/* 수정 by 정호진*/
			$cellzResult.find('li[name=cellz]').remove();	// 이전 결과 지우기
			_cellzDefaultResult();
			/* 수정 끝*/
		}

		//$$  지도 popup 열기
		, 'openMaps' : function(){	// 지도
			if (!$mapDialog) {					
				GoogleMap.init();
				$mapDialog= $somethingMap.dialog({
								resizable: false
								, dragable: false
								, autoOpen: false
								, modal: true
								, width: 709
							});
			}
			GoogleMap.start();
			$mapDialog.dialog( "open" );			
		}

		//$$  지도 popup 닫기
		, 'mapClose' : function(){	// cellz 에서 찾기 popup 닫기
			$mapDialog.dialog( "close" );
		}

		//$$  'Cellz에서 찾기' 에서file upload 목록에 있는지 확인
		, '_isAleadyFile' : function(code){	// file upload 목록에 있는지 확인
			var t = this
				, _file = t.$filePannel.find('table .template-download td[code='+code+']')
				, _isThere = _file.length > 0 ? true : false;

			return _isThere;			
		}

		//$$  file upload 목록에 있는 파일 개수
		, '_uploadFileLength' : function(){
			var t = this
				, _file = t.$filePannel.find('table tr')
				, _length = _file.length;
			return _length;
		}

// 4071 : 2013-03-16 START
		//$$  file 추가 할때 file upload 목록이 보이지 않는 다면 보이도록 처리
		, '_fileChange' : function(){	// file 추가 할때
			var t = this;
			if (t.$filePannel.hasClass('disnone')) {
				t.$filePannel.removeClass('disnone');
			}

			t.$now$Uploading = true;
			t.pumpUpTheCell('upload$start');			
		}

		//$$  file upload 시 발생한 error _showFileError 로 처리
		, '_saveTong' : function(kong){
			var t = this;
			if (kong.error.indexOf('exceeded') > 0) {				
				setTimeout(function(){alert($MSG$file);}, 100);
			} else {
				t._showFileError(kong.name + ' : ' + kong.error );
			}
		}

		//$$  file upload 목록에서 삭제시 처리
		, '_fileDestroyed' : function(context){
			var t = this
				;

			t._checkFilePannel();

			_browserInfo_.chrome && (t.caret('_fileDestroyed'));	// 4071 : 2013-06-13 $saySomething에 있는 caret 관련 처리
		}

		//$$  file upload 시 file 이 upload 되었을때 처리 ( 'Cellz 에서 찾기' )
		, '_fileFinished' : function(){
			var t = this;			
			t._checkFilePannel(true);
			if (t.isFromCellz) {
				t._bindFileEvent();
			}
		}

		//$$  file upload 시 file 이 upload 되었을때 처리
		, '_fileStopped' : function(){	// 올리기 check, event 달기
			var t = this;
			t._checkFilePannel(true);	// true : upload 된 이후
			t._bindFileEvent();
			t.$now$Uploading = false;
			t.pumpUpTheCell('upload$end');
		}
		
		//$$  file upload 목록에서 file upload/delete 시 목록 보이고 안 보이는것 처리
		, '_checkFilePannel' : function(desc){
			var t = this
				, _fileLength = t._uploadFileLength()
				;

			if (_fileLength===0) {
				t.$filePannel.addClass('disnone');
				t.$fileDescPannel.addClass('disnone');
			} else {					
				t.$filePannel.removeClass('disnone');
				if (desc) {
					t.$fileDescPannel.removeClass('disnone');
				}
			}
		}

		//$$  사용자 file upload 완료후 file upload 목록에 있는 파일 목록에 읽기/읽기쓰기 권한 event binding 처리
		, '_bindFileEvent' : function(){	// 
			var t = this
				, $files = t.$filePannel.find('table .template-download')
				, i
				, ii = $files.length
				, $_row
				, _binded
				;

			for (i=0;i<ii ;i++ ) {
				$_row = $($files[i]); 
				_binded = $_row.find('.name').attr('binded');

				if (!_binded) {
					$_row
						.find('.name').attr('binded','binded').end()
						.find('a.btn_upload').bind('click',function(event){
							var me = this;
							event.preventDefault();
							event.stopPropagation();
							if ($(me).parent().hasClass('auth_write')) {
								$(me).parent().removeClass('auth_write').addClass('auth_read');
							}
							_browserInfo_.chrome && (t.caret('read'));	// 4071 : 2013-06-13 $saySomething에 있는 caret 관련 처리
						}).end()
						.find('a.btn_rw').bind('click',function(event){
							var me = this;
							event.preventDefault();
							event.stopPropagation();
							if ($(me).parent().hasClass('auth_read')) {
								$(me).parent().removeClass('auth_read').addClass('auth_write');
							}
							_browserInfo_.chrome && (t.caret('write'));	// 4071 : 2013-06-13 $saySomething에 있는 caret 관련 처리
						}).end();
				}
			}

			t.isFromCellz = false;	// cellz 에서 추가하는 경우 처리후.. 
		}
// 4071 : 2013-03-16 END

		//$$  say something 상단 say 클릭시 say tab 을 연다
		, 'say' : function(){	// open say tab
			var t = this
				, _say = t.$saySomething
				, _height = _say.css('height')
				, _time = _height === $Height$Cell ? $time$HALF : 0
				;
			t.$votePannel.hide();
			t.$voteName.hide();
			
			t.$sayAndPoll.removeClass('poll_area').addClass('create_area');
			t.$pollSomething.hide();

			_say.show()
				.animate({'padding':'20px'}, _time, function(){
					_say.css('height','')
						.trigger('focus');
				});

			t.$indicator.show();
			t.$tab.fadeIn(1000);
			t.$button.show();
			if (t._uploadFileLength()>0) {
				t.$filePannel.removeClass('disnone');
			} else {
				t.$filePannel.addClass('disnone');
			}
		}	// say

		//$$  poll의 선택지 개수 return
		, '_istherePoll' : function(){
			return this.$votePannel.find('li[name=poll]').length;
		}

		//$$ 설문 작성에 따른 전송 버튼 활성화/비활성화
		, 'pumpUpThePoll' : function(fong){
			var t = Cellz.some$thing.t
				, tong = t._checkPoll()				
				;

//			console.log(1640, 'pumpUpThePoll', fong);

			if (tong>1) {
				t.$cellBtnPoll.addClass('btn_cfm2');
			} else {
				t.$cellBtnPoll.removeClass('btn_cfm2');
			}

			return tong;
		}

		//$$  poll의 선택지 내용이 있는지 판별, 글 작성 여부 판별 처리
		, '_checkPoll' : function(){
			var t = Cellz.some$thing.t
				, $polls = t.$votePannel.find('li[name=poll]')
				, i
				, ii = $polls.length
//				, _last = ii - 1
				, _vote
				, _kong = 0
//				, _pollval = $.trim(t.$pollSomething.find('div.input_area textarea').val())
				, _pollval = $.trim(t.$pollSomething.find('div.input_area input').val())
				;				

			if (_pollval === $First$Poll || _pollval.length == 0) {
				_kong = -1;
			} else {
				for (i=0 ;i<ii ;i++ ) {
					_vote = $.trim($($polls[i]).find('input').val());
					if (_vote.indexOf($First$Vote) == -1 && _vote.length > 0) {	// 4071 : 2013-06-17 선택지가 2개 이상 입력 되면 [OK] 가능
						_kong = i+1;
					}						
				}	// for
			}
			return _kong;			
		}

		//$$  poll의 선택지 추가/삭제 관련 처리
		, 'managePoll' : function(idx){
			var t = this
				, $clone
				, _last = t.$votePannel.find('li[name=poll]:last')
				, _l = _last.data('idx')
				, _count = t._istherePoll()
				;

			if ( _count > 1 && _count < 5  && idx == _l ) {
				$clone = t.makePoll(t.pollIdx++);						
				t.$votePannel.find('ul').append($clone);
				t.pumpUpThePoll('managerPoll');
			}

			if (t._istherePoll()>2) {	// 2013-03-24 : 3개 이상이면 삭제 활성화
				t.$votePannel.find('li[name=poll] span').removeClass('disnone');
			} else {
				t.$votePannel.find('li[name=poll] span').addClass('disnone');
			}
		}			

		//$$  poll의 새로운 선택지를 만든다.
		, 'makePoll' : function(idx){
			var t = this
				, _poll = t.$voteTpl.clone().removeClass('disnone');

			_poll
				.attr('name', 'poll')
				.attr('id', '')
				.data('idx', idx)				
				.bind({ 
					'click' : function(){
						t.managePoll($(this).data('idx'));
					}						
				})
				.find('div.input_area span.num_box').hide().end()
				.find('div.input_area input.input_txt')
					.val($First$Vote)
					.bind({
						'focus':function(event){
							var me = this;
							$(me)
//								.css('color', color$Focus)
								.parent().addClass('input_focus')
								.parent().find('span.num_box').show();

//							event.preventDefault();
//							event.stopPropagation();

							if ( $(me).val().indexOf($First$Vote) > -1 ) {
								$(me).val('');
							}			
						}
						, 'blur':function(){
							var me = this;
							$(me)
//								.css('color', color$Blur)
								.parent().removeClass('input_focus').end()
								.parent().find('span.num_box').hide()
								;

							if ( $(me).val() === '' ) {
								$(me).val($First$Vote);
							}
						}
						, 'keyup' : function(event){
							var me = this
								, _val = $(me).val()
								, _len = checkStrLen(_val);

							t.pumpUpThePoll('key up input_txt');
							$(me).parent().find('span.num_box').text(_len.sum+'/'+VOTEMAXLENGTH);
						}
					})
					.end()
				.find('span.btn_del').bind('click',function(event){
					var me = this;
					event.preventDefault();
					event.stopPropagation();
					if (t._istherePoll()>2) {
						$(me).parent().remove();
						t.pumpUpThePoll('span.btn_del');
						if (t._istherePoll()==2) {
							t.$votePannel.find('li[name=poll] span').addClass('disnone');
						}
					}							
				}).end();

			return _poll;
		}

		//$$  say something 상단 poll 클릭시 poll tab 을 연다
		, 'poll' : function(){	// open poll tab
			var t = this
				, $clone				
				, i, ii
				, _poll = t.$pollSomething
				, _height = _poll.css('height')
				, _time = _height === $Height$Poll ? $time$HALF : 0
				;

			t.$button.hide();

			if (!t._istherePoll()) {
				for (i=t.pollIdx,ii=t.pollIdx+2;i<ii ;i++ ) {
					$clone = t.makePoll(i);						
					t.$votePannel.find('ul').append($clone);
				}
				t.$votePannel.find('li[name=poll] span');
				t.pollIdx = i;
			}				

			t.$sayAndPoll.removeClass('create_area').addClass('poll_area');
			t.$saySomething.hide();
//				$pollSomething.find('div.input_area input.input_txt').val($First$Poll);	// 2013-05-01
//			t.$pollSomething.find('div.input_area textarea').val($First$Poll);
			t.$pollSomething.find('div.input_area input').val($First$Poll);
			t.$pollSomething.show();

			_poll.show()
				.animate({'padding':'10px', 'padding-bottom':'30px'}, _time, function(){
					_poll.css('height','');
				});
			
			t.$votePannel.show();
			t.$voteName.show();

			t.$filePannel.addClass('disnone');
		}	// poll

		//$$  something 의 입력된 내용이 text 인지 html 인지 판별
		, '_checkValue' : function(value){
			var outer = value.outerHTML
				, _text = $(value).text()
				, _node = $(value).context.nodeName.toUpperCase()
				, _type = 'html'
				, _value = outer;

			if (undefined === outer) {
				_type = 'text';
				_value = _text;
			}
			
			return {'type':_type, 'value':_value, 'text':_text, 'node':_node, 'length':_text.length};
		}

//////////////// 4071 : 2013-05-10 START //////////////

		//$$  enter 입력 된 줄의 마지막 값을 구해서 anything 에 저장
		, '_findLastSpace' : function(kong){
			var _code
				, i
				;
			for (i =kong.length; i ; i-- ) {
				_code = _charCode(kong.substring(i-1,i));
				if ( _code == KEY.space || _code == KEY.tab || _code == KEY.chromeSpace  ) {	// ' ', '\t' 160:chrome 에서의 space
					break;
				}
			}
			return i;
		}
		
		//$$  enter 입력시 줄의 마지막 값 check
		, '_lastValue' : function(value){
			var t = this
				, _text = $(value).text()
				, _before
				, _lastWord
				;

			_before = t._findLastSpace(_text);
			_lastWord = _text.substring(_before);

			if (_lastWord !== '' && /([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(_lastWord)) {
				t.anything.last = _lastWord;
				t.anything.kind = 'url';
				t.anything.count = 0;					
			} else {	// delete previous value..
				t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
			}
		}
//////////////// 4071 : 2013-05-10 END //////////////

		//$$  사용자 입력 caret 에 초점이 가도록 처리
		// 4071 : 2013-06-13 Jekyll : 파일 업로드시 #say_something의 focus를 #hyde_something 로 옮긴다.
		, 'caret' : function(Jekyll){	// focus at caret's position
			var t = this
				, el = !!Jekyll ? t.$hydeSomething : t.$saySomething
				, cc
				, range
				, selection
				;

			if (!!Jekyll) {
				t.$hydeSomething.append($CORE$caret);
			} else {
				el.blur();
			}
			try {
				cc = el.find('#'+$caret$ID)[0];
				// 4071 : 2013-05-30 START
				// IE, 그외 구분해서 처리
				if (document.selection) {	
					range = document.body.createTextRange();
					range.moveToElementText(cc);
					range.select();
					$(cc).remove();
				} else if (window.getSelection) {
					range = document.createRange();
					range.selectNode(cc);
					selection = window.getSelection();
					selection.removeAllRanges();				
					selection.addRange(range);
					range.deleteContents();
				}
				// 4071 : 2013-05-30 END
			} catch (e) {
				console.log(1923, ' Error: ', e);
			}
			if (!Jekyll) {
				el.focus();
			}
		}

		// 4071 : 2013-03-01
		//$$  something 의 내용을 바탕으로 내용별 json 을 만든다. (text, nametag, url clipping.. )
		, '_con2Json' : function(){	// make json from contents
			var t = this
				, $arrContents = t.$saySomething.contents()
				, i, ii
				, $paragraph
				, $paragraphText
				, $paragraphHtml
				, $paragraphContents
				, j, jj
				, _cv	// to save _checkValue result
				, _cons = []
				, _imgUrl
				, _value
				, _stamp = ''
				, _code = ''
				, _title
				, _content
				, _urlpushed = false
				, _urlBRPushed = false
				, map$search
				, map$jb
				, map$kb
				, map$address
				, map$song
				;

			for (i=0,ii=$arrContents.length; i<ii; i++) {
				$paragraph		= $($arrContents[i]);					
				$paragraphText	= $paragraph.text();
				$paragraphHtml	= $paragraph.html();

				if (undefined === $paragraphHtml) {	// text
					if (i>0) {
						_cons.push({'type':'text', 'content':' '});
					}
					if ($paragraphText.length>0) {
						_value = $paragraphText;
						_cons.push({'type':'text', 'content':_value});
					}						
				} else if ($paragraph.is('span.tag_name')) {
					if (i>0) {
						_cons.push({'type':'text', 'content':' '});	// 2013-04-03 &nbsp -> ' '
					}
					_cons.push({
						'type':'nameTag'
						, 'content':{
							'name': $paragraph.text()
							, 'url': ''
							, 'id':$paragraph.attr('id')											
							, 'groupId':$paragraph.attr('groupId')
						}
					});						
				} else if ($paragraph.is('span.somethingUrl')) {	// br
					if (i>0) {
						_cons.push({'type':'text', 'content':' '});
					}

					_stamp = $paragraph.attr('stamp');
					_code = $paragraph.attr('code');

					if (t.$saySomething.find('div[urlStamp='+_stamp+']').length > 0) {
						_cons.push({'type':'link', 'content':_code});	// url clipping  정보가 있는것
					} else {
						_cons.push({'type':'text', 'content':_code});
					}						
				} else if ($paragraph.is('div[name='+$PANNEL$url+']')) {	// url	#say_url_pannel
					if (i>0) {
						if (_urlpushed) {
							if (!_urlBRPushed) {
								_cons.push({'type':'text', 'content':'\n'});
								_urlBRPushed = true;
							} else {
								_urlBRPushed = false;
								_urlpushed = false;
							}							
						} else {
							_cons.push({'type':'text', 'content':'\n'});
						}
					}
					_imgUrl = $paragraph.find('.thmb img').attr('src') || '';
					_title = $paragraph.find('#title_edit input.input_txt').val() || $paragraph.find('#title').text();
					_content = $paragraph.find('#desc_edit .create_write2').val() || $paragraph.find('#desc').text();

					if (!!_imgUrl) {
						_imgUrl = $url$Image+ _imgUrl + '&w=90&path=/'+$company$ID+'/'+ (new Date().format('yyyyMMdd'));
					}

					_cons.push({
						'type':'url'
						, 'content':{
							'link': $paragraph.attr('url')
							, 'imageUrl': _imgUrl 
							, 'movieUrl':''
							, 'title': _title
							, 'from':''
							, 'contents': _content
						}
					});
					_urlpushed	= true;
				} else if ($paragraph.is('div[name='+$PANNEL$map+']')) {

					map$search	= $paragraph.attr('search');
					map$jb		= $paragraph.attr('jb');
					map$kb		= $paragraph.attr('kb');
					map$address	= $paragraph.attr('address');
					map$song	= $paragraph.attr('song');

					_imgUrl		= $url$Image+ map$song + '&w=416&h=219&path=/'+$company$ID+'/'+ (new Date().format('yyyyMMdd'));

					_cons.push({
						'type':'map'
						, 'content':{
							'search': map$search
							, 'img' : _imgUrl
							, 'Lat': map$jb 
							, 'Lng': map$kb
							, 'address': map$address
						}
					});

				} else {	// nameTag or text
					$paragraphContents = $paragraph.contents();
					if (i>0) {
						if (_urlpushed) {
							if (!_urlBRPushed) {
								_cons.push({'type':'text', 'content':'\n'});
								_urlBRPushed	= true;
							} else {
								_urlBRPushed	= false;
								_urlpushed		= false;
							}							
						} else {
							_cons.push({'type':'text', 'content':'\n'});
						}							
					}
					for (j=0, jj = $paragraphContents.length;j<jj ;j++ ) {
						_cv = t._checkValue($paragraphContents[j]);
						if (_cv.type == 'html') {
							if ($(_cv.value).is('span.tag_name')) {
								_cons.push({
									'type':'nameTag'
									, 'content':{
										'name': $(_cv.value).text()
										, 'url': ''
										, 'id':$(_cv.value).attr('id')
										, 'groupId':$(_cv.value).attr('groupId')
									}
								});
							}

							if ($(_cv.value).is('span.somethingUrl')) {									
								_stamp = $(_cv.value).attr('stamp');
								_code = $(_cv.value).attr('code');

								if (t.$saySomething.find('div[urlStamp='+_stamp+']').length > 0) {
									_cons.push({'type':'link', 'content':_code});	// url clipping  정보가 있는것
								} else {
									_cons.push({'type':'text', 'content':_code});
								}
							}

							if ($(_cv.value).is('div[name='+$PANNEL$url+']')) {
								if (j>0) {
									if (_urlpushed) {
										if (!_urlBRPushed) {
											_cons.push({'type':'text', 'content':'\n'});
											_urlBRPushed = true;
										} else {
											_urlBRPushed = false;
											_urlpushed = false;
										}							
									} else {
										_cons.push({'type':'text', 'content':'\n'});
									}
								}
								_imgUrl = $(_cv.value).find('.thmb img').attr('src') || '';
								_title = $(_cv.value).find('#title_edit input.input_txt').val() || $(_cv.value).find('#title').text();
								_content = $(_cv.value).find('#desc_edit .create_write2').val() || $(_cv.value).find('#desc').text();

								if (!!_imgUrl) {
									_imgUrl = $url$Image+ _imgUrl + '&w=90&path=/'+$company$ID+'/'+ (new Date().format('yyyyMMdd'));
								}

								_cons.push({
									'type':'url'
									, 'content':{
										'link': $(_cv.value).attr('url')
										, 'imageUrl': _imgUrl 
										, 'movieUrl':''
										, 'title': _title
										, 'from':''
										, 'contents': _content
									}
								});
								_urlpushed = true;
							}

						} else {
							if (_cv.value.length > 0) {
								_value = _cv.value;
								_cons.push({'type':'text', 'content':_value});
							}								
						}

						if (j>0) {
							_cons.push({'type':'text', 'content':' '});								
						}
					}	//for (j=0, jj = $paragraphContents.length;j<jj ;j++ ) {
				}					
			}	// for				 
			if (_cons.length==0) {
				_cons = undefined;
			}
			return _cons;
		}

		//$$  검색의 결과를 보여준다.
		// 2013-06-12 name 추가 이전 검색 기록과 현재의 showPeople 비교 하기 위함
		, 'showPeople' : function(people, name){	// ajax call, show $peopleList's Div
			var t = this
				, $ul = $('<ul/>').addClass('lst')
				, $li, $a
				, one	// 결과값 중 한사람
				, i, ii
				, _height = parseInt($Height$Cell,10)

				, positionName
				, memberGroupID = !!Cellz.PARAM.GROUPID ? Cellz.PARAM.GROUPID : ''
				, $img = ''
				, _groupId
				, _groupName
				;
							
			if (t.istherePeople()) {
				if (t.last$successName === name) {
					return ;	// discard result
				}
				t.hidePeople(true);
			}

			for (i=0, ii=people.length ; i< ii; i++ ) {	// positionName
				one = people[i];
				_groupId = 0;
				_groupName = '';
				one.deptGroup && ( _groupId = one.deptGroup.groupId, _groupName = ' | '+one.deptGroup.groupName);
				positionName = '';
				one.positionName && (positionName = one.positionName);

				if (!!one.profileImage) {
					$img = $('<span/>').addClass('thmb').append($('<img/>').attr('src',	'/api/v1/file/thumbnail?fname='+one.profileImage+'&w=28&h=28'));
				} else {
					$img = $('<span/>').addClass('thmb');
				}

				$a = $('<a/>').attr('href','#')
						.append($img)
						.append($('<strong/>').addClass('u_name').html(one.name+ ' | ' + positionName ))
						.append($('<span/>').append($('<span/>').html(one.mainCompany.companyName+_groupName))
											.append($('<span/>').addClass('bar').html(' | '))
											.append($('<span/>').html(one.deptName)))
						;
				
				$li = $('<li/>')
						.append($a)
						.data('id', one.userId)	// deptGroup.groupId
						.data('groupId', _groupId)
						.data('isMember', !!one.isMember ? 1 : 0)	
						.data('name', one.name)
						.bind({
							'click' : function(event){
								var me = this
									, isMember = $(me).data('isMember')
									, alertMsg = undefined
									;

								if (!!memberGroupID ) {
									if (isMember != 1) {
										alertMsg = $MSG$other;
									}
								}
								t.setNameTag($(me).data('name'), $(me).data('id'), $(me).data('groupId'), alertMsg);
							}
							, 'mouseover':function(){								
								$(this).addClass('cellz_name_selected');
							}
							, 'mouseout':function(){						
								$(this).removeClass('cellz_name_selected');								
							}
						})
						;
				
				$ul.append($li);					
			}	// for

//			_height = _height * (Number(t.whereIam())+1) + $Height$Base;
			_height = t.whereIam() + $Height$Base;

			t.$peopleList.show()
				.css('top',_height+'px')
				.append($ul);

			t.last$successName = name;

		}	// showPeople

		//$$  nameTag 검색 결과가 있는가?
		, 'istherePeople' : function(){
			var t = this
				, $_list = t.$peopleList.find('li')	// 2013-06-12
				;

			return $_list.length > 0 ? true : false;
		}

		//$$  base(p/div) attr name 을 check 해서 2개 이상의 div 가 있을때 이전 것과 같으면 다른 이름으로 2013-05-09
		// enter 입력시 불려 진다.
		// 그리고 그 이름 return
		, 'whenBaseCalled' : function(){
			var t = this
				, i
				, ii
				, $arrContents = t.$saySomething.contents()					
				, pong = undefined	// 이전 이름 저장
				, cong = undefined	// 현재 이름
				, bong = undefined	// check event binding
				, date = new Date()
				, timeStamp = date.getTime()
				, beau = undefined	// 1.아름다운, 예쁜, 건강미 있는  2.미  3.미인, 미녀 프랑스어
				, $paragraph			// enter 를 친줄 내용
				, $paragraphContents	// enter 를 친줄 내용들
				;

			for (i=0, ii=$arrContents.length ;i<ii ;i++ ) {
				cong = $($arrContents[i]).attr('name');
				bong = $($arrContents[i]).attr('bong');
				if (!bong && cong !== $PANNEL$url) {
					$($arrContents[i]).bind('click', function(){
						var me = this;
						t.house = $(me).attr('name');
						$(me).attr('bong', 'bong');
					});
				}

				if (_browserInfo_.ie && i===0 && !cong) {	// ie 에서 첫줄
					$($arrContents[0]).attr('name', $First$Name);
				}
				if (i>0) {						
					if (pong === cong) {	// 이전 이름과 현재 이름이 같으면 현재 이름을 바꾸고 새로운 이름 return
						beau = 'beau_' + timeStamp;
						$($arrContents[i]).attr('name', beau);
						t.maison = pong;							
						t.house = beau;						
						break;
					}
				}	// if
				pong =  cong;	// pong prev+cong 이전 이름
			}	// for

////////// 4071 : 2013-05-10 START /////////////				
			// check 이전 줄 내용
			if (_browserInfo_.ie && t.maison === undefined) {	// for loop 안에서 하면 error 발생 초기 값이 undefined 라 다음값과 비교 불가
				t.maison = $First$Name;
			}

			$paragraph = t.$saySomething.find($BASE+'[name='+t.maison+']');	
			$paragraphContents = $paragraph.contents();

			ii = $paragraphContents.length;	// $paragraphContents[ii-1] : 이전 줄의 마지막 내용

			t._lastValue($paragraphContents[ii-1]);

//////////// 4071 : 2013-05-10 END //////////				

			return beau;
		}	// whenBaseCalled

		//$$ nameTag 관련 caret 이 있는 곳까지는 height
		// 4071 : 2013-07-16 START
		, 'whereIam' : function(){
			var t = this
				, $arrContents = t.$saySomething.contents()
				, i = 0
				, ii = $arrContents.length				
				, cong = undefined
				, pong = 0
				, _height = parseInt($Height$Cell,10)	// default
				;			

			if ( !t.anything.story || !t.anything.story.name || ii == 1) {
				return _height;
			}

			for (i=0 ;i<ii ;i++ ) {
				cong = $($arrContents[i]).attr('name');
				pong += $($arrContents[i]).innerHeight();
				if (cong == t.anything.story.name) {					
					break;
				}
			}
			return pong;
		}
		// 4071 : 2013-07-16 END

		//$$  검색 결과를 지우고 감춘다.
		, 'hidePeople' : function(on){	// hide : $peopleList div			
			var t = this;
			t.$peopleList.scrollTop(0);	// 4071 : 2013-04-29 scroll 초기화
			t.$peopleList.empty().hide();	//addClass('disnone');
			t.last$successName = undefined;
		}

		//$$  nameTag 정보가 선택 되었는지 판별
		, 'selectedPeople' : function(){
			var t = this
				, $_selected = t.$peopleList.find('li.cellz_name_selected')
				;

			return $_selected.length > 0 ? true : false;
		}

		//$$  사용자의 enter 입력을 받아 nameTag 정보 설정
		, 'setPeopleInfo' : function(){
			var t = this
				, $_selected = t.$peopleList.find('li.cellz_name_selected')
				, memberGroupID = !!Cellz.PARAM.GROUPID ? Cellz.PARAM.GROUPID : ''
				, isMember = $_selected.data('isMember')
				, alertMsg = undefined
				;

			if (!!memberGroupID ) {
				if (isMember != 1) {
					alertMsg = $MSG$other;
//					alert($MSG$other);
				}
			}

			t.last$successName = undefined;

			t.setNameTag($_selected.data('name'), $_selected.data('id'), $_selected.data('groupId'), alertMsg);
		}

		//$$  방향키에 따라 nameTag.. 목록 이동
		, 'choosePeople' : function(key){
			var t = this
				, $_people = t.$peopleList.find('li')
				, isSelected = t.selectedPeople()
				, i
				, ii = $_people.length
				, pivot = undefined
				, next = undefined
				, _scrollTop = 0
				;

			if (!isSelected) {
				if (key == KEY.down) {
					t.$peopleList.find('li:first').addClass('cellz_name_selected');
				}
			} else {					
				// find cellz_name_selected
				if (key == KEY.down || key == KEY.up) {
					for (i=0;i<ii ;i++ ) {
						if ($($_people[i]).hasClass('cellz_name_selected')) {
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

/////////////////////////// 4071 : 2013-04-28 START /////////////
						_scrollTop = next - $SCROLLBASE;
						_scrollTop = _scrollTop > 0 ? _scrollTop : 0;

						t.$peopleList.scrollTop(_scrollTop * $SCROLLHEIGHT);						
/////////////////////////// 4071 : 2013-04-28 END /////////////

						for (i=0;i<ii ;i++ ) {
							if (i===pivot) {
								$($_people[i]).removeClass('cellz_name_selected');
							}
							if (i===next) {
								$($_people[i]).addClass('cellz_name_selected');
							}
						}
					}
				}	// if (key == KEY.down || key == KEY.up) {
			}	// if ($_selected.length === 0) {
		}	// choosePeople

		//$$  url clipping edit 모드 전환
		, 'clipEdit' : function(node){
			var _title = node.find('#title').text()
				, _content = node.find('#desc').text()
				, _tLen = checkStrLen(_title)
				, _tLength = _tLen.sum
				, _cLen = checkStrLen(_content)
				, _cLength = _cLen.sum
				;

			node.find('#title').addClass('disnone').end()
				.find('#title_edit').removeClass('disnone')
					.find('.input_txt').val(_title).bind('keyup',function(){
						var me = this
							, _title = $(me).val()
							, _len = checkStrLen(_title);
						$(me).parent().find('span.num_box').text(_len.sum+'/'+LEN$TITLE);
					}).end()
					.find('.num_box').html(_tLength+ '/'+LEN$TITLE).end()
				.end()						
				.find('#desc').addClass('disnone').end()
				.find('#desc_edit').removeClass('disnone')
					.find('.create_write2').val(_content).bind('keyup',function(){
						var me = this
							, _desc = $(me).val()
							, _len = checkStrLen(_desc);
						$(me).parent().find('span.num_box').text(_len.sum+'/'+LEN$CONG);
					}).end()
					.find('.num_box').html(_cLength+ '/'+LEN$CONG).end()
				.end();
			if (node.find('.thmb div').length > 0) {
				node
					.find('.btn_clse').removeClass('disnone').bind('click',function(event){
							var me = this;
							event.preventDefault();
							event.stopPropagation();
							$(me).parent().parent().find('.thmb').remove();
						});				
			}
				
		}

		//$$  url clipping edit 이후 처리
		, 'clipEditDone' : function(node){
			var _title = node.find('#title_edit .input_txt').val()
				, _content = node.find('#desc_edit .create_write2').val()
				;

			node.find('#title').removeClass('disnone').html(_title).end()
				.find('#title_edit').addClass('disnone').end()											
				.find('#desc').removeClass('disnone').html(_content).end()
				.find('#desc_edit').addClass('disnone').end()
				.find('.btn_clse').addClass('disnone');
		}

		//$$  url clipping data를 something 영역에 추가
		, 'clipping' : function(data){
			var t = Cellz.some$thing.t
				, urlPannel	= t.$urlPannel.clone().removeClass('disnone').addClass('link_view')
				, u = data.url
				;

			if (t.markerStory.youtube) {
				Cellz.screen.deleteLoader();
			}

			if (u.length > 50) {
				u = u.substring(0, 47) + '...';
			}			

			urlPannel
				.attr('id', '')
				.attr('name', $PANNEL$url)
				.attr('contenteditable', $CONTENTEDITABLE)
				.attr('urlStamp', t.markerStory.urlStamp)
				.attr('url', data.url)
//				.attr('unselectable', 'on')	// for ie					
				.find('div.view_area #title').html(data.title).end()
				.find('div.view_area .link').html(u).end()
				.find('div.view_area #desc').html(data.content).end()
				.find('a.btn_modify').bind('click',function(event){
						var me = this;
						event.preventDefault();
						event.stopPropagation();
						if ($(me).parent().find('div.view_area #title').hasClass('disnone')) {
							t.clipEditDone($(me).parent());
						} else {
							t.clipEdit($(me).parent());
						}							
					}).end()
				.find('a.btn_del').bind('click',function(event){
						var me = this;
						event.preventDefault();
						event.stopPropagation();
						$(me).parent().remove();
						Cellz.some$thing.t.pumpUpTheCell('remove url link');
					})
					;

			if (data.imageUrls !== undefined && data.imageUrls.length > 0) {
				urlPannel
					.find('div.thmb img').attr('src',data.imageUrls[0]).end()
					.find('div.thmb .ar_btn_area').addClass('disnone').end()	// hide < >
					.find('div.thmb a[name=delThum]').addClass('disnone').end();	// $('div[name=urlPannel] .thmb a').addClass('disnone')
			} else {
				urlPannel.find('div.thmb').remove();
			}

/////////////////////####################// 4071 : 2013-06-03 START
			if (_browserInfo_.ie && _ieVersion == 9) {
				urlPannel
//					.attr('contenteditable', $CONTENTEDITABLE)
					.attr('unselectable', 'on')
					.find('div.thmb').attr('unselectable', 'on')
						.find('img').attr('unselectable', 'on').end()
						.find('div.ar_btn_area').remove().end()
						.find('a.btn_clse').remove().end()
					.end()
					.find('div.view_area').attr('unselectable', 'on').end()
					.find('a.btn_modify').remove().end()
					.find('a.btn_del').remove().end()
					;
			}
/////////////////////####################// 4071 : 2013-06-03 END

			t.$saySomething.find($BASE+'[name='+t.house+']').before(urlPannel).prepend($CORE$caret);

			// 2013-04-27 마지막 정리정돈
			setTimeout(function(){
				t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
				t.houseStory = {'clipAfter':t.house};
				t.caret();	// t.$saySomething
			}, 10);
		}	// clipping

		//$$  url clipping 시 youtube 관련 처리
		, 'youtube' : function(data){
			var title = data.entry.title.$t
				, content = data.entry.media$group.media$description.$t
				, _whoamI = Cellz.some$thing.w	// Cellz.some$thing = {'t':t, 'w':t.whoamI};
				, t
				, c
				;

			t = Cellz.con$scissors(title, LEN$TITLE);
			c = Cellz.con$scissors(content, LEN$CONG);	// 내용 자르기

			Cellz[_whoamI+'$clipping']({
				'title': t
				, 'url': data.entry.media$group.media$player.url
				, 'imageUrls':[data.entry.media$group.media$thumbnail[0].url]
				, 'content': c.replace(/\n/g, '<br/>')
			});
		}		

		, 'setNameTag' : function(name, id, groupId, alertMsg){
			var t = this;
			alertMsg = !!alertMsg ? alertMsg : '';
			t._con2New(t.anything.story, 'name', {'search':t.anything.last, 'name':name, 'id':id, 'groupId':groupId, 'alert':alertMsg});
		}	// setNameTag

////////  4071 : 2013-05-12 START ///////////////
		// tong : faste
		// data : nameTag
		, '_con2New' : function(tong, mode, data){	// 새로운 내용 추가: nameTag, url, copy & paste , data: anything	// data : name
			var t = this
				, date = new Date()
				, timeStamp = date.getTime()
				, _urlStamp = 'url_'+timeStamp
				, _Stamp = 's_'+timeStamp
				, IE_NO$BASE = _browserInfo_.ie && (t.$saySomething.find('p').length === 0 ? true : false)	// 2013-04-11 <p> 가 있는지 확인, 없다면 한줄
				, i
				, ii
				, $paragraph = undefined
				, _cv
				, currentSum = 0
				, nextStartPosition = undefined
				, isNext = false
				, prevCont = '', nextCont = ''	// 초기 값 : if ($saySomething.text() !== '') { 부분에서 결정 $saySomething 내용이 없다면 초기값
				, _search_ = undefined
				, _new_	= ''
				, $buffer$ = ''
				, $_pasteBuffer = t.$sayAndPoll.find('#pasteBuffer').val()
				, _tmp				
				, tongName = undefined
				, whiteSpace = ''
				, lastManAlerting = mode === 'name' ? data.alert : ''
				;
			
			if (mode === 'faste') {	// $buffer$
				if ($_pasteBuffer !== undefined && $_pasteBuffer !== '') {
					$buffer$ = $_pasteBuffer.split('\n');
				} else {
					$buffer$ = ''.split('\n');
				}
			} else if (mode === 'youtube' || mode === 'url') {
				t.markerStory = {'urlStamp':_urlStamp, 'youtube':(mode === 'youtube')};	// 'clipping' 에서 marking 해 놓은 정보를 찾기 위함
				_search_ = t.anything.last;
				_new_ = '<span class=somethingUrl code=\''+t.anything.last+'\' contentEditable='+$CONTENTEDITABLE+' stamp='+_urlStamp+'> '+t.anything.last+' </span>'+$CORE$caret;	// 2013-04-12

			} else {	// nameTag
				_new_ = '<span class=tag_name contentEditable='+$CONTENTEDITABLE+' id='+data.id+' groupId='+data.groupId+'>'+data.name+'</span>'+ $CORE$caret;	// 2013-04-12
				_search_ = namePrefix + data.search;
			}

///////////////////////////////// 2013-04-11 START /////////////////////////////////////////
			if (t.$saySomething.text() !== '') {

				if (IE_NO$BASE) {
					$paragraph = t.$saySomething;
				} else {
					if (mode === 'youtube' || mode === 'url') {
						$paragraph = t.$saySomething.find($BASE+'[name='+t.maison+']');
					} else {
						$paragraph = t.$saySomething.find($BASE+'[name='+tong.name+']');
					}
				}

				if (mode === 'youtube' || mode === 'url') {
					nextStartPosition = t.$saySomething.find($BASE+'[name='+t.maison+']').text().length;
				}

				if (mode === 'name' || mode === 'faste') {
					nextStartPosition = tong.length;
				}

				$paragraphContents = $paragraph.contents();

				for (i=0, ii=$paragraphContents.length; i<ii; i++) {
					_cv = t._checkValue($paragraphContents[i]);

					currentSum += _cv.length;	// $($paragraphContents[i]).text().length;

					if (isNext) {
						nextCont += _cv.value;
					} else {
						if (nextStartPosition > currentSum) {
							prevCont += _cv.value;
						} else {	// 2013-02-26 : offset 고려합시다. => offsetPosition
							// startNextP
							if (_cv.type==='html' && ((_browserInfo_.ie && _cv.node !== 'A' && _cv.node !== 'EM') || (_browserInfo_.chrome && (_cv.node !== 'I' && _cv.node !== 'BR'))) ) {
								prevCont += _cv.value;	
							} else {	// _cv.type === 'text' 일때 값중에서 name 부분이 있는지 check
								if (nextStartPosition <= _cv.length) {	// 2013-04-10 맞게 찾아서 바꾸는지 살펴보자
									if (!_search_){												
										prevCont += _cv.text.substring(0, nextStartPosition);
										nextCont += _cv.text.substring(nextStartPosition);
									} else {
										_tmp = _cv.text.lastIndexOf(_search_);	// 4071 : 2013-05-10

										if (_tmp>-1) {
											prevCont += _cv.text.substring(0, _tmp);
											nextCont += _cv.text.substring(_tmp+_search_.length);
										}
									}
									isNext = true;
								}

								if (!isNext) {
									prevCont += _cv.value;
								}
							}	// if (_cv.type==='html' && _cv.node !== 'A') {
						}	// if (startNextP > currentSum) {
						nextStartPosition -= _cv.length;
					}	// if (isNext) {
				}	// for

			}	//if ($saySomething.text() !== '') {

			if (mode === 'name' || mode === 'faste') {
				if (IE_NO$BASE) {
					tongName = $First$Name;
				} else {
					tongName = tong.name;
				}
			}

			if (mode === 'faste' && $buffer$.length > 1) {	// $buffer$, _Stamp
////////////////////////// paste 된 내용의 첫줄 처리 부분 START
				if (IE_NO$BASE) {
					t.$saySomething.html('<'+$BASE+' name='+tongName+'>'+prevCont + whiteSpace + $buffer$[0] + '</'+$BASE+'>');
				} else {
					t.$saySomething.find($BASE+'[name='+tongName+']')
						.html(prevCont + whiteSpace + $buffer$[0]);
				}
////////////////////////// paste 된 내용의 첫줄 처리 부분 END

////////////////////////// paste 첫줄 이외의 내용 처리 부분 START
				for (i=1, ii= $buffer$.length-1;i<ii ;i++ ) {
					if (i==1) {
						t.$saySomething.find($BASE+'[name='+tongName+']')
							.after('<'+$BASE+' name='+_Stamp+'_'+i+'>' + $buffer$[i] + '</'+$BASE+'>');
					} else {
						t.$saySomething.find($BASE+'[name='+_Stamp+'_'+(i-1)+']')
							.after('<'+$BASE+' name='+_Stamp+'_'+i+'>' + $buffer$[i] + '</'+$BASE+'>');
					}
				}
////////////////////////// paste 첫줄 이외의 내용 처리 부분 END

				
////////////////////////// paste 마무리 START
/// 4071 : 2013-05-17 START ////// 2줄인 경우 처리 추가
				if (i===1) {
					t.$saySomething.find($BASE+'[name='+tongName+']')
							.after('<'+$BASE+' name='+_Stamp+'_'+i+'>' +$buffer$[i] + $CORE$caret + nextCont + '</'+$BASE+'>');
				} else {
					t.$saySomething.find($BASE+'[name='+_Stamp+'_'+(i-1)+']')
						.after('<'+$BASE+' name='+_Stamp+'>'+$buffer$[i] + $CORE$caret + nextCont+'</'+$BASE+'>');
				}
/// 4071 : 2013-05-17 END //////
////////////////////////// paste 마무리 END

			} else {
				if (mode === 'faste') {
					_new_ = whiteSpace + $buffer$[0] + $CORE$caret ;
				}

				if (IE_NO$BASE) {
					t.$saySomething.html(prevCont + _new_ + nextCont);
				} else {
					if (mode === 'youtube' || mode === 'url') {
						t.$saySomething.find($BASE+'[name='+t.maison+']').html(prevCont + _new_ + nextCont);
					} else {
						t.$saySomething.find($BASE+'[name='+tongName+']').html(prevCont + _new_ + nextCont);
					}						
				}

			}	// if (mode === 'faste' && $buffer$.length > 1) {	// $buffer$, _Stamp

///////////////////////////////// 2013-04-11 END /////////////////////////////////////////

			if (mode === 'name') {
				t.hidePeople();				
			}

			t.caret();	// t.$saySomething

			if (lastManAlerting) {	// 2013-05-22
				$.util_notice(lastManAlerting);	// 4071 : 2013-06-20 #1139
			}

			if (mode === 'faste') {
				t.$sayAndPoll.find('#pasteBuffer').val('');
			}

			t.pumpUpTheCell('_con2New');

			return true;
		}	// _con2New	
/////// 4071 : 2013-05-12 END //////

		//$$  url clipping 시 youtube.com 이외의 url 을 server에 data 요청 
		, 'url' : function(url){	// append : url clippind data
			var t = this
				, _data
				;

			t.$saySomething.blur();	// blur

			$.ajax({
				url : Cellz.API_URL.SOMETHING.CLIP 
				, type: 'GET'
				, async: true
				, timeout : $time$DEFAULT
				, dataType: 'JSON'
				, data: {
					'url': url
				}
				, error: function(data, status, err) {
					if (status == 'timeout') {
						$.util_notice($TIMEOUT$url);
					} else {
						$.util_notice($CLIP$None);
					}
					t.caret();	// t.$saySomething restore focus					
					Cellz.screen.deleteLoader();
				}
				, success: function(result) {
					_data = result.data;
					if (undefined === _data) {
						return false;
					}

					if (result.result_code == 0) {
						$.util_notice(_data.title);
						t.caret();	// t.$saySomething restore focus
					} else {			
						_data.title	= Cellz.con$scissors(_data.title, LEN$TITLE);
						_data.content = Cellz.con$scissors(_data.content, LEN$CONG);
						t.clipping(_data);
					}
					Cellz.screen.deleteLoader();
				}
			});	// $.ajax({
		}

		, 'map' : function(){
			var t = Cellz.some$thing.t	//this
				, mapPannel	= t.$mapPannel.clone().removeClass('disnone').addClass('map_area_wrap')
				, search = undefined
				, loc = undefined
				, address = undefined
				, date = new Date()
				, timeStamp = date.getTime()
				, mapStamp = 'map_'+timeStamp
				, beau = 'beau_' + timeStamp
				, goMap = undefined
				, _nextLine = _browserInfo_.ie ? '' : '<br>'
				, _whereName = undefined
				, _where
				, kong
				, song = ''
				;

			search		= GoogleMap.selected.search;
			address		= GoogleMap.selected.address;
			loc			= GoogleMap.selected.loc;

			if (search === undefined || address === undefined || loc === undefined) {
				return false;
			}
			
			goMap		= 'https://maps.google.co.kr/maps?f=q&source=s_q&hl=ko&q='+search+'&aq=&sll='+loc.jb+','+loc.kb;
			song		= 'https://maps.googleapis.com/maps/api/staticmap?center='+loc.jb+','+loc.kb
							+'&zoom=16&size=416x219&language=ko&markers=size:mid|color:red|'+loc.jb+','+loc.kb+'&sensor=false&maptype=roadmap';
				
			t.mapClose();

			if (t.houseStory.name !== undefined ) {
				_whereName = t.houseStory.name;
			}

			if (t.houseStory.clipAfter !== undefined ) {
				_whereName = t.houseStory.clipAfter;
			}

			if (!!_whereName && t.$saySomething.find($BASE+'[name='+_whereName+']').length === 0) {
				_whereName = undefined;
			}

			mapPannel
				.attr('id','')
				.attr('name', $PANNEL$map)
				.attr('contenteditable', $CONTENTEDITABLE)
				.attr('unselectable', 'on')
				.attr('mapStamp', mapStamp)
				.attr('search', search)
				.attr('jb', loc.jb)
				.attr('kb', loc.kb)
				.attr('address', address)
				.attr('song', song)				
				.find('div.map_area img').attr('src', song).end()
				.find('div.map_info a[name=search]').attr('href',goMap).html(search).end()
				.find('div.map_info p').html(address).end()
				.find('div.map_info a.map_point').attr('href',goMap).end()
				.find('a.btn_del').bind('click',function(event){
						var me = this;
						event.preventDefault();
						event.stopPropagation();
						$(me).parent().remove();
						Cellz.some$thing.t.pumpUpTheCell('remove map');
					})
					;

			if (_browserInfo_.ie && _ieVersion == 9) {
				mapPannel
					.find('.pic_bor img').attr('unselectable', 'on').end()
					.find('a.btn_del').remove().end()
					;
			}
					
////////////////////// 4071 : 2013-05-13 START ////////////

			if (!!_whereName) {					
				_where = t.$saySomething.find($BASE+'[name='+_whereName+']');
				if (_where.text().length > 0 ) {
					_where
						.after('<'+$BASE+' name='+beau+'>'+ _nextLine + $CORE$caret + '</'+$BASE+'>')
						.after(mapPannel)
						;
					t.houseStory = {'clipAfter':beau};
				} else {
					_where.before(mapPannel).prepend($CORE$caret);
				}
			} else {
				kong = t.$saySomething.text();

				if (kong === $First$Say || kong.length === 0 ) {
					t.$saySomething.empty()
						.append(mapPannel)
						.append('<'+$BASE+' name='+beau+'>'+ _nextLine + $CORE$caret + '</'+$BASE+'>');
				} else {
					t.$saySomething
						.append(mapPannel)
						.append('<'+$BASE+' name='+beau+'>'+ _nextLine + $CORE$caret + '</'+$BASE+'>');
				}					
				t.houseStory = {'clipAfter':beau};
			}

////////////////////// 4071 : 2013-05-13 END ////////////
			t.caret();
			t.pumpUpTheCell('map');
		
		}	// map

		//$$  PC에서 찾기와 Cellz에서 찾기 버튼 활성화
		, 'enableUploadFile' : function(){
			var t = this;
			t.$openBtnFile.removeClass('disabled');
			t.$openBtnCellz.removeClass('disabled');				
		}

		//$$  PC에서 찾기와 Cellz에서 찾기 버튼 비활성화
		, 'disableUploadFile' : function(){
			var t = this;
			t.$openBtnFile.addClass('disabled');
			t.$openBtnCellz.addClass('disabled');
		}

		//$$  'say Something' 문구가 보이도록 초기화
		, 'start' : function(){	// first action when mouseover($sayAndPoll) open say tab : 위에 마우스 올라갈때 동작 정의
			var t = this;
			t.$firstSomething.show();
		}

		//$$ cell, poll 중 내용이 있는지 판단 있으면 true, 없으면 false
		// 4071 : 2013-06-28
		, 'checkContent' : function(){	
			var t = Cellz.some$thing.t
				, say = t.$saySomething
				, poll = t.$pollSomething
				, _show = 'block'
				, _c = false
				;
			
			if (say.css('display').indexOf(_show) > -1) {
				_c = t.pumpUpTheCell('checkCong');
			}

			if (!_c && poll.css('display').indexOf(_show) > -1) {
				_c = t.pumpUpThePoll('checkCong') > -1 ? true : false;
			}

			return _c;
		}

		//$$ 내용 지우기
		// 4071 : 2013-06-28
		, 'clearContent' : function(){
			var t = Cellz.some$thing.t
				;
			t.first();
		}

		//$$  사용자 글쓰기(say, poll) 후 create 영역 초기화
		, 'first' : function(from, message){	// reinitialize
			var t = Cellz.some$thing.t
				, toFirst = !!before$group ? ('' +before$group ) : !!companyName ? ('' + companyName ): 'SDS'
				;
//////////// 2013-03-13 START

			// 4071 : 2013-03-01 내용 초기화
			t.pollIdx = 0;
			t.$pollSomething
//				.find('div.input_area textarea').val($First$Poll).end()	// 2013-05-01
				.find('div.input_area input').val($First$Poll).end()	// 2013-05-01
				.find('span.num_box').hide().end()
				.hide();	

			t.$votePannel.find('li[name=poll]').remove().end().hide();
			t.$voteName.find('div').removeClass('anonymity').end().hide();

			t.$cellBtnPoll.removeClass('btn_cfm2');

			t.cellMaps = {};

			t.$filePannel
				.find('table tr').remove().end()
				.addClass('disnone');

			t.$fileDescPannel.addClass('disnone');

			t.$uploader.maxNumberOfFiles = Cellz.CONFIG.maxNumberOfFiles;	// initialize or reinitialize
			
			if (!!before$group) {
				t.$comTab.hide();
				t.$groupNotice.show();
			}
			t.$saySomething.text($First$Say);
//			t.$comTab.find('span[name=title]').html($First$Say);	// 2013-06-20
			t.$comTab.find('span[name=title]').html('To. '+toFirst);	// 2013-07-05
			t.$cellBtnCreate.removeClass('btn_cfm2');

			t.$tab.hide();
			t.$indicator.hide();
			t.$button.hide();

			t.$sayAndPoll.removeClass('poll_area').addClass('create_area');

			t.$openBtnFile.removeClass('disabled');
			t.$openBtnCellz.removeClass('disabled');	

			t.$saySomething.hide().removeClass('disnone');	// 2013-05-29
			t.$peopleList.hide().removeClass('disnone');	// 2013-05-31

			t.$firstSomething.show();
///////////// 2013-03-13 END

			if (from !== undefined) {
				if (from==='detail') {
					t._hugCellMap();
				} else {
					t.start();
					if (from === 'CELLMAP') {
						t._hugCellMap();
					} else {
						message !== undefined && ($.util_notice(message));
					}
				}
			}
		}	// first

		//$$  say, poll의 글쓰기 처리
		, 'create' : function(bong){
			var t = this
				, _url = Cellz.API_URL.SOMETHING.CREATE
				, _groupID = !!Cellz.PARAM.GROUPID ? Cellz.PARAM.GROUPID : ''
				, _bongFrom = bong.from
				, _Message_ = undefined
				, toFirst = !!before$group ? ('' +before$group ) : !!companyName ? ('' + companyName ): 'SDS'
				, tong = {
						'lastTime': undefined
						, 'viewFilter':'CELL'	// CELL, CELLMAP
						, 'timelineFilter':'ALL'	// FOLLOWING
						, cellType:''
						, contents:''
						, from : ''
						, groupId: _groupID
						, groupNotice : false
						, ancestorUserId: ''
						, ancestorCellId: ''
						, parentUserId: ''
						, parentCellId: ''
						, attachments:{}
						, cellSurveyList:{}
					}
				, cracker = !!t.cellMaps.groupId	// 4071 : 2013-06-18 그룹인지 회사인지 여부
				, $groupChecker = undefined
				; 

			if (!!Cellz.timeline && !!Cellz.timeline.getFirstCellTime && typeof Cellz.timeline.getFirstCellTime === 'function') {
				tong.lastTime = Cellz.timeline.getFirstCellTime();
			}

			if (!!Cellz.topicview && !!Cellz.topicview.getFirstCellTime && typeof Cellz.topicview.getFirstCellTime === 'function') {
				tong.lastTime = Cellz.topicview.getFirstCellTime();
			}

			$.extend(tong, t.cellMaps, bong);

			if (!!tong.groupId) {
				$groupChecker = t.$groupNotice.find(':checkbox');
				$.extend(tong , {'groupNotice':$groupChecker.prop('checked')});
				$groupChecker.prop({'checked':false});
			}

			t.$comTab.find('span[name=title]').html('To. '+toFirst);
			t.$groupNotice.hide();

			if (t.cellMaps !==undefined 
				&& !!CellMap
				&& !!CellMap.cellDetailView
				&& !!CellMap.cellDetailView.removeCellDetailView
				&& typeof CellMap.cellDetailView.removeCellDetailView === 'function') {
				
				CellMap.cellDetailView.removeCellDetailView();
			}
			
			Cellz.screen.setLoader();


			if (!tong.parentCellId) {
				_Message_ = $MSG$created;
			}

			if (!!Cellz.news) {
				Cellz.news.clear();	
			}

			t.$cellBtnCreate.removeClass('bt_cfm2');
			t.$cellBtnPoll.removeClass('btn_cfm2');

			$.ajax({
				url : _url
				, type: 'POST'
				, async: false
				, timeout : $time$DEFAULT
				, dataType: 'JSON'
				, data: tong

				, error: function(data, status, err) {
					t.$loadingBar.hide();
					Cellz.screen.deleteLoader();
					t.cellMaps = {};
				}
				, success: function(result) {
					var cells = undefined
						, _from  = undefined
						;

					t.cellMaps = {};

					if (result.result_code === 1) {

						if (result.data !== undefined && result.data !== null) {
							cells = result.data.cells;
							_from = result.data.from;
						}

						if ( _from ===  'CELLMAP') {
							CellMap.resizeWrapCellMap();
						}
						Cellz.dispatcher.trigger('writeCell', {'cells':cells, 'from': _from, 'group':cracker});
					}

					setTimeout(function(){
						t.$loadingBar.hide();
						Cellz.screen.deleteLoader();
						t.first(_bongFrom, _Message_);
						Cellz.some$thing = FistofTheFirstMen;	// restore first men
					},10);

				}
			});	// $.ajax({
		}	// create
		
		//$$  PC에서 찾기, Cellz에서 찾기, url clipping 관련 error message 출력
		, '_showFileError' : function(message){
			var t = this
				, date = new Date()
				, timeStamp = date.getTime()					
				, _m = $('<tr/>').attr('id','fileError_'+timeStamp).append($('<td/>').html('&nbsp; &nbsp; &nbsp; '+message));	//.addClass('').html(message);

			t.$filePannel.find('table[name=aboutFileError]').append(_m);
			t.$filePannel.find('#fileError_'+timeStamp).fadeOut(5000,function(){
				_m.remove();
				setTimeout(function(){
					if (t._uploadFileLength() == 0 ) {
						t.$filePannel.addClass('disnone');
					}
				},10);
			});
		}	// _showFileError

		//$$  일정 수 이상 파일을 추가하려고 할때
		, '_overFlowFile' : function(file){
			if (file.length > 0 ) {
				setTimeout(function(){alert($MSG$file);}, 100);
			}
		}	// _overFlowFile

		//$$  검색시 인명 정보 server에 요청
		, 'getNameTag' : function(name){
			var t = this
				, date = new Date()
				, _groupID = !!Cellz.PARAM.GROUPID ? Cellz.PARAM.GROUPID : ''
				, timeStamp = date.getTime()
				, nameStamp = $user$ID + '_' + timeStamp	// 4071 : 2013-05-01 검색 결과 지연 check 와 연속 검색으로 인한 결과 충돌 방지
				;

			if (t.istherePeople() && t.nameTagChecker.name !== undefined && t.nameTagChecker.name === name) {
				return false;
			}

			t.nameTagChecker = {'name':name, 'stamp':nameStamp };

			t.$loadingBar.show();

			$.ajax({
				url : Cellz.API_URL.SOMETHING.NAME
				, type: 'GET'
				, async: true
				, timeout : 20000
				, dataType: 'JSON'
				, data: {
					'userId': $user$ID
					, 'groupId': _groupID
					, 'name': name
					, 'stamp': nameStamp
				}
				, error: function(data, status, err) {
					if (status == 'timeout') {
						$.util_notice($TIMEOUT$name);
					}
					t.$loadingBar.hide();
				}
				, success: function(result) {
					t.$loadingBar.hide();
					if (t.anything.kind == '') {	// 2013-04-23 : ajax call이 async 처리 되므로 .. 사용자에 의해 space ,, 기타 동작이 일어난 경우.. 결과 값 상관 없이 이후 문자 skip
						return false;
					}
					if (result.data !== undefined && result.data.stamp !== undefined && result.data.user !== undefined  && result.data.user.length > 0) {
						if (result.data.stamp === t.nameTagChecker.stamp) {
							t.showPeople(result.data.user, name);
						} else {
						}
					} else {
						t.hidePeople();
					}
				}
			});	// $.ajax({
		}	// getNameTag

		//$$  CELLMAP에서 글쓰기 후  say function 자동 호출 처리
		, '_hugCellMap' : function(){
			var t = this;
			t.$firstSomething.trigger('click');
			setTimeout(function(){
				t.$saySomething.focus();
			},10);
		}

		///////// 4071 : 2013-05-12 START ///////////////////
		//$$  el의 parent name 찾기
		, 'findParent' : function(el){
			var a = el
				, b = undefined
				, c = undefined
				, p = undefined
				, i
				, ii = 5
				;
			
			for (i=0;i<ii ;i++ ) {
				c = a.attr('name');
				p = a.parent();
				if (p.is('div') && p.attr('id')==='say_something') {
					if (_browserInfo_.ie&&i===0) {	// ie 첫줄은 p 가 없을수 있음
						b = {'house':true, 'ie':true, 'name':$First$Name};
					} else {
						b = {'house':true, 'name':c};
					}
				}

				if (a.is('div')) {	// check url clipping, map
					if (c===$PANNEL$url) {
						b = {'house':false, 'urlClip':true};
					}
					if (c===$PANNEL$map) {
						b = {'house':false, 'map':true};
					}
				}
				
				if (b !== undefined) {
					break;
				}
				a = p;
			}	// for
			return b;
		}	// findParent
/////// 4071 : 2013-05-12 END /////////

////////////////////////// 4071 : 2013-05-13 START ////////////////////////////
		//$$  house 이전 줄까지의 길이를 빼 house 상의 글자 길이를 구함
		// sea mean see 
		, 'seaHouse' : function(name, offset){
			var t = this
				, el = t.$saySomething[0]	//document.getElementById("say_something")
				, $arrContents = $(el).contents()				
				, i = 0
				, ii = $arrContents.length
				, prevLength = 0
				, kong = undefined
				;

			if (name == $First$Name) {
				kong = offset;
			} else {
				for (; i<ii; i++ ) {
					if ($($arrContents[i]).attr('name') !== name) {
						prevLength += $($arrContents[i]).text().length;
					} else {
						kong = offset - prevLength;
						break;
					}
				}	// for
			}

			return kong;
		}	// seaHouse
////////////////////////// 4071 : 2013-05-13 END ////////////////////////////

//////////////////// 4071 : 2013-05-11 START //////////
		//$$  입력중인 caret 의 $BASE 이름 구하기
		// 4071 : 2013-02-21		
		, 'aStoryOfHouse' : function(isMove, which){
			var t = this
				, element = t.$saySomething[0]
				, caretOffset = 0
				, range
				, selected
				, preCaretRange
				, IE_NO$BASE = _browserInfo_.ie && (t.$saySomething.find('p').length === 0 ? true : false)
				, kong = undefined	// return value
				, cong = undefined	// 입력중인 내용 || caret 이 위치한 곳의 내용
				, bong = undefined	// $BASE's name
				, pong = undefined	// var for find $BASE's name, findParent's returned value
				, rong = undefined	// $BASE 이전 내용 길이를 제외한 현재 caret까지의 길이를 위한 값	2013-05-13
				;
			
			try {
				range = window.getSelection().getRangeAt(0);
				selected = range.toString().length;
				preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);

				pong = t.findParent($(range.endContainer));	
		
				if (pong!==undefined && pong.house) {	// not : urlclip or map

					bong = pong.name; // 내용이 있는 경우
					if ($(range.endContainer).text().length === 0 && $(range.endContainer).is($BASE)) {
						bong = $(range.endContainer).attr('name');
						caretOffset = preCaretRange.toString().length;
						cong = '';
					}

					if (which=== KEY.enter) {
						caretOffset = preCaretRange.toString().length;
						cong = '';	// 새로운 줄 처음이므로 내용이 없다. caret 기준으로.. 뒤에 내용이 있어도 없는것으로 판단해야 함 2013-05-12
						bong = t.house;	// top 
					}

					if (cong !== '') {
						if (selected) {
							if (which == 229) {	// 한글입력							
								cong = $(range.endContainer).text().substring(0, range.startOffset+1);
							} else {
								cong = $(range.endContainer).text().substring(0, range.endOffset+1);
							}												
							caretOffset = preCaretRange.toString().length - selected;
						} else {
							if (isMove) {
								cong = $(range.endContainer).text().substring(0, range.startOffset);
							} else {
								cong = $(range.endContainer).text().substring(0, range.startOffset+1);
							}
							caretOffset = preCaretRange.toString().length;
						}

						if (_browserInfo_.ie) {
							cong = $(range.endContainer).text().substring(0, caretOffset);
						}
					}	// if (cong !== '') {	
						
					if (bong == $First$Name || IE_NO$BASE) {
						rong = caretOffset;
					} else {			
						rong = t.seaHouse(bong, caretOffset);
					}
				}	// if (pong.house) {	// not : urlclip or map
				
				kong = {'name':bong, 'content':cong, 'length':rong, 'isClip':!pong.house};	// urlClip, map 일때 house 값을 false
			} catch (e) {
//				console.log(1124,' catch:', e);
			}
		
			return kong;
		}	// aStoryOfHouse = function(element, isMove, which)
/////////////////////// 4071 : 2013-05-11 END ///////////

		//$$	say_something 영역에 내용이 입력 되면 전송 버튼 활성화/비활성화
		, 'pumpUpTheCell' : function(fong){	// fong : come From
			var t = this
				, tong = $.trim(t.$saySomething.text())
				, cong = false
				;

//			console.log(3563, ' ', fong);
			
			if ( !t.$now$Uploading && tong.length > 0 && tong !== $First$Say ) {
				t.$cellBtnCreate.addClass('btn_cfm2');				
				t.$saySomething.css('color', color$Focus);	// 4071 : 2013-07-02 글자 색깔 fix
				cong = true;
			} else {
				t.$cellBtnCreate.removeClass('btn_cfm2');
				t.$saySomething.css('color', color$Blur);	// 4071 : 2013-07-02 글자 색깔 fix
			}

			// 4071 : 2013-06-25 chrome caret 관련
			if (_browserInfo_.chrome) {
				if (tong.length > 0 && tong !== $First$Say ) {
					t.$saySomething.css({'display':'inline-block'});	// , 'padding-right':'1px'
				} else {
					t.$saySomething.css({'display':''});
				}
			}
			return cong;
		}

		//$$	say_something 입력에 따른 처리
		, 'danceWithInput' : function(which, isMove){
			var t = this
//				, el = t.$saySomething[0]	//document.getElementById("say_something")
				, v = undefined
				, _paragraph
				, _before
				, _lastWord
				, _name = ''				
				, videoid, m	// for youtube
				;

			if (which === KEY.enter) {
				t.whenBaseCalled();
				if (t.istherePeople()) {
					t.hidePeople();
					return false;
				}
			}

			if (which == KEY.space && t.istherePeople()) {
				t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
				return false;
			}

			t.pumpUpTheCell('danceWithInput');

/////////////////// 4071 : 2013-04-25 START ////////////////////////////////
			v = t.aStoryOfHouse(isMove, which);	// 4071 : 2013-05-12
			if (undefined === v || v.isClip) {
				return false;
			}
/////////////////// 4071 : 2013-04-25 END ////////////////////////////////

			_paragraph = v.content;

			// url 일때는 anything 과 maison, house 이용
			// name 일때는 anything, houseStory 이용 houseStory.name 이 해당 줄 houseStory.content 뒤 내용 .. 
			t.houseStory = v;	// save house's story

///////////// 4071 : 2013-04-29 START ###############################

			if (which == KEY.enter) {				
				t.anything.count += 1;
				if (t.anything.kind === 'url' && t.anything.count == 1) {
					videoid = t.anything.last;

					if (videoid.indexOf('@')>-1) {	// discard email address
						t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
						return false;
					}
					// check youtube
					if (m = videoid.match(/www\.youtube\.com\/.*[?&]v=([^&]+)/i) || videoid.match(/youtu\.be\/([^?]+)/i)) {
						videoid = m[1];
					}

					if (!videoid.match(/^[a-z0-9_-]{11}$/i)) {
						t._con2New(t.anything, 'url');
						t.url(t.anything.last);
					} else {
						t._con2New(t.anything, 'youtube');
						t.$saySomething.blur();
						Cellz.screen.setLoader();
						t.itsMe();	// set current Blow$SOME	to Cellz.some$thing
						$.getScript('http://gdata.youtube.com/feeds/api/videos/' + encodeURIComponent(videoid) + '?v=2&alt=json-in-script&callback=Cellz.'+t.whoamI+'$youTube');
					}
				}
			} else {				
				_before = t._findLastSpace(_paragraph);
				_lastWord = _paragraph.substring(_before);	// 마지막 입력중인 단어

				if (nameRegExp.test(_lastWord)) {	// name tag
					_name = _lastWord.substring(1);	// @ 빼기
					t.anything.kind = 'name';
					t.anything.count = 0;

					// 4071 : 2013-06-12 chrome 에서 결과가 있음에도 또 다시 호출하는것을 방지
					if (_browserInfo_.chrome && !_name && t.istherePeople() && t.anything.last == t.last$successName) {
						return;
					}
					if (!!_name && _name.search(_jaumMoum) == -1 && _hangleCheck.test(_name)) {
						if (t.anything.last != _name) {	// @이름 내용이 바뀐 경우
							t.anything.last = _name;
							t.anything.count = 0;
							t.anything.story = v;							
							t.getNameTag(_name);	// 2013-04-22 이전값과 다를때 call
						}
					}
				} else {
					t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
				}

				if (t.istherePeople()){
					if (t.anything.kind !== 'name' 
						|| !nameRegExp.test(_lastWord)
						|| _name.search(_jaumMoum) > -1 
						|| !_hangleCheck.test(_name)
						|| _lastWord == namePrefix) {
						t.anything = {'last':'', 'kind':'', 'count':0, 'story':''};
						t.hidePeople();
						return false;
					}
				}	// if (t.istherePeople()){
			}	// if (which == KEY.enter) {
///////////// 4071 : 2013-04-29 END ###############################
		}
	};

	// 4071 : 2013-07-04 START
	window.onbeforeunload = function(){
		if (!!Cellz.some$thing && !!Cellz.some$thing.t && Cellz.some$thing.t.checkContent()) {
			return $bye;
		}
	};
	// 4071 : 2013-07-04 END

	Cellz.con$scissors			= con$scissors;

	///////////////////  4071 : 2013-05-03 START : file Event //////////////////////
	Cellz.dispatcher.bind({
		'file$Changed' : function(){
			var me = Cellz.some$thing.t;
			me._fileChange();
		}
		, 'file$Destroyed' : function(e, data){
			var me = Cellz.some$thing.t;
			me._fileDestroyed(data.data);
		}
		, 'file$Finished' : function(){
			var me = Cellz.some$thing.t;
			me._fileFinished();
		}
		, 'file$Stopped' : function(){
			var me = Cellz.some$thing.t;
			me._fileStopped();
		}
		, 'file$ValidateError' : function(e, data){
			var me = Cellz.some$thing.t;
			me._saveTong(data.data);
		}
		, 'file$Enabled' : function(){
			var me = Cellz.some$thing.t;
			me.enableUploadFile();
		}
		, 'file$Disabled' : function(){
			var me = Cellz.some$thing.t;
			me.disableUploadFile();
		}

		, 'group$Name' : function(event, data){
			var me = Cellz.some$thing.t;
			if (!!data) {
				me.$groupNotice.show();
			}			
		}

		, 'group$loaded' : function(event, data){
			var i
				, ii
				, tmp
				;

			$group$List.push({'id':before$companyId, 'name':before$companyName, 'type':'company'});
			for (i=0,ii=data.kong.length;i<ii ;i++ ) {
				tmp = data.kong[i];
				$group$List.push({'id':tmp.id, 'name':tmp.name, 'type':'group'});
			}
		}
	});

	$somethingMap
		.find('#somethingMapInput').bind({
			'keyup' : function(event){
				var me = this
					, _search = $(me).val()
					, which;

				event = window.event || event;
				which = event.keyCode || event.which;

				if (!_search) {
					GoogleMap.clearList();
				} else {
					if (which == KEY.down || which == KEY.up) {
						GoogleMap.chooseMap(which);
					} else if (GoogleMap.selectedMap() && which === KEY.enter) {
						GoogleMap.setMapInfo();
					} else {
						if (which !== KEY.enter) {
							GoogleMap.search(_search);
						}
					}				
				}				
			}
			, 'keydown' : function(event){
				var me = this
					, _search = $(me).val()
					, which;
				
				event = window.event || event;
				which = event.keyCode || event.which;

				if (!GoogleMap.selectedMap() && which == KEY.enter) {
					if (GoogleMap.isthereMap()) {
						GoogleMap.clearList();
					}
					GoogleMap.readyToShow();
					GoogleMap.codeAddress(_search);
				}
			}
		}).end()
		.find('a.btn_search').bind('click', function(event){
			var me = this
				, _search = $(me).parent().find('#somethingMapInput').val();
			GoogleMap.readyToShow();
			GoogleMap.codeAddress(_search);
		}).end()
		.find('span[name=mapConfirm]').bind('click', function(event){
			var t = Cellz.some$thing.t;
			t.map();
		}).end();

	
	$btnCloseCellz.bind('click', function(event){	// cellz 에서 찾기
		var t = Cellz.some$thing.t;
		event.preventDefault();
		event.stopPropagation();
		t.cellzClose();
	});

	$btnCloseMap.bind('click', function(event){	// 지도
		var t = Cellz.some$thing.t;
		event.preventDefault();
		event.stopPropagation();
		t.mapClose();
	});

	$cellzArea.find('li').bind('click', function(event){	// 검색 범위 설정
		var me = this;	

		event.preventDefault();
		event.stopPropagation();

		$(me).parent().find('li').removeClass('on');
		$(me).addClass('on');
		cellzSearch();
	});
	
	$cellzTab.find('li').bind('click', function(event){	// 검색결과 filtering
		var me = this;

		event.preventDefault();
		event.stopPropagation();

		$(me).parent().find('li').removeClass('on');
		$(me).addClass('on');
	
		cellzSearch();
	});

	$btnSearchCellz.bind('click', function(event){
		event.preventDefault();
		event.stopPropagation();
		var _name = $.trim($searchArea.val());
		if(!_name || _name == ''|| _name ==  $.util_message.file.searchDefault){
			cellzSearch();// 임의삽입
			return;
		}
		cellzSearch(_name);

		
	});
	/* 2013-07-18 파일 순간검색 삽입  by 정호진 */
	
	$searchArea.on('focus', function(event) {
		event.preventDefault();
		var me = this;
		if($(me).val() == $.util_message.file.searchDefault && !$(me).parent().hasClass('active')){
			$(me).val('');
		}
		$(me).parent().addClass('active');
		
	}).on('blur', function(event){
		event.preventDefault();
		var me = this;
		if( $.trim($(me).val()) == ''){
			$(me).val($.util_message.file.searchDefault);
			$(me).parent().removeClass('active');
		}
		})
//	.on('focusout', function(event) {
//	
//	
//	
//	
//	})
	.bind({
			'keyup': function(event){
				var _name = $.trim($searchArea.val());
				if(!_name || _name == ''){
//					$searchArea.find('li[name=fileTag_items]').removeClass('selected').remove().end().addClass('disnone');
//					$searchArea.find('.ly_lst').addClass('disnone');
					cellzSearch();// 임의삽입
					return;
				}
				if (event.which == 32 
						||  event.which == 39 
						|| event.which == 37 
						|| event.which == 144
						|| event.which == 25 
						|| event.which == 45 
						|| event.which == 91
						|| 16 == event.which 
						 || event.which == 17
						 || event.which == 18
						 || event.which == 19
						 || event.which == 20 
						 || event.which == 33 
						 || event.which ==34
						 || event.which == 35) { //32 : space 특수키들 제거
				}else if (event.which == 13) {	// 13 : enter
//					if($this.tagArea.find('li[name=fileTag_items]').hasClass('selected')) {
//					
//						_name = $this.tagArea.find('li[name=fileTag_items].selected')[0].childNodes[0].getAttribute("ftitle");
//					}
					
//					$this.tagArea.find('li[name=fileTag_items]').remove().end().parent().addClass('disnone');
					cellzViewType = 'SEARCH';
					cellzOffSet = 0;
//					searchFileList(_name);
					cellzSearch(_name);
				}
//				else if (event.which == 38 || event.which == 40) { // 위나 아래버튼클릭시
//					event.preventDefault();
//					$this.chooseFiles(event.which);
//				}
//				else{ //순간검색
//					
//					if(!!_name && _name.search(_hangle) == -1 && _name.search(_hangle2) == -1 && event.which != 17){
//						$this.searchFileTag(_name);
//						
//					}else{
//						$this.tagArea.find('li[name=fileTag_items]').remove().end().addClass('disnone');
//					}
//					
//				}
				
			},
//			'keydown' : function(event) {
//					if (event.which === 13) { //enter치면
//						offMouseOver = false;
//					}
//				isKeyPressed = true;
//				pressedKeyValue = event.which;
//				mousemoveCounter = 2;
//			},
//			
//			'focusout' : function(event){
//				event.preventDefault();
//				
//				if(!$this.tagArea.find('li[name=fileTag_items]').hasClass('mover')) {
//					$this.tagArea.find('li[name=fileTag_items]').remove().end().parent().addClass('disnone');
//				}
//			},
//			'focusin' : function(event) {
//				var _name = $.trim($meFileArea.find('#searchArea').find('input.input_txt').val());
//				var _value = $.trim($('#searchMemberTxt').attr('value')); //attribute 값때문에 focusIn시 오류 발생
//				if(!_name || _name == ''||_name == _value){
//					
//					$meFileArea.find('#searchArea').find('li[name=fileTag_items]').removeClass('selected').remove().end().addClass('disnone');
//					$meFileArea.find('#searchArea').find('.ly_lst').addClass('disnone');
//					return;
//				}
//				if(!!_name && _name.search(_hangle) == -1 && _name.search(_hangle2) == -1){
//					$this.searchFileTag(_name);
//				}else{
//					$this.tagArea.find('li[name=fileTag_items]').remove().end().addClass('disnone');
//				}
//				
//				
//			}
			
		})
			
	;
	/*						  by 정호진*/

	

/////////// 4071 : 2013-06-18 START /////
	$btnConfirmCellz.bind('click', function(event){
		var t = Cellz.some$thing.t
			, _file = undefined
			, _files = []
			;
		event.preventDefault();
		event.stopPropagation();
		for ( _file in t.cellzSelected ) {
			_files.push( t.cellzSelected[_file]);
		}

		t.cellzFileList	= {};	// reinitialize
		t.cellzSelected = {};	// reinitialize
		/* 수정 주석 by 정호진 */
//		$cellzResult.find('li[name=cellz]').remove();	// 이전 결과 지우기
//		_cellzDefaultResult();
		/* 수정 주석 by 정호진 */
		if (_files.length > 0 ) {
			t.$filePannel.removeClass('disnone');
			t.isFromCellz = true;

			t.$uploader.done(null,{result:{files:_files}});
		}

		t.cellzClose();
	});
/////////// 4071 : 2013-06-18 END /////

	$btnCancelCellz.bind('click', function(event){
		var t = Cellz.some$thing.t;
		event.preventDefault();
		event.stopPropagation();
		t.cellzClose();
	});

///////////////////  4071 : 2013-05-03 END : file Event //////////////////////

	$.fn.one$say = function (name) {
		var $clone = undefined
//			, groupName = ''
			, $_create = $(this).find('.section_create')
			, $_isExist = $_create.length
			, topic = ($('#sayoneLayer').length > 0) ? true : false
			;
		name = name || 'timeline';

		if (name !== 'timeline' &&  $_isExist === 0) {
			if (name === 'topic') {
				$clone = $('div#imtopic .section_create').clone();
			} else {
				if (topic) {
					$clone = $('#sayoneLayer .section_create').clone();
				} else {
					$clone =  $('#timeline_wrap .section_create').clone();
					$clone.show();
				}				
			}

			if (!!$clone) {
				$(this).prepend($clone);
			} else {
				return ;
			}			
			groupName = $('div.view_pospd div.timeline_box span.group').text();
		}
		new Blow$SOME($(this).find('.section_create'), name);
	};	// $.fn.one$say

}(window.jQuery || window.Zepto));

$(function() {
	var topic = ($('#sayoneLayer').length > 0) ? true : false	// 4071 : 2013-06-13
		, _me = ($.util_urlParser.getMenuFromUrl() == 'user') ? true : false	// 4071 : 2013-06-14
		, firstStop = topic || _me
		;

	if (!firstStop){	// topic, me 가 아닐때 실행
		$('div#timeline_wrap').one$say();	// default : 'timeline'
	}
});