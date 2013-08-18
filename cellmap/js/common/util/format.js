/**
 * $.util_fileIcon('application/x-cellzDocs') : codoc
 * @param String
 * @returns
 */

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

$.util_fileIcon = function(fileKind, fileType){
if (fileType && fileType != '' && fileType.toUpperCase() == 'OPENDOC'){ //openDocs file kind는 text/html임
	return 'co';
}else{
	if (fileKind.startsWith("application")){
		if(fileKind.endsWith("gul") || fileKind.endsWith("jungumword")) return "gul";
		else if(fileKind.indexOf("wordprocessingml") > 0 || fileKind.endsWith("word")) return "doc";
		else if(fileKind.indexOf("spreadsheetml") > 0 || fileKind.endsWith("excel")) return "xls";
		else if(fileKind.indexOf("presentationml") > 0 || fileKind.endsWith("powerpoint")) return "ppt";
		else if(fileKind.startsWith("application/x-cellzDocs")) return "co";
		else if(fileKind.endsWith("shockwave-flash")) "swf";
		else if(fileKind.endsWith("fla")) return "fla";
		else if(fileKind.endsWith("pdf")) return "pdf";
		else if(fileKind.endsWith("zip")) return "zip";
		else if(fileKind.endsWith("x-rar-compressed")) return "rar";
		else if(fileKind.endsWith("illustrator")) return "ai";
		else if(fileKind.endsWith("photoshop")) return "psd";
		else return "file";
	}else if (fileKind.startsWith("audio")){
		if(fileKind.endsWith("mp4")) return "mp4";
		else if(fileKind.endsWith("avi")) return "avi";
		else if(fileKind.endsWith("mpeg")) return "mp3";
		else if(fileKind.endsWith("mpg")) return "mpg";
		else if(fileKind.endsWith("wave")) return "wav";
		else if(fileKind.endsWith("aac")) return "aac";
		else return "file";
	}else if (fileKind.startsWith("image")){
		if(fileKind.endsWith("gif")) return "gif";
		else if(fileKind.endsWith("jpeg")) return "jpg";
		else if(fileKind.endsWith("png")) return "png";
		else if(fileKind.endsWith("bmp") || fileKind.endsWith("bitmap")) return "bmp";
		else return "file";
	}else if (fileKind.startsWith("text")){
		if(fileKind.endsWith("html")) return "html";
		else if(fileKind.endsWith("css")) return "css";
		else return "txt2";
	}else if (fileKind.startsWith("video")){
		if(fileKind.endsWith("mp4")) return "mp4";
		else if(fileKind.endsWith("wmv")) return "wma";  // css 오타 수정 필요 - wma로 클래스 명이 지정되어있으나 실제 아이콘이미지는 wmv
		else if(fileKind.endsWith("mpeg")) return "mpeg";
		else if(fileKind.endsWith("mpg")) return "mpg";
		else if(fileKind.endsWith("3gp")) return "3gp";
		else return "file";
	}else	  // }else if (fileKind.startsWith("message") || fileKind.startsWith("model") || fileKind.startsWith("multipart")){
		return "file";
	}
};


/**
 * $obj: <input type="file" accpet="image/jpeg, image/png">
 * $form: input을 reset 시킬 form
 * _message: 해당 확장자가 아닐 경우 보일 메세지
 * accept는 html5에서 file 선택 창에 사용자 지정 파일만 보이게 함
 * 강제로 지정되지 않은 확장자 선택시 업로드 못하도록 함
 */
$.util_fileExtention = {
		'getFileKind': function($obj){
			var inputFile = $obj 
			, fkind = ''
			;
			
			if (__browser__ === 'ie' && getInternetExplorerVersion() == '9'){
				var fullPath = inputFile.val() 
				, temp = fullPath.substring(fullPath.lastIndexOf('\\')+1,fullPath.length)
				, _temp = temp.substring(temp.lastIndexOf('.')+1,temp.length)
				;
				fkind = _temp;
			}else{
				fkind = $.util_fileIcon(inputFile[0].files[0].type);
			}
			
			return fkind;
		}
		, 'getAcceptFileKind': function($obj){
			var inputFile = $obj
			, acceptKind = inputFile.attr('accept')
			, acceptKinds = new Array()
			;
			
			if(acceptKind && acceptKind.length != ''){
				var temp = acceptKind.split(',');
				
				for(var i = 0 ; i < temp.length; i++){
					acceptKinds[i] = $.util_fileIcon(temp[i].trim());
				}
			}
			
			return acceptKinds;
			
		}
		, 'isAcceptable': function($obj){
			var $this = this 
			, inputFile = $obj
			, acceptKinds = $this.getAcceptFileKind(inputFile)
			, fkind = $this.getFileKind(inputFile)
			, isAcceptable = false
			;
			console.log('acceptKinds.length: ' +acceptKinds.length);
			if(acceptKinds.length < 1){
				isAcceptable = true;
			}else if(fkind != ''){
				for(var i = 0 ; i < acceptKinds.length; i++){
					if(fkind == acceptKinds[i]){
						isAcceptable = true;
					}
				}
			}
			
			return isAcceptable;
		}
		, 'checkAcceptableFile': function($obj, $form, _message){
			var $this = this 
			, inputFile = $obj
			, form = $form[0]
			, isAcceptable = $this.isAcceptable(inputFile)
			, message = _message || $.util_message.file.notAcceptableFileKind
			;
			
			if(!isAcceptable){
				$.util_notice(message);
				form.reset();
			}
			
			return isAcceptable;
		}
		, 'getFileExtention': function(fileKind){
			
			if (fileKind.startsWith("application")){
				if(fileKind.endsWith("gul") || fileKind.endsWith("jungumword")) return "gul";
				else if(fileKind.indexOf("wordprocessingml") > 0 || fileKind.endsWith("word")) return "doc";
				else if(fileKind.indexOf("spreadsheetml") > 0 || fileKind.endsWith("excel")) return "xls";
				else if(fileKind.indexOf("presentationml") > 0 || fileKind.endsWith("powerpoint")) return "ppt";
				//else if(fileKind.startsWith("application/x-cellzDocs")) return "co";
				else if(fileKind.endsWith("shockwave-flash")) "swf";
				else if(fileKind.endsWith("fla")) return "fla";
				else if(fileKind.endsWith("pdf")) return "pdf";
				else if(fileKind.endsWith("zip")) return "zip";
				else if(fileKind.endsWith("x-rar-compressed")) return "rar";
				else if(fileKind.endsWith("illustrator")) return "ai";
				else if(fileKind.endsWith("photoshop")) return "psd";
				else if(fileKind.endsWith("json")) return "json";
				else if(fileKind.endsWith("javascript")) return "js";
				else if(fileKind.endsWith("xml")) return "xml";
				else return ;
			}else if (fileKind.startsWith("audio")){
				if(fileKind.endsWith("mp4")) return "mp4";
				else if(fileKind.endsWith("avi")) return "avi";
				else if(fileKind.endsWith("mpeg")) return "mp3";
				else if(fileKind.endsWith("mpg")) return "mpg";
				else if(fileKind.endsWith("wave")) return "wav";
				else if(fileKind.endsWith("aac")) return "aac";
				else return ;
			}else if (fileKind.startsWith("image")){
				if(fileKind.endsWith("gif")) return "gif";
				else if(fileKind.endsWith("jpeg")) return "jpg";
				else if(fileKind.endsWith("png")) return "png";
				else if(fileKind.endsWith("bmp") || fileKind.endsWith("bitmap")) return "bmp";
				else return ;
			}else if (fileKind.startsWith("text")){
				if(fileKind.endsWith("html")) return "html";
				else if(fileKind.endsWith("css")) return "css";
				else if(fileKind.endsWith("xml")) return "xml";
				else if(fileKind.endsWith("javascript ")) return "js";
				else return "txt";
			}else if (fileKind.startsWith("video")){
				if(fileKind.endsWith("mp4")) return "mp4";
				else if(fileKind.endsWith("wmv")) return "wma";  // css 오타 수정 필요 - wma로 클래스 명이 지정되어있으나 실제 아이콘이미지는 wmv
				else if(fileKind.endsWith("mpeg")) return "mpeg";
				else if(fileKind.endsWith("mpg")) return "mpg";
				else if(fileKind.endsWith("ogg")) return "ogg";
				else return ;
			}else	  // }else if (fileKind.startsWith("message") || fileKind.startsWith("model") || fileKind.startsWith("multipart")){
				return ;
		}
};

$.util_fileGroup = {
	'IMAGE' : 'image'
	, 'OFFICE' : 'office'
	, 'ETC' : 'etc'
	, 'getFileGroup': function(_fkind){
		var $this = this
		;
		
		if (_fkind.startsWith("image")){
			return $this.IMAGE;
		}else if(_fkind.endsWith('gul') 
				|| _fkind.endsWith('jungumword')
				|| _fkind.endsWith('word')
				|| _fkind.indexOf('wordprocessingml') > 0
				|| _fkind.endsWith('excel')
				|| _fkind.indexOf('spreadsheetml') > 0
				|| _fkind.endsWith('powerpoint')
				|| _fkind.indexOf('presentationml') > 0 
				|| _fkind.indexOf('hwp') > 0 
				|| _fkind.indexOf('office') > 0 ){
			return $this.OFFICE;
		}else{
			return $this.ETC;
		}
	}
	, 'getFileGroupRegularExpression': function(_fkind){
		var $this = this
		, fileGroup = $this.getFileGroup(_fkind)
		, regExp =  /.+$/i
		;
		console.log(fileGroup);
		switch(fileGroup){
		case $this.IMAGE : 
//			regExp = /^image\/(gif|jpeg|png)$/;
			regExp = /(gif|jpeg|png|jpg)/;
			break;
		case $this.OFFICE : 
			regExp = /(gul|hwp|doc|xls|ppt|jungumword|word|wordprocessingml|excel|spreadsheetml|powerpoint|presentationml|office)/;
			break;
		case $this.ETC : 
		default:
			regExp = /(gul|hwp|doc|xls|ppt|gif|jpeg|png|jungumword|word|wordprocessingml|excel|spreadsheetml|powerpoint|presentationml|office)/;
//			regExp = /((?!(gif|jpeg|png)))/;
			break;
		}
		return regExp;
	}
};

