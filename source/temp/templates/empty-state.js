var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<!-- empty-state: -->\n<div class=\"empty-state\">\n	<p class=\"text\">\n		O usuário \"<span>"
    + this.escapeExpression(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"username","hash":{},"data":data}) : helper)))
    + "</span>\" ainda não marcou nenhum repositório com estrela.\n	</p>\n	<div class=\"button\">\n		<button class=\"default-button -secondary js-button-search-again\" type=\"submit\"><i class=\"material-icons\">search</i> pesquisar outro</button>\n	</div>\n</div>\n<!-- :empty-state -->\n";
},"useData":true});