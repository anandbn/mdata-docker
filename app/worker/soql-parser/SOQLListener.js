// Generated from SOQL.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');
var ParseUtils = require('../utils/ParseUtils.js');
var SOQLStatement = require('./SOQLStatement.js');

// This class defines a complete listener for a parse tree produced by SOQLParser.
function SOQLListener(stmt) {
	this.soqlStmt = stmt;
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

SOQLListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
SOQLListener.prototype.constructor = SOQLListener;

// Enter a parse tree produced by SOQLParser#keywords_alias_allowed.
SOQLListener.prototype.enterKeywords_alias_allowed = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#keywords_alias_allowed.
SOQLListener.prototype.exitKeywords_alias_allowed = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#keywords_name_allowed.
SOQLListener.prototype.enterKeywords_name_allowed = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#keywords_name_allowed.
SOQLListener.prototype.exitKeywords_name_allowed = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#name.
SOQLListener.prototype.enterName = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#name.
SOQLListener.prototype.exitName = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#object_name.
SOQLListener.prototype.enterObject_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#object_name.
SOQLListener.prototype.exitObject_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#field_name.
SOQLListener.prototype.enterField_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#field_name.
SOQLListener.prototype.exitField_name = function(ctx) {
	this.soqlStmt.addField(ParseUtils.getNameFromContext(ctx));
	
};


// Enter a parse tree produced by SOQLParser#filter_scope_name.
SOQLListener.prototype.enterFilter_scope_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#filter_scope_name.
SOQLListener.prototype.exitFilter_scope_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_group_name.
SOQLListener.prototype.enterData_category_group_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_group_name.
SOQLListener.prototype.exitData_category_group_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_name.
SOQLListener.prototype.enterData_category_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_name.
SOQLListener.prototype.exitData_category_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#alias_name.
SOQLListener.prototype.enterAlias_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#alias_name.
SOQLListener.prototype.exitAlias_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#alias.
SOQLListener.prototype.enterAlias = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#alias.
SOQLListener.prototype.exitAlias = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#literal.
SOQLListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#literal.
SOQLListener.prototype.exitLiteral = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#date_formula_literal.
SOQLListener.prototype.enterDate_formula_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#date_formula_literal.
SOQLListener.prototype.exitDate_formula_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#date_formula_n_literal_name.
SOQLListener.prototype.enterDate_formula_n_literal_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#date_formula_n_literal_name.
SOQLListener.prototype.exitDate_formula_n_literal_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#date_formula_n_literal.
SOQLListener.prototype.enterDate_formula_n_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#date_formula_n_literal.
SOQLListener.prototype.exitDate_formula_n_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#datetime_literal.
SOQLListener.prototype.enterDatetime_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#datetime_literal.
SOQLListener.prototype.exitDatetime_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#date_literal.
SOQLListener.prototype.enterDate_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#date_literal.
SOQLListener.prototype.exitDate_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#integer_literal.
SOQLListener.prototype.enterInteger_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#integer_literal.
SOQLListener.prototype.exitInteger_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#real_literal.
SOQLListener.prototype.enterReal_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#real_literal.
SOQLListener.prototype.exitReal_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#string_literal.
SOQLListener.prototype.enterString_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#string_literal.
SOQLListener.prototype.exitString_literal = function(ctx) {
	this.soqlStmt.addStringLiteralValue(ParseUtils.getNameFromContext(ctx));
};


// Enter a parse tree produced by SOQLParser#boolean_literal.
SOQLListener.prototype.enterBoolean_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#boolean_literal.
SOQLListener.prototype.exitBoolean_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#null_literal.
SOQLListener.prototype.enterNull_literal = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#null_literal.
SOQLListener.prototype.exitNull_literal = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_name.
SOQLListener.prototype.enterFunction_name = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_name.
SOQLListener.prototype.exitFunction_name = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_date.
SOQLListener.prototype.enterFunction_date = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_date.
SOQLListener.prototype.exitFunction_date = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_aggregate.
SOQLListener.prototype.enterFunction_aggregate = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_aggregate.
SOQLListener.prototype.exitFunction_aggregate = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_location.
SOQLListener.prototype.enterFunction_location = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_location.
SOQLListener.prototype.exitFunction_location = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_other.
SOQLListener.prototype.enterFunction_other = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_other.
SOQLListener.prototype.exitFunction_other = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#soql_query.
SOQLListener.prototype.enterSoql_query = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#soql_query.
SOQLListener.prototype.exitSoql_query = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#select_clause.
SOQLListener.prototype.enterSelect_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#select_clause.
SOQLListener.prototype.exitSelect_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#from_clause.
SOQLListener.prototype.enterFrom_clause = function(ctx) {

};

// Exit a parse tree produced by SOQLParser#from_clause.
SOQLListener.prototype.exitFrom_clause = function(ctx) {
	this.soqlStmt.fromClause(ParseUtils.getNameFromContext(ctx.children[1]));
};


// Enter a parse tree produced by SOQLParser#using_clause.
SOQLListener.prototype.enterUsing_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#using_clause.
SOQLListener.prototype.exitUsing_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#where_clause.
SOQLListener.prototype.enterWhere_clause = function(ctx) {
	this.soqlStmt.whereStart();
};

// Exit a parse tree produced by SOQLParser#where_clause.
SOQLListener.prototype.exitWhere_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#groupby_clause.
SOQLListener.prototype.enterGroupby_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#groupby_clause.
SOQLListener.prototype.exitGroupby_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#having_clause.
SOQLListener.prototype.enterHaving_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#having_clause.
SOQLListener.prototype.exitHaving_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#orderby_clause.
SOQLListener.prototype.enterOrderby_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#orderby_clause.
SOQLListener.prototype.exitOrderby_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#limit_clause.
SOQLListener.prototype.enterLimit_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#limit_clause.
SOQLListener.prototype.exitLimit_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#offset_clause.
SOQLListener.prototype.enterOffset_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#offset_clause.
SOQLListener.prototype.exitOffset_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#for_clause.
SOQLListener.prototype.enterFor_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#for_clause.
SOQLListener.prototype.exitFor_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#update_clause.
SOQLListener.prototype.enterUpdate_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#update_clause.
SOQLListener.prototype.exitUpdate_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#soql_subquery.
SOQLListener.prototype.enterSoql_subquery = function(ctx) {
	this.soqlStmt.subQueryStart();
};

// Exit a parse tree produced by SOQLParser#soql_subquery.
SOQLListener.prototype.exitSoql_subquery = function(ctx) {
	this.soqlStmt.subQueryEnd();
};


// Enter a parse tree produced by SOQLParser#subquery_select_clause.
SOQLListener.prototype.enterSubquery_select_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#subquery_select_clause.
SOQLListener.prototype.exitSubquery_select_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#select_spec.
SOQLListener.prototype.enterSelect_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#select_spec.
SOQLListener.prototype.exitSelect_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#subquery_select_spec.
SOQLListener.prototype.enterSubquery_select_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#subquery_select_spec.
SOQLListener.prototype.exitSubquery_select_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#field_spec.
SOQLListener.prototype.enterField_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#field_spec.
SOQLListener.prototype.exitField_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_call_spec.
SOQLListener.prototype.enterFunction_call_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_call_spec.
SOQLListener.prototype.exitFunction_call_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#field.
SOQLListener.prototype.enterField = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#field.
SOQLListener.prototype.exitField = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_call.
SOQLListener.prototype.enterFunction_call = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_call.
SOQLListener.prototype.exitFunction_call = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_parameter_list.
SOQLListener.prototype.enterFunction_parameter_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_parameter_list.
SOQLListener.prototype.exitFunction_parameter_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#function_parameter.
SOQLListener.prototype.enterFunction_parameter = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#function_parameter.
SOQLListener.prototype.exitFunction_parameter = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#typeof_spec.
SOQLListener.prototype.enterTypeof_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#typeof_spec.
SOQLListener.prototype.exitTypeof_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#typeof_when_then_clause_list.
SOQLListener.prototype.enterTypeof_when_then_clause_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#typeof_when_then_clause_list.
SOQLListener.prototype.exitTypeof_when_then_clause_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#typeof_when_then_clause.
SOQLListener.prototype.enterTypeof_when_then_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#typeof_when_then_clause.
SOQLListener.prototype.exitTypeof_when_then_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#typeof_then_clause.
SOQLListener.prototype.enterTypeof_then_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#typeof_then_clause.
SOQLListener.prototype.exitTypeof_then_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#typeof_else_clause.
SOQLListener.prototype.enterTypeof_else_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#typeof_else_clause.
SOQLListener.prototype.exitTypeof_else_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#field_list.
SOQLListener.prototype.enterField_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#field_list.
SOQLListener.prototype.exitField_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#object_spec.
SOQLListener.prototype.enterObject_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#object_spec.
SOQLListener.prototype.exitObject_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#object_prefix.
SOQLListener.prototype.enterObject_prefix = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#object_prefix.
SOQLListener.prototype.exitObject_prefix = function(ctx) {
	this.soqlStmt.objectPrefix(ParseUtils.getNameFromContext(ctx.children[0]));
};


// Enter a parse tree produced by SOQLParser#comparison_operator.
SOQLListener.prototype.enterComparison_operator = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#comparison_operator.
SOQLListener.prototype.exitComparison_operator = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_operator.
SOQLListener.prototype.enterSet_operator = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_operator.
SOQLListener.prototype.exitSet_operator = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#condition.
SOQLListener.prototype.enterCondition = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#condition.
SOQLListener.prototype.exitCondition = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#condition1.
SOQLListener.prototype.enterCondition1 = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#condition1.
SOQLListener.prototype.exitCondition1 = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#parenthesis.
SOQLListener.prototype.enterParenthesis = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#parenthesis.
SOQLListener.prototype.exitParenthesis = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#simple_condition.
SOQLListener.prototype.enterSimple_condition = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#simple_condition.
SOQLListener.prototype.exitSimple_condition = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#field_based_condition.
SOQLListener.prototype.enterField_based_condition = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#field_based_condition.
SOQLListener.prototype.exitField_based_condition = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_based_condition.
SOQLListener.prototype.enterSet_based_condition = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_based_condition.
SOQLListener.prototype.exitSet_based_condition = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#like_based_condition.
SOQLListener.prototype.enterLike_based_condition = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#like_based_condition.
SOQLListener.prototype.exitLike_based_condition = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#condition_field.
SOQLListener.prototype.enterCondition_field = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#condition_field.
SOQLListener.prototype.exitCondition_field = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_values.
SOQLListener.prototype.enterSet_values = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_values.
SOQLListener.prototype.exitSet_values = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_value_list.
SOQLListener.prototype.enterSet_value_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_value_list.
SOQLListener.prototype.exitSet_value_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_values_complex.
SOQLListener.prototype.enterSet_values_complex = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_values_complex.
SOQLListener.prototype.exitSet_values_complex = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#set_values_variable.
SOQLListener.prototype.enterSet_values_variable = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#set_values_variable.
SOQLListener.prototype.exitSet_values_variable = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#with_clause.
SOQLListener.prototype.enterWith_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#with_clause.
SOQLListener.prototype.exitWith_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#with_plain_clause.
SOQLListener.prototype.enterWith_plain_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#with_plain_clause.
SOQLListener.prototype.exitWith_plain_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#with_data_category_clause.
SOQLListener.prototype.enterWith_data_category_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#with_data_category_clause.
SOQLListener.prototype.exitWith_data_category_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_spec_list.
SOQLListener.prototype.enterData_category_spec_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_spec_list.
SOQLListener.prototype.exitData_category_spec_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_spec.
SOQLListener.prototype.enterData_category_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_spec.
SOQLListener.prototype.exitData_category_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_parameter_list.
SOQLListener.prototype.enterData_category_parameter_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_parameter_list.
SOQLListener.prototype.exitData_category_parameter_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#data_category_selector.
SOQLListener.prototype.enterData_category_selector = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#data_category_selector.
SOQLListener.prototype.exitData_category_selector = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#group_by_plain_clause.
SOQLListener.prototype.enterGroup_by_plain_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#group_by_plain_clause.
SOQLListener.prototype.exitGroup_by_plain_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#group_by_rollup_clause.
SOQLListener.prototype.enterGroup_by_rollup_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#group_by_rollup_clause.
SOQLListener.prototype.exitGroup_by_rollup_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#group_by_cube_clause.
SOQLListener.prototype.enterGroup_by_cube_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#group_by_cube_clause.
SOQLListener.prototype.exitGroup_by_cube_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#group_by_list.
SOQLListener.prototype.enterGroup_by_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#group_by_list.
SOQLListener.prototype.exitGroup_by_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#group_by_spec.
SOQLListener.prototype.enterGroup_by_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#group_by_spec.
SOQLListener.prototype.exitGroup_by_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#order_by_list.
SOQLListener.prototype.enterOrder_by_list = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#order_by_list.
SOQLListener.prototype.exitOrder_by_list = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#order_by_spec.
SOQLListener.prototype.enterOrder_by_spec = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#order_by_spec.
SOQLListener.prototype.exitOrder_by_spec = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#order_by_direction_clause.
SOQLListener.prototype.enterOrder_by_direction_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#order_by_direction_clause.
SOQLListener.prototype.exitOrder_by_direction_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#order_by_nulls_clause.
SOQLListener.prototype.enterOrder_by_nulls_clause = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#order_by_nulls_clause.
SOQLListener.prototype.exitOrder_by_nulls_clause = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#order_by_field.
SOQLListener.prototype.enterOrder_by_field = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#order_by_field.
SOQLListener.prototype.exitOrder_by_field = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#for_value.
SOQLListener.prototype.enterFor_value = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#for_value.
SOQLListener.prototype.exitFor_value = function(ctx) {
};


// Enter a parse tree produced by SOQLParser#update_value.
SOQLListener.prototype.enterUpdate_value = function(ctx) {
};

// Exit a parse tree produced by SOQLParser#update_value.
SOQLListener.prototype.exitUpdate_value = function(ctx) {
};



exports.SOQLListener = SOQLListener;