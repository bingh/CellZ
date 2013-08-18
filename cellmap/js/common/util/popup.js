
$.util_popup = {	
	'popUp': function(contents, btn1, method1, btn2, method2){
		var $dialog = $('<div class="pop_layer" id="utilPopUp"/>')
						.append($('<div class="h_area"/>'))
						.append($('<div class="pop_group_area2 type2">')
								.html(contents))
						.append($('<div class="btn_area2">')
								.append($('<a href="#" id="submit"/>')
										.html(btn1))
								.append((btn2 == undefined || btn2 == '')?undefined:$('<a href="#" id="cancle"/>').html(btn2)))
						.append($('<a href="#" class="clse">팝업창 닫기</a>'))
						.show()
						.appendTo('body')
		;

		$dialog.dialog({
			autoOpen : true,
			resizable : false,
			dragable : false,
			modal : true,
			width : '378px',
			open : function() {
				// [btn] 확인, 예
				$dialog.find('#submit').click(function(e) {
					e.preventDefault();
					$dialog.dialog('close');
					method1();
				});
		
				// [btn] 팝업 닫기, 취소
				$dialog.find('.clse, #cancle').click(function(e) {
					e.preventDefault();
					$dialog.dialog('close');
				});
			},
			close : function() {
				$dialog.dialog('destroy');
				if(!method2 && method2 != '' && method2 != undefined){
					method2();
				}
			}
		});
	}
};