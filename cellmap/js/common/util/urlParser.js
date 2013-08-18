$.util_urlParser = {
			'href': window.document.location.href
			, 'search': window.document.location.search
			, 'host': window.document.location.host
			/**
			 * param: 	userId
			 * url: 	http://localhost:8080/user/timeline?userId=3
			 * return:	3
			 */
			, 'getParamFromUrl' : function(param){
				var result = undefined
				, url = this.search
				;
				if(url && url != '' && param && param != ''){
					var temp = url.split('#');
					var _temp = temp[0].split('?');
					if(_temp.length > 1){
						var __temp = _temp[1].split('&');
						for(var i = 0; i < __temp.length; i++){
							var ___temp = __temp[i].split('=');
							if(___temp.length > 1 && ___temp[0] == param){
								result = ___temp[1];
							}
						}
					}
				}
				return result;
			}
			/**
			 * menu:	user
			 * url:		http://localhost:8080/user/timeline?userId=3
			 * return:	timeline
			 */
			,  'getGubunFromUrl': function(menu){
				var result = undefined
				, url = this.href
				;
				if(url && url != '' && menu && menu != ''){
					var temp = url.split('#');
					var _temp = temp[0].split('/'+menu+'/');
					if(_temp.length > 1){
						var __temp = _temp[1].split('?');
						result =  __temp[0];
					}
				}
				return result;
			}
			/**
			 * url:		http://localhost:8080/user/timeline?userId=3
			 * return:	user
			 */
			, 'getMenuFromUrl': function(){
				var result = undefined
				, url = this.href
				;
				if(url && url != ''){
					var temp = url.split(this.host);
					if(temp.length > 1){
						var _temp = temp[1].split(APPLICATION_CONTEXT);
						if(_temp.length > 1){
							result = _temp[1];
						}
					}
				}
				return result;
			}
		};