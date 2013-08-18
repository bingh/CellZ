$.util_message = {
	group: {
		createSuccess				: '그룹생성이 정상적으로 완료되었습니다.'
		, createUsableName			: '사용하실 수 있는 그룹명 입니다.'
		, createUnusableName		: '사용하실 수 없는 그룹명 입니다.'
		, createDuplName			: '그룹명이 중복 되었습니다.'
		, updateGroupInfo			: '그룹정보가 수정되었습니다.'
		, joinRequestSuccess		: 'Group 가입신청이 완료되었습니다.'
		, joinSuccess				: 'Group에 가입되셨습니다.'
		, approveSuccess			: '승인이 정상적으로 완료되었습니다.'
		, sendMailsToInvite			: '그룹초대 메일을 발송하였습니다.'
		, statusMember				: '현재 Group member'
		, statusJoinRequest			: '현재 Waiting member'
		, withdrawSuccess			: '탈퇴가 정상적으로 완료되었습니다.'
		, withdrawAndGroupDeleteSuccess		: '탈퇴와 그룹삭제가 정상적으로 완료되었습니다.'
		, invitedUser				: '초대 이력이 있는 User 입니다.'
		, invitedUsers				: '초대 이력이 있는 User가 포함되어입니다.'
		, disableToInvite_Users		: '초대 불가능한 User가 포함되어있습니다.'
		, disableToInvite_Member	: '현재 Group member로서 초대할 수 없습니다.'
		, disableToInvite_REQUEST	: '현재  Waiting member로서 초대할 수 없습니다.'
		, disableToInvite_Company	: '타회사 User로서 초대할 수 없습니다.'
		, disableToInvite_NoCellz	: 'Cellz 미사용 회사 User로서 초대할 수 없습니다.'
		, history_create		: '그룹 생성'
		, history_joinRequest	: '가입 신청'
		, history_invite		: '가입 초대'
		, history_approve		: '가입 승인'
		, history_withdraw		: '탈퇴'
		, history_ban			: '강제탈퇴'
		, history_info			: '정보변경'
		, history_create_msg	: '그룹을 생성했습니다.'
		, history_join_msg		: '에 가입신청했습니다.'
		, history_invite_msg	: '명을 초대했습니다.'
		, history_approve_msg	: '명을 승인했습니다.'
		, history_withdraw_msg	: '에서 탈퇴 하였습니다.'
		, history_withdraw_desc	: '[탈퇴사유] '
		, history_ban_msg		: '에서 강제탈퇴 하였습니다.'
		, history_ban_desc		: '[강제탈퇴사유] '
		, history_info_msg_desc	: ' 소개를 수정했습니다.'
		, history_info_msg_img	: ' Group Cover Image를 수정했습니다.'
		, history_info_msg_img_del	: ' Group Cover Image를 삭제했습니다.'
		, history_info_msg_auth	: ' 가입 방법을 수정했습니다.'
		, history_userAddress_kr: '님'
		, history_postposition	: '이'
		, history_postposition2	: '에'
		, history_postposition3	: '을'
		, history_auth			: '[가입방법] '
		, history_before		: '[수정전] '
		, history_after			: '[수정후] '
		, history_PUBLIC		: '자동승인'
		, history_PUBLIC_APPROVE: '가입승인'
		, history_year			: '년'
		, disableToWithrowBasicGroup : '기본 그룹은 탈퇴할 수 없습니다'
	}
	, info: {
		err_title				: '안내'
		, err_comment1			: '해당기능을 수행할 수 없습니다.'
		, err_comment2			: 'CELLZ로 문의해주세요'
	}
	, user: {
		
	}
	, file: {
		deleteSelectedFile				: '선택하신 file을 정상적으로 삭제하였습니다.'
		, needFileName					: '파일명을 입력하세요.'
		, needDocName					: '문서명을 입력하세요.'
		, needAttachFile				: '첨부파일이 필요합니다.'
		, notAcceptableFileKind			: '등록할 수 없는 파일 확장자 입니다.'
		, tooLarge						: '파일크기가 너무 큽니다. 5MB 미만만 등록 가능합니다.'
		, onlyAcceptImage				: '등록 가능한 파일은 jpg, png, gif, bmp 입니다.'
		, noFilesToUpload				: 'Upload 할 파일이 없습니다.'
		, searchDefault					: 'Files 검색'
		, showMore						: '더보기'
		, noResult						: 'No more results'
		, read							: '읽기'
		, write							: '읽기/쓰기'
		, own							: '내파일'
		, authorizedWrite				: '이미 읽기/쓰기 권한이 있는 사용자 입니다.'
		, authorizedUser				: '이미 권한이 부여된 User입니다.'
		, authorizedGroup				: '이미 권한이 부여된 Group입니다.'
		, authorizedCellnote			: '이미 권한이 부여된 Cellnote입니다.'
		, cannotAddUserWhoIsOwner		: '파일의 소유자 입니다. 소유자에게 권한을 부여 할 수 없습니다.'
		, cannotRemoveWriteAuth			: '읽기/쓰기 권한을 삭제 할 수 없습니다.'
		, cannotGiveWriteAuth			: '읽기/쓰기 권한으로 변경 할 수 없습니다.'
		, cannotGiveReadAuth			: '읽기 권한으로 변경 할 수 없습니다.'
		, confirmUpdateNewVersion		: 'New version을 등록하시겠어요?'
		, confirmDeleteFile				: '해당 file을 정말 삭제하시겠어요?'
		, conpleteCopyFile				: '해당 파일이 내 Files에 정상적으로 보관 되었습니다.'
	}
	, search: {
		noSearchResult					: '검색결과가 없습니다.'
		, pleaseSelectOrg				: '부서를 선택해 주세요.'
		, error							: '오류가 발생했습니다.'
	}
	, common: {
		serviceAfterBeta				: '서비스 예정입니다 :)'
	}
	, button: {
		yes								: '예'
		, no							: '아니오'
		, confirm						: '확인'
		, cancle						: '취소'
		, _delete						: '삭제'
		
	}
	, cellmap: {
		noFollowCellmap					: 'Follow한 Cellmap이 없습니다.'
	}
	, timeline: {
		deleteCell			: 'Cell을 정말 삭제하시겠어요?'
		, deleteSharedCell	: 'share를 취소하시겠어요?'
		, deleting			: '삭제중입니다.'
	}
};