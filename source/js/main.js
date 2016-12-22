/* globals jQuery */
"use strict";

var repositoriesStore = require("stores/repositoriesStore"),
	repositoriesActions = require("action-creators/repositoriesActionCreator");

function listRepositiories() {
	var list,
		div;

	div = jQuery(".repository-list");
	div.empty();

	list = repositoriesStore.getList();
	list.forEach(function (item) {
		div.append("<p>" + item.name + "<p>");
	});
}

function getOptions(list) {
	return list.map(function (item) {
		return "<label><input type='checkbox' class='filter-options' " + (item.active ? "checked='checked'" : "") + " data-id=" + item.id + " value='" + item.value + "'>" + item.value + "</label>";
	});
}

function showFilterOptions() {
	var list,
		div,
		itemName;

	div = jQuery(".filter-options-list");
	div.empty();

	list = repositoriesStore.getFilters();

	for(itemName in list) {
		div.append("<p>" + itemName + "</p>");
		div.append(getOptions(list[itemName]));
	}

	jQuery(".filter-options").on("change", function () {
		if(jQuery(this).is(":checked")) {
			repositoriesActions.addFilter(jQuery(this).attr("data-id"), jQuery(this).val());
		} else {
			repositoriesActions.removeFilter(jQuery(this).attr("data-id"), jQuery(this).val());
		}
	});
}

function showSortOptions() {
	var list = repositoriesStore.getSortOptions(),
		actual = repositoriesStore.getCurrentSortOption(),
		div,
		key;

	div = jQuery(".ordering-options");
	div.empty();

	for(key in list) {
		div.append("<p data-id='" + key + "'>" + list[key] + ((key === actual) ? "X" : "") + "</p>");
	}

	div.find("p").on("click", function () {
		repositoriesActions.sort(jQuery(this).attr("data-id"));
	});
}

repositoriesStore.addChangeListener(function () {
	listRepositiories();
	showFilterOptions();
	showSortOptions();
});

jQuery(".username").on("change", function () {
	repositoriesActions.changeUser(jQuery(this).val());
});

jQuery(".fetch-more").on("click", function () {
	repositoriesActions.fetchMore();
});
