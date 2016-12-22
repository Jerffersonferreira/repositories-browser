"use strict";

var request = require("superagent"),
	endpoints = require("settings/endpointsAPI"),
	api = {};

api.fetch = function (username, page, callback) {
	if(!page) {
		page = 1;
	}

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
		});
};

module.exports = api;
