/**
 * messsage: 보여질 문구
 * url: message 보여진 후 이동할 url
 * _time: post notice가 보여질 시간(default: 2초)
 */
$.util_notice = function(message, url, _time){
	//<!-- 안내문구 레이어 -->
	//<div class="noti_layer">
	//<p>그룹생성이 정상적으로 완료되었습니다.</p>
	//<a href="#" class="clse">레이어 닫기</a>
	//</div>
	//<!-- //안내문구 레이어 -->

	var date= new Date()
		, timeStamp = date.getTime()
//		, time = 5000
		, time = (_time || 2) * 1000
//		, $content = $('#content')
		, $content = $('body') //dimm 처리 후에도 보이도록 body 아래에 붙임
		;
	
//	if(_time && _time != ''){
//		time = _time*1000;
//	}
//console.log('url: '+url);
	//이전에 notice있으면 삭제
	if($content.find('.noti_layer').length > 0){
		$content.find('.noti_layer').remove();
	}

	$content
		.prepend($('<div style="position: fixed; z-index:10000"></div>')
				.css('display', 'none')
				.attr('class','noti_layer')
				.attr('id', timeStamp)
				.append($('<p></p>')
						.html(message)
						.append($('<a></a>')
								.attr('class','clse')
								.attr('href','#')
								.html('레이어 닫기')
								.bind('click',function(event){
									event.preventDefault();
									$(this).parent().parent().slideUp('normal', function(){
										$(this).remove();
										if(url && url != ''){
											loction.href = url;
										}
									});
									}) //bind
						) //</a>
				) //</p>
		);

	$('#'+timeStamp).slideDown(1000);
	
	setTimeout( function(){
		//해당 notice가 있으면 삭제
		if($content.find('#'+timeStamp).length > 0){
			$('#'+timeStamp).slideUp('normal', function(){
				$('#'+timeStamp).remove();
			});
			if(url && url != ''){
				location.href = url;
			}
		}
     }, time ); //2초후 지워짐
};