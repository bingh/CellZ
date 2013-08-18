/*
 * 
 * */
(function($, cz, w) {
	cz.Template.Cellbox = {};
	
	cz.Template.Cellbox.Cell = function(_data, _sectionName) {
		this.TEXT_GROUP_LINE_HEIGHT = 18;
		this.TEXT_GROUP_LIMIT_HEIGHT = this.TEXT_GROUP_LINE_HEIGHT * 6; //6줄
		
		var cell = (_data.cell !== undefined) ? _data.cell : null
		,	cellUser = (cell.cellUser !== undefined) ? cell.cellUser : null
		,	attachments = (cell.attachmentsMeta !== undefined) ? cell.attachmentsMeta : null
		,	contents = (cell.contents !== undefined) ? cell.contents : null
		,	name = cellUser.name
		,	$unitWrap = $('<div class="unitWrap"  box_user_id="'+_data.boxUserId+'" box_item_id="'+_data.boxItemId+'" box_item_string_id="'+_data.boxItemStringId+'" inserted_Timestamp="'+_data.insertedTimestamp+'"/>')
		,	$unit = $('<div class="unit" />')
		,	$btnDelete = $('<a href="#" class="clse">삭제하기</a>')
		,	$name = $('<strong class="name" />')
		,	$text = $('<div class="txt" />')
		;
		

		var param = {
			type: 'CELLBOX'
			,sectionName: _sectionName
			,boxItemId: _data.boxItemId
		};
		this.textTmpl = new cz.Template.Text(cell.contents, cell.surveyAnonymity, cell.cellType, cell.cellId, param);
		var $totalTextGroup = this.textTmpl.$totalTextGroup.find('.txt_group');
		var $summaryTextGroup = this.textTmpl.$summaryTextGroup.find('.txt_group');
		var $html = $(this.textTmpl.getHtml());
		
		
//		console.log('---------------시작--------------');
		if (this.textTmpl.getInlineObjLength() > 0) {
//			console.log('클리핑이 존재한다.');
			if (this.textTmpl.getFirstInlineObjType() === 'url') {
//				console.log('url클리핑이다.');
				if (this.textTmpl.getFirstTextType() === 'url') {
//					console.log('최상단에 위치한다.');
//					console.log('============클리핑만 표시한다.=========');
				} else {
//					console.log('최상단에 위치하지 않는다.');
					if ($summaryTextGroup.height() <= this.TEXT_GROUP_LINE_HEIGHT * 2) {
//						console.log('텍스트가 2줄이하다.');
//						console.log('============클리핑 표시한다.=========');
					} else {
//						console.log('텍스트가 2줄 초과한다.');
//						console.log('============클리핑을 표시하지 않는다.=========');
						$html.find('.inlineObj').remove();
						cutLine($html, $summaryTextGroup.height(), this.TEXT_GROUP_LIMIT_HEIGHT);
					}
				}
			} else {
				//셀이나 맵등.
//				console.log('url클리핑아니다.');
			}
		} else {
//			console.log('클리핑이 없다.');
			if (attachments.length > 0) {
//				console.log('첨부파일이 있다.');
				if ($summaryTextGroup.height() <= this.TEXT_GROUP_LINE_HEIGHT * 2) {
//					console.log('텍스트가 2줄이하다.');
//					console.log('============첨부파일 표시한다.=========');
					var kind = cz.Utils.getFileKind(attachments[0].fileKind)
					,	$file;
					if (kind === 'image') {
						$file = new cz.Template.Cellbox.AttachmentImage(attachments[0]);
					} else {
						$file = new cz.Template.Cellbox.AttachmentFile(attachments[0]);
					}
					console.log('$file', $file);
					console.log('$html', $html);
					$html.append($file);
					
				} else {
//					console.log('텍스트가 2줄 초과한다.');
//					console.log('============첨부파일 표시하지 않는다.=========');
					$html.find('.inlineObj').remove();
					cutLine($html, $summaryTextGroup.height(), this.TEXT_GROUP_LIMIT_HEIGHT);
				}
			} else {
//				console.log('첨부파일이 없다.');
				cutLine($html, $summaryTextGroup.height(), this.TEXT_GROUP_LIMIT_HEIGHT);
			}
		}
		$name.html(name);
		$text.html($html);
		$unit.append($name);
		$unit.append($text);
		$unitWrap.append($unit);
		$unitWrap.append($btnDelete);
		$unitWrap.data('json', _data);
		return $unitWrap;

		function setHeight(_$el, _height) {
			_$el.css({
				'height': _height
				,'overflow': 'hidden'
			});
		};
		function cutLine(_$el, _height, _maxHeight) {
			if (checkMaxLine(_height, _maxHeight)) {			//여섯줄 초과한다.
//				console.log('여섯줄 초과한다.');
				setHeight(_$el, _maxHeight);
			} else {																	//여섯줄 초과하지 않는다.
//				console.log('여섯줄 초과하지 않는다.');
			}
		}
		function checkMaxLine(_height, _maxHeight) {
//			console.log('checkMaxLine-height',_height);
//			console.log('checkMaxLine-this.TEXT_GROUP_LIMIT_HEIGHT',_maxHeight);
			return (_height > _maxHeight) ? true : false;
		}
	}
	
//	cz.Template.Cellbox.Cell2 = function(_data) {
//		this.TEXT_GROUP_HEIGHT = 110; //6줄
//		var $unit = $('<div class="unit" />')
//		,	$name = $('<strong class="name" />')
//		,	$text = $('<div class="txt" />')
//		,	name = '임시이름'
//		;
//		
//
//		if (_data.boxUserName !== undefined) {
//			name = _data.boxUserName;
//		}
//		if (_data.content !== undefined) {
//			this.textTmpl = new cz.Template.Text(_data.content, _data.surveyAnonymity, _data.cellType, _data.cellId, 'CELLBOX');
//			var $cloneEl = this.textTmpl.$cloneEl;
//			var $textGroup = $cloneEl.find('.txt_group');
//			var $html = $(this.textTmpl.getHtml());
//			
//			if (this.textTmpl.getInlineObjLength() <= 0 && $textGroup.height() > this.TEXT_GROUP_HEIGHT) { 
//				setHeight($html, this.TEXT_GROUP_HEIGHT);
//			} else {
//				
//			}
//		}
//		$name.html(name);
//		$text.html($html);
//		$unit.append($name);
//		$unit.append($text);
//		
//		return $unit;
//
//		function setHeight(_$el, _height) {
//			_$el.css({
//				'height': _height
//				,'overflow': 'hidden'
//			});
//		};
//	}
	cz.Template.Cellbox.People = function(_data) {
//		console.log('cz.Template.Cellbox.People', _data);
		var html = '';
		html += '<div class="unitWrap" box_user_id="'+_data.boxUserId+'" box_item_id="'+_data.boxItemId+'" box_item_string_id="'+_data.boxItemStringId+'" inserted_Timestamp="'+_data.insertedTimestamp+'">';
		html += '<div class="unit">';
		html += '	<div class="img_area">';
		if (_data.profileImage !== undefined) {
			if (_data.profileImage === '') {
				html +=	'	<img src="/resources/images/img_noimg_timeline.png" alt="" /><span class="mask"></span>';
			} else {
				html +=	'	<img src="'+Cellz.API_URL.FILE.THUMBNAIL + _data.profileImage+'&w=22&h=22'+'" alt=""><span class="mask"></span>';
			}
		} else {
			html +=	'	<img src="/resources/images/img_noimg_timeline.png" alt="" /><span class="mask"></span>';
		}
//		html += '		<img width="22" height="22" alt="" src="'+Cellz.API_URL.FILE.THUMBNAIL+ _profile_image+'&w=22&h=22'+'"><span class="mask"></span>';
		html += '	</div>';
		html += '	<strong class="name">'+_data.userName+'</strong>';
		html += '	<span class="part">'+_data.basicGroup+'</span>';
		html += '</div>';
		html += '<a class="clse" href="#">삭제하기</a>';
		html += '</div>';

		var $html = $(html);
		$html.data('json', _data);
		return $html;
	}
	cz.Template.Cellbox.File = function(_data) {
		var html = '';
		html += '<div class="unitWrap" box_user_id="'+_data.boxUserId+'" box_item_id="'+_data.boxItemId+'" box_item_string_id="'+_data.boxItemStringId+'" file_name="'+_data.fileName+'" inserted_Timestamp="'+_data.insertedTimestamp+'">';
		html += '<div class="unit">';
		html += '</div>';
		html += '<a class="clse" href="#">삭제하기</a>';
		html += '</div>';
		
		var $html = $(html);
		$html.data('json', _data);
		var $file = new cz.Template.Cellbox.AttachmentFile(_data);
		$html.find('.unit').html($file);
		return $html;
	}
	cz.Template.Cellbox.AttachmentFile = function(_data) {
		var kind = cz.Utils.getFileKind(_data.fileKind);
		var w = 22;
		var h = 27;
		var html = '';
		html += '<div class="fileWrap">';
		html += '	<span class="file_type '+kind+'">';
		if (kind === 'image') {
			html += '	<img src="'+API_VERSION+'file/thumbnail?fname='+_data.fileName+'&h='+h+'&w='+w+'" >';
		}
		html += '	</span>';
		html += '	<p class="filename"><span class="tx">'+_data.fileTitle+'</span></p>';
		html += '</div>';
		
		var $html = $(html);
		$html.data('json', _data);
		return $html;
	}
	cz.Template.Cellbox.AttachmentImage = function(_data) {
		var kind = cz.Utils.getFileKind(_data.fileKind);
		var w = 162;
		var h = 86;
		var html = '<div class="imageWrap"><img src="'+API_VERSION+'file/thumbnail?fname='+_data.fileName+'&h='+h+'&w='+w+'" ></div>';
		return $(html);
	}
//	cz.Template.Cellbox.Text = function(_contents, _anonymity, _cellType, _cellId) {
//		this.$cloneEl = null;
//		
//		var	jsonArray
//		,	ExistFirstInlineObj = false;
//		try {
//			jsonArray = $.parseJSON(_contents);
//		} catch(e) {
//			jsonArray = [{
//				type: 'text',
//				content: 'error: contens의 json형태가 올바르지 않습니다.'
//			}];
//		}
//		
//		this.html =	'';
//		 if (_cellType === 'ENQUETE' && _anonymity !== undefined) {
//			var anonymityText = (_anonymity === true) ? '익명' : '실명';
//			var anonymityClass = (_anonymity === true) ? 'sp_namea' : 'sp_namer';
//			this.html +=	'<span class="'+anonymityClass+' sp">'+anonymityText+'</span> ';
//			this.html +=	'<span>'+jsonArray.content+'</span>';
//		}
//		for (var i = 0, ii = jsonArray.length; i < ii; i++) {
//			if (jsonArray[i].type === 'text' && jsonArray[i].content !== undefined) {
//				var txtContent = replaceNewLineToBr(jsonArray[i].content);
//				this.html +=	'<span>'+txtContent+'</span>';
//			} else if (jsonArray[i].type === 'link' && jsonArray[i].content !== undefined) {
//				this.html +=	'<a href="'+jsonArray[i].content+'" target="_blank" class="link_text">'+jsonArray[i].content+'</a>';
//			} else if (jsonArray[i].type === 'nameTag' && jsonArray[i].content !== undefined) {
//				this.html +=	'<a href="#" class="name nameCard" userid="'+jsonArray[i].content.id+'">'+jsonArray[i].content.name+'</a>';
//			} else if (jsonArray[i].type === 'url') {
//				if (jsonArray[i].content !== undefined && jsonArray[i].content !== '') {
//					this.html +=	'<div class="inlineObj preview_group inlineObjOriginal hidden_template">';
//					if (jsonArray[i].content.imageUrl != '') {
//						this.html +=	'	<div class="pv_img">';
//						if (jsonArray[i].content.movieUrl !== "") {
//							this.html +=	'		<a href="#" class="playMovie" url="'+jsonArray[i].content.movieUrl+'">';
//						}
//						this.html +=	'		<img width="90" height="70" alt="" src="'+jsonArray[i].content.imageUrl+'">';
//						if (jsonArray[i].content.movieUrl !== "") {
//							this.html +=	'		</a>';
//						}					
//						this.html +=	'	</div>';
//					}
//					this.html +=	'	<div class="pv_cnt">';
//					this.html +=	'		<strong class="pv_tlt"><a target="_blank" href="'+jsonArray[i].content.link+'">'+jsonArray[i].content.title+'</a></strong>';
//					this.html +=	'		<em class="pv_url"><a target="_blank" href="'+jsonArray[i].content.link+'">'+jsonArray[i].content.link+'</a></em>';
//					this.html +=	'		<p class="pv_txt"><a target="_blank" href="'+jsonArray[i].content.link+'">'+jsonArray[i].content.contents+'</a></p>';
//					this.html +=	'	</div>';
//					this.html +=	'</div>';
//					this.inlineObjLength += 1;
//					ExistFirstInlineObj = true;
//				}
//			} else if (jsonArray[i].type === 'map' && jsonArray[i].content !== undefined) {
//			} else if (jsonArray[i].type === 'cell' && jsonArray[i].content !== undefined) {
//			}
//		}
//		
//		this.$cloneEl = $('<div class="cellbox_clone" parent_cell_id="'+ _cellId+'"/>')
//			.html(this.html)
//			.appendTo('body');
//	}

//	cz.Template.Cellbox.Cell.prototype = cz.Template;
//	cz.Template.Cellbox.Text.prototype = cz.Template;
})(jQuery, Cellz, window);