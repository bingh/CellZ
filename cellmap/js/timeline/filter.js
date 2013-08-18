/*
 * filter
 * 
 * */
(function($, cz, w) {
cz.timelineFilter = klass(null, {
	o: null
	,filters: null
	,'__construct': function(_options) {
		this.o = $.extend({}, cz.timelineFilter.Defaults, _options);
		this.filters = ['FOLLOWING','COMPANY','GROUPS'];
		var initFilter = this.getInitFilter();
		//console.log('initFilter', initFilter);
		this.o.timelineFilter = (initFilter === '') ? this.o.timelineFilter : initFilter;
		this.o.$filters.filter('[value='+this.o.timelineFilter+']').parent().addClass('on');
		this.eventListener();
	}
	,'getInitFilter': function() {
		var result = false;
		var filter = window.location.search.split('?filter=');
		for (var f in this.filters) {
			if (filter[1] === this.filters[f] && filter[1] !== undefined && filter[1] !== '') {
				result = true;
			}	
		}
		//console.log(result)
		return (result) ? filter[1] : this.filters[0];
	}
	,'eventListener': function() {
		var self = this;
		this.o.$filters.click(function(e) {
			e.preventDefault();
			self.o.timelineFilter = $(this).attr('value');
			self.o.$filters.parent().removeClass('on');
			$(this).parent().addClass('on');
			/*if ($(this).attr('value') === 'FOLLOWING') {
				$('#selectTimelineView').hide();
				$('#selectTimelineViewCell').hide();
				$('.timeline_lst .tab_area_s a').removeClass('on');
				$('#selectTimelineViewCell').addClass('on');
				$timelineView.text($('#selectTimelineViewCell').attr('value'));
			} else {
				$('#selectTimelineView').show();
				$('#selectTimelineViewCell').show();
			}*/
			self.o.afterFiltersClick(self.o);
		});
		/*this.o.$viewFilters.click(function() {
			e.preventDefault();
			$timelineView.text($(this).attr('value'));
			$('.timeline_lst .tab_area_s a').removeClass('on');
			$(this).addClass('on');
			//$(this).parents('.section_timeline').addClass('cellmap_view_ln');	
			changeTimelineMode($(this));
		});*/
	}
	,'getFilterElement': function(_isGroup) {
		var filter = (_isGroup) ? 'GROUPS' : 'COMPANY';
		return this.o.$filters.filter('[value='+filter+']');
	}
});
cz.timelineFilter.Defaults = {};
})(jQuery, Cellz, window);