/*
 * topicview 

 * TODO: 갱신조건 메시지 처리
 * 			- share한 경우 안나옴.(송선임님께 전달)
 * TODO: 버튼 애니메이션 처리
 * 
 * 디자인	
2. 업데이트 토픽셀 현재 작업 불가 후순위 적용
7. 관련 인터렉션 후순위 적용

 * */
(function($, cz, w) {
cz.TopicView = klass(null, {
	o: null
	,filter: null
	,initialized: null
	,alreadyDrawed: null
	,lastCellTime: null //마지막 로드된 셀의 TimestampTemp
	,firstCellTime: null 
	,hasCell: null //셀이 있는지 여부
	,usemapData: null //캔버스 context 저장 객체
	,RAIL_CLASS: 'rail'
	,CELL_FILL_COLOR: '#FFFFFF' //cell 배경색 
	,CELL_BORDER_COLOR: '#bacbd3' //cell 선색 
	,CELL_UNREAD_BORDER_COLOR: '#b1e7ff' //cell 안읽은 선색 
	,CELL_LINE_WIDTH: 2
	,CELL_UNREAD_LINE_WIDTH: 6
	,WRAP_SIZE: {  //CELL사이즈는 가로 - 32, 세로 - 42
		LEVEL_0: {
			WIDTH: 372
			,HEIGHT: 380
		}
		,LEVEL_1: {
			WIDTH: 292
			,HEIGHT: 302
		}
		,LEVEL_2: {
			WIDTH: 232
			,HEIGHT: 242	
		}
		,LEVEL_3: {
			WIDTH: 192
			,HEIGHT: 202
		}
	}
	,railsSize: null // 레일의 사이즈 배열
	,$wrap: null 
	,$rails: null //레일의 엘리먼트 배열 
	,$railsInner: null //레일의 inner엘리먼트 배열 
	,'__construct': function(_options) {
		this.o = $.extend({}, cz.TopicView.Defaults, _options);
		this.filter = _options.filter;

		this.initialize();
		this.eventListener();
	}
	,'initialize': function() {
		this.$wrap = $('#'+this.o.id);
		this.$wrap.html('');
		this.railsSize = [0,0,0];
		this.$rails = [];
		this.$railsInner = [];
		this.alreadyDrawed = false;
		this.hasCell= false;
		this.usemapData = {};
		this.makeRails();
		this.load('INIT');
		this.initialized = true;
//		this.o.afterInit(this);
	}
	,'isInitialized': function() {
		return this.initialized;
	}
	,'makeRails': function() {
		for (var i = 0, ii = this.railsSize.length; i < ii; i++) {
			var $rail = $('<div id="'+this.RAIL_CLASS+'_'+i+'" class="'+this.RAIL_CLASS+' '+this.RAIL_CLASS+'_'+i+'">');
			var $inner = $('<div class="rail_inner">');
			$inner.appendTo($rail);
			$rail.appendTo(this.$wrap);
			this.$rails.push($rail);
			this.$railsInner.push($inner);
		}
	}
	,'getCellElement': function(_cellId, _ranking, _content) {
		var html = ''
		html += '<div id="topic_'+_cellId+'" class="cell cell_bg rowtype4_'+_ranking+'">';
	    html += '	<div class="rowtype4_'+_ranking+'_bg"></div>';
		html += '	<div class="cellview_area"></div>';
		html += '<div class="cell_blyr_wrap"><div class="cell_blyr"><div class="_ellipsis _ellipsis100">';
		html += '	<strong class="userName"></strong><span class="message"></span>';
		html += '	<span class="bg_l"></span>';
		html += '	<span class="bg_r"></span>';
		html += '	<span class="bu"></span>	';		
		html += '</div></div></div>';
		html += '	<div class="wrapCanvas">';
		html += '		<canvas class="cellCircle"></canvas>';
		html += '		<map name="topicMap_'+_cellId+'">';
		html += '			<area shape="circle" href="#">';
		html += '		</map>';
		html += '		<img src="../../../resources/images/cellMap/trans.gif" class="mapImage" usemap="#topicMap_'+_cellId+'">';
		html += '	</div>';
		html += '</div>';
		return $(html);
	}
	,'load': function(_loadType) {
		if (cz.screen !== undefined) cz.screen.setLoader();

		var self = this
			,param = {
				pageSize: this.o.cellLengthPerPage
				,timelineFilter: this.filter.o.timelineFilter
				,viewFilter: this.filter.o.viewFilter
				,sortOrder: 'DESC'
			};
		if (this.filter.o.clickParam) {
			param.click = this.filter.o.clickParam;
		}

		if (_loadType === 'MORE') {
			param.endTime = this.getLastCellTime();
		}
		$.ajax({
			type: "GET",
			dataType: "json",
			url: self.o.url,
			data: param,
			cache: false,
			success: function(_json) {
				if (_json.result_code === 1) {
					var data = _json.data;
					self.hasCell = self._hasCell(data);
					if (self.hasCell) {
						self.lastCellTime = data.lastCellTime;
						if (_loadType !== 'MORE') self.firstCellTime = data.firstCellTime;
						self.draw(data.cells);
						//셀이 30개이상 이면 더보기버튼 생성
//						if (data.cells.length >= self.o.cellLengthPerPage) {
//							self._createMoreBtn();
//						}
//
//						if (_loadType === 'MORE' && (data.cells.length < self.o.cellLengthPerPage)) {
//							self._removeMoreBtn();
//						}
						self._createMoreBtn();
					} else {
						self.lastCellTime = _json.timestamp;
						if (_loadType === 'MORE') {
							$.util_notice('더 이상 불러올 내용이 없습니다.');
							self._removeMoreBtn();
						} else {
							self.firstCellTime = _json.timestamp;
						}
					}
					if (_loadType === 'INIT' && self.o.afterInit !== undefined) {
						self.o.afterInit();
					}
					if (cz.screen !== undefined) cz.screen.deleteLoader();
				}
			},
			error: function(xhr, status, error) {
				if (cz.screen !== undefined) cz.screen.deleteLoader();
			}
		});
	}
	,'_createMoreBtn': function() {
		var self = this;
		this._removeMoreBtn();
		this.$moreBtn = $('<a class="btn_cellmore" href="#">더보기</a>');
		this.$moreBtn.appendTo(this.$railsInner[1]);
		this.$moreBtn.click(function(e) {
			e.preventDefault();
			/*var tmpArr = [];
			$('#timelineDiv .timeline_box').each(function() {
				var userId = ($(this).attr('ancestor_user_id') > 0) ? $(this).attr('ancestor_user_id') : $(this).attr('cell_user_id');
				var cellId = ($(this).attr('ancestor_cell_id') > 0) ? $(this).attr('ancestor_cell_id') : $(this).attr('cell_id');
				tmpArr.push(userId+'_'+cellId);
			});
			base.cellMapViewInfo = tmpArr.join(',');*/
			self.moreLoad();
		});
	}
	,'getLastCellTime': function() {
		return this.lastCellTime;
	}
	,'getFirstCellTime': function() {
		return this.firstCellTime;
	}
	,'_removeMoreBtn': function() {
		if (this.$moreBtn !== undefined) this.$moreBtn.remove();
	}
	,'_hasCell': function(_data) {
		return (_data.cells.length > 0) ? true : false;
	}
	,'moreLoad': function() {
		this.load('MORE');
	}
	,'draw': function(_cells) {
		try {
			for (var idx in _cells) {
				this.add(_cells[idx], idx);
			}
	//		this.setRailsHeight(this.railsSize[this.getMaxSizeArrayIndex()]);
			this.setCloneHeight(this.railsSize[this.getMaxSizeArrayIndex()]+320);
			if (this.alreadyDrawed === false) { //init시에만 호출
				this.o.afterDraw(this);
			}
			this.alreadyDrawed = true;
		}
		catch(e) {
			console.log(e);
		}
		
	}
	,'setCloneHeight': function(_height) {
		$('.topicviewHeightClone').css({
			height: _height
		});
	}
	,'add': function(_cell, _idx) {
		var cell = (_cell.ancestorCell !== undefined) ? _cell.ancestorCell : _cell
			cellId = (cell.cellId !== undefined) ? cell.cellId : null
			,connectN = (cell.connectN !== undefined) ? cell.connectN : null
			,cellType = (cell.cellType !== undefined) ? cell.cellType : null
			,cellUserId = (cell.userId !== undefined) ? cell.userId : null
			,_cellUserId = (_cell.userId !== undefined) ? _cell.userId : null
			,read = (cell.read !== undefined) ? cell.read : null
			,descriptionCell = (_cell.descriptionCell !== undefined) ? _cell.descriptionCell : null
			,cellMediaType = null
			,ranking = this.getRanking(connectN)
			,wrapHeight = this.getWrapSize(ranking).height
	    	,recentActionMessage = null
			,oCellSize = this.getCellSize(ranking)
			,oCircleCoords = this.getCircleCoords(ranking)
			,minSizeIndex = this.getMinSizeArrayIndex()
			,cellCircleContext = null
			,hasAncestorCell = (_cell.ancestorCell !== undefined) ? true : false
			,$cell = this.getCellElement(cellId, ranking, connectN)
			,$canvas = $cell.find('canvas')
		;
		if (cell.cellMediaType !== undefined) cellMediaType = cell.cellMediaType['1'];
		if (cz.User.id === _cellUserId && hasAncestorCell === false) { //조상셀이 없고 내가 쓴 경우 read속성은 무조껀 true
			read = true;
		}
//		console.log(cellMediaType);
		$canvas
			.attr('width',oCellSize.width)
			.attr('height',oCellSize.height)
			.css({
				marginLeft: -(oCellSize.width/2)
			});
    	cellCircleContext = $canvas.get(0).getContext("2d")
//    	this.circleContext[cellId] = cellCircleContext
    	//this.cellContextArr = cellContextArr;
    	//console.log(this.filter.o.timelineFilter)
    	if (this.filter.o.timelineFilter === 'FOLLOWING' && descriptionCell !== null ) {
    		recentActionMessage = this.getRecentActionMessage(descriptionCell.cellType);
    		this.setActionMessage($cell, recentActionMessage, descriptionCell.cellUser.name, descriptionCell.cellId, descriptionCell.userId);
    	}
    	this.displayCellContents($cell, cell, _cell, 0, ranking, cellMediaType);
    	$(this.$railsInner[minSizeIndex]).append($cell);
    	this.railsSize[minSizeIndex] += wrapHeight;
    	
    	this.editCellContentsClass($cell, ranking, cellMediaType, 4);
    	this.usemapData[cellId] = this.makeUsemap($cell, cellCircleContext, oCellSize, oCircleCoords, read);
    	this.drawCircleCanvas(cellId, 'event');
//    	console.log('ranking', ranking);
    	this.drawImageMask(cellId, cell, oCellSize, cellMediaType, ranking);
	}
	,'setActionMessage': function(_$cell, _recentActionMessage, _userName, _cellId, _userId) {
		var $cellMsgBox = _$cell.find('.cell_blyr_wrap');
		$cellMsgBox.find('.cell_blyr').attr('cell_id', _cellId).attr('cell_user_id', _userId);
		$cellMsgBox.find('.message').text(_recentActionMessage);
		$cellMsgBox.find('.userName').text(_userName);
		$cellMsgBox.show();
	}
	,'getRecentActionMessage': function(_cellType) {
		var msg;
		if (_cellType === 'CELL') {
			msg = '님이 Add했습니다.';
		} else if (_cellType === 'RECELL') {
			msg = '님이 Share한 Cell이 있습니다.';
		}
		return msg;
	}
	,'getRanking': function(_connectN) {
		var ranking;
		if (_connectN <= 3) {
			ranking = 3;
		} else if (_connectN >= 4 && _connectN <= 8) {
			ranking = 2;
		} else if (_connectN >= 9 && _connectN <= 13) {
			ranking = 1;
		} else {
			ranking = 0;
		}
//		ranking = 0;
		return ranking;
	}
	,'getWrapSize': function(_ranking) {
		return {
			width: this.WRAP_SIZE['LEVEL_'+_ranking].WIDTH, 
			height: this.WRAP_SIZE['LEVEL_'+_ranking].HEIGHT
		};
	}
	,'getCellSize': function(_ranking) {
		return {
			width: this.WRAP_SIZE['LEVEL_'+_ranking].WIDTH - 14, 
			height: this.WRAP_SIZE['LEVEL_'+_ranking].HEIGHT - 24
		};
	}
	,'getCircleCoords': function(_ranking) {
		return {
			x:  (this.WRAP_SIZE['LEVEL_'+_ranking].WIDTH - 14)/2
			,y: (this.WRAP_SIZE['LEVEL_'+_ranking].HEIGHT - 24)/2  
			,radius: (this.WRAP_SIZE['LEVEL_'+_ranking].WIDTH - 34)/2
		};
	}
	,'getMinSizeArrayIndex': function() {
		return this.railsSize.indexOf(Math.min.apply(Math, this.railsSize));
	}
	,'getMaxSizeArrayIndex': function() {
		return this.railsSize.indexOf(Math.max.apply(Math, this.railsSize));
	}
	,'makeUsemap' : function(_$cell, _cellCircleContext, _oCellSize, _oCircleCoords, _read){
		var usemapData = {
				cellCircleContext: _cellCircleContext
				,radius: _oCircleCoords.radius
				,centralPointX: _oCircleCoords.x
				,centralPointY: _oCircleCoords.y
				,oCellSize: _oCellSize
				,read: _read
			}
		,	$wrapCanvas = _$cell.find('.wrapCanvas')
		,	$image = $wrapCanvas.find('img')
		,	$area = $wrapCanvas.find('area')
		;
		
	    $image.css({
    		width : _oCellSize.width,
    		height : _oCellSize.height
    	});
	    $area.attr('coords',_oCircleCoords.x+', '+_oCircleCoords.y+', '+_oCircleCoords.radius);
	    //$area.attr('coords',_oCircleCoords.x+', '+_oCircleCoords.y+', '+_oCircleCoords.radius).data('usemapData', usemapData);
	    return usemapData;
	    
	}
	,'displayCellContents': function(_$cell, currentCell, _currentCell, zoomValue, cellRanking, cellType){
		var $cellTmpl = '';
		var $cell = _$cell;
		$cell.attr('recent_cell_id',_currentCell.cellId);
		$cell.attr('recent_cell_user_id',_currentCell.userId);
		var $cellview_area = $cell.find('.cellview_area');
		if(!currentCell.deleted){			
			var cellTmpl = new Cellz.Template.Cell(currentCell, null, 'CELLMAP');
			$cellTmpl = cellTmpl.getElement();
			
			var $firstAttachment = $cellTmpl.find('.attachments *:eq(0)').clone();
			var $textGroup = $cellTmpl.find('.txt_group').clone();
			var $firstCliping = $textGroup.find('.preview_group:eq(0)');
			var $tx_area = $cell.find('.tx_area');
			if($tx_area.length < 1){
				if ($firstAttachment.length > 0 && $firstAttachment.hasClass('word_group')) { //파일첨부
					var tmp = [];
					var fileTypeClass = $firstAttachment.find('.icon').attr('class');
					if (fileTypeClass !== undefined) {
						var fileName = $firstAttachment.find('.tlt').text();
						var link = $firstAttachment.find('.down').attr('href');
						tmp = fileTypeClass.split(' ');
						fileTypeClass = tmp[1].replace('sp_','');
						var $span = $('<div class="tx_area"><div class="wrap_ellipsis"><span class="_ellipsis"><span class="file_type2 '+fileTypeClass+'">'+fileTypeClass+'</span><a href="'+link+'">'+fileName+'</a></span></div></div>');
						$cellview_area.parents('.cell').append($span);
					}
				} else if ($firstCliping.length > 0) {
					var href = $firstCliping.find('.pv_tlt a').attr('href');
					var $noticeForCell = $('<div class="tx_area"><div class="wrap_ellipsis"><span class="_ellipsis"><a href="'+href+'" target="_blank">'+href+'</a></span></div></div>');
					$cellview_area.parent().append($noticeForCell);
				}
			}
			$cell.find('.tx_area').show();
			$cellview_area.append($cellTmpl);
			$cellTmpl.find('.preview_group').hide();
			
			
			$cell.find('.btn_joinPoll').remove();
			if(cellRanking + zoomValue <= 2 ){
				if(cellType == 'POLL'){
					this.makeJoinPoll(currentCell.cellId);
				}
			}

			if (cellRanking === 3) {
				$cellview_area.find('.txt_group').prepend($cellview_area.find('.profile .pr'));
			}
			if (currentCell.group !== undefined) {
				var group = currentCell.group;
				var $isGroup = '<strong class="isGroup _ellipsis"><img width="15" height="12" alt="cellzgroup" src="/resources/images/ico_cellmap5.png"> '+group.groupName+'</strong>';
				$cellview_area.find('.txt_group').prepend($isGroup);
			}
			
			var connectN = (currentCell.connectN !== undefined) ? currentCell.connectN : null;
			var $connectN = '<div class="cellmap cellmapCount"><a class="view_count" href="#"><span class="bg_l"></span>'+connectN+'<span class="bg_r"></span></a></div>';
			$cellview_area.find('.content').before($connectN);
			
			var followClass = (currentCell.followed !== undefined && currentCell.followed === true)? 'following' : null;
			var $btnMapFollow = '<div class="btn_follow"><a href="#" class="'+followClass+'"><span class="blind">Map follow</span></a></div>';
			$cellview_area.find('.content').after($btnMapFollow);
			
			
			
		}else{
			//var $cell = $cellview_area.parents('.cell');
			if($cell.find('.noticeForCell').length < 1){
				// TODO : 삭제 된 것으로 그리기..
				
//				if(cellRanking > 2){
//					$cellTmpl = $('<div class="noticeForCell"><div class="wrap_ellipsis"><span class="_ellipsis">X</span></div></div>');//$('<div />').addClass('noticeForCell').html('X');//삭제되어 내용을 확인하실 수 없습니다.//.addClass('timeline_box');
//				}else{
//					$cellTmpl = $('<div class="noticeForCell"><div class="wrap_ellipsis"><span class="_ellipsis">삭제되어 내용을 확인하실 수 없습니다.</span></div></div>');
//				}
				$cellview_area.parent().append($cellTmpl);
			}
		}
		
	}
	,'makeJoinPoll' : function(cellId){
		var $cell = $('#'+cellId);
		var $btn_joinPoll = $('<a class="btn_joinPoll">참여하기</a>');//<span href="#"></span>
		$cell.append($btn_joinPoll);
//		var $noticeForCell = $('<div class="tx_area"><div class="wrap_ellipsis"><span class="_ellipsis"><a href="'+href+'" target="_blank">'+href+'</a></span></div></div>');
//		$cellview_area.parent().append($noticeForCell);
	}
	,'editCellContentsClass' : function($cell, cellRanking, cellType, zoomValue){
//		console.log('cellRanking', cellRanking)
//		console.log('zoomValue', zoomValue)
		var rowtypeClass = 'rowtype' + zoomValue + '_' + cellRanking;
		$cell.attr('class','').addClass(rowtypeClass).addClass('cell_bg').addClass('cell');
		var $cellview_area = $cell.find('.cellview_area');
		
		$cellview_area.addClass(cellType);
    	var $timeline_box = $cellview_area.find('.timeline_box');
    	var $txt_group = $cellview_area.find('.txt_group');
//    	console.log($txt_group);
//	    	var profileSize = $cellview_area.find('.profile').height();
//	    	var tx_area = '';

    	switch(cellRanking){
    		case 0 : 
	    		break;
    		case 1 : 
    			$timeline_box.addClass('noname');
	    		break;
    		case 2 : 
    			$timeline_box.addClass('noname');
	    		break;
    		case 3 : 
    			$timeline_box.addClass('noname');
    			$timeline_box.addClass('step_size16');
	    		$timeline_box.addClass('noadd');
	    		$timeline_box.addClass('nothumb');
	    		break;
    	}

    	$timeline_box.addClass(rowtypeClass);
    	$timeline_box.addClass('timeline_p_'+cellType);

//	    	var textLineHeight = $txt_group.css('lineHeight');
    	var textMaxHeight = parseFloat($txt_group.css('max-height'));
    	var textGroupHeight = $txt_group.height();
    	$cellview_area.css('top',''); // 초기화 
    	var areaTop = parseFloat($cellview_area.css('top'));
    	var moveTopValue = (textMaxHeight - textGroupHeight) / 2;
    	$cellview_area.css('top', areaTop + moveTopValue);
    	
	}
	,'drawCircleCanvas' : function(_cellId, event){
		var cellCanvasData = this.usemapData[_cellId];
		var context = cellCanvasData.cellCircleContext;
		
		context.beginPath();
		if (cellCanvasData.read === true) {
			context.lineWidth = this.CELL_LINE_WIDTH;
			context.strokeStyle = this.CELL_BORDER_COLOR;
		} else {
			context.lineWidth = this.CELL_UNREAD_LINE_WIDTH;
			context.strokeStyle = this.CELL_UNREAD_BORDER_COLOR;
		}
		context.fillStyle = this.CELL_FILL_COLOR;
		context.arc(cellCanvasData.centralPointX, cellCanvasData.centralPointY, cellCanvasData.radius, Math.PI*2, false);
		context.closePath();
		context.stroke();
		context.fill();
	}
	,'drawCircle': function(_ctx, _x, _y, _r, _oCellSize, _img, _read) {
		//console.log(_ctx);
//		console.log(_img);
		_ctx.save();
		_ctx.beginPath();
		if (_read === true) {
			_ctx.lineWidth = this.CELL_LINE_WIDTH;
			_ctx.strokeStyle = this.CELL_BORDER_COLOR;
		} else {
			_ctx.lineWidth = this.CELL_UNREAD_LINE_WIDTH;
			_ctx.strokeStyle = this.CELL_UNREAD_BORDER_COLOR;
		}
		_ctx.clearRect(0, 0, 372, 380);
		_ctx.fillStyle = this.CELL_FILL_COLOR;
		_ctx.arc(_x, _y, _r, Math.PI*2, false);
//		_ctx.closePath();
		_ctx.stroke();
		_ctx.fill();
		if (_img !== null) {
			_ctx.clip();
			_ctx.drawImage(_img, 0, _oCellSize.height*0.73);
		}
		_ctx.restore();
	}
	,'extendCircle': function(_usemapData) {
		var self = this
		,	ctx = _usemapData.cellCircleContext
		,	x = _usemapData.centralPointX
		,	y = _usemapData.centralPointY
		,	r = _usemapData.radius
		,	oCellSize = _usemapData.oCellSize
		,	read = _usemapData.read
		,	img = (_usemapData.circleImage !== undefined) ? _usemapData.circleImage : null
		,	limit = r + 7
		;
		var interval = w.setInterval(function() {
//			console.log('r',r)
//			console.log('limit',limit)
			if (r > limit) {
				//멈춤
				w.clearInterval(interval);
			} else {
				self.drawCircle(ctx, x, y, r, oCellSize, img, read);
				r += 1;
			}
		}, 20);
	}
	,'reduceCircle': function(_usemapData) {
		var self = this
		,	ctx = _usemapData.cellCircleContext
		,	x = _usemapData.centralPointX
		,	y = _usemapData.centralPointY
		,	r = _usemapData.radius + 7
		,	oCellSize = _usemapData.oCellSize
		,	read = _usemapData.read
		,	img = (_usemapData.circleImage !== undefined) ? _usemapData.circleImage : null
		,	limit = _usemapData.radius
		;
		var interval = w.setInterval(function() {
//			console.log('r',r)
//			console.log('limit',limit)
			if (r < limit) {
				//멈춤
				w.clearInterval(interval);
			} else {
				self.drawCircle(ctx, x, y, r, oCellSize, img, read);
				r -= 1;
			}
		}, 30);
	}
	,'drawImageMask' : function(cellId, currentCell, cellSize, cellType, cellRanking){
//		console.log('cellId',cellId)
//		console.log('currentCell',currentCell)
//		console.log('cellSize',cellSize)
//		console.log('cellType',cellType)
//		console.log('cellRanking',cellRanking)
		if(currentCell.contents === undefined) return;
		var self = this;
		var img = new Image();	
//		console.log('cellType', cellType);	
		switch(cellType){
			case 'SAY' :
				var contentsString = currentCell['contents'];
				var firstContentsObj = self.getFirstContentsObj(contentsString);
				var type = firstContentsObj.type;
				if(type == 'url'){
//					var imageUrl = firstContentsObj['imageUrl'];
					var link = firstContentsObj['link'];
					var filter =/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
					if(link.match(filter)){
						var youtubeURL = 'http://img.youtube.com/vi';
						var movieId = RegExp.$1;
		    			var thumbnailSize = '0';
		    			var extension = 'jpg';
		    			img.src = youtubeURL+'/'+movieId+'/'+thumbnailSize+'.'+extension;
					}else{
						img.src = '../../../resources/images/cellMap/bg_attachments.png';
					};
				}else if(type == 'map'){
					var googleURL = 'http://maps.googleapis.com/maps/api/staticmap?';
	    			var markers = 'color:red%7C';
	    			var zoom = 16;
	    			var height = Math.round(cellSize.height * 0.27);
					var width = Math.round(cellSize.height);
	    			var mapSize = width+'x'+height;
	    			var sensor = 'false';
	    			var LatLng = firstContentsObj['LatLng'];
	    			// TODO : #cellMap .map_group {display:none !important;} important삭제 
	    			img.src = googleURL+'&markers='+markers+LatLng+'&zoom='+zoom+'&size='+mapSize+'&sensor='+sensor;
	    		}
				break;
			case 'DOCUMENT' :
				//img.src = '../../../resources/images/cellMap/bg_attachments.png';
				// TODO : 첨부파일 넣기..
				//var $span = $('<div class="tx_area"><div class="wrap_ellipsis"><span class="_ellipsis"><span class="file_type2 '+fileTypeClass+'">'+fileTypeClass+'</span><a href="'+link+'">'+fileName+'</a></span></div></div>');
				break;
			case 'POLL' :
				//img.src = '../../../resources/images/cellMap/bg_attachments.png';
				break;
			case 'IMAGE' :
				var auth = currentCell.attachmentsMeta[0].auth;
				var fileName = currentCell.attachmentsMeta[0].fileName;
				
				if(auth !== 'NONE'){//권한 체크..
					var api = 'api';
					var apiVersion = 'v1';
					var service = 'file';
					var method = 'thumbnail';
					var parameter = 'fname';
					var value = fileName;
					var height = Math.round(cellSize.height * 0.3);
					var width = Math.round(cellSize.width);
					var crop = true;
					img.src = '/'+api+'/'+apiVersion+'/'+service+'/'+method+'?'+parameter+'='+value+'&h='+height+'&w='+width+'&crop='+crop;
//					console.log('img.src',img.src)
				}else{
					img.src = '../../../resources/images/cellMap/bg_attachments.png';
				}
				break;
				
		}
		$(img).load(function(){
			//CellMap.cellAttachmentsImage[cellId] = {};
			//CellMap.cellAttachmentsImage[cellId][cellType] = img;
			var ctx = self.usemapData[cellId].cellCircleContext;
			ctx.save();
			ctx.clip();
			ctx.drawImage(img, 0, cellSize.height*0.73);
			ctx.restore();
			self.usemapData[cellId].circleImage = img;
		});
	}
	,'getFirstContentsObj' : function(contentsString){
		var firstContentsObj = {};
		var contentsObj = this.convertedContents(contentsString);
		for(var index in contentsObj){
			var type = contentsObj[index]['type'];
			if(type == 'link'){
				firstContentsObj['type'] = type;
				firstContentsObj['link'] = subContents;
				break;
			}
		}
		for(var index in contentsObj){
			var type = contentsObj[index]['type'];
			if(type == 'url'){
				firstContentsObj['type'] = type;
				var subContents = contentsObj[index]['content'];
				firstContentsObj['link'] = subContents['link'];
				firstContentsObj['imageUrl'] = subContents['imageUrl'];
				firstContentsObj['movieUrl'] = subContents['movieUrl'];
				break;
			}else if(type == 'map'){
				firstContentsObj['type'] = type;
				var subContents = contentsObj[index]['content'];
				firstContentsObj['link'] = subContents['Lat":"37.5139848","Lng":"127.05652069999996'];
				firstContentsObj['imageUrl'] = subContents['img'];
				firstContentsObj['LatLng'] = subContents['Lat']+','+subContents['Lng'];
			}
		}
		return firstContentsObj;
	}
	,'convertedContents' : function(contents){
		var convertedContents = [];
		try {
			convertedContents = jQuery.parseJSON(contents);
		} catch (e) {
			convertedContents = [{type:'url', content:{link : '잘못된 값이 입력 되었습니다.'}}];
		}
		return convertedContents;
	}
	,'setTypeFilter': function(_type) {
		this.filter.o.timelineFilter = _type;
	}
	,'setClickParam': function(_value) {
		this.filter.o.clickParam = _value;
	}
	,'setMapFollow': function(_$btn, _cellId, _cellUserId, _type) {
		$.ajax({
			dataType: "json",
			type: "POST",
			cache: false,
			url: Cellz.API_URL.CELLMAP[_type],
			data: { 
				userId: _cellUserId, 
				cellId: _cellId 
			},
			success: function(_data) {
				if (_data.result_code === 1) {
					if (_type === 'FOLLOW') {
						_$btn.find('a').attr('class','');
						_$btn.find('a').addClass('following');
					} else {
						_$btn.find('a').attr('class','');
					}
				} else {
				}
			},
			error: function(xhr, status, error) {
				nameCardClicked = false;
			}
		});
		
	}
	,'eventListener': function() {
		var self = this;
		$('#topicView').on('click', '.cell area, .cellview_area .content, .cellmapCount', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $cell = $(this).parents('.cell_bg')
			,	cellId = $cell.attr('recent_cell_id')
			,	cellUserId = $cell.attr('recent_cell_user_id')
			;
//			console.log($cell);
			self.o.cellmapView(cellId, cellUserId);
			var _cellId = $cell.find('.timeline_box').attr('id')
			,	usemapData = self.usemapData[_cellId]
			;
			usemapData.read = true;
			self.reduceCircle(usemapData);
		});
		
		$('#topicView').on('mouseenter', '.cellview_area', function(e) {
//			console.log('cellview_area-mouseenter')
			var $cell = $(this).parents('.cell_bg');
			$cell.addClass('on');
		});
		$('#topicView').on('mouseleave', '.cellview_area', function(e) {
//			console.log('cellview_area-mouseleave')
			var $cell = $(this).parents('.cell_bg');
			$cell.removeClass('on');
		});
		$('#topicView').on('mouseenter', '.cell area', function(e) {
//			console.log('mouseenter');
			if ($(this).hasClass('on') === false) {

//				console.log('mouseenter');
				var $cell = $(this).parents('.cell_bg');
				var cellId = $cell.find('.timeline_box').attr('id');
				var usemapData = self.usemapData[cellId];
				
				self.extendCircle(usemapData);
				$(this).addClass('on');
			}
		});
		$('#topicView').on('mouseleave', '.cell area', function(e) {
			var $this = $(this);
			w.setTimeout(function() {
//				console.log('mouseleave');
				var $cell = $this.parents('.cell_bg');
				if ($cell.hasClass('on')) {
					return;
				}
				var cellId = $cell.find('.timeline_box').attr('id');
				var usemapData = self.usemapData[cellId];
				
				self.reduceCircle(usemapData);
				$this.removeClass('on');
			}, 20);
		});
		$('#topicView').on('click', '.cell .cell_blyr', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $cell = $(this).parents('.cell_bg')	
			,	cellId = $(this).attr('cell_id')
			,	cellUserId = $(this).attr('cell_user_id')
			;
//			console.log($cell);
			self.o.cellmapView(cellId, cellUserId);
			
			var _cellId = $cell.find('.timeline_box').attr('id')
			,	usemapData = self.usemapData[_cellId]
			;
			usemapData.read = true;
			self.reduceCircle(usemapData);
		});
		$('#topicView').on('click', '.cell .btn_follow', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $cell = $(this).parents('.timeline_box')
			,	cellId = $cell.attr('cell_id')
			,	cellUserId = $cell.attr('cell_user_id')
			,	$a = $(this).find('a')
			;
			if ($a.hasClass('un_following') || $a.hasClass('following')) {
				self.setMapFollow($(this), cellId, cellUserId, 'UNFOLLOW');
			} else {
				self.setMapFollow($(this), cellId, cellUserId, 'FOLLOW');
			}
		});
		$('#topicView').on('mouseenter', '.cell .btn_follow', function(e) {
			var $a = $(this).find('a');
			if ($a.hasClass('following')) {
				$a.removeClass('following');
				$a.addClass('un_following');
			}
		});
		$('#topicView').on('mouseleave', '.cell .btn_follow', function(e) {
			var $a = $(this).find('a');
			if ($a.hasClass('un_following')) {
				$a.removeClass('un_following');
				$a.addClass('following');
			}
		});
		

		cz.dispatcher.bind('writeCell',function(e, _param) {
//			console.log('writeCell_param111111111111');
//			console.log('writeCell_param', _param);
//			console.log('writeCell_param', self.filter.o.timelineFilter)
			if (self.filter.o.timelineFilter === 'FOLLOWING') {
				self.initialize();
			} else {
				var $filterElem = self.filter.getFilterElement(_param.group);
				$filterElem.trigger('click');
			}
			self.o.afterWrite();
		});
	}
});
cz.TopicView.Defaults = {
	cellLengthPerPage: 30 //로드갯수
};

})(jQuery, Cellz, window);