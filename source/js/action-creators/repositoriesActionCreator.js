"use strict";

var dispatcher = require("dispatcher/dispatcher"),
	repositoriesConstants = require("constants/repositoriesConstants"),
	repositoriesService = require("services/repositoriesService"),
	repositoriesStore = require("stores/repositoriesStore"),
	actionTypes = repositoriesConstants.actionTypes,
	api = {};

api.fetchMore = function () {
	repositoriesService.fetch(
		repositoriesStore.getCurrentUsername(),
		repositoriesStore.getNextPage(),
		function (error, list) {
			dispatcher.dispatch({
				type: actionTypes.FETCHED,
				error: error,
				list: list
			});
		});
};

api.addFilter = function (id, value) {
	dispatcher.dispatch({
		type: actionTypes.ADD_FILTER,
		filter: {
			id: id,
			value: value
		}
	});
};

api.removeFilter = function (id, value) {
	dispatcher.dispatch({
		type: actionTypes.REMOVE_FILTER,
		filter: {
			id: id,
			value: value
		}
	});
};

api.changeUser = function (username) {
	dispatcher.dispatch({
		type: actionTypes.CHANGE_USER,
		username: username
	});

	api.fetchMore();
};

api.sort = function (sortType) {
	dispatcher.dispatch({
		type: actionTypes.SORT,
		sortType: sortType
	});
};

module.exports = api;
