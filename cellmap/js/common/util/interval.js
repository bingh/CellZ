/*
 * cellbox
 * 
 * intervalTime, callback
 * 
 * */
(function($, cz, w) {
	$.Interval = klass(null, {
		time: null
		,callback: null
		,val: null
		,'__construct': function(_time, _callback) {
			this.time = _time;
			this.callback = _callback;
			this.set();
		}
		,'set': function() {
			var self = this;
			this.val = w.setInterval(function() {
				self.callback();
			}, this.time);
		}
		,'clear': function() {
			w.clearInterval(this.val);
		}
	});
})(jQuery, Cellz, window);