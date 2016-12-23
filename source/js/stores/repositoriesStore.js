"use strict";

var EventEmitter = require("events").EventEmitter,
	dispatcher = require("dispatcher/dispatcher"),
	assign = require("object-assign"),
	Immutable = require("immutable"),
	repositoriesConstants = require("constants/repositoriesConstants"),
	actionTypes = repositoriesConstants.actionTypes,
	errorCodes = repositoriesConstants.errorCodes,
	repositoriesStore,
	CHANGE_EVENT = "change",
	ERROR_EVENT = "error",
	privateMethods = {},
	handlers = {},
	currentPage = 0,
	hasMoreRecordToFetch = true,
	repositoriesList = [],
	activatedFilters = [],
	activatedSortType = {},
	currentUsername,
	error = {},
	sortOptions = {
				"SORT_BY_ALPHABETIC_REPONAME_ORDER": "Alfabética",
				"SORT_BY_OPEN_ISSUES": "Issues",
				"SORT_BY_STARS": "Stars"
			};

repositoriesStore = assign({}, EventEmitter.prototype, {
	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	emitError: function () {
		this.emit(ERROR_EVENT);
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	addErrorListener: function (callback) {
		this.on(ERROR_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getError: function () {
		return error;
	},
	getNextPage: function () {
		return currentPage + 1;
	},

	hasMoreRecordToFetch: function () {
		return hasMoreRecordToFetch;
	},

	hasRecords: function () {
		return repositoriesList.length > 0;
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

			if(filter.value === (item[filter.id] || "Não especificado")) {
				return true;
			}
		}

		return false;
	});
};

privateMethods.sort = function (list) {
	var low = -1,
		hight = 1;

	if(activatedSortType.order === "ASC") {
		low = 1;
		hight = -1;
	}

	switch(activatedSortType.code) {
		case "SORT_BY_ALPHABETIC_REPONAME_ORDER": {
			return list.sort(function (a, b) {
				return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? low : hight;
			});
		}
		case "SORT_BY_OPEN_ISSUES": {
			return list.sort(function (a, b) {
				return a.open_issues < b.open_issues ? low : hight;
			});
		}
		case "SORT_BY_STARS": {
			return list.sort(function (a, b) {
				return a.stargazers_count < b.stargazers_count ? low : hight;
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
	currentUsername = "";
	hasMoreRecordToFetch = true;
	currentPage = 0;
	repositoriesList = [];
};

privateMethods.getErrorMessage = function (error) {
	var timeToTryAgain,
		message;

	if(error.status === 404) {
		return "Usuário não encontrado.";
	}

	if(error.status === 403 && error.response.statusType === 3) {
		message = "O limite de consultas esgotou temporariamente. Tente novamente ";

		if(error.response.header && error.response.header["x-ratelimit-reset"]) {
			timeToTryAgain = parseInt(error.response.header["x-ratelimit-reset"]);
			timeToTryAgain = new Date() - new Date(timeToTryAgain * 1000);
			timeToTryAgain = Math.round(timeToTryAgain / 1000 / 60);

			message += " em " + timeToTryAgain;

			if(timeToTryAgain > 1) {
				message += " minutos";
			} else {
				message += " minuto";
			}
		} else {
			message += "mais tarde.";
		}

		return message;
	}

	return "Ocorreu um erro ao pesquisar o usuário.";
};

handlers.fetch = function (action) {
	if(!action.error) {
		if(action.list.length) {
			repositoriesList = repositoriesList.concat(action.list);
			currentPage += 1;
		} else {
			hasMoreRecordToFetch = false;
		}
		repositoriesStore.emitChange();
	} else {
		error = {
			code: errorCodes.FETCH_ERROR,
			message: privateMethods.getErrorMessage(action.error)
		};
		repositoriesStore.emitError();
	}
};

handlers.changeUser = function (action) {
	var username = action.username;

	if(username) {
		username = username.trim();
	}

	if(username) {
		privateMethods.reset();
		currentUsername = username;
		repositoriesStore.emitChange();
	}
};

handlers.sort = function (action) {
	var sortType = action.sortType;

	if(sortType) {
		sortType = sortType.trim();
	}

	if(sortType && sortOptions[sortType]) {
		if(activatedSortType && activatedSortType.code === sortType) {
			if(activatedSortType.order === "ASC") {
				activatedSortType.order = "DESC";
			} else if(activatedSortType.order === "DESC") {
				activatedSortType = {};
			}
		} else {
			activatedSortType = {
				code: sortType,
				order: "ASC"
			};
		}

		repositoriesStore.emitChange();
	} else {
		activatedSortType = {};
	}
};

handlers.addFilter = function (action) {
	if(action.filter && !privateMethods.isFilterActive(action.filter)) {
		activatedFilters.push(action.filter);
		repositoriesStore.emitChange();
	}
};

handlers.removeFilter = function (action) {
	var filter = action.filter;

	if(filter) {
		activatedFilters = activatedFilters.filter(function (activatedFilter) {
			return !(filter.id === activatedFilter.id && filter.value === activatedFilter.value);
		});

		repositoriesStore.emitChange();
	}
};

handlers.clean = function () {
	privateMethods.reset();
	repositoriesStore.emitChange();
};

repositoriesStore.dispatchToken = dispatcher.register(function (action) {
	error = {};
	console.log(action.type);
	switch(action.type) {
		case actionTypes.FETCHED: {
			handlers.fetch(action);
			break;
		}
		case actionTypes.CHANGE_USER: {
			handlers.changeUser(action);
			break;
		}
		case actionTypes.SORT: {
			handlers.sort(action);
			break;
		}
		case actionTypes.ADD_FILTER: {
			handlers.addFilter(action);
			break;
		}
		case actionTypes.REMOVE_FILTER: {
			handlers.removeFilter(action);
			break;
		}
		case actionTypes.CLEAN: {
			handlers.clean();
			break;
		}
	}
});

module.exports = repositoriesStore;
