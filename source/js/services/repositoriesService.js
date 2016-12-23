"use strict";

var request = require("superagent"),
	endpoints = require("settings/endpointsAPI"),
	api = {};

api.fetch = (function () {
	var lock = false;

	return function (username, page, callback) {
		if(lock) {
			return;
		}

		if(!page) {
			page = 1;
		}

		lock = true;

		request
			.get(endpoints("github-starred", {
				page: page,
				username: username
			}))
			.end(function (error, response) {
				var list = [];

				if(!error && response.statusCode === 200) {
					list = response.body;
				}

				callback(error, list);

				lock = false;
			});
	};
})();

module.exports = api;
