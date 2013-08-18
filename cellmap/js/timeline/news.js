
/*
 * 
 * 
 * */
(function($, cz, w) {
	cz.News = function(id, options) {
		var	base = this;
		this._initialize = function() {
			base.$wrap = $('#'+id);
			base.$count = base.$wrap.find('#newCount');
			base.$btnNews = base.$wrap.find('#btnNewTimeline');
			base.networking = false;
			base.o = $.extend({}, cz.News.Defaults, options);
			base.newCount = 0;
			base.initialize();
			//마우스이벤트
			base.$btnNews.click(function(e) {
				e.preventDefault();
				base.clear();
				base.o.whenClick(function() {
					base._observe();
				});
			});
		}
		this.initialize = function() {
			this.clear();
			this._observe();
		}
		this._observe = function() {
			var param = {
				lastTime: base.o.lastTime,
				timelineFilter: base.o.timelineFilter,
				viewFilter: base.o.viewFilter,
				groupId: base.o.groupId
			}
//			console.log('ovserve시 파라미터',param)
			base.interval = w.setInterval(function() {
				//if (base.param.viewFilter === 'CELLMAP') return;
				if (base.networking === false) {
					base.networking = true;
//					console.log(base.o.observeTarget.isInitialized());
					if (base.o.observeTarget.isInitialized() === false) return ; //target이 준비되지 않았으면 return
					var tmpLastTime = base.o.observeTarget.getFirstCellTime();
					if( tmpLastTime === undefined && tmpLastTime === null ) {
						base.networking = false;
						return;
					}
					
					if( param.lastTime === undefined || param.lastTime === null || param.lastTime < tmpLastTime ) {
						param.lastTime = tmpLastTime;
					}
					$.ajax({
						dataType: "json",
						type: "GET",
						url: base.o.url,
						cache: false,
						data: param,
						success: function(_json) {
							if (_json.result_code === 1) base.networking = false;
							if (_json.result_code === 1 && _json.data > 0) {
								pc = parseInt(base.newCount,10);
								cc = parseInt(_json.data,10);
								str = ((pc+cc) >= 10) ? '10+' : cc;
								base.$count.text(str)
								base.$wrap.slideDown('slow');
							}
						},
						error: function(xhr, status, error) {
						}
					});
				}
			}, base.o.intervalTime);
		}
		this.clear = function() {
			base.$wrap.hide();
			base.$wrap.find('#newCell').text(0);
			base.newCount = 0;
			w.clearInterval(base.interval);
		}
		this.stop = function() {
			w.clearInterval(base.interval);
		}
		this.start = function() {
			base._observe();
		}
		this.setTimelineFilter = function(_filter) {
			console.log('***************_filter',_filter)
			base.o.timelineFilter = _filter;
		}
		this.setViewFilter = function(_filter) {
			base.o.viewFilter = _filter;
		}
		this._initialize();
	}
	cz.News.Defaults = {
		intervalTime: cz.INTERVAL_TIME
	};
})(jQuery, Cellz, window);