var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing, alias3="function";

  return "<div class=\"col s4 m4\">\n	<div class=\"card\">\n		<div class=\"card-image waves-effect waves-block waves-light\">\n			<img class=\"activator\" src=\""
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.avatar_url : stack1), depth0))
    + "\">\n		</div>\n		<div class=\"card-content\">\n			<span class=\"card-title activator grey-text text-darken-4\">"
    + alias1(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "<i class=\"material-icons right\">more_vert</i></span>\n			<p><a href=\"#\">This is a link</a></p>\n		</div>\n		<div class=\"card-reveal\">\n			<span class=\"card-title grey-text text-darken-4\">"
    + alias1(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "<i class=\"material-icons right\">close</i></span>\n			<p>"
    + alias1(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n		</div>\n	</div>\n</div>\n";
},"useData":true});