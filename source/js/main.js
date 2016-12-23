/* globals jQuery */
"use strict";

var repositoriesStore = require("stores/repositoriesStore"),
	repositoriesActions = require("action-creators/repositoriesActionCreator"),
	templateSimpleCard = require("templates/simple-card"),
	templateCheckList = require("templates/check-list"),
	templateCardList = require("templates/card-list"),
	templateEmptyState = require("templates/empty-state"),
	templateSortControl = require("templates/sort-control"),
	errorCodes = require("constants/repositoriesConstants").errorCodes,
	app = jQuery(".js-app"),
	sideBar = app.find(".js-sidebar"),
	mainDisplayContent = app.find(".js-main-display-content"),
	modal = app.find(".js-app-modal"),
	searchForm = modal.find(".js-search-form"),
	inputSearch = searchForm.find(".js-input-search"),
	submitButton = searchForm.find(".js-submit-button"),
	modalErrorMessage = searchForm.find(".js-app-modal-error-message"),
	sortControl = app.find(".js-sort-controls"),
	cardList;

function eventChangeHandler() {
	var button;

	changeAppLoadingState(false);
	changeFormDisabledState(false);
	handleModalAndFetchError(repositoriesStore, modal);
	listCards(repositoriesStore, mainDisplayContent);
	listFilterOptions(repositoriesStore, sideBar);
	showSortOptions(repositoriesStore, sortControl);
	handleEmptyState(repositoriesStore, app, mainDisplayContent);

	button = jQuery("<div class=\"button\"><button class=\"default-button -secondary\">Carregar mais</button></div>");

	if(repositoriesStore.hasMoreRecordToFetch()) {
		button
		.on("click", function () {
			changeAppLoadingState(true);
			repositoriesActions.fetchMore();
		});

		mainDisplayContent
		.append(button);
	}
}

function changeFormDisabledState(disable) {
	if(disable) {
		inputSearch.attr("disabled", "disabled");
		submitButton.attr("disabled", "disabled");
	} else {
		inputSearch.removeAttr("disabled");
		submitButton.removeAttr("disabled");
	}
}

function changeUser() {
	var userName = inputSearch.val().trim();

	if(userName) {
		changeAppLoadingState(true);
		changeFormDisabledState(true);
		repositoriesStore.removeChangeListener(eventChangeHandler);
		repositoriesActions.changeUser(inputSearch.val());
		repositoriesStore.addChangeListener(eventChangeHandler);
	}
}

function listCards(store, mainDisplayContent) {
	var list,
		wrapper;

	cardList = jQuery(templateCardList());

	list = store.getList();
	list.forEach(function (item) {
		wrapper = jQuery("<div class=\"item\"></div>");
		wrapper.append(templateSimpleCard(item));
		cardList.append(wrapper);
	});

	mainDisplayContent.html(cardList);

	cardList.find(".js-change-user-option").on("click", function () {
		var userName = jQuery(this).attr("data-username");
		repositoriesActions.changeUser(userName);
		changeAppLoadingState(true);
	});
}

function handleModalAndFetchError(store, modal) {
	var error;

	error = store.getError();

	if(error.code === errorCodes.FETCH_ERROR) {
		modal.removeClass("is-closed");
		modalErrorMessage.html("<i class=\"material-icons\">highlight_off</i>" + error.message);
	} else if(!store.getCurrentUsername()) {
		modal.removeClass("is-closed");
	} else {
		modal.addClass("is-closed");
		modalErrorMessage.empty();
	}

	changeFormDisabledState(false);
	changeAppLoadingState(false);
}

function changeAppLoadingState(isLoading) {
	if(isLoading) {
		app.addClass("is-loading");
	} else {
		app.removeClass("is-loading");
	}
}

function handleEmptyState(store, app, mainDisplayContent) {
	if(!store.hasRecords() && !store.hasMoreRecordToFetch()) {
		app.addClass("is-sidebarclosed");
		mainDisplayContent.html(templateEmptyState({username: store.getCurrentUsername()}));
		mainDisplayContent.find(".js-button-search-again").on("click", function () {
			repositoriesActions.clean();
		});
	}
}

function getOptions(list) {
	return list.map(function (item) {
		return {
				checked: item.active,
				value: item.id + ":" + item.value,
				label: item.value
			};
	});
}

function listFilterOptions(store, sidebar) {
	var filterList,
		checklist,
		itemName;

	sidebar.empty();

	filterList = store.getFilters();

	for(itemName in filterList) {
		checklist = templateCheckList({
			title: itemName,
			options: getOptions(filterList[itemName])
		});
		sidebar.append(checklist);
	}

	sidebar.find(".js-checklist-checkbox").on("change", function () {
		var id, value, _this;

		_this = jQuery(this);
		value = _this.val().split(":");

		id = value[0];
		value = value[1];

		if(_this.is(":checked")) {
			repositoriesActions.addFilter(id, value);
		} else {
			repositoriesActions.removeFilter(id, value);
		}
	});
}

function showSortOptions(store, sortControl) {
	var map = repositoriesStore.getSortOptions(),
		activatedFilter = repositoriesStore.getCurrentSortOption(),
		templateData = {
			list: []
		},
		templateDataItem,
		key;

	for(key in map) {
		templateDataItem = {
			label: map[key],
			value: key
		};

		if(key === activatedFilter.code && activatedFilter.order) {
			templateDataItem.order = activatedFilter.order.toLocaleLowerCase();
		}

		templateData.list.push(templateDataItem);
	}

	sortControl.html(templateSortControl(templateData));
	sortControl.find(".js-sort-button").on("click", function () {
		repositoriesActions.sort(jQuery(this).val());
	});
}

repositoriesStore.addErrorListener(function () {
	handleModalAndFetchError(repositoriesStore, modal);
});

searchForm.on("submit", function (event) {
	event.preventDefault();
	changeUser();
});

app.find(".js-button-show-filters, .js-sidebar-close-button").on("click", function () {
	app.toggleClass("is-sidebarclosed");
});

app.find(".js-button-search").on("click", function () {
	repositoriesActions.clean();
});

jQuery(window).on("keyup", function (event) {
	if(27 === (event.which || event.keyCode)) {
		app.toggleClass("is-sidebarclosed");
	}
});
