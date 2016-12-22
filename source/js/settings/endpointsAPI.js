"use strict";

var endpoints = {
	"github-starred": "https://api.github.com/users/@username/starred?page=@page"
};

module.exports =  function (endpointName, varList) {
	var endpoint = endpoints[endpointName],
		name;

	if(!endpoint) {
		throw new Error("No valid end point found.");
	}

	for(name in varList) {
		endpoint = endpoint.replace(new RegExp("@" + name, "g"), varList[name]);
	}

	return endpoint;
};
