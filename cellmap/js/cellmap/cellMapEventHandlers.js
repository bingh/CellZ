//CellContents (s)////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function($, cz, w){
	
	CellMapEventHandlers = function(){
		this.init = function(){
			// TODO : 
			var contentsEventHandlers = new ContentsEventHandlers();
			contentsEventHandlers.init();
			
			var mapControlEventHandlers = new MapControlEventHandlers();
			mapControlEventHandlers.init();
			
			var dispatcherEventHandlers = new DispatcherEventHandlers();
			dispatcherEventHandlers.init();
			
			$(window).resize(function() {
				if(cz.Config.screen == 'CELLMAP'){
					if(CellMap.sccellMapTargetScaleIndex==4){
						if(!CellMap.isDrawingStarView){
							CellMap.isDrawingStarView = true;
							$('#starView').empty();
							$('#starView').append('<div class="sigma-parent" id="sigma-example-parent"><div class="sigma-expand" id="sigma-example"></div></div>');
							$('#starView').height($(window).height()).width($(window).width());
							$('.sigma-parent').height($(window).height());
							StarView.initStarView();
							window.setTimeout(function() {
								CellMap.isDrawingStarView = false;
							},3000);
						}
					}else{
						CellMap.cellMapResize();
					}
				}
				
			});
		};
		
		MapMemberListEventHandlers = function(){
			this.init = function(){
				$('#memberList .thm').off();
				$('#memberList .member_area .ico').off();
				
				$('#memberList .thm').on({
					click : function(e){
						e.preventDefault();
						var userId = $(this).attr('userId');
						$('#cellMapController .filter li').removeClass('on');
						$('#cellMapController .all').addClass('on');
						$('#cellMap .cell').addClass('filter');	
						
						var thisClass = $(this).attr('class');
						//console.log('thisClass = ',thisClass)
						$('#memberList .thm').removeClass('selected');
						if(thisClass === 'thm selected'){
							//console.log(thisClass == 'thm selected')
							$('#cellMap .cell').removeClass('filter');
						}else{
							$(this).addClass('selected');							
							for(var i in CellMap.cellData){
								if(CellMap.cellData[i].userId == Number(userId)){
									$('#'+CellMap.cellData[i].hId).removeClass('filter');
								}
							}
						}
					}
				});
				
				$('#memberList .member_area .ico').on({
					click : function(e){
						e.preventDefault();
						var	isUp  = $('#memberIco').hasClass('down');
						//console.log('memberIco',memberIcoClass)
						if(isUp){
							$('#memberIco').removeClass('down').addClass('up');
							$('#memberList .member_area').removeClass('default');
						}else{
							$('#memberIco').removeClass('up').addClass('down');
							$('#memberList .member_area').addClass('default');
						}
						CellMapData.miniTimeline.resizing(true);
					}
				})
			};
		};
		
		MapNaviEventHandlers = function(){
			this.init = function(){
				$('#cellMapNavi .path_lst a').off();
				$('#cellMapNavi .path_lst .pathList').off();
				$('#cellMapNavi .btn_change').off();
				$('#cellMapNavi .btn_prev_path').off();
				$('#cellMapNavi .btn_next_path').off();
				
				$('#cellMapNavi .path_lst a').on({
					click : function(e){
						e.preventDefault();
						var hId = $(this).attr('href');
						var appendHId = CellMap.cellData[hId].appendHId;
						CellMap.displayChangeSelectCellPath($(this), hId);
						if(appendHId !== ''){
							var $celectedHideCells = $('#'+appendHId+'_hideChilds');
							$celectedHideCells.find('.num_wrap2').addClass('size_t1');
							this.simpleCellList = new SimpleCellList(CellMap.ajaxData, CellMap.cellData);
							this.simpleCellList.init($celectedHideCells, hId);
							var simpleCellListEventHandlers =  new SimpleCellListEventHandlers();
							simpleCellListEventHandlers.simpleCellListEvent();
						}else{
							CellMap.selectedCellFocus( hId, 400, 'move' );
						}
					}
				});
				
				$('#cellMapNavi .path_lst .pathList').on({
					mouseenter : function(e){
						if($(this).find('strong').length !== 0){
							//e.preventDefault();
							var noti_pos = '';
							noti_pos += '<div class="noti_pos" style="position:absolute;z-index:500;">';
							noti_pos += '	<div class="noti_wrap">삭제된 셀입니다<span class="ico_arrow">&nbsp;</span></div>';
							noti_pos += '</div>';
							var $noti_pos = $(noti_pos)
							var pathListOffset = $(this).offset();
							var pathListLeft = parseInt(pathListOffset.left);
							var pathListTop = parseInt(pathListOffset.top);
							var pathListWidth = $(this).width();
							$('#wrap_inner').append( $noti_pos );
							var noti_pos_width = $noti_pos.width();
							var noti_pos_height = $noti_pos.height();
							$noti_pos.css({
								left : pathListLeft - (noti_pos_width - pathListWidth)/2,
								top : pathListTop - noti_pos_height - 3
							});
						}
					},
					mouseleave : function(e){
						$('#wrap_inner .noti_pos').remove();
						console.log('mouselive');
					}
				});
				
				$('#cellMapNavi .btn_next_path').on({
					click : function(e){
						e.preventDefault();
						var $path = $('.path_lst');
						var pathLength = $path.find('.pathList').length;
						var path_listLeftCss = $path.css('left');
						var pathLocation = parseInt( path_listLeftCss.substring( 0, path_listLeftCss.indexOf("px") ) );
						console.log(pathLength,pathLocation)
						if(pathLocation <= -pathLength*36 + 10*36){// 이동 가능한 거리.. 
							//$path.css({ left : 0 });
						}else{
							$path.css({ left : pathLocation - 36 });
						}
					}
				});
				
				$('#cellMapNavi .btn_prev_path').on({
					click : function(e){
						e.preventDefault();
						var $path = $('.path_lst');
						var pathLength = $path.find('.pathList').length;
						var path_listLeftCss = $path.css('left');
						var pathLocation = parseInt( path_listLeftCss.substring( 0, path_listLeftCss.indexOf("px") ) );
						console.log(pathLocation ,'<=', pathLength * 36)
						if(pathLocation >= 0){
							//$path.css({ left : 0 });
						}else{
							$path.css({ left : 0 });
						}
						console.log('btn_next_path',pathLength * 36);
					}
				});
				
				$('#cellMapNavi .btn_change').on({
					click : function(e){
						if(CellMap.cellMapTargetScaleIndex == 4){
							
						}else{
							e.preventDefault();
							var selectedCell = CellMap.cellData[CellMap.selectedHId];
							var cellId = selectedCell.cellId;
							var cellUserId = selectedCell.userId;
							console.log(cellId,cellUserId);
							
							$('#newCellNoti .num').html('0');
							$('#cellMap .cell').remove();
							$('#cellMap .num_pos').remove();
							$('#memberList').remove();
							$('#wrapCellLinkLine').empty();
							$('#starView').empty();
							
							clearInterval(CellMap.newsInterval);
							CellMap.cellMapEventHandlers = null;
							
							CellMapData.cellMapAjaxconnect(cellId, cellUserId, 1000, 'move');
						}
					}
				});
			};
		};
		
		MapControlEventHandlers = function(){
			this.wheelCount = function(event,delta){
				window.setTimeout(function() {
					CellMap.cellMapZoomController(delta);
				},300);
			};
			
			this.wheelStartEvent = false;
			
			this.init = function(){
				$('#t_box').off();
				$('#cellmap_wrap').off();
				$('#wrapCellLinkLine').off();
				$('#cellMapController .zoomin').off();
				$('#cellMapController .zoomout').off();
				$('#cellMapController .filter a').off();
				$('#cellMapSlider').off();
				$('#btn_back_timeline').off();
				
				$('#t_box').on({
					mousewheel : function(event,delta){
						event.stopPropagation();
					}
				});
				
				$('#cellmap_wrap').on({
					mousewheel : function(event,delta){
						$('#simpleCellList').remove();
						$('.num_wrap2').removeClass('size_t1');
						CellMap.cellMapZoomController(delta);
					}
				});
				
				$('#wrapCellLinkLine').on({
					mouseover : function(e){
						$(this).css({cursor:'move'});
						$('#cellMap').draggable(
						{
							scroll : false,
							start: function() {
								CellMapEventHandlers.contentsEventHandlers = null;
								$('#cellMap .cell').off();
							},
							drag: function() {
							},
							stop: function() {
								window.setTimeout(function() {
									CellMapEventHandlers.contentsEventHandlers = new ContentsEventHandlers()
									CellMapEventHandlers.contentsEventHandlers.init();
								},300);
							}
						});
					}
				});
				
				$('#cellMapController .zoomin').on({
					click : function(e){
						e.preventDefault();
						CellMap.cellMapZoomController(1);
					}
				});
				
				$('#cellMapController .zoomout').on({
					click : function(e){
						e.preventDefault();
						CellMap.cellMapZoomController(-1);
					}
				});
	
				$('#cellMapSlider').bind({
					mouseenter : function(e){
						e.stopPropagation();
						var $cellMapSliderBG = $('#cellMapSliderBG');
						$(this).draggable({
							axis: "y",
							containment: "#slideArea",
							scroll:false, 
							grid:[0,18],
							drag: function() {
								var position = $(this).position();
								$cellMapSliderBG.css('height' , position.top+20); 
							},
							stop: function() {
								var zoomIndex = parseInt($(this).position().top / 18);
								if(zoomIndex === 4){
									CellMap.displayStarView(true);
								}else{
									CellMap.displayStarView(false);
									CellMap.cellMapTargetScaleIndex = zoomIndex;
									CellMap.changeCellMapScale(zoomIndex);
								}
							}
						});
					}
				});
	
				$('#cellMapController .filter a').on({
					click : function(e){
						e.preventDefault();
						$('#memberList .thm').removeClass('selected');
						var selectCellType = $(this).attr('href');
						$('#cellMapController .filter li').removeClass('on');
						$(this).parents('li').addClass('on');
						$('#cellMap .cell').each(function(){
							$(this).removeClass('filter');
							if(selectCellType !== $(this).attr('type') && selectCellType !== 'ALL'){
								$(this).addClass('filter');
							}
						});
					}
				});
				
				$('#btn_back_timeline').click(function(e) {
					$('#t_clse').trigger('click');
					$('#cellMap .cell').remove();
					$('#cellMap .num_pos').remove();
					$('#memberList').remove();
					$('#wrapCellLinkLine').empty();
					
					$('#starView').hide();
					$('#starView').empty();
					$('#cellMap').show();
					
					e.preventDefault();
					var currentCellId = $(this).attr('current_cell_id')
					,	ancestorCellId = $(this).attr('ancestor_cell_id')
					,	target = null
					,	isTopicCell = (currentCellId === ancestorCellId) ? true : false;
					Cellz.screen.moveToTimeline(function() {
						window.setTimeout(function() {
							//$(window).scrollTop($('#'+id).offset().top - 30);
							var top = 0;
							if ($('#topicView').length > 0) {
								if (isTopicCell) {
									target = '#topic_'+currentCellId;
								} else {
									target = '#topic_'+ancestorCellId;
								}
								top = $(target).position().top - 220;
							} else {
								target = '#'+currentCellId;
								top = $(target).position().top;
							}
							// TODO : ancestorCellId 넣어 주는 부분 
							//console.log(prefix+'+'+currentCellId,'=',prefix+currentCellId)
							$('body').mCustomScrollbar("scrollTo", top);
							
							//스크린이 타임라인인지 토픽인지 확인후 값을 넣어 준다.. 
							//}
//							$('body').mCustomScrollbar("disable");
//							$('body').mCustomScrollbar("update");
//							$('body').mCustomScrollbar("scrollTo", 300, {
//								scrollInertia: 0
//							});
							
							clearInterval(CellMap.newsInterval);
							CellMap.cellMapEventHandlers = null;
						},300);
					});
				});
			};
// eventHandlers (s)////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
//			this.eventOff = function(){
//				$('#cellMapController .zoomin').off();
//				$('#cellMapController .zoomout').off();
//				$('#cellMapSlider').off();
//				$('#cellDetailVeiw').off();
//				$('#cellLinkLine').off();
//				$('#btn_back_timeline').unbind();
//				$('#cellDetailVeiw').off();
//				//Cellz.dispatcher.off();
//				
//				$('#cellMap .cell').off();
//			},
		},
//////////////  DispatcherEventHandlers //////////////////////////////////////////////		
		DispatcherEventHandlers = function(){
			this.init = function(){
				//Cellz.dispatcher.unbind('share').unbind('deleteCell').unbind('like').unbind('writeCell').unbind('selectPoll');
				if(CellMap.dispatcherTemp === 0){
					++CellMap.dispatcherTemp; 
					cz.dispatcher.bind('share',function(e, _param) { 
						if(cz.Config.screen === 'CELLMAP'){
							//Cellz.ACTION.SHARE_SUCCESS(_param._this);
							$('#cellMap').find('.timeline_box[same_cell_id='+_param.cellId+'] .btnShare').each(function() {
								Cellz.ACTION.SHARE_SUCCESS($(this));
							});
							CellMap.cellDataUpdate(_param.cellId, 'share');
							// TODO : DATA 업데이트 
						}
					});
					
					cz.dispatcher.bind('deleteCell',function(e, _param) {
						if(cz.Config.screen === 'CELLMAP'){
							Cellz.screen.deleteLoader();
							$('#newCellNoti .num').html('0');
							$('#cellMap .cell').remove();
							$('#cellMap .num_pos').remove();
							$('#memberList').remove();
							$('#wrapCellLinkLine').empty();
							$('#starView').empty();
							
							clearInterval(CellMap.newsInterval);
							CellMap.cellMapEventHandlers = null;
							CellMapData.cellMapAjaxconnect(_param.cellId, _param.cellUserId, 1000, 'move');
						}
					});
					
					cz.dispatcher.bind('like',function(e, _param) {
						if(cz.Config.screen === 'CELLMAP'){
							$('#cellMap').find('.timeline_box[same_cell_id='+_param.cellId+'] .btnLike').each(function() {
								Cellz.ACTION.LIKE_SUCCESS($(this));
							});
							CellMap.cellDataUpdate(_param.cellId, 'like');
						}
					});
					
					cz.dispatcher.bind('writeCell',function(e, _param) {
						//TODO 성운뷰 애드에 대한 처리
						if(cz.Config.screen === 'CELLMAP'){
							var currentAddCell = _param.cells[Object.keys(_param.cells).length-1];
							var currentAddCellId = currentAddCell.cellId;
							var currentAddCellUserId = currentAddCell.userId;
							
							$('#newCellNoti .num').html('0');
							$('#cellMap .cell').remove();
							$('#cellMap .num_pos').remove();
							$('#memberList').remove();
							$('#wrapCellLinkLine').empty();
							$('#starView').empty();
							
							clearInterval(CellMap.newsInterval);
							CellMap.cellMapEventHandlers = null;
							if(CellMap.cellMapTargetScaleIndex == 4){
								CellMapData.cellMapAjaxconnect(currentAddCellId, currentAddCellUserId, 5000, 'starView',false);
							}else{
								CellMapData.cellMapAjaxconnect(currentAddCellId, currentAddCellUserId, 5000, 'detaleViewClose');
							}
						}
					});
					
					cz.dispatcher.bind('selectPoll',function(e, _param) {
						if(cz.Config.screen === 'CELLMAP'){
							Cellz.ACTION.SELECT_POLL_SUCCESS(_param._this, _param.result.data);
						}
					});
					
					CellMap.dispatcher.bind('CellMapNewDataLoadSuccess',function(e, _param) {
						CellMap.cellMapNewDataUpDate(_param.cells);//, _param.action
					});
					
				};
			};
		};
	};
	
///////////////   ContentsEventHandlers  ////////////////////////////////////	
	ContentsEventHandlers = function(){
		this.off = function(){
			$('#cellMap .cell').off();
		};
		this.init = function(){
			//console.log('contentsEventHandlers')
			$('#cellMap .cell').off();
			
			$('#cellMap .cell').on('click', '.content', function(e){
				console.log(222)
				e.stopPropagation();
				e.preventDefault();
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				var selectedCellId = $(this).parents('.timeline_box').attr('cell_id');
				var selectedUserId = $(this).parents('.timeline_box').attr('cell_user_id');
				CellMap.selectedHId = selectedHId;
				CellMap.selectedCellPath(selectedHId);
				
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, '', selectedUserId, $path);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
			});
			
			$('#cellMap .cell').on('click', '.profile', function(e){
				e.stopPropagation();
				//e.preventDefault();
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				var selectedCellId = $(this).parents('.timeline_box').attr('cell_id');
				var selectedUserId = $(this).parents('.timeline_box').attr('cell_user_id');
				CellMap.selectedHId = selectedHId;
				CellMap.selectedCellPath(selectedHId);
				
				
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, '', selectedUserId, $path);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
			});
			
			$('#cellMap .cell').on('click', '.pr', function(e){
				console.log(111111111111);
				e.stopPropagation();
				//e.preventDefault();
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				var selectedCellId = $(this).parents('.timeline_box').attr('cell_id');
				var selectedUserId = $(this).parents('.timeline_box').attr('cell_user_id');
				CellMap.selectedHId = selectedHId;
				CellMap.selectedCellPath(selectedHId);
				
				
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, '', selectedUserId, $path);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
			});
			
			$('#cellMap .cell').on('click', '.btn_joinPoll', function(e){
				//TODO 
				e.stopPropagation();
				e.preventDefault();
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				var selectedCellId = $selectedCell.find('.timeline_box').attr('cell_id');
				var selectedUserId = $selectedCell.find('.timeline_box').attr('cell_user_id');
				CellMap.selectedHId = selectedHId;
				
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, '', selectedUserId, $path);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
				CellMap.selectedCellPath(selectedHId);
			});
			
			$('#cellMap .cell').on('mouseenter', '.wrapCanvas area', function(e){
//				var cellData = $(this).data();
//				//console.log('selectCellId(',$(this).attr('href'),')  id(',cellData.id,') userId(',cellData.userId,') index(',cellData.index,')');
			});
			
			$('#cellMap .cell').on('mouseleave', '.wrapCanvas area[state=true]', function(e){
//				CellMap.redrawCellCanvasCircleShape($(this).data(),'mouseleave');
			});
			
			$('#cellMap .cell').on('click', '.wrapCanvas area[state=true]', function(e){
				e.preventDefault();
				$.util_notice('삭제된 cell 입니다.');
			});
			
			$('#cellMap .cell').on('click', '.wrapCanvas area[state=false]', function(e){
				//e.stopPropagation();
				e.preventDefault();
				var cellData = $(this).data();
				CellMap.selectedCellPath(cellData.hId);
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], cellData.cellId, '', cellData.userId, $path);
				CellMap.selectedCellFocus( cellData.hId, 400, 'detaleView' );
			});
			
			$('#cellMap .cell').on('click', '.cellUp', function(e){
				e.stopPropagation();
				e.preventDefault();
				clearInterval(CellMap.newsInterval);
				
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				var selectedCellId = $(this).parents('.timeline_box').attr('cell_id');
				var selectedUserId = $(this).parents('.timeline_box').attr('cell_user_id');
				CellMap.selectedHId = selectedHId;
				
				CellMap.cellDetailView = new CellDetailView();
				var $path = $('#cellMapNavi').clone();
				CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, 'cellUp', selectedUserId, $path);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
			});
			
			
			$('#cellMap .cell').on('click', ' .profile span', function(e){
				e.stopPropagation();
				e.preventDefault();
				var $selectedCell = $(this).parents('.cell');
				var selectedHId = $selectedCell.attr('id');
				CellMap.selectedHId = selectedHId;
				this.tnc_wrap_Height = $('#tnc_wrap').height();
				$('#cellDetailVeiw').attr('cellPathId', selectedHId);
				CellMap.selectedCellFocus( selectedHId, 400, 'detaleView' );
			});

			$('#cellMap .cell').on('click', '.btnLike', function(e){
				e.stopPropagation();
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box')
				,	cellUserId = $cell.attr('cell_user_id')
				,	cellId = $cell.attr('cell_id');
				Cellz.ACTION.LIKE($(this), cellUserId, cellId);
			});
			
			$('#cellMap .cell').on('click', '.btnShare', function(e){
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box')
				,	cellUserId = $cell.attr('cell_user_id')
				,	cellId = $cell.attr('cell_id');
				Cellz.ACTION.SHARE($(this), cellUserId, cellId);
			});
			
			$('#cellMap .cell').on('click', '.btnRemoveCell', function(e) {
				e.preventDefault();
				var $cell = $(this).parents('.timeline_box');
				var cellId = $cell.attr('cell_id');
				var cellUserId = $cell.attr('cell_user_id');
				var strNoti = ($cell.attr('original_cell_id') !== undefined) ? $.util_message.timeline.deleteSharedCell : $.util_message.timeline.deleteCell;
				confirmLayer(strNoti, function() {
					Cellz.screen.setLoader();
					Cellz.ACTION.DELETE_CELL(cellId, cellUserId);
				});
			});
		};

	};
//////////////HideChildCellEventHandlers //////////////////////////////////////////////			
	HideChildCellEventHandlers = function(){
		$('#cellMap .num_pos').off();
		this.simpleCellList = '';
		this.init = function(){
			// TODO = 다른곳 클릭하면 닫기..
			$('#cellMap .num_pos').on('click', function(e) {
				e.preventDefault();
				$(this).find('.num_wrap2').addClass('size_t1');
				var $celectedHideCells = $(this);
				//var parentCell = $(this).attr('parentHId');
				//CellMap.displayChangeSelectCellPath($celectedHideCells, parentCell, 'hide');
				
				//CellMap.selectedCellPath(parentCell, 'hide');
				
				this.simpleCellList = new SimpleCellList(CellMap.ajaxData, CellMap.cellData);
				this.simpleCellList.init($celectedHideCells);
				var simpleCellListEventHandlers =  new SimpleCellListEventHandlers();
				simpleCellListEventHandlers.simpleCellListEvent();
			});
			
		};
	};
	
//////////////SimpleCellListEventHandlers //////////////////////////////////////////////		
	SimpleCellListEventHandlers = function(){
		this.self = this;
		
		this.simpleCellListEventOff = function(){
			$('#wrapCellMap').off();
			$('#simpleCellList').off();
		};
		
		this.simpleCellListEvent = function(e){
			$('#wrapCellMap').off();
			$('#simpleCellList').off();
			
			$('#wrapCellMap').on('mousedown', function(e){
				e.preventDefault();
				$('#simpleCellList').each(function(){
					if( $(this).css('display') == 'block' ){
						var l_position = $(this).offset();
						l_position.right = parseInt(l_position.left) + ($(this).width());
						l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());
					
						if( ( l_position.left <= e.pageX && e.pageX <= l_position.right ) && ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) ){
							var $selectedWrapBox = $(e.target).parentsUntil('.memly_list','.wrapBox');
							if($selectedWrapBox.length !== 0){
								var $selectedCell = $selectedWrapBox.find('.box');
								var selectedHid = $selectedCell.attr('cell_hid');
								var appendHId = CellMap.cellData[selectedHid].appendHId;
								var selectedCellId = $selectedCell.attr('cell_id');
								var selectedUserId = $selectedCell.attr('cell_user_id');
								CellMap.selectedCellPath(selectedHid, 'hide');
								var $path = $('#cellMapNavi').clone();
								if(appendHId === ''){
									CellMap.selectedCellFocus( hId, 400, 'detaleView' );
								}else{
									CellMap.selectedCellFocus( appendHId, 400, 'detaleView' );
								}
								CellMap.cellDetailView = new CellDetailView();
								CellMap.cellDetailView.displayCellDetailView(CellMap.ajaxData['cells'], selectedCellId, '', selectedUserId, $path);
								$('#simpleCellList').remove();
							}
						}else{
							$('#simpleCellList').remove();
						}
					}
				});
				$('.num_wrap2').removeClass('size_t1');
			}); 
			
			$('#simpleCellList').on('click', '.memly_close', function(e) {
				e.stopPropagation();
				e.preventDefault();
				$('#simpleCellList').remove();
				this.self = null;
			});
		};
		
	};
	
})(jQuery, Cellz, window);