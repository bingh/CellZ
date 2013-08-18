String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/gi, "");
}
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
function checkStrLen(str){
	var hangle = (escape(str)+"%u").match(/%u/g).length-1;
	return {'sum':str.length, 'hangle':hangle };
}
function getAmpm(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = ampm +' '+ parseInt(hours).padLeft() + ':' + parseInt(minutes).padLeft();
	return strTime;
}
function replaceSrcOn(this_) {
	var $this = $(this_);
	var step = $this.attr('step');
	var src = '../../../resources/images/'+step;
	var $self = $this;
	if ($this.attr('src').indexOf('_stop') != -1 || $this.attr('src').indexOf('_out') != -1) {
		var img = new Image();
		$(img).attr('src','../../../resources/images/'+step+'_over.gif');
		$(img).attr('step',step);
		$(img).load(function() {
			$self.parent().html($(img));
		});
	}
}
function replaceSrcOff(this_) {
	var $this = $(this_);
	var step = $this.attr('step');
	var src = '../../../resources/images/'+step;
	var $self = $this;
	if ($this.attr('src').indexOf('_over') != -1) {
		var img = new Image();
		$(img).attr('src','../../../resources/images/'+step+'_out.gif');
		$(img).attr('step',step);
		$(img).load(function() {
			$self.parent().html($(img));
		});
	}
}
function getTextByte(text){
	 var length = 0;
	 var ch;
	 for (var i = 0; i < text.length; i++) {
		 ch = escape(text.charAt(i));
		 if ( ch.length == 1 ) {
			 length++;
		 }else if (ch.indexOf("%u") != -1) {
			 length += 2;
		 }else if (ch.indexOf("%") != -1) {
			 length += ch.length/3;
		 }
	 }
	 return length;
}
function replaceNewLineToBr(_str) {
	return _str.replace("\n", "<br />","gi");
}
function confirmLayer(_comment, _callback) {
	var $dialog = $('#confirm_layer').clone().appendTo('body');
	$dialog.dialog({
		modal: true,
		open: function() {
			$("body").mCustomScrollbar("disable");
			var clicked = false;
			$dialog.find('.strNoti').html(_comment);
			$dialog.find('.conf').click(function(e) {
				e.preventDefault();
				_callback();
				$dialog.dialog('close').dialog('destroy');
				$dialog.remove();
			})
			$dialog.find('.cancel, .clse').click(function(e) {
				e.preventDefault();
				$dialog.dialog('close').dialog('destroy');
			});
		},
		close: function() {
			$("body").mCustomScrollbar("update");
		}
	});
	$dialog.dialog('open');
}
function alertLayer(_alertTitle, _headComment, _subComment, _callback) {
	var $dialog = $('#alert_layer').clone().appendTo('body');
	$dialog.dialog({
		modal: true,
		open: function() {
			$("body").mCustomScrollbar("disable");
			var clicked = false;
			$dialog.find('.alertTitle').html(_alertTitle);
			$dialog.find('.headComment').html(_headComment);
			$dialog.find('.subComment').html(_subComment);
			$dialog.find('.btn_area').click(function(e) {
				e.preventDefault();
				_callback();
				$dialog.dialog('close').dialog('destroy');
				$dialog.remove();
			})
			$dialog.find('.cancel, .clse').click(function(e) {
				e.preventDefault();
				$dialog.dialog('close').dialog('destroy');
			});
		},
		close: function() {
			$("body").mCustomScrollbar("update");
		}
	});
	$dialog.dialog('open');
}
function stopPropagationScroll($el){
	$el.bind('mousewheel DOMMouseScroll', function(e) {
	    var scrollTo = null;

	    if (e.type == 'mousewheel') {
	        scrollTo = (e.originalEvent.wheelDelta * -1);
	    }
	    else if (e.type == 'DOMMouseScroll') {
	        scrollTo = 40 * e.originalEvent.detail;
	    }

	    if (scrollTo) {
	        e.preventDefault();
	        $(this).scrollTop(scrollTo + $(this).scrollTop());
	    }
	});	
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
function sc2Html(_str) {
	return _str.replace(/\&gt;/g, ">").replace(/\&lt;/g, "<");
}
/* timeline utils */ //추후 정리 예정
var cellMapIconAction = function(_$cell, _action) {
	var $cell = _$cell
	,	$circle = $cell.children('.circle')
	,	$circleImg = $circle.find('img')
	,	step = $circleImg.attr('step')
	,	img = $('<img >')
	,	action = _action;
	if ($circleImg.length <= 0) return;
	if (_action === 'wave' && (($circleImg.attr('src').indexOf('over') != -1) || ($circleImg.attr('src').indexOf('out') != -1))) {
		return;
	}
	
	$(document.createElement('img'));
	$(img).attr('src','../../../resources/images/'+step+'_'+_action+'.gif?' + Math.random());
	$(img).attr('step',step);
	$circleImg.remove();
	$(img).appendTo($circle);
}
var getConnectNStep = function(_connectN) {
	var step;
	if (_connectN <= 3) {
		step = 1;
	} else if (_connectN >= 4 && _connectN <= 8) {
		step = 2;
	} else if (_connectN >= 9 && _connectN <= 13) {
		step = 3;
	} else if (_connectN >= 14 && _connectN <= 18) {
		step = 4;
	} else {
		step = 5;
	}
	return step;
}
var jsonToHtml = function(_json) {
	var result = ''; 
	if (_json.type === 'text') {
		var txtContent = replaceNewLineToBr(_json.content);
		result =	'<span>'+txtContent+'</span>';
	} else if (_json.type === 'link') {
		result =	'<a href="'+_json.content+'" target="_blank" class="link_text">'+_json.content+'</a>';
	} else if (_json.type === 'nameTag') {
		result =	'<a href="#" class="name nameCard" userid="'+_json.content.id+'">'+_json.content.name+'</a>';
	}
	return result;
}
var RelativeDate = function(_wDate) {
	var	tDate = new Date(),
	wDate = _wDate,
	tYear = tDate.getFullYear(),
	tMonth = tDate.getMonth(),
	tDay = tDate.getDate(),
	wYear = wDate.getFullYear(), //한국시간으로 환산된 year
	wMonth = wDate.getMonth(), //한국시간으로 환산된 month
	wDay = wDate.getDate(), //한국시간으로 환산된 day
	dResult='';

	
	
	tMonth = parseInt(tMonth)+1;
	wMonth = parseInt(wMonth)+1;
	tDay = parseInt(tDay);
	wDay = parseInt(wDay);
	
	if (tMonth < 10) tMonth = "0" +tMonth;
	if (wMonth < 10) wMonth = "0" +wMonth;
	if (tDay < 10) tDay = "0" +tDay;
	if (wDay < 10) wDay = "0" +wDay;
	

	if (tYear === wYear) {
		if (tMonth === wMonth && tDay === wDay) {
			dResult = getAmpm(wDate);				
		} else {
			dResult = wMonth+'/'+wDay;		
		}
	} else {
		dResult = wYear+'/'+wMonth+'/'+wDay;
	}
	
	this.getTime = function() {
		return dResult;
	}
}
/* timeline utils */