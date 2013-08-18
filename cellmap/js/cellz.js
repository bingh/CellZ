var API_VERSION = '/api/v1/'
	, API_VERSION_2 = '/api/v2/'
	, Cellz = Cellz || {
		dispatcher : $({})
		, User: {}
		, Page : {}
		, Config : {
			screen : ''
		}
		, Layer : {
			count : null
		}
		, Cellmap : {
			/** 새소식용 전역변수 */
			newsInterval : null
		}
		, INTERVAL_TIME: 10000
		, Utils : {
			getFileKind: function(_mimeType) {
				var kind;
				if (_mimeType !== undefined) {
					switch(_mimeType)
					{
					case 'image/png':
						kind = 'image';
						break;
					case 'image/jpeg':
						kind = 'image';
						break;
					case 'image/gif':
						kind = 'image';
						break;
					case 'image/vnd.adobe.photoshop':
						kind = 'psd';
						break;
					case 'text/html':
						kind = 'html';
						break;
					case 'text/plain':
						kind = 'txt';
						break;
					case 'text/css':
						kind = 'css';
						break;
					case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
						kind = 'xls';
						break;
					case 'application/x-shockwave-flash':
						kind = 'swf';
						break;
					case 'application/zip':
						kind = 'zip';
						break;
					case 'application/pdf':
						kind = 'pdf';
						break;
					case 'application/msword':
						kind = 'doc';
						break;
					case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
						kind = 'ppt';
						break;
					case 'application/jungumword':
						kind = 'gul';
						break;
					case 'audio/x-wav':
						kind = 'wav';
						break;
					case 'audio/x-ms-wma':
						kind = 'wma';
						break;
					case 'audio/mpeg':
						kind = 'mp3';
						break;
					case 'video/x-msvideo':
						kind = 'avi';
						break;
					case 'video/mp4':
						kind = 'mp4';
						break;
					default:
						kind = 'file';
					}
				} else {
					kind = 'file';
				}
				return kind;
			}
		}
		, CONFIG : {
			maxNumberOfFiles : 5
		}
		, PARAM : {
			GROUPID : undefined,
			INVITEMEMBERSTATUS: undefined
		}
		, API_URL: {
			TIMELINE : {
				CELLZ : API_VERSION+'timeline/timelines'
				, CELLZ2 : API_VERSION_2+'timeline/timelines'
				, NEWS : API_VERSION+'timeline/newCellCount'
				, NEWS2 : API_VERSION_2+'timeline/newCellCount'
				, LIKE : API_VERSION+'cell/like'
				, SHARE : API_VERSION+'cell/share'
				, DELETE : API_VERSION+'cell/delete'
				, GROUPLIST : API_VERSION+'group/groupList'
				, MAIN : '/timeline/main'
			}
			, 'SOMETHING' : {
				'CREATE':API_VERSION + 'cell/create'	// Cellz.API_URL.SOMETHING.CREATE
				, 'CREATEUP':API_VERSION + 'cell/createUp'	// Cellz.API_URL.SOMETHING.CREATEUP
				, 'NAME':API_VERSION + 'user/peopletags'	// Cellz.API_URL.SOMETHING.NAME
				, 'CLIP':API_VERSION + 'copyurl/make'	// Cellz.API_URL.SOMETHING.CLIP
//				, 'FILE':API_VERSION + 'file/list'	// Cellz.API_URL.SOMETHING.FILE				
//				, 'FILEDOWN':API_VERSION + 'download?fname='	// Cellz.API_URL.SOMETHING.FILEDOWN
//				, 'THUMBNAIL':API_VERSION + 'file/thumbnail?fname='	// Cellz.API_URL.SOMETHING.THUMBNAIL
//				, 'FILEDELETE':API_VERSION + 'file/delete?fname='	// Cellz.API_URL.SOMETHING.FILEDELETE			
			}
			, GROUP: {
				MEMBER: '/group/member?groupId='
				, SETUP: '/group/setup?groupId='
				, HISTORY: '/group/history?groupId='
				, TIMELINE: '/group/timeline?groupId=' // Cellz.API_URL.GROUP.TIMELINE?id=groupId : 해당 groupId의 GROUP main page
				, HISTORYLIST: API_VERSION + '/group/historylist'	
				, GROUPSIMPLEINFO: API_VERSION + 'group/groupSimpleInfo'
				, UPDATE: API_VERSION + 'group/update'
				, GROUPMEMBERLIST: API_VERSION + 'group/groupMemberList'
				, JOIN: API_VERSION + 'group/join'
				, REQUEST: API_VERSION + 'group/request'
				, JEJECT: API_VERSION + 'group/reject'
				, INVITE: API_VERSION + 'group/invite'
				, DISAPPROVE: API_VERSION + 'group/disapprove'
				, WITHDRAW: API_VERSION + 'group/withdraw'
				, APPROVE: API_VERSION + 'group/approve'
				, ACCEPT: API_VERSION + 'group/accept'
				, ACCEPTALARM : API_VERSION + 'group/acceptAlarm'
				, BAN: API_VERSION + 'group/ban'
				, CREATE: API_VERSION + 'group/create'
				, CHECKGROUPNAME: API_VERSION + 'group/checkGroupName'
				, INVITE_PAGE: '/group/invitation?groupId='
				, ESBSEARCH: API_VERSION +'user/esbSearch'
				, CHECKGROUPMEMBER: API_VERSION + 'group/checkGroupMember'
				, GETGROUPBYCODE: API_VERSION + 'group/getGroupByCode'
				, GETCHILDRENORG: API_VERSION + 'group/getChildrenOrg'
				, GETORGMEMBER: API_VERSION + 'group/getOrgMember'
				, GROUPMEMBERCOUNT: API_VERSION + 'group/groupMemberCount'
				, MYGROUPLIST : API_VERSION+'group/groupMenuList'
			}
			, ME: {
				FOLLOWLIST: '/user/me' 
				, TIMELINE: '/user/timeline' // Cellz.API_URL.ME.TIMELINE?id=userId : 해당 userId의 ME main page
				, FILES: '/user/files'
				, CELLMAPS: '/user/cellmaps'
				, SETUP: '/user/setup'
				, PROFILE: API_VERSION + 'user/profile'
				, UPDATE: API_VERSION + 'user/update'
				, FOLLOWINGS: API_VERSION + 'user/followings'
				, FOLLOWERS: API_VERSION + 'user/followers'
				, FOLLOW: API_VERSION + 'user/follow'
				, UNFOLLOW: API_VERSION + 'user/unfollow'
				, FOLLOWINGCOUNT: API_VERSION + 'user/followingCount'
				, FOLLOWERCOUNT: API_VERSION + 'user/followerCount'
				, CHECKUSER: API_VERSION + 'user/checkUser'
			}
			, FILE: {				
				THUMBNAIL: API_VERSION + 'file/thumbnail?fname='
				, DOWNLOAD: API_VERSION + 'file/download?fname='
				, PEEKVIEW: API_VERSION + 'file/peekview?fname='
				, DELETE: API_VERSION + 'file/delete?fname='
				, FOLLOWERLIST: API_VERSION + 'file/followerList'
				, UPLOADFILES: API_VERSION + 'file/uploadFiles'
				, LIST :API_VERSION + 'file/list'	// SOMETHING 에서 사용.
				, SEARCH_MY_FILE : API_VERSION + 'search/searchMyFile' //post 방식 Elastic Search 사용, query=검색단어, 검색범위:내파일
				, SEARCH_FILE : API_VERSION + 'file/searchList' //post 방식 DB Like 검색 사용, query=검색단어, 검색범위:내파일,팔로우,shared,RecentBox
				, RECENT_FILETAG : API_VERSION + 'box/getFileListTag'
				, INFO: '/file/info'
				, FILESHARELIST: API_VERSION + 'file/shareList'
				, FOLLOW: API_VERSION + 'file/follow'
				, UNFOLLOW: API_VERSION + 'file/unfollow'
				, UPDATE: API_VERSION + 'file/update'
				, UPDATEFILES: API_VERSION + 'file/updatefiles'
				, VERSIONUP: API_VERSION + 'file/versionUp'
				, CLEARURLSHARE: API_VERSION + 'file/clearShare'
				, SHARECOUNT: API_VERSION + 'file/shareCount'
				, SHARELIST: API_VERSION + 'file/shareList'
				, AUTHLIST: API_VERSION + 'file/authorization'
				, SETMULTIAUTH: API_VERSION + 'file/setMultipleAuthorization'
				, COPY: API_VERSION + 'file/copy'
				, OPENDOC_NEWVERSION: API_VERSION + 'file/openDocNewVersion'
				, OPENDOC_SAVE: API_VERSION + 'file/openDocSave'
				, OPENDOC_COPY: API_VERSION + 'file/openDocCopy'
				, OPENDOC_NEW: '/file/createOpenDoc'
				, OPENDOC_OPEN: '/file/openOpenDoc?fname='
				, CHECKFILEEXISTED: API_VERSION + '/file/checkFileExisted'
			}
			, PROFILE : API_VERSION + 'user/profile'
			, BOX: {
				PEOPLELIST: API_VERSION + 'box/getPeopleList'
				, GET_LIST_BY_ITEM: 'box/getListByItem'
				, GET_CELL_LIST: API_VERSION + 'box/getCellList'
				, GET_PEOPLE_LIST: API_VERSION + 'box/getPeopleList'
				, GET_FILE_LIST: API_VERSION + 'box/getFileList'
				, ADD_CELL: API_VERSION + 'box/addCellToCellBox'
				, ADD_PEOPLE: API_VERSION + 'box/addPeopleToCellBox'
				, ADD_FILE: API_VERSION + 'box/addFileToCellBox'
				, MOVE: API_VERSION + 'box/moveBoxItems'
				, DELETE: API_VERSION + 'box/delete'
				, 'MAP': API_VERSION + 'box/getMapList'	// 4071 : 2013-06-28 지도관련 
				, 'MAPQUERY' : API_VERSION + 'box/getMapListByQuery'// 4071 : 2013-06-28 지도관련
			}
			, CELL: {
				PARTICIPANTS: API_VERSION + 'cell/participants'
				,VOTE: API_VERSION + 'cell/vote'
				,CONTENTS : API_VERSION + 'cell/contents' 
				,CHECKDELETE : API_VERSION + 'cell/checkDelete'
			}
			, ALARM : {
				UNREADCOUNT : API_VERSION + 'alarm/getUnReadCount'
				,PACKAGELIST : API_VERSION + 'alarm/getPackageList'
				,ALLALARM : API_VERSION + 'alarm/getAllList'
				,PASTLIST : API_VERSION + 'alarm/getPastList'
				,CLICKALARM : API_VERSION + 'alarm/clickAlarm'
			}
			, CELLMAP : {
				FOLLOW : API_VERSION + 'cellmap/follow' 
				,UNFOLLOW : API_VERSION + 'cellmap/unfollow' 
				,TIMELINES : API_VERSION + 'cellmap/timelines' 
				,NEWCELLCOUNT : API_VERSION + 'cellmap/newCellCount'
				,CELLMAPS: API_VERSION + 'cellmaps/cellmaps'
				,VIEW : '/timeline/cellmap'
			},MAIL : {
				SEND: API_VERSION + 'mail/sendMail'
			}
			, COMPANY : {
				GETCOMPANY : API_VERSION + 'company/getCompany'
			}
			, COMMON: {
				LOGOUT: API_VERSION + 'user/logout'
			}
		}
		, ACTION: {
			LIKED : false
			, SHARED : false
			, DELETED : false
			, 'LIKE' : function(_$this, _cellUserId, _cellId) {
				if (Cellz.ACTION.LIKED) {
					$.util_notice('처리중입니다.');
				} else {
					Cellz.ACTION.LIKED = true;
					$.ajax({
						dataType: "json",
						type: "POST",
						cache: false,
						url: Cellz.API_URL.TIMELINE.LIKE,
						data: {
							"cellUserId": _cellUserId,
							"cellId": _cellId
						},
						success: function(_data) {
							if (_data.result_code === 1) {
								Cellz.dispatcher.trigger('like', {'_this':_$this, 'cellId':_cellId});
								Cellz.ACTION.LIKED = false;
							} else {
								Cellz.ACTION.LIKED = false;
							}
						},
						error: function(xhr, status, error) {
							Cellz.ACTION.LIKED = false;
						}
					});
				}
			}
			, 'LIKE_SUCCESS' : function(_$this) {
				var $a = _$this;
				var txt = $a.text(),
				$num = $a.parents('dl').find('dd .num'),
				num = parseInt($num.text()) + 1;
				$a.parent().prepend(txt);
				$num.text(num);
				$a.remove();
			}
			, 'SHARE' : function(_$this, _cellUserId, _cellId) {
				if (Cellz.ACTION.SHARED) {
					$.util_notice('처리중입니다.');
				} else {
					Cellz.ACTION.SHARED = true;
					$.ajax({
						dataType: "json",
						type: "POST",
						cache: false,
						url: Cellz.API_URL.TIMELINE.SHARE,
						data: {
							"cellUserId": _cellUserId,
							"cellId": _cellId
						},
						success: function(_data) {
							if (_data.result_code === 1) {
								Cellz.dispatcher.trigger('share', {'_this':_$this, 'cellId':_cellId});
//								if (_from === 'CELLMAP') Cellz.ACTION.SHARE_SUCCESS(_$this);
//								_syncCallback(_data);
								Cellz.ACTION.SHARED = false;
							} else {
								Cellz.ACTION.SHARED = false;
							}
						},
						error: function(xhr, status, error) {
							Cellz.ACTION.SHARED = false;
						}
					});
				}
			}
			, 'SHARE_SUCCESS' : function(_$this) {
				var $a = _$this;
				var txt = 'Shared',
				$num = $a.parents('dl').find('dd .num'),
				num = parseInt($a.parents('dl').find('dd .num').text()) + 1;
				$a.parent().prepend(txt);
				$num.text(num);
				$a.remove();
				$.util_notice('Cell내용을 follower에게 share 하였습니다.');
			}
			, 'DELETE_CELL' : function(_cellId, _cellUserId) {
				Cellz.screen.setLoader();
				if (Cellz.ACTION.DELETED) {
					$.util_notice('처리중입니다.');
				} else {
					Cellz.ACTION.DELETED = true;
					$.ajax({
						dataType: "json",
						type: "POST",
						data: {
				            "cellId": _cellId
						},
						url: Cellz.API_URL.TIMELINE.DELETE,
						success: function(_data) {
							if (_data.result_code === 1) {
								Cellz.dispatcher.trigger('deleteCell', {'cellId':_cellId, 'cellUserId':_cellUserId});
								//_callback();
								Cellz.ACTION.DELETED = false;
							} else {
								Cellz.ACTION.DELETED = false;
							}
							Cellz.screen.deleteLoader();
							$.util_notice('선택하신 Cell을 정상적으로 삭제하였습니다.');
						},
						error: function(xhr, status, error) {
							clicked = false;
							Cellz.screen.deleteLoader();
						}
					});
				}
			}
			, 'SELECT_POLL': function(_$this) {
				var	$this = _$this
				,	$cell = $this.parents('.timeline_box')
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
					url: Cellz.API_URL.CELL.VOTE,
					data: {
						cellUserId: cellUserId,
						cellId: cellId,
						itemId: $this.attr('item_id')
					},
					success: function(_result) {
						if (_result.result_code === 1) {
							Cellz.dispatcher.trigger('selectPoll', {'_this':$this, 'cellId':cellId, 'result':_result});
						}
					},
					error: function(xhr, status, error) {
					}
				});
			}
			, 'SELECT_POLL_SUCCESS': function(_$this, _result, _from) {
				var cell = _result
				,	$this = _$this
				,	$cell = $this.parents('.timeline_box');
				
				var surveyTmpl = new Cellz.Template.Survey(cell.cellSurveyList, cell.myPollId, cell.surveyAnonymity, _from);
				$cell.children('.content').children('.poll_group').html($(surveyTmpl.getHtml()).find('ul'));
			}
			, 'WRITE_CELL_SUCCESS' : function(_cellId) {
				
			}
		}
	};

if (window.console === undefined) {
	console = {log:function(){}};	// console == window.console is true
}

// 4071 : 2013-07-12 START
if (typeof String.prototype.getIconName != 'function') {
	String.prototype.getIconName = function(){
		var name = this			
			, _t = undefined
			, _s = undefined
			, type = undefined
			, sub = undefined                                                                                                                                                                                                                           
			, icon = undefined
			, mime = {
						'application' : {'type':/^application/
									, 'subType' : [
										{'reg':/gul$/, 'icon':'gul'}
										, {'reg':/jungumword$/, 'icon':'gul'}
										, {'reg':/wordprocessingml|word$/, 'icon':'doc'}
										, {'reg':/spreadsheetml|excel$/, 'icon': 'xls'}
										, {'reg':/presentationml|powerpoint$/, 'icon':'ppt'}
										, {'reg':/x\-cellzDocs/, 'icon':'co'}
										, {'reg':/shockwave\-flash$/, 'icon':'swf'}
										, {'reg':/fla$/, 'icon':'fla'}
										, {'reg':/pdf$/, 'icon':'pdf'}
										, {'reg':/(zip|x\-zip\-compressed)$/, 'icon':'zip'}	// application/x-zip-compressed
										, {'reg':/x\-rar\-compressed$/, 'icon':'rar'}
										, {'reg':/illustrator$/, 'icon':'ai'}
										, {'reg':/photoshop$/, 'icon':'psd'}									
									]}
						, 'audio' : {'type':/^audio/
									, 'subType' : [
										{'reg':/mp4$/, 'icon':'mp4'}
										, {'reg':/avi$/, 'icon':'avi'}
										, {'reg':/mpeg$/, 'icon':'mp3'}
										, {'reg':/mpg$/, 'icon':'mpg'}
										, {'reg':/wave$/, 'icon':'wav'}
										, {'reg':/aac$/, 'icon':'aac'}
									]}
						, 'image' : {'type':/^image/
									, 'subType' : [
										{'reg':/gif$/, 'icon':'gif'}
										, {'reg':/(jpeg|jpg)$/, 'icon':'jpg'}
										, {'reg':/png$/, 'icon':'png'}
										, {'reg':/(bmp|bitmap)$/, 'icon':'bmp'}
									]}
						, 'text' : {'type':/^text/
									, 'subType' : [
										{'reg':/(html|htm)$/, 'icon':'html'}
										, {'reg':/css$/, 'icon':'css'}
										// txt2 ??
									]}
						, 'video' : {'type':/^video/
									, 'subType' : [
										{'reg':/mp4$/, 'icon':'mp4' }
										, {'reg':/wmv$/, 'icon':'wma' }
										, {'reg':/mpeg$/, 'icon':'mpeg'}
										, {'reg':/mpg$/, 'icon':'mpg'}
										, {'reg':/3gp$/, 'icon':'3gp'}
									]}
					}
			;

//if (fileType && fileType != '' && fileType.toUpperCase() == 'OPENDOC'){ //openDocs file kind는 text/html임
//	return 'co';
//}
//		console.log(463, ' getIconName ', name);

		for ( _t in mime ) {
			if (mime[_t].type.test(name)){
				type=_t;
				break;
			}
		}
		
		if (type=='image') {
			return null;
		}
		
		if (!!type) {
			sub = mime[type].subType;
			for ( _s in sub ) {
				if (sub[_s].reg.test(name)){
					icon=sub[_s].icon;
					break;
				}
			}		
		}

		!!icon || (icon='file');

		return icon;
	};
}	// if
// 4071 : 2013-07-12 END