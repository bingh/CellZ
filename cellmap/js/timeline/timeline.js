/*
 * 
 * Todo:  
 * 
 * */
(function($, cz, w) {
	$.fn.fadeInWithDelay = function(){
        var delay = 0;
        return this.each(function(){
            $(this).delay(delay).animate({opacity:1}, 200);
            delay += 100;
        });
    };
	cz.Timeline = function(id, options) {
		var	base = this
		,	$wrap;
		this._initialize = function() {
			base.$wrap = $('#'+id);
			base.o = $.extend({}, cz.Timeline.Defaults, options);
			base.filter = options.filter;
			base.initialized = false;
			//base.processing = false;
			base.load();
			base.eventHanddler();
		}
		this.initialize = function(_callback) {
			$('.text_group_clone').remove();
			base._removeMoreBtn();
			base.$wrap.html('');
			base.load(_callback);
		}
		this.add = function(cells, _loadType, _from, _order) {
			if (cells === undefined || cells.length <= 0) return;
			var	tmpFirstCellTime
			,	lastCellId
			,	lastCellUserId
			,	lastCellAncestorCellId
			,	lastCellAncestorCellCount
			;			

			try {
				$(cells).each(function(i) {
					var cell = this
					,	cellUserId = this.cellUser.userId
					,	cellId = this.cellId
					,	ancestorCellId = this.ancestorCellId
					,	sameCellId
					,	likeCount = this.likeCount
					,	shareCount = this.shareCount
					,	isMine = this.mine
					,	cellTmpl
					,	templates
					,	elements
					,	originalCellUserId
					,	originalCellId
					,	$cellTmpl
					,	$btn
					,	$cutText
					,	imgLimitIdx = (($.util_urlParser.getMenuFromUrl() === 'user' || $.util_urlParser.getMenuFromUrl() === 'group')) ? 3 : 4;
					
					if (this.originalCell !== undefined) {
						cellTmpl = new cz.Template.Cell(cell, this.originalCell, null);
						originalCellUserId = this.originalCell.userId
						originalCellId = this.originalCell.cellId
					} else {
						cellTmpl = new cz.Template.Cell(cell, null, null);
					}
					sameCellId = cellTmpl.getSameCellId();
					
					$cellTmpl = cellTmpl.getElement();
					templates = cellTmpl.getTemplates();
					elements = cellTmpl.getElements();
					$btn = cellTmpl.getFoldBtn();
					
					//이벤트 시 전달할 data 객체
					$cellTmpl.data('cell', {
						cellUserId: cellUserId
						,	cellId: cellId
						,	originalCellUserId: originalCellUserId
						,	originalCellId: originalCellId
						,	ancestorCellId: ancestorCellId
						,	sameCellId: sameCellId
						,	likeCount: likeCount
						,	shareCount: shareCount
						,	isMine: isMine
						,	cellTmpl: cellTmpl
						,	templates: templates
						,	elements: elements
						,	$cellTmpl: $cellTmpl
					});
					$cellTmpl.data('json', cell);
					
					var imageLength = (templates.imageTmpl !== undefined) ? templates.imageTmpl.getLength() : 0;
					var fileLength = (templates.fileTmpl !== undefined) ? templates.fileTmpl.getLength() : 0;
					
					if (
							templates.textTmpl !== undefined && (
									templates.textTmpl.isOverSixLines() || //text가 6줄이상 이거나
									(templates.textTmpl.getInlineObjLength() >= 2) || //inlingObject가 2개  이상이거나
									(templates.textTmpl.getInlineObjLength() >= 1 && templates.textTmpl.getHiddenTextAfterInlineObj()) || //inlingObject가 1개  이상이고 뒤에 텍스트가 있거나
									(templates.textTmpl.getInlineObjLength() >= 1 && (fileLength >= 1 || imageLength >= 1)) || //inlingObject가  1개이상이고 첨부파일이 1개이상 인경우
									(templates.textTmpl.getInnerCellLength() >= 1) || //셀안에 셀이  1개이상이거나
									imageLength > imgLimitIdx || //이미지 첨부파일이 4개 이상이거나
									fileLength > 1 || //파일첨부가 2개이상이거나
									(fileLength > 0 && imageLength > 0) //첨부파일이 1개이상 이미지가 1개이상인경우
							)
					)
					{ 
						elements.$textTmpl.children('.txt_group').addClass('hide');
						$cutText = $('<div class="cutText"></div>');
						elements.$textTmpl.append($cutText);
						$btn.show();
					}
					if (templates.textTmpl !== undefined && templates.textTmpl.isOverSixLines()) {//text가 6줄이상인 경우 말줄임 표시
						$cutText.addClass('cutTextOnlyText')
					}
					if (templates.textTmpl !== undefined && !templates.textTmpl.isOverSixLines()) { //텍스트가 6줄 이하인 경우 clone의 height적용
						elements.$textTmpl.children('.txt_group').addClass('heightFixed').css('height',templates.textTmpl.getSummaryTextGroupHeight());
					}
					if (_loadType === 'new') {
						//$cellTmpl.prependTo(base.$wrap);
						$cellTmpl.prependTo(base.$wrap).css({'opacity' :0});
						$cellTmpl.fadeInWithDelay();
						tmpFirstCellTime = this.createdTimestamp;
						
						//마지막 로드된 셀(지금 작성된 셀)의 cellId와 cellUserId를 저장.
						//if(_from === 'CELLMAP') {
						if(true) {
							lastCellId = this.cellId;
							lastCellUserId = this.cellUser.userId;
							lastCellAncestorCellId = this.ancestorCellId;
							lastCellAncestorCellCount = $cellTmpl.children('.cellmap').find('.cellmap_box em').text();
							
						}
					} else {
						$cellTmpl.appendTo(base.$wrap);
					}
					
					$cellTmpl.children('.timeline_top').find('.profile').attr('w', $cellTmpl.children('.timeline_top').find('.profile').width());
					
					
					//마지막 로드 시간 이후에 작성된 셀 상단에 newline표시
					var cellIdx = base._getCellIdx($cellTmpl);
					if (base.lastTimestampTemp !== undefined && base.lastCheckTime >= templates.userTmpl.createdTimestamp) {
						if (base.hasNewLine !== true && cellIdx > 0) {
							base._appendReadLine($cellTmpl);
						}
					}
					if( base.lastTimestampTemp === undefined && base.lastCheckTime < templates.userTmpl.createdTimestamp ) {
						base.lastTimestampTemp = templates.userTmpl.createdTimestamp;
					}
					if(base.o.viewFilter === 'CELLMAP') {
						$cellTmpl.after('<div class="collect_view_ln">');
						$cellTmpl.addClass('timeline_box_cellmap_view');
					}
					
				});
			} catch(e) {
				console.log(e);
			}

			//셀업인경우 같은 같은 조상셀을 가진 셀들 갯수 싱크
//			console.log('_loadType',_loadType)
//			console.log('_from',_from)
//			console.log('lastCellAncestorCellId',lastCellAncestorCellId)
//			console.log('lastCellAncestorCellCount',lastCellAncestorCellCount)
			//if (_loadType === 'new' && _from === 'CELLMAP') {
			if (_loadType === 'new') {
				
				this._syncAncestorCells(lastCellAncestorCellId, lastCellAncestorCellCount);
			}
			//셀업인경우 firstCellTime을 가장 최근에 작성된 cellTime으로 설정
			if(_loadType === 'new' && (_order !== undefined && _order === 'ASC')) {
				base.firstCellTime = tmpFirstCellTime;
			}
			//셀맵에서 write를 한경우.
			if (_from === 'CELLMAP') {
				//screen.setLoader();
				base.o.writeFromCellMap(lastCellId, lastCellUserId);
			}
			//emptyCell이 존재하는 경우 제거
			if (base.$emptyCell !== undefined && base.$emptyCell.length > 0) {
				base._removeEmptyCell();
			}
//			console.log('base.firstCellTime', base.firstCellTime)
		}
		this.eventHanddler = function() {
			//마우스 이벤트
			base.$wrap.on('click', '.timeline_box .btnFold', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				$(this).hasClass('clse') ? base._cellOpen($cell) : base._cellClose($cell);
			});
			/*base.$wrap.on('mouseenter', '.timeline_box .profile', function(e){
				e.preventDefault();
				var	$this_ = $(this)
				,	$cell = $this_.parents('.timeline_box');
				if ($cell.data('cell').isMine) return;
				
				var w = parseInt($this_.attr('w')) + 34;
				$this_.stop().animate({
					width: w
				}, 'fast', function() {
					$this_.find('.put').fadeIn();
				});
			});
			base.$wrap.on('mouseleave', '.timeline_box .profile', function(e){
				e.preventDefault();
				var	$this_ = $(this)
				,	$cell = $this_.parents('.timeline_box');
				if ($cell.data('cell').isMine) return;

				var w = parseInt($this_.attr('w'));
				$this_.find('.put').hide();
				$this_.stop().animate({
					width: w
				}, 'fast');
			});*/
			base.$wrap.on('mouseenter', '.timeline_box .cellmap .add', function(e){
				$(this).hide();
				$(this).parent().find('.addover').show();
			});
			base.$wrap.on('click', '.timeline_box .cellmap .addover', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				base.o.cellmapUp($cell, $cell.data('cell').cellId, $cell.data('cell').cellUserId, base._json);
			});
			base.$wrap.on('mouseleave', '.timeline_box .cellmap .addover', function(e){
				$(this).hide();
				$(this).parent().find('.add').show();
			});


			base.$wrap.on('click', '.timeline_box .btnLike', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box')
				,	cellUserId = $cell.attr('cell_user_id')
				,	cellId = $cell.attr('cell_id')

//				cz.ACTION.LIKE($(this), cellUserId, cellId, 'TIMELINE', function() {
//					base.syncLikeCount(sameCellId);
//					cz.dispatcher.bind('like',function(evt) { 
//						alert(evt);
//					});
//				});

				Cellz.ACTION.LIKE($(this), cellUserId, cellId);
			});
			
			base.$wrap.on('click', '.timeline_box .btnShare', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box')
				,	cellUserId = $cell.attr('cell_user_id')
				,	cellId = $cell.attr('cell_id')
				
				Cellz.ACTION.SHARE($(this), cellUserId, cellId);
			});
			

			base.$wrap.on('click', '.timeline_box .btnRemoveCell', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				base.o.remove($cell);
			});

			base.$wrap.on('click', '.timeline_box .preview_group.inlineObjOriginal .pv_img', function(e){
				e.preventDefault();
				var $content = $(this).parents('.content');
				var $parent = $(this).parents('.preview_group');
				var href = $parent.find('.pv_url a').attr('href');
				if (href.indexOf('youtube') != -1) {
					var src = href.split('?v=');
					src = src[1];
					src = src.split('&');
					src = 'http://youtube.com/v/'+src[0];
					$parent.after($('<div class="opened_template" style="padding-left: 20px;" />').html('<object width="560" height="315"><param name="movie" value="'+src+'?hl=ko_KR&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="'+src+'?hl=ko_KR&autoplay=1" type="application/x-shockwave-flash" width="560" height="315" allowscriptaccess="always" allowfullscreen="true" wmode="Opaque"></embed></object>'));
					$parent.addClass('hidden_template_1');
				}
			});
			base.$wrap.on('click', '.timeline_box .preview_group.inlineObjClone .pv_img', function(e){
				e.preventDefault();
				e.stopPropagation();
				var $cell = $(this).parents('.timeline_box');
				var $children = $cell.children('.content').children('.txt_group').children('.preview_group:eq(0)')
				base._cellOpen($cell);
				
				if (!$children.hasClass('hidden_template_1')) {
					$children.find('.pv_img').trigger('click');
				}
			});

//			base.$wrap.on('click', '.timeline_box .img_group .btnImage', function(e){
//				e.preventDefault();
//				var $imgGroup = $(this).parents('.img_group')
//				base.o.multiImageview($(this), $imgGroup);
//			});

			base.$wrap.on('click', '.timeline_box .cellmap_box', function(e){
				e.preventDefault();
				var count = parseInt($(this).find('em').text(), 10);
				if (__browser__ && (_ieVersion < 9)) {
					$.util_notice('IE8 이하의 브라우저에서 동작하지 않습니다.');
					return;
				}
				base.o.cellmapView($(this).attr('cell_id'), $(this).attr('cell_user_id'));
			});
			
			base.$wrap.on('mouseenter', '.timeline_box .cellmap_box', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				cellMapIconAction($cell, 'over');
			});
			base.$wrap.on('mouseleave', '.timeline_box .cellmap_box', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				cellMapIconAction($cell, 'out');
			});

			base.$wrap.on('change', '.timeline_box .poll_group input[type=radio]', function(){
				cz.ACTION.SELECT_POLL($(this));
			});
			
			cz.dispatcher.bind('like',function(e, _param) {
				base.syncLikeCount(_param.cellId);
			});
			cz.dispatcher.bind('share',function(e, _param) {
				base.syncShareCount(_param.cellId);
			});
			cz.dispatcher.bind('selectPoll',function(e, _param) {
				base.syncPollSelect(_param);
			});
			cz.dispatcher.bind('deleteCell',function(e, _param) {
				if (base.o.viewFilter === 'CELLMAP') {
					base.initialize();
				} else {
					base.syncDeleteCell(_param);
				}
			});
			cz.dispatcher.bind('writeCell',function(e, _param) {
//				console.log('writeCell:timeline');
				if (base.o.viewFilter === 'CELLMAP') {
					base.initialize();
				} else {
					// 타인 ME일 경우 새로 쓴 cell 타임라인에 넣지 않는다.
					if(base.filter.o.timelineFilter == 'ME' && base.o.meUserId != undefined && base.o.meUserId != $('#gnbProfileImage').attr('userId')){
						return;
					}
					//TODO: 탭이 다른경우 init처리
//					console.log('_param.group', _param.group);
//					console.log('base.filter.timelineFilter', base.filter.o.timelineFilter);
					console.log('_param.group', _param.group)
					console.log('.filter.o.timelineFilter', base.filter.o.timelineFilter)
					
					if ((
							_param.group && base.filter.o.timelineFilter === 'GROUPS') || 
							(!_param.group && base.filter.o.timelineFilter === 'COMPANY' ||
							base.filter.o.timelineFilter === 'ME' || //ME 인경우
							base.filter.o.timelineFilter === 'ALL'  //GROUP 인경우 TODO: 추후 값 수정 해야할듯.
						)) { //글을 쓴 type이 같은 경우
						base.add(_param.cells,'new', _param.from, 'ASC');
					} else {
						var $filterElem = base.filter.getFilterElement(_param.group);
//						console.log('$filterElem', $filterElem);
						$filterElem.trigger('click');
					}
					//ToDo: 뉴스 분리 
					if (!!cz.news) {
						cz.news.start();
					}
				}
			});
			/*base.$wrap.on('click', '.timeline_box .info_view', function(){
				var	$this_ = $(this)
				,	file_name = $this_.attr('file_name')
				,	$cell = $this_.parents('.timeline_box');
				$.util_pageMover.moveToFileInfo(file_name);
			});*/
			
			
			/*
			base.$wrap.on('click', '.timeline_box .btnPublish', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				var $this_ = $(this);
				$.ajax({
					dataType: "json",
					type: "POST",
					url: cz.API_URL.TIMELINE.PUBLISH,
					data: {
			            "cellUserId": $cell.data('cell').cellUserId,
			            "cellId": $cell.data('cell').cellId
					},
					success: function(_data) {
						if (_data.result_code === 1) {
							var txt = 'Published';
							$this_.parent().prepend(txt);
							$this_.remove();
						}
					},
					error: function(xhr, status, error) {
					}
				});
			});
			

			 */

		}
		this._appendReadLine = function(_$cell) {
			base.$readLineCell = $('<div class="timeline_box_txinfo">여기까지 읽으셨습니다.</div>');
			_$cell.before(base.$readLineCell);
			base.hasNewLine = true;
		}
		this._getCellIdx = function(_$cell) {
			return base.$wrap.find('.timeline_box').index(_$cell);
		}
		this.selectPoll = function(_$this) {
			var	$this_ = _$this
			,	$cell = $this_.parents('.timeline_box')
			,	cellUserId
			,	cellId;
			if($cell.attr('original_cell_id')) {
				cellUserId = $cell.attr('original_cell_user_id');
				cellId = $cell.attr('original_cell_id');
			} else {
				cellUserId = $cell.attr('cell_user_id');
				cellId = $cell.attr('cell_id');
			}
			$.ajax({
				dataType: "json",
				type: "POST",
				cache: false,
				url: cz.API_URL.CELL.VOTE,
				data: {
					cellUserId: cellUserId,
					cellId: cellId,
					itemId: $this_.attr('item_id')
				},
				success: function(_result) {
					if (_result.result_code === 1) {
						var cell = _result.data;
						var surveyTmpl = new cz.Template.Survey(cell.cellSurveyList, cell.myPollId, cell.surveyAnonymity, null);
						//console.log($($cell.data('cell').templates.surveyTmpl.getHtml()).find('ul'))
						$cell.find('.poll_group').html($(surveyTmpl.getHtml()).find('ul'));
						//$cell.data('cell').elements.$surveyTmpl = $content.append($(surveyTmpl.getHtml())).appendTo($cell);
					}
				},
				error: function(xhr, status, error) {
				}
			});
		}
		this._syncAncestorCells = function(_lastCellAncestorCellId, _lastCellAncestorCellCount) {
			base.$wrap.children('.timeline_box[ancestor_cell_id="'+_lastCellAncestorCellId+'"]').each(function() {
				$(this).children('.cellmap').find('.cellmap_box em').text(_lastCellAncestorCellCount);
				//갯수에 따라 서 이미지도 변경되어야함 cz.Timeline.Utils.getConnectNStep(lastCellAncestorCellCount)
				
			});
			base.$wrap.children('.timeline_box[cell_id="'+_lastCellAncestorCellId+'"]').each(function() {
				$(this).children('.cellmap').find('.cellmap_box em').text(_lastCellAncestorCellCount);
				//갯수에 따라 서 이미지도 변경되어야함 cz.Timeline.Utils.getConnectNStep(lastCellAncestorCellCount)
			});	
		}
		this.syncLikeCount = function(_cellId) {
			base.$wrap.children('.timeline_box[same_cell_id='+_cellId+']').find('.btnLike').each(function() {
				cz.ACTION.LIKE_SUCCESS($(this));
			});
		}
		this.syncShareCount = function(_cellId) {
			base.$wrap.children('.timeline_box[same_cell_id='+_cellId+']').find('.btnShare').each(function() {
				cz.ACTION.SHARE_SUCCESS($(this));
			});
		}
		this.syncPollSelect = function(_param) {
			base.$wrap.children('.timeline_box[same_cell_id='+_param.cellId+']').find('.poll_group input[type=radio]').each(function() {
				cz.ACTION.SELECT_POLL_SUCCESS($(this), _param.result.data, null);
			});
		}
		this.syncDeleteCell = function(_param) {
			var $cell = base.$wrap.children('.timeline_box[cell_id='+_param.cellId+']')
			,	ancestorCellId = $cell.attr('ancestor_cell_id')
			,	ancestorCellCount = parseInt($cell.children('.cellmap').find('.cellmap_box em').text()) - 1
			;
			if ($cell.length > 0) {
				$cell.slideUp('normal', function() {
					var $clone = $('.text_group_clone[parent_cell_id='+_param.cellId+']');
					$cell.remove();
					$clone.remove();
				});
				if (ancestorCellId !== undefined) {
					this._syncAncestorCells(ancestorCellId, ancestorCellCount);
				}
			}
		}
		this.getFirstCellId = function() {
			return base.$wrap.children('.timeline_box:eq(0)').attr('cell_id');
		}
		this.getFirstCellUserId = function() {
			return base.$wrap.children('.timeline_box:eq(0)').attr('cell_user_id');
		}
		this.getFirstCellTime = function() {
			return base.firstCellTime;
		}
		this.getLastCellTime = function() {
			return base.lastCellTime;
		}
		this.setFirstCellTime = function(_time) {
			base.firstCellTime = _time;
		}
		this.setTimelineFilter = function(_filter) {
			base.o.timelineFilter = _filter;
		}
		this.setViewFilter = function(_view) {
			base.o.viewFilter = _view;
		}
		this.load = function(_callback) {
			(_callback !== undefined) ? this._ajaxLoad('init', _callback) : this._ajaxLoad('init');
		}
		this._moreLoad = function() {
			this._ajaxLoad('more');
		}
		this.newLoad = function(_callback) {
			this._ajaxLoad('new', _callback);
		}
		this._ajaxLoad = function(_loadType, _callback) {
			/*if (base.processing === true) {
				$.util_notice('타임라인을 불러오는 중입니다.');
				return;
			}
			base.processing = true;*/
			cz.screen.setLoader();
//			console.log(base.filter);
			var param = {
				//userId: base.o.userId,
				pageSize: base.o.cellLengthPerPage,
				meUserId: base.o.meUserId,
				groupId: base.o.groupId,
				timelineFilter: base.filter.o.timelineFilter,
				viewFilter: base.filter.o.viewFilter,
				cellmapsFilter: base.filter.o.cellmapsFilter,
				sortOrder: 'DESC'
			}
			if (_loadType === 'new') {
				param.startTime = base.firstCellTime;
				param.sortOrder = 'ASC';
			}
			if (_loadType === 'more') {
				param.endTime = base.lastCellTime;
				param.pcells = base.cellMapViewInfo;
			}
			
			$.ajax({
				type: "GET",
				dataType: "json",
				url: base.o.url,
				data: param,
				cache: false,
				success: function(_json) {
					if (_json.result_code === 1) {
						console.log('_loadType',_loadType)
						base._json = _json; 
						var _data = _json.data;
						base.hasCell = base._hasCell(_data);
						//firstCellTime이나 lastCellTime값이 없는 경우 default timestamp로 변경
						if (_loadType !== 'more') {
							base.firstCellTime = (base.hasCell && _data.firstCellTime !== undefined)? _data.firstCellTime : (base.firstCelTime === undefined)? _json.timestamp:base.firstCellTime;
						}
						if (_loadType !== 'new') {
							base.lastCellTime = (base.hasCell && _data.lastCellTime !== undefined)? _data.lastCellTime : (base.lastCellTime === undefined)? _json.timestamp:base.lastCellTime;
						}
						
						if (_callback !== undefined) _callback(); //cell이 로드되고 난 후 콜백호출 
						
						if (base.hasCell) {
							base._createMoreBtn();
						}
						//셀이 30개이상 이면 더보기버튼 생성
//						if (_loadType !== 'new') {
//							if (_data.cells.length >= base.o.cellLengthPerPage) {
//								base._createMoreBtn();
//							}
//							else base._removeMoreBtn();
//						}
						if (base.initialized === false) {
							base.o.afterLoad(base);
							base.initialized = true;
						}
						if (_loadType === 'more') {
							if (!base.hasCell) {
								$.util_notice('더 이상 불러올 내용이 없습니다.');
								base._removeMoreBtn();
							}
						}
						if (_loadType === 'init') {
							if (!base.hasCell) { //셀이 없는 경우 처리
								base.lastCheckTime = _json.timestamp;
								if (cz.screen !== undefined) cz.screen.deleteLoader();
								base._appendEmptyCell();
								return;
							} else {
								base.lastCheckTime = _data.lastCheckTime;
							}
						}
						base.add(_data.cells, _loadType);
						cz.screen.deleteLoader();
						
						//base.processing = false;
					} else {
						if( base.firstCelTime === undefined ) {
							base.firstCellTime = _json.timestamp;
						}
						cz.screen.deleteLoader();
						//base.processing = false;
					}
				},
				error: function(xhr, status, error) {
					cz.screen.deleteLoader();
					//base.processing = false;
				}
			});
		}
		this.isInitialized= function() {
			return this.initialized;
		}
		this._appendEmptyCell = function() {
			var emptyMessage = '등록된 Cell이 존재하지 않습니다.';
			if(base.o.timelineFilter == 'ME' && base.o.viewFilter == 'CELLMAP'){
				switch(base.o.cellmapsFilter){
				case 'FOLLOWING':
					emptyMessage = $.util_message.cellmap.noFollowCellmap;
					break;
				default:
					break;
				}
			}
			base.$emptyCell = $('<div class="timeline_box empty_timeline_box"></div>')
								.append($('<p class="no_result"></p>')
										.html(emptyMessage)
								);
			//$.util_message.cellmap.noFollowCellmap
			base.$wrap.append(base.$emptyCell);
		}
		this._removeEmptyCell = function() {
			base.$emptyCell.remove();
			base.hasCell = true;
		}
		this._hasCell = function(_data) {
			return (_data.cells.length > 0) ? true : false;
		}
		this._createMoreBtn = function() {
			base._removeMoreBtn();
			base.$moreBtn = $('<a class="btn_more" id="btnTimelineMore" href="#">더보기</a>');
			base.$moreBtn.appendTo(base.$wrap.parent());
			base.$moreBtn.click(function(e) {
				e.preventDefault();
				var tmpArr = [];
				$('#timelineDiv .timeline_box').each(function() {
					var userId = ($(this).attr('ancestor_user_id') > 0) ? $(this).attr('ancestor_user_id') : $(this).attr('cell_user_id');
					var cellId = ($(this).attr('ancestor_cell_id') > 0) ? $(this).attr('ancestor_cell_id') : $(this).attr('cell_id');
					tmpArr.push(userId+'_'+cellId);
				});
				base.cellMapViewInfo = tmpArr.join(',');
				base._moreLoad();
			});
		}
		this._removeMoreBtn = function() {
			if (base.$moreBtn !== undefined) base.$moreBtn.remove();
		}
//		this.setView = function(type) {
//			this._clear();
//			if (type === 'collect') this._setCollectView(); 
//		}
//		this._clear = function() {
//			base.$wrap.html('');
//		}
//		this._setCollectView = function() {
//		}
		this._cellOpen = function($cellTmpl) {
			var $content = $cellTmpl.children('.content');
			var $hiddenTemplateInTextGroup = $content.children('.txt_group').children('.hidden_template');
			var $hiddenTemplateInAttachment = $content.children('.attachments').find('.hidden_template');
			if ($hiddenTemplateInTextGroup.length > 0) {
				$content.children('.txt_group').removeClass('hide');
			} else {
				$content.children('.txt_group').removeClass('hide','normal');
			}
			$hiddenTemplateInTextGroup.slideDown('normal',function() {
				$hiddenTemplateInTextGroup.addClass('opened_template').removeClass('hidden_template');
			});
			$hiddenTemplateInAttachment.slideDown('normal',function() {
				$hiddenTemplateInAttachment.addClass('opened_template').removeClass('hidden_template');
			});
			$content.children('.clse').html('접기<span class="sp"></span>').addClass('open').removeClass('clse');
			$content.children('.heightFixed').css('height','auto');

			$content.children('.inlineObjClone').hide();
			$content.children('.txt_group').children('.hiddenText').addClass('showText').removeClass('hiddenText');

			if ($content.children('.cutText').length > 0) {
				$content.children('.cutText').text('');
			}
			/*var $content = $cellTmpl.children('.content');
			var $hiddenTemplate = $content.children('.txt_group, .attachments').children('.hidden_template');
			var $textGroup = $content.children('.txt_group');
			var $hiddenTemplateInTextGroup = $textGroup.children('.hidden_template');
			if ($hiddenTemplateInTextGroup.length > 0) {
				$textGroup.removeClass('hide');
			} else {
				$textGroup.removeClass('hide','normal');
			}
			$hiddenTemplate.slideDown('normal',function() {
				$hiddenTemplate.addClass('opened_template').removeClass('hidden_template');
			});
			$content.children('.clse').html('접기<span class="sp"></span>').addClass('open').removeClass('clse');
			$content.children('.heightFixed').css('height','auto');

			$content.children('.inlineObjClone').hide();
			$content.children('.txt_group').children('.hiddenText').addClass('showText').removeClass('hiddenText');*/
			
		}
		this._cellClose = function($cellTmpl) {
			var $content = $cellTmpl.children('.content');
			var $openedTemplateInTextGroup = $content.children('.txt_group').children('.opened_template');
			var $openedTemplateInAttachment = $content.children('.attachments').find('.opened_template');
			if ($openedTemplateInTextGroup.length <= 0) {
				$content.children('.txt_group').addClass('hide','normal');
			}
			$openedTemplateInTextGroup.slideUp('normal',function() {
				$openedTemplateInTextGroup.addClass('hidden_template').removeClass('opened_template');				
			});
			$openedTemplateInAttachment.slideUp('normal',function() {
				$openedTemplateInAttachment.addClass('hidden_template').removeClass('opened_template');				
			});
			$content.children('.open').html('펼치기<span class="sp"></span>').addClass('clse').removeClass('open');
			
			$content.children('.inlineObjClone').show();
			$content.children('.txt_group').find('.showText').addClass('hiddenText').removeClass('showText');
			
			if ($content.children('.cutText').length > 0) {
				$content.children('.cutText').text('');
			}
			
			
			/*var $content = $cellTmpl.children('.content');
			var $openedTemplate = $content.children('.txt_group, .attachments').children('.opened_template');
			var $textGroup = $content.children('.txt_group');
			var $hiddenTemplateInTextGroup = $textGroup.children('.hidden_template');
			$textGroup.addClass('hide','normal');
			//$cellTmpl.find('.txt_group').removeClass('show').addClass('hide','slow').removeClass('heightAuto');
			$openedTemplate.slideUp('normal',function() {
				$openedTemplate.addClass('hidden_template').removeClass('opened_template');				
			});
			$content.children('.open').html('펼치기<span class="sp"></span>').addClass('clse').removeClass('open');
			
			$content.children('.inlineObjClone').show();
			$content.children('.showText').addClass('hiddenText').removeClass('showText');*/
		}
		this.getLastCheckTime = function() {
			return base.lastCheckTime;
		}
		this._initialize();
	}
	cz.Timeline.Defaults = {
		cellLengthPerPage: 30 //로드갯수
	};
})(jQuery, Cellz, window);
