$(document).ready(function() {

	$zoom_pane = $("#zoom_pane");
	
	$zoom_pane.panzoom({
		increment: 0.4,
		minScale: 1,
		maxScale: 2.2,
		duration: 600,
		$zoomIn: $("#zoom_in"),
		$zoomOut: $("#zoom_out"),
		$zoomRange: $("#zoom_range"),
		$reset: $("#reset")
	});
	
	function zoom() {
		$placeholder = $(".placeholder");
		$placeholderZoom = $(".placeholder_zoom");
		var scale = $zoom_pane.panzoom("getMatrix")[0];
		var newScale = 1.0/scale;
		var newScaleStyle = "scale(" + newScale + "," + newScale + ")";
		var newWidth = (100*scale) + "%";
		$("#cellMapSlider").css('top',top);
		$placeholder.fadeOut(600, function() {
			$placeholderZoom.css({
				"transform":newScaleStyle,
				"-ms-transform":newScaleStyle,
				"-webkit-transform":newScaleStyle,
				"transform-origin":"left top",
				"-webkit-transform-origin":"left top",
				"width":newWidth,
				"height":newWidth
			});
			
		});
		
		$placeholder.fadeIn(600);
	}
	
	$("#zoom_in").click(function() {
		if(zoomLevel != 3) {
			zoomLevel += 1;
			$(".profile").remove();
			$(".cellAdd").remove();
			for(var i = 0; i < nodes.length; ++i) {
				var nodeId = nodes[i].id;
				nodeId = "#" + nodeId;
				nodeId = nodeId.replace(/_/g, "\\_");
				var placeholder = $(nodeId).children().children(".placeholder_zoom").children(".cellTop");
			    var picId = "zoom_" + zoomLevel + "_" + nodes[i].importance + ".jpg";
			    picId = "images/profile/" + picId;
			    placeholder.append("<div class='profile' style='position:absolute; top: 0; left: 5%; width: 100%; height:100%; background-image: "+"url(" + picId +"); background-repeat: no-repeat" + "'></div><div class='cellAdd'></div>");
			}
		}
		zoom();
		addClick();
	});
	
	$("#zoom_out").click(function() {
		if(zoomLevel != 0) {
			zoomLevel -= 1;
			$(".profile").remove();
			$(".cellAdd").remove();
			for(var i = 0; i < nodes.length; ++i) {
				var nodeId = nodes[i].id;
				nodeId = "#" + nodeId;
				nodeId = nodeId.replace(/_/g, "\\_");
				var placeholder = $(nodeId).children().children(".placeholder_zoom").children(".cellTop");
			    var picId = "zoom_" + zoomLevel + "_" + nodes[i].importance + ".jpg";
			    picId = "images/profile/" + picId;
			    placeholder.append("<div class='profile' style='position:absolute; top: 0; left: 5%; width: 100%; height:100%; background-image: "+"url(" + picId +"); background-repeat: no-repeat" + "'></div><div class='cellAdd'></div>");
			}
		}
		zoom();
		addClick();
		
	});
	
	$("#reset").click(function() {
		zoom();
	});
	
	$("#zoom_range").mousedown(function() {
		$placeholder = $(".placeholder");
		$placeholder.fadeOut(400);
	});
	
	$("#zoom_range").mouseup(function() {
		$placeholder = $(".placeholder");
		$placeholderZoom = $(".placeholder_zoom");
		var scale = $zoom_pane.panzoom("getMatrix")[0];
		var newScale = 1.0/scale;
		var newScaleStyle = "scale(" + newScale + "," + newScale + ")";
		var newWidth = (100*scale) + "%";
		$placeholderZoom.css({
			"transform":newScaleStyle,
			"-webkit-transform":newScaleStyle,
			"transform-origin":"left top",
			"-webkit-transform-origin":"left top",
			"width":newWidth,
			"height":newWidth
		});
		$placeholder.fadeIn(600);
	});
	
});