﻿/// <reference path="jquery-2.0.2.js" />
var httpRequester = (function () {
	function getJSON(url, success, error) {
		$.ajax({
			url: url,
			type: "GET",
			timeout: 5000,
			contentType: "application/json",
			success: success,
			error: error
		});
	}
	function postJSON(url, data, success, error) {
		$.ajax({
			url: url,
			type: "POST",
			contentType: "application/json",
			timeout: 5000,
			data: JSON.stringify(data),
			success: success,
			error: error
		});
	}
	function putJSON(url, data, success, error) {
	    $.ajax({
	        url: url,
	        type: "PUT",
	        contentType: "application/json",
	        timeout: 5000,
	        data: JSON.stringify(data),
	        success: success,
	        error: error
	    });
	}
	function deleteJSON(url, success, error) {
	    $.ajax({
	        url: url,
	        type: "DELETE",
	        contentType: "application/json",
	        timeout: 5000,
	        success: success,
	        error: error
	    });
	}
	return {
		getJSON: getJSON,
		postJSON: postJSON,
		putJSON: putJSON,
		deleteJSON: deleteJSON
	};
}());