// Generated from ./Apexcode.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by ApexcodeParser.

function ApexcodeVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

ApexcodeVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
ApexcodeVisitor.prototype.constructor = ApexcodeVisitor;

// Visit a parse tree produced by ApexcodeParser#compilationUnit.
ApexcodeVisitor.prototype.visitCompilationUnit = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#packageDeclaration.
ApexcodeVisitor.prototype.visitPackageDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#importDeclaration.
ApexcodeVisitor.prototype.visitImportDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeDeclaration.
ApexcodeVisitor.prototype.visitTypeDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerDeclaration.
ApexcodeVisitor.prototype.visitTriggerDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#modifier.
ApexcodeVisitor.prototype.visitModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classOrInterfaceModifier.
ApexcodeVisitor.prototype.visitClassOrInterfaceModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#sharingModifier.
ApexcodeVisitor.prototype.visitSharingModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#variableModifier.
ApexcodeVisitor.prototype.visitVariableModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classDeclaration.
ApexcodeVisitor.prototype.visitClassDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeParameters.
ApexcodeVisitor.prototype.visitTypeParameters = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeParameter.
ApexcodeVisitor.prototype.visitTypeParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeBound.
ApexcodeVisitor.prototype.visitTypeBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enumDeclaration.
ApexcodeVisitor.prototype.visitEnumDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enumConstants.
ApexcodeVisitor.prototype.visitEnumConstants = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enumConstant.
ApexcodeVisitor.prototype.visitEnumConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enumBodyDeclarations.
ApexcodeVisitor.prototype.visitEnumBodyDeclarations = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#interfaceDeclaration.
ApexcodeVisitor.prototype.visitInterfaceDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeList.
ApexcodeVisitor.prototype.visitTypeList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classBody.
ApexcodeVisitor.prototype.visitClassBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#interfaceBody.
ApexcodeVisitor.prototype.visitInterfaceBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classBodyDeclaration.
ApexcodeVisitor.prototype.visitClassBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#memberDeclaration.
ApexcodeVisitor.prototype.visitMemberDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#methodDeclaration.
ApexcodeVisitor.prototype.visitMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#genericMethodDeclaration.
ApexcodeVisitor.prototype.visitGenericMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#constructorDeclaration.
ApexcodeVisitor.prototype.visitConstructorDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#genericConstructorDeclaration.
ApexcodeVisitor.prototype.visitGenericConstructorDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#fieldDeclaration.
ApexcodeVisitor.prototype.visitFieldDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#propertyDeclaration.
ApexcodeVisitor.prototype.visitPropertyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#propertyBodyDeclaration.
ApexcodeVisitor.prototype.visitPropertyBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#interfaceBodyDeclaration.
ApexcodeVisitor.prototype.visitInterfaceBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#interfaceMemberDeclaration.
ApexcodeVisitor.prototype.visitInterfaceMemberDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#constDeclaration.
ApexcodeVisitor.prototype.visitConstDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#constantDeclarator.
ApexcodeVisitor.prototype.visitConstantDeclarator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#interfaceMethodDeclaration.
ApexcodeVisitor.prototype.visitInterfaceMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#genericInterfaceMethodDeclaration.
ApexcodeVisitor.prototype.visitGenericInterfaceMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#variableDeclarators.
ApexcodeVisitor.prototype.visitVariableDeclarators = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#variableDeclarator.
ApexcodeVisitor.prototype.visitVariableDeclarator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#variableDeclaratorId.
ApexcodeVisitor.prototype.visitVariableDeclaratorId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#variableInitializer.
ApexcodeVisitor.prototype.visitVariableInitializer = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#arrayInitializer.
ApexcodeVisitor.prototype.visitArrayInitializer = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enumConstantName.
ApexcodeVisitor.prototype.visitEnumConstantName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#type.
ApexcodeVisitor.prototype.visitType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classOrInterfaceType.
ApexcodeVisitor.prototype.visitClassOrInterfaceType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeArguments.
ApexcodeVisitor.prototype.visitTypeArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeArgument.
ApexcodeVisitor.prototype.visitTypeArgument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#qualifiedNameList.
ApexcodeVisitor.prototype.visitQualifiedNameList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#formalParameters.
ApexcodeVisitor.prototype.visitFormalParameters = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#formalParameterList.
ApexcodeVisitor.prototype.visitFormalParameterList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#formalParameter.
ApexcodeVisitor.prototype.visitFormalParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#lastFormalParameter.
ApexcodeVisitor.prototype.visitLastFormalParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#methodBody.
ApexcodeVisitor.prototype.visitMethodBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#constructorBody.
ApexcodeVisitor.prototype.visitConstructorBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerBody.
ApexcodeVisitor.prototype.visitTriggerBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerBodyDeclaration.
ApexcodeVisitor.prototype.visitTriggerBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#qualifiedName.
ApexcodeVisitor.prototype.visitQualifiedName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#literal.
ApexcodeVisitor.prototype.visitLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerContextVariable.
ApexcodeVisitor.prototype.visitTriggerContextVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerScope.
ApexcodeVisitor.prototype.visitTriggerScope = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerEvent.
ApexcodeVisitor.prototype.visitTriggerEvent = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerEventBefore.
ApexcodeVisitor.prototype.visitTriggerEventBefore = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#triggerEventAfter.
ApexcodeVisitor.prototype.visitTriggerEventAfter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotation.
ApexcodeVisitor.prototype.visitAnnotation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationName.
ApexcodeVisitor.prototype.visitAnnotationName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#elementValuePairs.
ApexcodeVisitor.prototype.visitElementValuePairs = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#elementValuePair.
ApexcodeVisitor.prototype.visitElementValuePair = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#elementValue.
ApexcodeVisitor.prototype.visitElementValue = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#elementValueArrayInitializer.
ApexcodeVisitor.prototype.visitElementValueArrayInitializer = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationTypeDeclaration.
ApexcodeVisitor.prototype.visitAnnotationTypeDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationTypeBody.
ApexcodeVisitor.prototype.visitAnnotationTypeBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationTypeElementDeclaration.
ApexcodeVisitor.prototype.visitAnnotationTypeElementDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationTypeElementRest.
ApexcodeVisitor.prototype.visitAnnotationTypeElementRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationMethodOrConstantRest.
ApexcodeVisitor.prototype.visitAnnotationMethodOrConstantRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationMethodRest.
ApexcodeVisitor.prototype.visitAnnotationMethodRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#annotationConstantRest.
ApexcodeVisitor.prototype.visitAnnotationConstantRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#defaultValue.
ApexcodeVisitor.prototype.visitDefaultValue = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#block.
ApexcodeVisitor.prototype.visitBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#blockStatement.
ApexcodeVisitor.prototype.visitBlockStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#localVariableDeclarationStatement.
ApexcodeVisitor.prototype.visitLocalVariableDeclarationStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#localVariableDeclaration.
ApexcodeVisitor.prototype.visitLocalVariableDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#statement.
ApexcodeVisitor.prototype.visitStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#propertyBlock.
ApexcodeVisitor.prototype.visitPropertyBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#getter.
ApexcodeVisitor.prototype.visitGetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#setter.
ApexcodeVisitor.prototype.visitSetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#catchClause.
ApexcodeVisitor.prototype.visitCatchClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#catchType.
ApexcodeVisitor.prototype.visitCatchType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#finallyBlock.
ApexcodeVisitor.prototype.visitFinallyBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#resourceSpecification.
ApexcodeVisitor.prototype.visitResourceSpecification = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#resources.
ApexcodeVisitor.prototype.visitResources = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#resource.
ApexcodeVisitor.prototype.visitResource = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#forControl.
ApexcodeVisitor.prototype.visitForControl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#forInit.
ApexcodeVisitor.prototype.visitForInit = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#enhancedForControl.
ApexcodeVisitor.prototype.visitEnhancedForControl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#forUpdate.
ApexcodeVisitor.prototype.visitForUpdate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#db_shortcut_expression.
ApexcodeVisitor.prototype.visitDb_shortcut_expression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#runas_expression.
ApexcodeVisitor.prototype.visitRunas_expression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#parExpression.
ApexcodeVisitor.prototype.visitParExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#expressionList.
ApexcodeVisitor.prototype.visitExpressionList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#statementExpression.
ApexcodeVisitor.prototype.visitStatementExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#expression.
ApexcodeVisitor.prototype.visitExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#primary.
ApexcodeVisitor.prototype.visitPrimary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#creator.
ApexcodeVisitor.prototype.visitCreator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#createdName.
ApexcodeVisitor.prototype.visitCreatedName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#innerCreator.
ApexcodeVisitor.prototype.visitInnerCreator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#arrayCreatorRest.
ApexcodeVisitor.prototype.visitArrayCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#mapCreatorRest.
ApexcodeVisitor.prototype.visitMapCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#setCreatorRest.
ApexcodeVisitor.prototype.visitSetCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#classCreatorRest.
ApexcodeVisitor.prototype.visitClassCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#explicitGenericInvocation.
ApexcodeVisitor.prototype.visitExplicitGenericInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#nonWildcardTypeArguments.
ApexcodeVisitor.prototype.visitNonWildcardTypeArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#typeArgumentsOrDiamond.
ApexcodeVisitor.prototype.visitTypeArgumentsOrDiamond = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#nonWildcardTypeArgumentsOrDiamond.
ApexcodeVisitor.prototype.visitNonWildcardTypeArgumentsOrDiamond = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#superSuffix.
ApexcodeVisitor.prototype.visitSuperSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#explicitGenericInvocationSuffix.
ApexcodeVisitor.prototype.visitExplicitGenericInvocationSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ApexcodeParser#arguments.
ApexcodeVisitor.prototype.visitArguments = function(ctx) {
  return this.visitChildren(ctx);
};



exports.ApexcodeVisitor = ApexcodeVisitor;