"use strict";

var EventEmitter = require("events").EventEmitter,
	dispatcher = require("dispatcher/dispatcher"),
	assign = require("object-assign"),
	Immutable = require("immutable"),
	repositoriesConstants = require("constants/repositoriesConstants"),
	actionTypes = repositoriesConstants.actionTypes,
	repositoriesStore,
	CHANGE_EVENT = "change",
	privateMethods = {},
	currentPage = 0,
	hasMoreRecordToFetch = true,
	repositoriesList = [],
	activatedFilters = [],
	activatedSortType = "",
	currentUsername,
	sortOptions = {
				"SORT_BY_ALPHABETIC_REPONAME_ORDER": "Ordem alfabética",
				"SORT_BY_OPEN_ISSUES": "Open issues",
				"SORT_BY_STARS": "Stars"
			};

repositoriesStore = assign({}, EventEmitter.prototype, {
	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getNextPage: function () {
		return currentPage + 1;
	},

	hasMoreRecordToFetch: function () {
		return hasMoreRecordToFetch;
	},

	getCurrentUsername: function () {
		return currentUsername;
	},

	getCurrentSortOption: function () {
		return activatedSortType;
	},

	getSortOptions: function () {
		return Immutable.fromJS(sortOptions).toJS(sortOptions);
	},

	getFilters: function () {
		return privateMethods.getFilters();
	},

	getList: function () {
		var list = Immutable.fromJS(repositoriesList).toJS();

		list = privateMethods.filterAll(list);
		list = privateMethods.sort(list);
		if(repositoriesList.length) {
			console.log(repositoriesList[0].name);
		}
		return list;
	}
});

privateMethods.getFilters = function () {
	var filterList = {},
		filterName,
		language,
		filter;

	repositoriesList.forEach(function (item) {
		filterName = "Linguagem";

		if(!filterList[filterName]) {
			filterList[filterName] = [];
		}

		language = item.language;

		if(!language) {
			language = "Não especificado";
		}

		filter = {
			id: "language",
			value: language,
			active: false
		};

		if(!privateMethods.isFilterInList(filter, filterList[filterName])) {
			if(privateMethods.isFilterActive(filter)) {
				filter.active = true;
			}

			filterList[filterName].push(filter);
		}
	});

	return filterList;
};

privateMethods.filterAll = function (list) {
	var filter;

	if(activatedFilters.length === 0) {
		return list;
	}

	return list.filter(function (item) {
		for(filter in activatedFilters) {
			filter = activatedFilters[filter];

			if(item[filter.id] === filter.value) {
				return true;
			}
		}

		return false;
	});
};

privateMethods.sort = function (list) {
	switch(activatedSortType) {
		case "SORT_BY_ALPHABETIC_REPONAME_ORDER": {
			return list.sort(function (a, b) {
				return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1;
			});
		}
		case "SORT_BY_OPEN_ISSUES": {
			return list.sort(function (a, b) {
				return a.open_issues < b.open_issues ? -1 : 1;
			});
		}
		case "SORT_BY_STARS": {
			return list.sort(function (a, b) {
				return a.stargazers_count < b.stargazers_count ? -1 : 1;
			});
		}
	}

	return list;
};

privateMethods.isFilterInList = function (filter, list) {
	var activatedFilter;

	for(activatedFilter in list) {
		activatedFilter = list[activatedFilter];
		if(filter.id === activatedFilter.id && filter.value === activatedFilter.value) {
			return true;
		}
	}
	return false;
};

privateMethods.isFilterActive = function (filter) {
	return privateMethods.isFilterInList(filter, activatedFilters);
};

privateMethods.reset = function () {
	hasMoreRecordToFetch = true;
	currentPage = 0;
	repositoriesList = [];
};

repositoriesStore.dispatchToken = dispatcher.register(function (action) {
	var username,
		sortType;

	switch(action.type) {
		case actionTypes.FETCHED: {
			if(!action.error) {
				if(action.list.length) {
					repositoriesList = repositoriesList.concat(action.list);
					currentPage += 1;
				} else {
					hasMoreRecordToFetch = false;
				}
			}

			repositoriesStore.emitChange();
			break;
		}
		case actionTypes.CHANGE_USER: {
			username = action.username;

			if(username) {
				username = username.trim();
			}

			if(username) {
				currentUsername = username;
				privateMethods.reset();
				repositoriesStore.emitChange();
			}

			break;
		}
		case actionTypes.SORT: {
			sortType = action.sortType;

			if(sortType) {
				sortType = sortType.trim();
			}

			if(sortType && sortOptions[sortType]) {
				activatedSortType = sortType;
				repositoriesStore.emitChange();
			} else {
				activatedSortType = "";
			}

			break;
		}
	}
});

// To temporarily solve ciclomatic complexity
repositoriesStore.dispatchToken = dispatcher.register(function (action) {
	var filter;

	switch(action.type) {
		case actionTypes.ADD_FILTER: {
			if(action.filter && !privateMethods.isFilterActive(action.filter)) {
				activatedFilters.push(action.filter);
				repositoriesStore.emitChange();
			}

			break;
		}
		case actionTypes.REMOVE_FILTER: {
			filter = action.filter;

			if(filter) {
				activatedFilters = activatedFilters.filter(function (activatedFilter) {
					return !(filter.id === activatedFilter.id && filter.value === activatedFilter.value);
				});

				repositoriesStore.emitChange();
			}

			break;
		}
	}
});

module.exports = repositoriesStore;
