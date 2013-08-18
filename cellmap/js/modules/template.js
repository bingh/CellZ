/*
 * 
 * */
(function($, cz, w) {
	cz.Template = {};

	cz.Template.getHtml = function() {
		return this.html;
	}
	cz.Template.Cell = function(_cell, _originalCell, _from) {
		this.from = _from
		var	cell
		,	myCellId = _cell.cellId
		,	sameCellId
		,	originalCellId
		,	originalCellUserId
		,	firstAttachmentFileKind
		,	attachmentLength
		,	images = []
		,	files = []
		,	templates = {}
		,	elements = {}
		,	cellClassName = (_from === 'TEXT_TMPL') ? '' : 'timeline_box'
		,	$cell = $('<div class="'+cellClassName+'" />')
		,	$content = $('<div class="content" />')
		,	$attachments = $('<div class="attachments" />')
		,	$btn = $('<a href="#" class="btnFold clse">펼치기<span class="sp"></span></a>').appendTo($content);
		
		cz.Template.from = (_from !== null) ? _from : '';
		
		if (_originalCell !== undefined && _originalCell !== null) {
			originalCellId = _originalCell.cellId;
			originalCellUserId = _originalCell.cellUser.userId;
			cell = _originalCell;
			templates.recellTmpl = new cz.Template.Recell(_originalCell, _cell);
			elements.$recellTmpl = $(templates.recellTmpl.getHtml()).prependTo($cell); 
			$cell.addClass('timeline_share');
		} else {
			myCellId = _cell.cellId;
			cell = _cell;
		}
		// 조상셀이 있는경우
		if (_cell.ancestorCellId !== undefined && _cell.ancestorCellId > 0){
			 $cell.attr('ancestor_cell_id',_cell.ancestorCellId);
			 $cell.attr('ancestor_user_id',_cell.ancestorUserId);
		}
		
		sameCellId = cell.cellId;
		$cell.attr('id',myCellId);
		$cell.attr('same_cell_id',sameCellId);
		$cell.attr('original_cell_id',originalCellId);
		$cell.attr('original_cell_user_id',originalCellUserId);
		$cell.attr('cell_id',myCellId);
		$cell.attr('cell_user_id',_cell.cellUser.userId);
		this.sameCellId = cell.cellId;
		
		if (cell.contents !== undefined) {
			templates.textTmpl = new cz.Template.Text(cell.contents, cell.surveyAnonymity, cell.cellType, _cell.cellId, false, cell.firstLinkedCell, _from);
		}
		if (cell.attachmentsMeta !== undefined) {
			if (cell.attachmentsMeta.length > 0) {
				firstAttachmentFileKind = cz.Utils.getFileKind(cell.attachmentsMeta[0].fileKind);
				$(cell.attachmentsMeta).each(function() {
					if (this.fileKind !== undefined) {
						var kind = cz.Utils.getFileKind(this.fileKind);
						//console.log(kind);
						(kind === 'image') ? images.push(this) : files.push(this);
					}
				});
				this.attachmentLength = cell.attachmentsMeta.length;
				
			}
			//console.log(firstAttachmentFileKind);
			//console.log(files.length);
			//console.log(images.length);
			/*if (images.length > 0) {
				templates.imageTmpl = new cz.Template.Image(images, firstAttachmentFileKind);
				elements.$imageTmpl = $content.append($attachments.append($(templates.imageTmpl.getHtml()))).appendTo($cell);
			}
			if (files.length > 0) {
				templates.fileTmpl = new cz.Template.File(files, firstAttachmentFileKind);
				elements.$fileTmpl = $content.append($attachments.append($(templates.fileTmpl.getHtml()))).appendTo($cell);
			}*/
			if (firstAttachmentFileKind === 'image') {
				if (images.length > 0) {
					templates.imageTmpl = new cz.Template.Image(images, firstAttachmentFileKind, templates.textTmpl);
					elements.$imageTmpl = $content.append($attachments.append($(templates.imageTmpl.getHtml()))).appendTo($cell);
				}
				if (files.length > 0) {
					templates.fileTmpl = new cz.Template.File(files, firstAttachmentFileKind, templates.textTmpl);
					elements.$fileTmpl = $content.append($attachments.append($(templates.fileTmpl.getHtml()))).appendTo($cell);
				}
			} else {
				if (files.length > 0) {
					templates.fileTmpl = new cz.Template.File(files, firstAttachmentFileKind, templates.textTmpl);
					elements.$fileTmpl = $content.append($attachments.append($(templates.fileTmpl.getHtml()))).appendTo($cell);
				}
				if (images.length > 0) {
					templates.imageTmpl = new cz.Template.Image(images, firstAttachmentFileKind, templates.textTmpl);
					elements.$imageTmpl = $content.append($attachments.append($(templates.imageTmpl.getHtml()))).appendTo($cell);
				}
			}
		}
		if (cell.cellUser !== undefined) {
			templates.userTmpl = new cz.Template.User(cell.cellUser, cell.createdTimestamp, firstAttachmentFileKind, cell.userId, cell.group, cell.cellType);
			elements.$userTmpl = $(templates.userTmpl.getHtml()).appendTo($cell);
		}
		if (cell.contents !== undefined) {
			//templates.textTmpl = new cz.Template.Text(cell.contents, cell.surveyAnonymity, cell.cellType, _cell.cellId);	
			elements.$textTmpl = $content.prepend($(templates.textTmpl.getHtml())).appendTo($cell);
			
			elements.$firstInlineObj = $cell.children('.content').children('.txt_group').children('.inlineObj:eq(0)');
			if (elements.$firstInlineObj.length > 0) { //첫번째 인라인 오브젝트가 있으면 텍스트 그룹뒤에 복사해서 삽입
				elements.$firstInlineObjClone = elements.$firstInlineObj.clone();
				elements.$firstInlineObjClone
					.removeClass('inlineObj')
					.removeClass('inlineObjOriginal')
					.removeClass('hidden_template')
					.addClass('inlineObjClone')
					.show();
				$cell.children('.content').children('.txt_group').after(elements.$firstInlineObjClone);
			}
		}
		if (cell.cellType === 'ENQUETE' && cell.cellSurveyList !== undefined) {
			templates.surveyTmpl = new cz.Template.Survey(cell.cellSurveyList, cell.myPollId, cell.surveyAnonymity, _from);	
			elements.$surveyTmpl = $content.append($(templates.surveyTmpl.getHtml())).appendTo($cell);
			//elements.$surveyTmpl.find('input[checked=checked]').prop('checked',true);
		}
		templates.cellmapTmpl = new cz.Template.Cellmap(cell.connectN, _cell.cellId, _cell.cellUser.userId);		
		elements.$cellmapTmpl = $(templates.cellmapTmpl.getHtml()).appendTo($cell);
		
		templates.statusTmpl = new cz.Template.Status(cell.liked, cell.shared, cell.groupId, cell.mine, _cell.mine, cell.likeCount, cell.shareCount, myCellId, _cell.cellUser.userId);
		elements.$statusTmpl = $(templates.statusTmpl.getHtml()).appendTo($cell); 
		if (cell.ancestorCell !== undefined) {
			templates.cellmapViewTmpl = new cz.Template.CellmapView(cell.ancestorCell);
			elements.$cellmapViewTmpl = $(templates.cellmapViewTmpl.getHtml()).appendTo($cell); 
		}
		this.getElement = function() {
			return $cell;
		}
		this.getTemplates = function() {
			return templates;
		}
		this.getElements = function() {
			return elements;
		}
		this.getFoldBtn = function() {
			return $btn;
		}
		this.getAttachmentLength = function() {
			return this.attachmentLength;
		}
		this.getSameCellId = function() {
			return this.sameCellId;
		}
	}
	cz.Template.Recell = function(_originalCell, _cell) {
		var date = new Date(_cell.createdTimestamp),		
		rd = new RelativeDate(date),
		time = rd.getTime();

		this.html = '';
		this.html += '<span class="share">';
		this.html += '	<span class="tx_info">';
		this.html += '		<a class="name nameCard" href="#" userid="'+_cell.cellUser.userId+'" >'+_cell.cellUser.name+'</a>님께서 ';
		this.html += '		<a class="name nameCard" href="#" userid="'+_originalCell.cellUser.userId+'">'+_originalCell.cellUser.name+'</a>님의 cell을 share 하셨습니다.'
		this.html += '	</span>';
		this.html += '	<span class="time">'+time+'</span>';
//		if (_cell.cellUser.mainCompany !== undefined) {
//			this.html +=	'	<span class="company">['+_cell.cellUser.mainCompany.companyName+']</span>';
//		}
		if (_cell.group !== undefined && _cell.group.groupName !== undefined) {
			this.html += '	<span class="bar">|</span>';		
			this.html +=	'	<span class="group"><a href="'+_cell.cellUser.group.link+'">'+_cell.group.groupName+'</a></span>';
		}
		this.html += '</span>';
	}
	cz.Template.CellmapView = function(_jsonAncestorCell) {
		this.html = '';
		if (_jsonAncestorCell.deleted === true) {
			this.html += '<div class="timeline_info"><div class="timeline_info_inner">';
			this.html += '삭제된 셀입니다.';
			this.html += '</div></div><span class="btm_bg"></span>';
		} else {
			var date = new Date(_jsonAncestorCell.createdTimestamp),		
			rd = new RelativeDate(date),
			time = rd.getTime();

			try {
				jsonContents = $.parseJSON(_jsonAncestorCell.contents);
			} catch(e) {
				jsonContents = [{
					type: 'text',
					content: 'error: contens의 json형태가 올바르지 않습니다.'
				}];
			}
			
			this.html += '<div class="timeline_info"><div class="timeline_info_inner">';
			this.html += '	<strong>'+_jsonAncestorCell.cellUser.name+'</strong> ';
			this.html += '	<span class="time">'+time+'</span> ';

			if (jQuery.type(jsonContents) === 'array') {
				this.html += '<span>';
				for (var i = 0, length = jsonContents.length; i < length; i++) {
					this.html += jsonToHtml(jsonContents[i]);
				}
				this.html += '</span>';
			} else {
				this.html += jsonToHtml(jsonContents);
			}
			this.html += '</div></div><span class="btm_bg"></span>';
		}
	}
	cz.Template.User = function(jsonUser, jsonTime, firstAttachmentFileKind, _userId, _group, _cellType) {
		var date = new Date(jsonTime)		
		,	rd = new RelativeDate(date)
		,	time = rd.getTime()
		,	userInfo
		,	groupId
		,	groupName
		,	profileImage
		;
		//loginUserid
		//userId
		//name
		//deptName
		//profileImage
		//console.log(firstAttachmentFileKind);
		this.createdTimestamp = jsonTime;
		if (_cellType === 'ENQUETE') {
			typeClass = 'pr_poll';
		} else {
			if (firstAttachmentFileKind === undefined) typeClass = 'pr_sns';
			else if (firstAttachmentFileKind === 'image') typeClass = 'pr_photo';
			else if (firstAttachmentFileKind !== 'image') typeClass = 'pr_file';
		}
		/*else if (firstAttachmentFileKind === 'doc') typeClass = 'pr pr_file sp';
		else if (firstAttachmentFileKind === 'co-doc') typeClass = 'pr pr_co sp';
		else if (firstAttachmentFileKind === 'xls') typeClass = 'pr pr_xlsx sp';
		else if (firstAttachmentFileKind === 'cell') typeClass = 'pr pr_cell sp';*/
		groupId = (_group !== undefined && _group.groupId !== undefined) ? _group.groupId : '';
		groupName = (_group !== undefined && _group.groupName !== undefined) ? _group.groupName : '';
		profileImage = (jsonUser.profileImage !== undefined) ? API_VERSION+'file/thumbnail?fname='+jsonUser.profileImage+'&w=31&h=30' : '/resources/images/img_noimg_timeline.png';
		profileImage2 = (profileImage === '/resources/images/img_noimg_timeline.png') ? '' : profileImage;
		
		
		this.html= '';
		this.html +=	'<div class="timeline_top">';
		this.html +=	'<div class="profile">';
		this.html +=	'	<a href="#" class="nameCard" userid="'+_userId+'"><div class="photo"><span class="mask sp"></span>';
		this.html +=	'	<img src="'+profileImage+'" alt="">';
		this.html +=	'</div>';
		this.html +=	'	<strong class="name">'+jsonUser.name+'</strong></a>';
		this.html +=	'	<span class="pr '+typeClass+' sp">'+firstAttachmentFileKind+'</span>';
		this.html +=	'	<div class="put_bg"><span class="put_maskl sp"></span><span class="put_maskr sp"></span></div>';
		this.html +=	'	<div class="put"><a href="#" class="btnAddPeopleToCellbox pr_put sp" user_id="'+_userId+'" user_name="'+jsonUser.name+'" group_name="'+groupName+'" profile_image="'+profileImage2+'">담기</a></div>';
		this.html +=	'</div>';
		this.html +=	'<div class="info">';
		this.html +=	'	<span class="time">'+time+'</span>';
//		if (jsonUser.mainCompany !== undefined) {
//			this.html +=	'	<span class="company">['+jsonUser.mainCompany.companyName+']</span>';
//		}	
		if (groupId !== '' || groupName !== '') {
			this.html +=	'	<span class="bar">|</span>';
			this.html +=	'	<span class="group"><a href="'+Cellz.API_URL.GROUP.TIMELINE+groupId+'"><span class="sp ico_mem">&nbsp;</span>'+groupName+'</a></span>';
		}
		this.html +=	'</div>';
		this.html +=	'</div>';
	}
	cz.Template.Cellmap = function(_connectN, _cellId, _cellUserId) {
		var	connectN = parseInt(_connectN, 10)
		,	step = getConnectNStep(connectN);
		
		this.html= '';
		this.html +=	'<div class="circle" style="width: 210px; height: 132px; background: url(../../../resources/images/'+step+'_stop.gif) no-repeat 0 0;" step="'+step+'" >';
		this.html +=	'	<img src="../../../resources/images/'+step+'_stop.gif" step="'+step+'" alt="">';
		this.html +=	'</div>';
		this.html +=	'<div class="cellmap cellUp">';
		this.html +=	'<a href="#" class="add sp">more</a>';
		this.html +=	'	<a href="#" class="addover sp">Add</a>';
		this.html +=	'	<div class="cellmap_box" cell_id="'+_cellId+'" cell_user_id="'+_cellUserId+'">Cellmap <em>'+connectN+'</em><span class="sp"></span></div>';
		this.html +=	'			<p class="cellmap_box_end"></p>';
		this.html +=	'</div>';
	}
	cz.Template.Text = function(_strArray, _anonymity, _cellType, _cellId, _cellBoxParam, _firstLinkedCell, _from) {
		var	jsonArray
		,	ExistFirstInlineObj = false;
		try {
			jsonArray = $.parseJSON(_strArray);
		} catch(e) {
			jsonArray = [{
				type: 'text',
				content: 'error: contens의 json형태가 올바르지 않습니다.'
			}];
		}
		this.textLength = 0;
		this.nameTagLength = 0;
		this.urlLength = 0;
		this.mapLength = 0;
		this.urlClipingLength = 0;
		this.firstTextType = null;
		this.firstInlineObjType = null;
		this.inlineObjLength = 0;
		this.innerCelllength = 0;
		this.hasHiddenTextAfterInlineObj = false;
		this.$cloneEl;
		this.$totalTextGroup;
		this.$summaryTextGroup;
		this.cell = false;
		
		this.html =	'<div class="txt_group">';
		 if (_cellType === 'ENQUETE' && _anonymity !== undefined) {
			var anonymityText = (_anonymity === true) ? '익명' : '실명';
			var anonymityClass = (_anonymity === true) ? 'sp_namea' : 'sp_namer';
			this.html +=	'<span class="'+anonymityClass+' sp">'+anonymityText+'</span> ';
			this.html +=	'<span>'+jsonArray.content+'</span>';
		}
		for (var i = 0, ii = jsonArray.length; i < ii; i++) {
			var textClass = (ExistFirstInlineObj) ? 'hiddenText' : '';
			if (jsonArray[i].type === 'text' && jsonArray[i].content !== undefined) {
				var txtContent = replaceNewLineToBr(jsonArray[i].content);
				this.html +=	'<span class="'+textClass+'">'+txtContent+'</span>';
				//console.log(txtContent)
				if (ExistFirstInlineObj && (isNotEmpty(txtContent))) {
					this.hasHiddenTextAfterInlineObj = true;
				}
				if (isNotEmpty(txtContent)) {
					if (this.firstTextType === null) this.firstTextType = jsonArray[i].type;
				}
				
				//this.textLength += 1;
			} else if (jsonArray[i].type === 'link' && jsonArray[i].content !== undefined) {
					if (_cellBoxParam !== undefined && _cellBoxParam.type !== 'CELLBOX') {
						this.html +=	'<a href="'+jsonArray[i].content+'" target="_blank" class="'+textClass+' link_text">'+jsonArray[i].content+'</a>';
						if (ExistFirstInlineObj) this.hasHiddenTextAfterInlineObj = true;
					}
			} else if (jsonArray[i].type === 'nameTag' && jsonArray[i].content !== undefined) {
					this.html +=	'<a href="#" class="name nameCard '+textClass+'" userid="'+jsonArray[i].content.id+'">'+jsonArray[i].content.name+'</a>';
					if (ExistFirstInlineObj) this.hasHiddenTextAfterInlineObj = true;
					if (this.firstTextType === null) this.firstTextType = jsonArray[i].type;
				//this.nameTagLength += 1;
			} else if (jsonArray[i].type === 'url') {
				//this.html +=	'<a class="link '+textClass+'" href="'+jsonArray[i].content.link+' "target="_blank">'+jsonArray[i].content.link+'</a>';
				//console.log(jsonArray[i].content);
				if (jsonArray[i].content !== undefined && jsonArray[i].content !== '') {
					this.html +=	'<div class="inlineObj preview_group inlineObjOriginal hidden_template">';
					if (jsonArray[i].content.imageUrl != '') {
						this.html +=	'	<div class="pv_img">';
						if (jsonArray[i].content.movieUrl !== "") {
							this.html +=	'		<a href="#" class="playMovie" url="'+jsonArray[i].content.movieUrl+'">';
						}
						this.html +=	'		<img width="90" height="70" alt="" src="'+jsonArray[i].content.imageUrl+'">';
						if (jsonArray[i].content.movieUrl !== "") {
							this.html +=	'		</a>';
						}					
						this.html +=	'	</div>';
					}
					this.html +=	'	<div class="pv_cnt">';
					this.html +=	'		<div class="pv_cnt_inner"><strong class="pv_tlt"><a target="_blank" href="'+jsonArray[i].content.link+'">'+jsonArray[i].content.title+'</a></strong>';
					this.html +=	'		<em class="pv_url"><a target="_blank" href="'+jsonArray[i].content.link+'">'+jsonArray[i].content.link+'</a></em></div>';
					this.html +=	'		<p class="pv_txt">'+jsonArray[i].content.contents+'</p>';
					this.html +=	'	</div>';
					this.html +=	'</div>';
					this.inlineObjLength += 1;
					this.urlClipingLength += 1;
					ExistFirstInlineObj = true;
					if (this.firstInlineObjType === null) this.firstInlineObjType = jsonArray[i].type;
					if (this.firstTextType === null) this.firstTextType = jsonArray[i].type;
					
				}
			} else if (jsonArray[i].type === 'map' && jsonArray[i].content !== undefined) {
				var address = jsonArray[i].content.address
				,	qAddress = address.replace(/\s/gi,'+')
				;
//				this.html +=	'<a class="link '+textClass+'" href="#">'+jsonArray[i].content.link+'</a>';
				this.html +=	'<div class="inlineObj map_group inlineObjOriginal hidden_template"><div class="map_info_line3">';
				this.html +=	'	<img width="480" height="300" alt="" src="https://maps.googleapis.com/maps/api/staticmap?center='+jsonArray[i].content.Lat+','+jsonArray[i].content.Lng+'&amp;zoom=16&amp;size=480x300&amp;language=ko&amp;markers=size:mid|color:red|'+jsonArray[i].content.Lat+','+jsonArray[i].content.Lng+'&amp;sensor=false&amp;maptype=roadmap"  class="gmap_results">';
				this.html +=	'	<p class="map_addr"><strong class="title">'+jsonArray[i].content.search+'</strong>'+sc2Html(jsonArray[i].content.address)+'</p>';
				this.html +=	'	<a href="https://maps.google.co.kr/maps?f=q&source=s_q&hl=ko&q='+jsonArray[i].content.search+'&aq=&sll='+jsonArray[i].content.Lat+','+jsonArray[i].content.Lng+'" class="btn_map sp" target="_blank">지도크게보기</a>';
				this.html +=	'	<span class="map_bg"></span>';
				this.html +=	'</div></div>';
				this.inlineObjLength += 1;
				ExistFirstInlineObj = true;
				if (this.firstInlineObjType === null) this.firstInlineObjType = jsonArray[i].type;
				if (this.firstTextType === null) this.firstTextType = jsonArray[i].type;
			} else if (jsonArray[i].type === 'cellmap' && jsonArray[i].content !== undefined) {
				this.html +=	'<a href="#" class="name textCellmap '+textClass+'" cell_id="'+jsonArray[i].cellId+'" cell_user_id="'+jsonArray[i].cellUserId+'"><img width="12" height="12" alt="" src="../../../resources/images/ico_cellmap.png"> Cell map</a>';
//				console.log(_firstLinkedCell)
				var innerCellTmpl = new cz.Template.Cell(_firstLinkedCell, null, 'TEXT_TMPL');
				var $innerCellTmpl = cz.Template.InnerCell(innerCellTmpl.getElement());
				this.html +=	'<div class="cellMap_group inlineObjOriginal hidden_template other_group"><div class="other_view">';
				this.html +=	$innerCellTmpl.get(0).outerHTML;
				this.html +=	'</div></div>';
//				this.cell = true;
				this.inlineObjLength += 1;
				this.innerCelllength += 1;
				ExistFirstInlineObj = true;
				if (this.firstInlineObjType === null) this.firstInlineObjType = jsonArray[i].type;
				if (this.firstTextType === null) this.firstTextType = jsonArray[i].type;
			}
		}
		this.html +=	'</div>';
		
		
		if (_from !== 'CELLMAP' && _from !== 'CELL_LAYER' ) {
			if (_cellBoxParam !== undefined && _cellBoxParam.type === 'CELLBOX') {
				this.$cloneEl = $('<div class="cellbox_clone" section_name="'+ _cellBoxParam.sectionName+'" box_item_id="'+ _cellBoxParam.boxItemId+'"/>').appendTo('body');
				this.$totalTextGroup = $('<div class="totalText" />');
				this.$summaryTextGroup = $('<div class="summaryText" />');
				
				this.$totalTextGroup
				.html(this.html)
				.appendTo(this.$cloneEl);
				var $clone = this.$totalTextGroup.find('.txt_group').clone();
				$clone.find('.hiddenText').remove();
				$clone.find('.hidden_template').remove();
				this.$summaryTextGroup
				.html($clone)
				.appendTo(this.$cloneEl);
			} else {
				var textGroupClassName = (_from === 'TEXT_TMPL') ? 'text_group_inner_cell_clone' : 'text_group_clone';
				var sw = ($.util_urlParser.getMenuFromUrl() === 'user' || $.util_urlParser.getMenuFromUrl() === 'group') ? 448 : 648;
				this.$cloneEl = $('<div class="'+textGroupClassName+'" parent_cell_id="'+ _cellId+'"/>').appendTo('body').css('width', sw);
				this.$totalTextGroup = $('<div class="totalText" />');
				this.$summaryTextGroup = $('<div class="summaryText" />');
				
				this.$totalTextGroup
				.html(this.html)
				.find('.hidden_template').remove().end()
				.appendTo(this.$cloneEl);
				var $clone = this.$totalTextGroup.find('.txt_group').clone();
				$clone.find('.hiddenText').remove();
				this.$summaryTextGroup
				.html($clone)
				.appendTo(this.$cloneEl);
			}
		}
		
		this.isOverSixLines = function() {
			return (this.getSummaryTextGroupHeight() > 108) ? true : false;
		}
		this.getInlineObjLength = function() {
			//return this[type+'Length'];
			return this.inlineObjLength;
		}
		this.getSummaryTextGroupHeight = function() {
			return this.$summaryTextGroup.height();
		}
		this.getTotalTextGroupHeight = function() {
			return this.$totalTextGroup.height();
		}
		this.hasCell = function() {
			return (this.cell) ? true : false;
		}
		this.getClone = function() {
			return this.$cloneEl;
		}
		this.getHiddenTextAfterInlineObj = function() {
			return this.hasHiddenTextAfterInlineObj;
		}
		this.getUrlClipingLength = function() {
			return this.urlClipingLength;
		}
		this.getInnerCellLength = function() {
			return this.innerCelllength;
		}
		this.getFirstTextType = function() {
			return this.firstTextType;
		}
		this.getFirstInlineObjType = function() {
			return this.firstInlineObjType;
		}
		function isNotEmpty(_text) {
			return (_text.trim() !== '' && _text !== '<br />' && _text !== '&nbsp;') ? true : false;
		}
		
	}
	cz.Template.Image = function(jsonArray, firstAttachmentFileKind, textTmpl) {
		var className = (firstAttachmentFileKind === 'image' && textTmpl.inlineObjLength <= 0) ? '' : 'hidden_template'
		//var className = (firstAttachmentFileKind === 'image') ? '' : 'hidden_template'
		,	size = ''
		,	w = 0
		,	h = 0
		,	displayLength
		,	param = ''
		;
		
		this.length = 0;
		if (jsonArray.length <= 1) {
			this.html =	'<ul class="img_group imageViewer '+className+'">';
			w = 400;
			h = 240;
			param = '&h='+h+'&w='+w;
			//size = 'width="'+w+'" height="'+h+'"';
		} else {
			this.html =	'<ul class="img_group imageViewer img_group_v2 '+className+'">';
			if (($.util_urlParser.getMenuFromUrl() === 'user' || $.util_urlParser.getMenuFromUrl() === 'group')) {
				w = 180;
				displayLength = 2;
			} else {
				w = 160;
				displayLength = 3;
			}
			w = ($.util_urlParser.getMenuFromUrl() === 'user' || $.util_urlParser.getMenuFromUrl() === 'group') ? 180 : 160;
			h = 160;
			param = '&h='+h+'&w='+w+'&crop=true';
			//size = 'width="'+w+'" height="'+h+'"';
		}
		for (var i = 0, ii = jsonArray.length; i < ii; i++) {
			var date = new Date(jsonArray[i].updatedTime)	
			,	time = [date.getFullYear(),
			               (date.getMonth()+1).padLeft(),
			               date.getDate().padLeft()].join('/')+
			              ' '+
			              getAmpm(date)
			,	fileSize = Math.round(parseInt(jsonArray[i].fileSize)/1024)
			,	authClassName = ''
			,	kind = cz.Utils.getFileKind(jsonArray[i].fileKind);
			
			if ((jsonArray[i].auth !== undefined && jsonArray[i].auth === 'NONE') || jsonArray[i].deleted === true) {					
				authClassName = 'tx_box';
			} else {
				authClassName = '';
			}
			
			var innerClassName = (i > displayLength) ? 'hidden_template' : '';
			this.html +=	'	<li class="'+innerClassName+' '+authClassName+'" kind="'+kind+'" auth="'+authClassName+'">';
			if (jsonArray[i].deleted !== undefined && jsonArray[i].deleted === true) {
				this.html +=	'	<div>원본파일이<br />삭제 되었습니다.</div> ';
			} else if (jsonArray[i].auth !== undefined && jsonArray[i].auth === 'NONE') {
				this.html +=	'	<div>확인 권한이 <br />설정되지 않았습니다.</div> ';
			} else {
				this.html +=	'		<div class="imgInnerSection">';
				this.html +=	'		<h2 class="imgTitle">';
				this.html +=	'			<span class="fileTitle">[Ver. '+leadingZeros(jsonArray[i].version, 2)+'] '+jsonArray[i].fileTitle+'</span>';
				this.html +=	'			<span class="fileInfo">file : '+jsonArray[i].fileOrigin+' ('+fileSize+'kb)</span>';
				this.html +=	'		</h2>';
				this.html +=	'		<span class="btnImageWrap"><span class="wrapInner"><a href="#" class="btnImage">';
				this.html +=	'			<img src="'+API_VERSION+'file/thumbnail?fname='+jsonArray[i].fileName+param+'" alt="" file_name="'+jsonArray[i].fileName+'">';
				this.html +=	'		</a></span>';
				if (jsonArray[i].auth !== undefined && jsonArray[i].auth !== 'NONE') {
					this.html +=	'<div class="img_ln">';
					this.html +=	'	<div class="btn_area">';
					this.html +=	'		<a class="down" href="'+cz.API_URL.FILE.DOWNLOAD+jsonArray[i].fileName+'" onclick="window.location.href=this.href">';
					this.html +=	'			<span class="layer_bot">다운로드<span class="arr"></span></span>';
					this.html +=	'		</a>';
					this.html +=	'		<a class="info_view" href="'+Cellz.API_URL.FILE.INFO + '?fname=' + jsonArray[i].fileName+'" file_name='+jsonArray[i].fileName+'" onclick="window.location.href=this.href">';
					this.html +=	'			<span class="layer_bot">fileinfo<span class="arr"></span></span>';
					this.html +=	'		</a>';
//					this.html +=	'		<a class="put btnAddFileToCellbox" href="#" owner_id="'+jsonArray[i].userId+'" file_name="'+jsonArray[i].fileName+'" file_origin="'+jsonArray[i].fileOrigin+'" file_kind="'+jsonArray[i].fileKind+'">';
//					this.html +=	'		<span class="layer_bot">담기<span class="arr"></span></span>';
//					this.html +=	'		</a>';
					this.html +=	'	</div>';
					this.html +=	'	<span class="bg"></span>';
					this.html +=	'</div></span>';
				}
			}
			if (jsonArray[i].fileDesc !== undefined) {
				this.html +=	'<p class="imgDesc">'+jsonArray[i].fileDesc+'</p>';
			}
			this.html +=	'</div></li>';
			this.length += 1;
			
		}
		this.html +=	'</ul>';
		this.getLength = function() {
			return this.length;
		}
	}
	cz.Template.File = function(jsonArray, firstAttachmentFileKind, textTmpl) {
		var className = ''
		,	authClassName = ''
		,	isDoc = false
		,	docTypes = ['doc','html','xls','hwp'];
		
		this.length = 0;
		
		if (jsonArray.length > 0) {
			this.html= '';
			for (var i = 0, ii = jsonArray.length; i < ii; i++) {
				className = (firstAttachmentFileKind !== 'image' && i === 0 && textTmpl.inlineObjLength <= 0) ? '' : 'hidden_template';
				//className = (firstAttachmentFileKind !== 'image' && i === 0) ? '' : 'hidden_template';
				if ((jsonArray[i].auth !== undefined && jsonArray[i].auth === 'NONE') || jsonArray[i].deleted === true) {					
					authClassName = 'tx_info';
				} else {
					authClassName = '';
				}
				for (var j = 0, jj = docTypes.length; j < jj; j++) {
					var kind = cz.Utils.getFileKind(jsonArray[i].fileKind);
					isDoc = (docTypes[i] === kind) ? true : false;
				}
				var date = new Date(jsonArray[i].updatedTime)		
				,	rd = new RelativeDate(date)
				,	fileSize = Math.round(parseInt(jsonArray[i].fileSize)/1024)
				,	time = [date.getFullYear(),
			               (date.getMonth()+1).padLeft(),
			               date.getDate().padLeft()].join('/')+
			              ' '+
			              getAmpm(date)
				
				this.html +=	'<div class="word_group '+className+' '+authClassName+'">';
				if (jsonArray[i].deleted !== undefined && jsonArray[i].deleted === true) {
					this.html +=	'	<div>원본파일이<br />삭제 되었습니다.</div> ';
				} else if (jsonArray[i].auth !== undefined && jsonArray[i].auth === 'NONE') {
					this.html +=	'	<div>확인 권한이 <br />설정되지 않았습니다.</div> ';
				} else {
					this.html +=	'	<a href="'+Cellz.API_URL.FILE.INFO + '?fname=' + jsonArray[i].fileName+'"><span class="icon sp_'+kind+' sp">DOC</span></a>';
					this.html +=	'<div class="word_data">';
					this.html +=	'	<span class="tlt"><a href="'+Cellz.API_URL.FILE.INFO + '?fname=' + jsonArray[i].fileName+'">[Ver.'+leadingZeros(jsonArray[i].version, 2)+']'+jsonArray[i].fileTitle+'</a></span>';
					this.html +=	'	<p>';
					this.html +=	'		<span class="fileOrigin">File : '+jsonArray[i].fileOrigin+' ('+fileSize+'KB)</span><br />';
					this.html +=	'		<span class="date">작성일 : '+time+' (by '+jsonArray[i].ownerName+')</span>';
					if (jsonArray[i].fileDesc !== undefined) {
						this.html +=	jsonArray[i].fileDesc;
					}
					this.html +=	'	</p>';
					this.html +=	'</div>';
					if (jsonArray[i].auth !== undefined && jsonArray[i].auth !== 'NONE') {
						this.html +=	'<div class="img_ln">';
						this.html +=	'	<div class="btn_area">';
						if (isDoc) {
							this.html +=	'		<a class="preview" href="#">';
							this.html +=	'			<span class="layer_bot">미리보기<span class="arr"></span></span>';
							this.html +=	'		</a>';
						}
						this.html +=	'		<a class="down" href="'+cz.API_URL.FILE.DOWNLOAD+jsonArray[i].fileName+'">';
						this.html +=	'			<span class="layer_bot">다운로드<span class="arr"></span></span>';
						this.html +=	'		</a>';
						this.html +=	'		<a class="info_view" href="'+Cellz.API_URL.FILE.INFO + '?fname=' + jsonArray[i].fileName+'">';
						this.html +=	'			<span class="layer_bot">fileinfo<span class="arr"></span></span>';
						this.html +=	'		</a>';
//						this.html +=	'		<a class="put btnAddFileToCellbox" href="#" owner_id="'+jsonArray[i].userId+'" file_name="'+jsonArray[i].fileName+'" file_origin="'+jsonArray[i].fileOrigin+'" file_kind="'+jsonArray[i].fileKind+'">';
//						this.html +=	'			<span class="layer_bot">담기<span class="arr"></span></span>';
//						this.html +=	'		</a>';
						this.html +=	'	</div>';
						this.html +=	'	<span class="bg"></span>';
						this.html +=	'</div>';
					}
				}
				this.html +=	'</div>';
				this.length += 1;
			}
		}
		this.getLength = function() {
			return this.length;
		}
	}
	cz.Template.Status = function(_liked, _shared, _groupId, _his, _mine, _likeCount, _shareCount, _cellId, _cellUserId) {
		this.html = '';
		this.html += '<div class="timeline_bot">';
		this.html += '	<ul>';
		this.html += '		<li class="common_like">';
		this.html += '			<dl>';
		this.html += '			<dt>';
		if (_liked === true) {
			this.html += '				Like';
		} else {
			this.html += '				<a href="#" class="btnLike">Like</a>';
		}
		this.html += '				<span class="layer_bot">Like this cell<span class="arr"></span></span>';
		this.html += '			</dt>';
		this.html += '			<dd class="first"><span class="sp"></span><span class="num countLayer" cell_id="'+_cellId+'" user_id="'+_cellUserId+'" type="LIKE" >'+_likeCount+'</span></dd>';	
		this.html += '			</dl>';
		this.html += '		</li>';
		if (_groupId === undefined || _groupId === 0) { //퍼블릭셀인경우
			this.html += '		<li class="common_share">';
			this.html += '			<dl>';
			this.html += '			<dt>';
			if (_his === true) {
				this.html += '			Share';
			}
			else {
				if (_shared === true) {
					this.html += '			Shared';
				} else {
					this.html += '			<a href="#" class="btnShare">Share</a>';
				}
			}
			this.html += '			<span class="layer_bot">Share this your people<span class="arr"></span></span>';
			this.html += '			</dt>';
			this.html += '			<dd><span class="sp"></span><span class="num countLayer"  cell_id="'+_cellId+'" user_id="'+_cellUserId+'" type="SHARE">'+_shareCount+'</span></dd>';
			this.html += '			</dl>';
			this.html += '		</li>';			
		}
		else if (_groupId !== undefined && _groupId > 0) {
			this.html += '		<li class="common_share">';
			this.html += '			<dl>';
			this.html += '			<dt>';
			if (_his === true) {
				/*if (json.publish.already === true) {
					this.html += '			Published';
				} else {
					this.html += '			<a href="#" class="btnPublish">Publish</a>';
				}*/
			}
			this.html += '			<span class="layer_bot">Share this your people<span class="arr"></span></span>';
			this.html += '			</dt>';
			this.html += '			</dl>';
			this.html += '		</li>';
		}
		this.html += '	</ul>';
		this.html += '	<div class="btn">';
		//this.html += '		<a class="pr_putb sp btnAddCellToCellbox"  cell_id="'+_cellId+'" cell_user_id="'+_cellUserId+'" href="#">cell 담기</a>';
		if (_mine === true) {
			//this.html += '		<span class="bar">|</span>';
			this.html += '		<a class="pr_del sp btnRemoveCell" href="#">cell 삭제</a>';
		}
		this.html += '	</div>';
		this.html += '</div>';
	}
	cz.Template.Survey = function(_jsonSurvey, _myPollId, _anonymity, _from) {
		//var re = new RegExp(/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\wㄱ-ㅎㅏ-ㅣ가-힣\;\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/g);
		this.surveyTotalCount = 0;
		this.html = '<div class="poll_group"><ul>';
		for (var i = 0, ii = _jsonSurvey.length; i < ii; i++) {
			var surveyContents = _jsonSurvey[i].surveyContents;
			var m = /([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(surveyContents);
			if (m) {
				var _tmp = surveyContents.match(/([a-z0-9-:\/]+\.)+[a-z0-9]{2,4}.*$/)[0].split(' ');
				var url = _tmp[0];
				var link = (url.indexOf('http') !== -1) ? url : 'http://'+url;
				surveyContents = surveyContents.replace(url, '<a href="'+link+'" target="_blank">'+url+'</a>');
			}
//			console.log('_myPollId', _myPollId)
//			console.log('_jsonSurvey[i].itemId', _jsonSurvey[i].itemId)
			var checked = (_myPollId === _jsonSurvey[i].itemId) ? 'checked="checked"' : '';
			this.html +=	'<li class="poll_lst_'+i+'" idx="'+i+'">';
			this.html +=	'		<div class="graph">';
			this.html +=	'			<input type="radio" id="poll_lst_'+_jsonSurvey[i].cellId+'_'+_jsonSurvey[i].itemId+'" item_id="'+_jsonSurvey[i].itemId+'" name="'+_from+'_poll_lst_'+_jsonSurvey[i].cellId+'" '+checked+'>';
			this.html +=	'			<label for="poll_lst_'+_jsonSurvey[i].cellId+'_'+_jsonSurvey[i].itemId+'">'+surveyContents+'</label>';
			this.html +=	'			<span style="width:'+_jsonSurvey[i].percentage+'%" class="graph_bg"></span>';
			this.html +=	'		</div>';
			this.html +=	'		<p class="num">';
			if (_anonymity === false && _jsonSurvey[i].count > 0) {
				this.html +=	'	<em class="countLayer" user_id="'+_jsonSurvey[i].userId+'" cell_id="'+_jsonSurvey[i].cellId+'" item_id="'+_jsonSurvey[i].itemId+'" type="SURVEY">'+_jsonSurvey[i].count+'</em>';
			} else {
				this.html +=	'	<em>'+_jsonSurvey[i].count+'</em>';
			}
			this.html +=	'	명  참여</p></li>';
			this.surveyTotalCount += parseInt(_jsonSurvey[i].count);
		}
		this.html += '</ul></div>';
		this.getSurveyTotalCount = function() {
			return this.surveyTotalCount;
		}
		this.getPollId = function() {
			return this.pollId;
		}
		this.setPollId = function(_id) {
			this.pollId = _id;
		}
	}
	
	

	cz.Template.InnerCell = function(_$html) {
		var $name = _$html.find('.profile .nameCard');
		$name.find('.photo').remove();
		_$html.find('.info').prepend($name);
		_$html.find('.profile').remove();
		_$html.find('.circle').remove();
		_$html.find('.cellmap .sp').remove();
		_$html.find('.timeline_bot').remove();
		_$html.find('.content .clse').remove();
		return _$html;
	}
	
	
	
	cz.Template.Recell.prototype = cz.Template;
	cz.Template.CellmapView.prototype = cz.Template;
	cz.Template.User.prototype = cz.Template;
	cz.Template.Cellmap.prototype = cz.Template;
	cz.Template.Text.prototype = cz.Template;
	cz.Template.Image.prototype = cz.Template;
	cz.Template.File.prototype = cz.Template;
	cz.Template.Status.prototype = cz.Template;
	cz.Template.Survey.prototype = cz.Template;
	
	cz.Template.Simple = {
			makeHtml : function(data, cellType){
				var	_contentsArray;
				
				this.connectN = data.connectN;	// 전역에 저장 
				var isUrl = false;
				if (cellType == '_TOP_') {
					this.followed = data.followed?true:false;
					var _c = '';
					if (data.deleted) {
						var _contents = "삭제되어 내용을 확인하실수 없습니다.";
						_c = '<p class="txt">'+ _contents +'</p>';
					} else {
						if (!data || !data.contents) {
							return _c;
						}
						_contentsArray = $.parseJSON(data.contents);
						
						if (data.cellType == 'ENQUETE') {
							_c = this.makeHtml(data, 'ENQUETE');
						} else {
							_c = this.makeHtml(data, '_TOP_OTHER');
						}
					}

					_c += '<dl>'
						+ 	'<dt>cellmap</dt>'
						+ 	'<dd><span class="sp"></span><span id="span_connectN">'+ data.connectN +'</span></dd>'
						+ 	'<dt>Followers</dt>'
						+	'<dd><span class="sp"></span>'
						+	'<span id="followers_num" class="num countLayer"'
												 	+' cell_id="'+ data.cellId 
												 	+'" user_id="'+ data.userId
												 	+'" type="CELLFOLLOW" style="cursor:pointer;">'+ data.followers +'</span>'
												 	+'</dd>'
						+ 	'</dl>';
					
					
					return _c;
				}
				else if (cellType == 'ENQUETE') {
					var html = '';
					if (!data || !data.contents) {
						return html;
					}
					_contentsArray = $.parseJSON(data.contents);
					//console.log("+++++ data.surveyAnonymity : ", data.surveyAnonymity);
					var name_sp = '';
						name_sp += (!data.surveyAnonymity)?'<strong class="name">'+ data.cellUser.name +'</strong>':'';
						name_sp += (!data.surveyAnonymity)?'<span class="name_r sp">실명</span>':'<span class="name_a sp">익명</span>';
					var cutContent = this.cutStr(_contentsArray.content, 90);
					_contentsArray.content = cutContent;
					html = '<p class="txt">'+ name_sp +' '+ this.makeContents(_contentsArray);
					if (_contentsArray.content.length > 90) {
						var dot = "...";
						html += '<span class="ellip">'+ dot +'</span>';
					}
					html += '</p>'; 
					
					return html;
				} 
				else {	// 일반 Text
					var html = '';
					if (!data || !data.contents) {
						return html;
					}
					//console.log("+++++ data.contents : ", data.contents);
					_contentsArray = $.parseJSON(data.contents);

					// 그룹정보 있으면 출력
					if (data.group != undefined && data.group != null) {
						if (data.group.groupName != undefined) {
							if (cellType == '_TOP_OTHER') {
								html += '<span class="group">';
								html += '<a href="#">';
								html += '<span class="sp ico_mem">&nbsp;</span>';
								html += data.group.groupName; 
								html += '</a>';
								html +=	'<span class="bor">&nbsp;</span>';
								html += '</span>';
							}
						}
					}
					html +='<strong class="name" style="display:block">'+ data.cellUser.name +'</strong>';
					// class="ico_openline">Openline</span></span>';
					var _contents = '';
					var needMoreDefault = 90;
					var _needMore = 90;
					if(this.whatIsContentType(_contentsArray) != ContentType.TEXT
						|| this.isInMediaType(data.cellMediaType) ){
						//console.log("+++++ resized more..");
						needMoreDefault = 45;
						_needMore = 45;
					}
					var isNameTag = false;
					var _noMore = false;
					//console.log("+++++ _contentsArray", _contentsArray);
					for ( var i in _contentsArray) {
						var _c = _contentsArray[i];
						if (_c.type=='text') {
							if (_noMore) {
								continue;
							}
							var _content = _c.content;
							_content = this.stripTags(_content);
		
							if (_needMore < _content.length) {
								_content = this.cutStr(_content, _needMore);
							}
							_needMore -= _content.length;
							
							if (!isUrl) {
								html += '<p class="txt" style="display:inline;word-wrap: break-word;">'+ _content;
								if (_contents.length > _needMore ) {
									var dot = "...";
									html += '<span class="ellip">'+ dot +'</span>';
									
									_noMore = true;
								}
								html += '</p>';
								_contents += _content;
							}
						} else if (_c.type=='url') {
							html += this.makeContents(_c);
							isUrl = true;
						} else if(_c.type=='nameTag'){
							if (_noMore) {
								continue;
							}
							if (_needMore < _c.content.name.length) {
								var _name = this.cutStr(_c.content.name, _needMore);
								_c.content.name = _name;
							}
							_needMore -= _c.content.name.length;
							
							html += this.makeContents(_c);
							isNameTag = true;
						}
						
						if (cellType == '_TOP_OTHER') {	// 첫번째 데이터만 가져온다.
							if (isUrl) {
								if (_contents.length > _needMore ) {
									var dot = "...";
								}
							}
						}
					}
					if (isUrl) {
						return html;
					}
					// 이미지 인지 파일인지는 일단 첨부파일을 먼저 뒤진다.
					if (data.attachmentsMeta.length >0) {
						var meta = data.attachmentsMeta[0];
						if (!meta.deleted) {
							var fileKind = Cellz.Utils.getFileKind(meta.fileKind);
							if (fileKind == 'image') { // 이미지
								var w = 144;
								var h = 81;
								html +='<div class="box" style="text-align:center;">'
									 + '<img src="'+ API_VERSION +'file/thumbnail?fname='+ meta.fileName+'&h='+ h +'&w='+ w +'" alt="">'
									 + '</div>';
							}
							else { // 파일
								html +='<div class="box">'
									 + '<p class="filename">'
									 + '<span class="file_type '+ fileKind +'">'+ fileKind.toUpperCase() +'</span>'
									 + '<span class="tx _ellipsis" style="width:80%;">'+ meta.fileOrigin +'</span></p>'
									 + '</div>';
							}
						} else {
							html +='<div class="box" style="text-align:center; color:#A0A0A0;">'
								 + '원본 파일이<br>삭제되었습니다.'
								 + '</div>';
						}
					}
					return html;
				}
			},
		
			/**
			 * contents 배열에서 각 블럭을 타입별로 구성합니다.
			 * 
			 * @param content
			 * @returns {String}
			 */
			makeContents : function(content){
				var html ='';
				switch (content.type){
					case 'nameTag':{
						html +=' <span class="name_type1">'+ content.content.name +'</span> ';
						return html;
					}break;
					
					case 'link':{
						html +=	'<a href="'+ content.content +'" target="_blank">';
						html +=	content.content;
						html +=	'</a>';
						return html;
					}break;
		
					case 'url':{
						var _content = content.content;
						html = this.getMakeUrl(_content);
						return html;
						
					}break;
					
					case 'map':{    				
					//	html +=	'<a href="'+ content.link +'" target="_blank" class="img">';
						html +=	'<img src="http://maps.google.com/maps/api/staticmap?center='+ content.lat +','+ content.lng+'&amp;zoom=16&amp;size=480x300&amp;maptype=roadmap&amp;sensor=false&amp;markers=color:red|label:none|'+ content.lat +','+ content.lng +'" width="164" height="80" alt="지도">';
					//	html +=	'</a>';
						return html;
					}break;
					
					case 'cell':{	// 미작업 부분, 고로 현재는 미구현. 
						html = '';
						return html;
					}break;
					
					case 'text':
					default:{
						html = '';
						try{
							if (content.content.length>0) {
								html = '<p class="txt">'+ content.content +'</p>';
							}
						}catch (e) {
							console.log('[ERROR 1003] ', e.description);
						}
						return html;
					}break;
				
				}
			},
			
			getMakeUrl : function(_content){
				var html = '';
			//	html+='<a href="'+ _content.link +'" target="_blank">';
				if (_content.imageUrl != undefined && _content.imageUrl != null && _content.imageUrl.length > 0) {
					var w = 144;
					var h = 81;
					var size = 'width="'+ w +'"';
					html+= '<div class="box">';
					html+= '<p class="title">'+ this.cutStr(_content.title, 45);
					if (_content.title.length > 45 ) {
						var dot = "...";
						html += '<span class="ellip">'+ dot +'</span>';
					}
					html+='</p>';
					html+='<img src="'+ _content.imageUrl +'" '+ size +' alt="">';
					html+='</div>';
				} else {
					html+= '<div class="box">';
					html+= '<p class="title" style="color:#A0A0A0;">'+ this.cutStr(_content.link, 25);
					if (_content.link.length > 25 ) {
						var dot = "...";
						html += '<span class="ellip">'+ dot +'</span>';
					}
					html+='</p>';
					html+='</div>';
				}
				if (_content.movieUrl != undefined && _content.movieUrl != null && _content.movieUrl.length > 0) {
					html+='<span class="mov sp">'+ _content.movieUrl +'</span>';
				}
			//	html+='</a>';
				return html;
			},
			
			whatIsContentType : function(contentsArray){
				if (contentsArray == undefined || contentsArray == null) {
					return ContentType.TEXT;
				}
				var resultType = ContentType.TEXT;
				for (var i in contentsArray) {
					var content = contentsArray[i];
					if (content.type == 'url') {
						resultType = ContentType.URL;
					}
					else if (content.type == 'nameTag') {
						resultType = ContentType.NAMETAG;
					}
					else if (content.type == 'map') {
						resultType = ContentType.MAP;
					}
					else if (content.type == 'cell') {
						resultType = ContentType.CELL;
					}
					else if (content.type == 'link') {
						resultType = ContentType.LINK;
					}
				}
				return resultType;
			},
			
			/**
			 *	범례)
				SAY					// 단순 텍스트만 있는 셀 (기본 cellType 에 있음) (?? 클리핑은 say 로 봐야하는가?)
				NOTE				// (기본 cellType 에 있음)
				POLL				// (기본 cellType 에 있음)
				TODO				// (기본 cellType 에 있음, 추후 확정에 따라서 구조는 변동될수 있음.)
				IMAGE				// (메타파일을 뒤져서 하나라도 이미지가 있으면 플래깅)
				DOCUMENT			// (메타파일을 뒤져서 하나라도 (doc,xsl,ppt)가 있으면 플래깅)
				CO_DOCUMENT			// (첨부된 임의의 마인타임)
			 * @param cellMediaType
			 * @returns {Boolean}
			 */
			isInMediaType : function(cellMediaType){
				//console.log("+++++ cellMediaType : ", cellMediaType );
				var result = false;
				if(cellMediaType){
					$.each( cellMediaType, function( key, value ) {
						//console.log("+++++ value.toUpperCase() : ", value.toUpperCase() );
						if(value.toUpperCase() == 'IMAGE'
							|| value.toUpperCase() == 'DOCUMENT'){
							result = true;
						}
					});
				}
				return result;
			},
			
			stripTags : function(str){
				if (str==undefined) {
					return '';
				} else {
					var t = str.replace(/<(\/)?(html|head|title|body|h1|h2|h3|h4|h5|h6|p|br|hr|pre|em|strong|code|b|i|a|ul|li|ol|dl|dd|table|tr|th|td|br)([^>]*)>/gi, '');
					t = t.replace(/<(\/)?(iframe|frameset|form|input|select|option|textarea|blackquote|address|object)([^>]*)>/gi, '');
					t = t.replace(/(&nbsp;)/gi, '');
					t = $.trim(t);
					return t;
				}
			},
			
			cutStr : function(str,limit){
				var tmpStr = str;
				var byte_count = 0;
				var len = 0;
				if (str!=null && str!=undefined) {
					len = str.length;
				}
				var dot = "";
				var chr_byte = function(chr){
					if(escape(chr).length > 4)
						return 2;
					else
						return 1;
				};
				for(var i=0; i<len; i++){
					byte_count += chr_byte(str.charAt(i));
					if(byte_count == limit-1){
						if(chr_byte(str.charAt(i+1)) == 2){
							tmpStr = str.substring(0,i+1);
							dot = "...";
						} else {
							if(i+2 != len) dot = "...";
							tmpStr = str.substring(0,i+2);
						}
						break;
					} else if(byte_count == limit){
						if(i+1 != len) dot = "...";
						tmpStr = str.substring(0,i+1);
						break;
					}
				}
				return tmpStr;// + '<span class="ellip">'+ dot +'</span>';
			}
		}
})(jQuery, Cellz, window);