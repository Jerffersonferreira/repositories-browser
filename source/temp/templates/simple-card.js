var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<!-- simple-card: -->\n<div class=\"simple-card\">\n	<div class=\"image\">\n		<img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.avatar_url : stack1), depth0))
    + "\" width=\"100%\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.login : stack1), depth0))
    + "\">\n	</div>\n	<div class=\"content\">\n		<span class=\"title\">"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"stars\"><i class=\"material-icons\">grade</i> "
    + alias2(((helper = (helper = helpers.stargazers_count || (depth0 != null ? depth0.stargazers_count : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"stargazers_count","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"openissues\"><i class=\"material-icons\">error_outline</i> "
    + alias2(((helper = (helper = helpers.open_issues_count || (depth0 != null ? depth0.open_issues_count : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"open_issues_count","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"author js-change-user-option\" data-username=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.login : stack1), depth0))
    + "\"><i class=\"material-icons\">account_circle</i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.login : stack1), depth0))
    + "</span>\n		<a href=\""
    + alias2(((helper = (helper = helpers.html_url || (depth0 != null ? depth0.html_url : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html_url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\" class=\"link\"><i class=\"material-icons\">link</i></a>\n	</div>\n</div>\n<!-- :simple-card -->\n";
},"useData":true});