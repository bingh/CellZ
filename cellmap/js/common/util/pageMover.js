$.util_pageMover = {
	'moveToMe': function(userId){
		if(userId == $('#gnbProfileImage').attr('userId')){
			location.href = Cellz.API_URL.ME.TIMELINE;
		}else{
			location.href = Cellz.API_URL.ME.TIMELINE + '?userId=' + userId;
		};
	}
	, 'moveToGroup': function(groupId){
		location.href = '/group/timeline?groupId=' + groupId;
	}
	, 'moveToDept': function(deptCode){
		$.ajax({
			url: Cellz.API_URL.GROUP.GETGROUPBYCODE,
			type: 'GET',
			async: false,
			data: {
				'deptCode': deptCode
			},
			success: function(result){
				if(result.result_code != '1'){
					return;
				}else{
					location.href = Cellz.API_URL.GROUP.TIMELINE + result.data.groupId;
				}
			}
		});
	}
	, 'moveToFileInfo': function(fname){
		location.href = Cellz.API_URL.FILE.INFO + '?fname=' + fname;
	}
	, 'moveToTimeline': function(_filter){
		location.href = '/timeline/main?filter='+_filter;
	}
	, 'moveToTopic': function(_filter){
		location.href = '/timeline/topic?filter='+_filter;
	}
	, 'moveToCellMap' : function(userId,cellId){
		location.href =  '/timeline/cellmap?cellUserId=' + userId +"&cellId="+cellId;
	}
	, 'moveToOpenDocs': function(_fname){
		var link = 'http://'+ location.host + Cellz.API_URL.FILE.OPENDOC_OPEN + _fname;
//		window.open(link,'window', 'location=no, status=no, toolbar=no, menubar=no');
		window.open(link,'_blank');
	}
	, 'moveToNewOpenDocs': function(){
		var link = 'http://'+ location.host + Cellz.API_URL.FILE.OPENDOC_NEW;
		window.open(link,'_blank');
	}
	, 'moveToMyFollowerList':function(){
		location.href = Cellz.API_URL.ME.FOLLOWLIST;
	}
	, 'moveToLoginPage': function(){
		location.href = '/index.html';
	}
};