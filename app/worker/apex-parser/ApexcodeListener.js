// Generated from Apexcode.g4 by ANTLR 4.7
// jshint ignore: start
const TYPES_TO_IGNORE =[
    "LIST","MAP","SET","DOUBLE","STRING","LONG","DECIMAL","BOOLEAN","DATE","DATETIME","TIME","OBJECT","ID","SOBJECT","INTEGER"
];

var antlr4 = require('antlr4/index');
var ParseUtils = require('../utils/ParseUtils.js');
// This class defines a complete listener for a parse tree produced by ApexcodeParser.
function ApexcodeListener(clsOrTrigger,typeRefs,stmtList) {
	this.typeReferences = typeRefs;
	this.theClassOrTrigger = clsOrTrigger;
	this.soqlStatements = stmtList;
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}


ApexcodeListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
ApexcodeListener.prototype.constructor = ApexcodeListener;

// Enter a parse tree produced by ApexcodeParser#compilationUnit.
ApexcodeListener.prototype.enterCompilationUnit = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#compilationUnit.
ApexcodeListener.prototype.exitCompilationUnit = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#packageDeclaration.
ApexcodeListener.prototype.enterPackageDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#packageDeclaration.
ApexcodeListener.prototype.exitPackageDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#importDeclaration.
ApexcodeListener.prototype.enterImportDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#importDeclaration.
ApexcodeListener.prototype.exitImportDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeDeclaration.
ApexcodeListener.prototype.enterTypeDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeDeclaration.
ApexcodeListener.prototype.exitTypeDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerDeclaration.
ApexcodeListener.prototype.enterTriggerDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerDeclaration.
ApexcodeListener.prototype.exitTriggerDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#modifier.
ApexcodeListener.prototype.enterModifier = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#modifier.
ApexcodeListener.prototype.exitModifier = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classOrInterfaceModifier.
ApexcodeListener.prototype.enterClassOrInterfaceModifier = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classOrInterfaceModifier.
ApexcodeListener.prototype.exitClassOrInterfaceModifier = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#sharingModifier.
ApexcodeListener.prototype.enterSharingModifier = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#sharingModifier.
ApexcodeListener.prototype.exitSharingModifier = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#variableModifier.
ApexcodeListener.prototype.enterVariableModifier = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#variableModifier.
ApexcodeListener.prototype.exitVariableModifier = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classDeclaration.
ApexcodeListener.prototype.enterClassDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classDeclaration.
ApexcodeListener.prototype.exitClassDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeParameters.
ApexcodeListener.prototype.enterTypeParameters = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeParameters.
ApexcodeListener.prototype.exitTypeParameters = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeParameter.
ApexcodeListener.prototype.enterTypeParameter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeParameter.
ApexcodeListener.prototype.exitTypeParameter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeBound.
ApexcodeListener.prototype.enterTypeBound = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeBound.
ApexcodeListener.prototype.exitTypeBound = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enumDeclaration.
ApexcodeListener.prototype.enterEnumDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enumDeclaration.
ApexcodeListener.prototype.exitEnumDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enumConstants.
ApexcodeListener.prototype.enterEnumConstants = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enumConstants.
ApexcodeListener.prototype.exitEnumConstants = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enumConstant.
ApexcodeListener.prototype.enterEnumConstant = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enumConstant.
ApexcodeListener.prototype.exitEnumConstant = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enumBodyDeclarations.
ApexcodeListener.prototype.enterEnumBodyDeclarations = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enumBodyDeclarations.
ApexcodeListener.prototype.exitEnumBodyDeclarations = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#interfaceDeclaration.
ApexcodeListener.prototype.enterInterfaceDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#interfaceDeclaration.
ApexcodeListener.prototype.exitInterfaceDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeList.
ApexcodeListener.prototype.enterTypeList = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeList.
ApexcodeListener.prototype.exitTypeList = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classBody.
ApexcodeListener.prototype.enterClassBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classBody.
ApexcodeListener.prototype.exitClassBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#interfaceBody.
ApexcodeListener.prototype.enterInterfaceBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#interfaceBody.
ApexcodeListener.prototype.exitInterfaceBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classBodyDeclaration.
ApexcodeListener.prototype.enterClassBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classBodyDeclaration.
ApexcodeListener.prototype.exitClassBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#memberDeclaration.
ApexcodeListener.prototype.enterMemberDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#memberDeclaration.
ApexcodeListener.prototype.exitMemberDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#methodDeclaration.
ApexcodeListener.prototype.enterMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#methodDeclaration.
ApexcodeListener.prototype.exitMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#genericMethodDeclaration.
ApexcodeListener.prototype.enterGenericMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#genericMethodDeclaration.
ApexcodeListener.prototype.exitGenericMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#constructorDeclaration.
ApexcodeListener.prototype.enterConstructorDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#constructorDeclaration.
ApexcodeListener.prototype.exitConstructorDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#genericConstructorDeclaration.
ApexcodeListener.prototype.enterGenericConstructorDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#genericConstructorDeclaration.
ApexcodeListener.prototype.exitGenericConstructorDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#fieldDeclaration.
ApexcodeListener.prototype.enterFieldDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#fieldDeclaration.
ApexcodeListener.prototype.exitFieldDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#propertyDeclaration.
ApexcodeListener.prototype.enterPropertyDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#propertyDeclaration.
ApexcodeListener.prototype.exitPropertyDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#propertyBodyDeclaration.
ApexcodeListener.prototype.enterPropertyBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#propertyBodyDeclaration.
ApexcodeListener.prototype.exitPropertyBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#interfaceBodyDeclaration.
ApexcodeListener.prototype.enterInterfaceBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#interfaceBodyDeclaration.
ApexcodeListener.prototype.exitInterfaceBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#interfaceMemberDeclaration.
ApexcodeListener.prototype.enterInterfaceMemberDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#interfaceMemberDeclaration.
ApexcodeListener.prototype.exitInterfaceMemberDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#constDeclaration.
ApexcodeListener.prototype.enterConstDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#constDeclaration.
ApexcodeListener.prototype.exitConstDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#constantDeclarator.
ApexcodeListener.prototype.enterConstantDeclarator = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#constantDeclarator.
ApexcodeListener.prototype.exitConstantDeclarator = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#interfaceMethodDeclaration.
ApexcodeListener.prototype.enterInterfaceMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#interfaceMethodDeclaration.
ApexcodeListener.prototype.exitInterfaceMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#genericInterfaceMethodDeclaration.
ApexcodeListener.prototype.enterGenericInterfaceMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#genericInterfaceMethodDeclaration.
ApexcodeListener.prototype.exitGenericInterfaceMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#variableDeclarators.
ApexcodeListener.prototype.enterVariableDeclarators = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#variableDeclarators.
ApexcodeListener.prototype.exitVariableDeclarators = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#variableDeclarator.
ApexcodeListener.prototype.enterVariableDeclarator = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#variableDeclarator.
ApexcodeListener.prototype.exitVariableDeclarator = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#variableDeclaratorId.
ApexcodeListener.prototype.enterVariableDeclaratorId = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#variableDeclaratorId.
ApexcodeListener.prototype.exitVariableDeclaratorId = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#variableInitializer.
ApexcodeListener.prototype.enterVariableInitializer = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#variableInitializer.
ApexcodeListener.prototype.exitVariableInitializer = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#arrayInitializer.
ApexcodeListener.prototype.enterArrayInitializer = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#arrayInitializer.
ApexcodeListener.prototype.exitArrayInitializer = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enumConstantName.
ApexcodeListener.prototype.enterEnumConstantName = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enumConstantName.
ApexcodeListener.prototype.exitEnumConstantName = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#type.
ApexcodeListener.prototype.enterType = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#type.
ApexcodeListener.prototype.exitType = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classOrInterfaceType.
ApexcodeListener.prototype.enterClassOrInterfaceType = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classOrInterfaceType.
ApexcodeListener.prototype.exitClassOrInterfaceType = function(ctx) {
	
};


// Enter a parse tree produced by ApexcodeParser#typeArguments.
ApexcodeListener.prototype.enterTypeArguments = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeArguments.
ApexcodeListener.prototype.exitTypeArguments = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeArgument.
ApexcodeListener.prototype.enterTypeArgument = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeArgument.
ApexcodeListener.prototype.exitTypeArgument = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#qualifiedNameList.
ApexcodeListener.prototype.enterQualifiedNameList = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#qualifiedNameList.
ApexcodeListener.prototype.exitQualifiedNameList = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#formalParameters.
ApexcodeListener.prototype.enterFormalParameters = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#formalParameters.
ApexcodeListener.prototype.exitFormalParameters = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#formalParameterList.
ApexcodeListener.prototype.enterFormalParameterList = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#formalParameterList.
ApexcodeListener.prototype.exitFormalParameterList = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#formalParameter.
ApexcodeListener.prototype.enterFormalParameter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#formalParameter.
ApexcodeListener.prototype.exitFormalParameter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#lastFormalParameter.
ApexcodeListener.prototype.enterLastFormalParameter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#lastFormalParameter.
ApexcodeListener.prototype.exitLastFormalParameter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#methodBody.
ApexcodeListener.prototype.enterMethodBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#methodBody.
ApexcodeListener.prototype.exitMethodBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#constructorBody.
ApexcodeListener.prototype.enterConstructorBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#constructorBody.
ApexcodeListener.prototype.exitConstructorBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerBody.
ApexcodeListener.prototype.enterTriggerBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerBody.
ApexcodeListener.prototype.exitTriggerBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerBodyDeclaration.
ApexcodeListener.prototype.enterTriggerBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerBodyDeclaration.
ApexcodeListener.prototype.exitTriggerBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#qualifiedName.
ApexcodeListener.prototype.enterQualifiedName = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#qualifiedName.
ApexcodeListener.prototype.exitQualifiedName = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#literal.
ApexcodeListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#literal.
ApexcodeListener.prototype.exitLiteral = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerContextVariable.
ApexcodeListener.prototype.enterTriggerContextVariable = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerContextVariable.
ApexcodeListener.prototype.exitTriggerContextVariable = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerScope.
ApexcodeListener.prototype.enterTriggerScope = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerScope.
ApexcodeListener.prototype.exitTriggerScope = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerEvent.
ApexcodeListener.prototype.enterTriggerEvent = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerEvent.
ApexcodeListener.prototype.exitTriggerEvent = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerEventBefore.
ApexcodeListener.prototype.enterTriggerEventBefore = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerEventBefore.
ApexcodeListener.prototype.exitTriggerEventBefore = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#triggerEventAfter.
ApexcodeListener.prototype.enterTriggerEventAfter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#triggerEventAfter.
ApexcodeListener.prototype.exitTriggerEventAfter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotation.
ApexcodeListener.prototype.enterAnnotation = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotation.
ApexcodeListener.prototype.exitAnnotation = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationName.
ApexcodeListener.prototype.enterAnnotationName = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationName.
ApexcodeListener.prototype.exitAnnotationName = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#elementValuePairs.
ApexcodeListener.prototype.enterElementValuePairs = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#elementValuePairs.
ApexcodeListener.prototype.exitElementValuePairs = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#elementValuePair.
ApexcodeListener.prototype.enterElementValuePair = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#elementValuePair.
ApexcodeListener.prototype.exitElementValuePair = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#elementValue.
ApexcodeListener.prototype.enterElementValue = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#elementValue.
ApexcodeListener.prototype.exitElementValue = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#elementValueArrayInitializer.
ApexcodeListener.prototype.enterElementValueArrayInitializer = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#elementValueArrayInitializer.
ApexcodeListener.prototype.exitElementValueArrayInitializer = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationTypeDeclaration.
ApexcodeListener.prototype.enterAnnotationTypeDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationTypeDeclaration.
ApexcodeListener.prototype.exitAnnotationTypeDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationTypeBody.
ApexcodeListener.prototype.enterAnnotationTypeBody = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationTypeBody.
ApexcodeListener.prototype.exitAnnotationTypeBody = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationTypeElementDeclaration.
ApexcodeListener.prototype.enterAnnotationTypeElementDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationTypeElementDeclaration.
ApexcodeListener.prototype.exitAnnotationTypeElementDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationTypeElementRest.
ApexcodeListener.prototype.enterAnnotationTypeElementRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationTypeElementRest.
ApexcodeListener.prototype.exitAnnotationTypeElementRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationMethodOrConstantRest.
ApexcodeListener.prototype.enterAnnotationMethodOrConstantRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationMethodOrConstantRest.
ApexcodeListener.prototype.exitAnnotationMethodOrConstantRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationMethodRest.
ApexcodeListener.prototype.enterAnnotationMethodRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationMethodRest.
ApexcodeListener.prototype.exitAnnotationMethodRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#annotationConstantRest.
ApexcodeListener.prototype.enterAnnotationConstantRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#annotationConstantRest.
ApexcodeListener.prototype.exitAnnotationConstantRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#defaultValue.
ApexcodeListener.prototype.enterDefaultValue = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#defaultValue.
ApexcodeListener.prototype.exitDefaultValue = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#block.
ApexcodeListener.prototype.enterBlock = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#block.
ApexcodeListener.prototype.exitBlock = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#blockStatement.
ApexcodeListener.prototype.enterBlockStatement = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#blockStatement.
ApexcodeListener.prototype.exitBlockStatement = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#localVariableDeclarationStatement.
ApexcodeListener.prototype.enterLocalVariableDeclarationStatement = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#localVariableDeclarationStatement.
ApexcodeListener.prototype.exitLocalVariableDeclarationStatement = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#localVariableDeclaration.
ApexcodeListener.prototype.enterLocalVariableDeclaration = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#localVariableDeclaration.
ApexcodeListener.prototype.exitLocalVariableDeclaration = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#statement.
ApexcodeListener.prototype.enterStatement = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#statement.
ApexcodeListener.prototype.exitStatement = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#propertyBlock.
ApexcodeListener.prototype.enterPropertyBlock = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#propertyBlock.
ApexcodeListener.prototype.exitPropertyBlock = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#getter.
ApexcodeListener.prototype.enterGetter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#getter.
ApexcodeListener.prototype.exitGetter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#setter.
ApexcodeListener.prototype.enterSetter = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#setter.
ApexcodeListener.prototype.exitSetter = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#catchClause.
ApexcodeListener.prototype.enterCatchClause = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#catchClause.
ApexcodeListener.prototype.exitCatchClause = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#catchType.
ApexcodeListener.prototype.enterCatchType = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#catchType.
ApexcodeListener.prototype.exitCatchType = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#finallyBlock.
ApexcodeListener.prototype.enterFinallyBlock = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#finallyBlock.
ApexcodeListener.prototype.exitFinallyBlock = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#resourceSpecification.
ApexcodeListener.prototype.enterResourceSpecification = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#resourceSpecification.
ApexcodeListener.prototype.exitResourceSpecification = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#resources.
ApexcodeListener.prototype.enterResources = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#resources.
ApexcodeListener.prototype.exitResources = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#resource.
ApexcodeListener.prototype.enterResource = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#resource.
ApexcodeListener.prototype.exitResource = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#forControl.
ApexcodeListener.prototype.enterForControl = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#forControl.
ApexcodeListener.prototype.exitForControl = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#forInit.
ApexcodeListener.prototype.enterForInit = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#forInit.
ApexcodeListener.prototype.exitForInit = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#enhancedForControl.
ApexcodeListener.prototype.enterEnhancedForControl = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#enhancedForControl.
ApexcodeListener.prototype.exitEnhancedForControl = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#forUpdate.
ApexcodeListener.prototype.enterForUpdate = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#forUpdate.
ApexcodeListener.prototype.exitForUpdate = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#db_shortcut_expression.
ApexcodeListener.prototype.enterDb_shortcut_expression = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#db_shortcut_expression.
ApexcodeListener.prototype.exitDb_shortcut_expression = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#runas_expression.
ApexcodeListener.prototype.enterRunas_expression = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#runas_expression.
ApexcodeListener.prototype.exitRunas_expression = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#parExpression.
ApexcodeListener.prototype.enterParExpression = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#parExpression.
ApexcodeListener.prototype.exitParExpression = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#expressionList.
ApexcodeListener.prototype.enterExpressionList = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#expressionList.
ApexcodeListener.prototype.exitExpressionList = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#statementExpression.
ApexcodeListener.prototype.enterStatementExpression = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#statementExpression.
ApexcodeListener.prototype.exitStatementExpression = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#expression.
ApexcodeListener.prototype.enterExpression = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#expression.
ApexcodeListener.prototype.exitExpression = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#primary.
ApexcodeListener.prototype.enterPrimary = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#primary.
ApexcodeListener.prototype.exitPrimary = function(ctx) {

	ParseUtils.extractSOQLFromContext(ctx,this.soqlStatements);

};


// Enter a parse tree produced by ApexcodeParser#creator.
ApexcodeListener.prototype.enterCreator = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#creator.
ApexcodeListener.prototype.exitCreator = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#createdName.
ApexcodeListener.prototype.enterCreatedName = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#createdName.
ApexcodeListener.prototype.exitCreatedName = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#innerCreator.
ApexcodeListener.prototype.enterInnerCreator = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#innerCreator.
ApexcodeListener.prototype.exitInnerCreator = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#arrayCreatorRest.
ApexcodeListener.prototype.enterArrayCreatorRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#arrayCreatorRest.
ApexcodeListener.prototype.exitArrayCreatorRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#mapCreatorRest.
ApexcodeListener.prototype.enterMapCreatorRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#mapCreatorRest.
ApexcodeListener.prototype.exitMapCreatorRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#setCreatorRest.
ApexcodeListener.prototype.enterSetCreatorRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#setCreatorRest.
ApexcodeListener.prototype.exitSetCreatorRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#classCreatorRest.
ApexcodeListener.prototype.enterClassCreatorRest = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#classCreatorRest.
ApexcodeListener.prototype.exitClassCreatorRest = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#explicitGenericInvocation.
ApexcodeListener.prototype.enterExplicitGenericInvocation = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#explicitGenericInvocation.
ApexcodeListener.prototype.exitExplicitGenericInvocation = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#nonWildcardTypeArguments.
ApexcodeListener.prototype.enterNonWildcardTypeArguments = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#nonWildcardTypeArguments.
ApexcodeListener.prototype.exitNonWildcardTypeArguments = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#typeArgumentsOrDiamond.
ApexcodeListener.prototype.enterTypeArgumentsOrDiamond = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#typeArgumentsOrDiamond.
ApexcodeListener.prototype.exitTypeArgumentsOrDiamond = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#nonWildcardTypeArgumentsOrDiamond.
ApexcodeListener.prototype.enterNonWildcardTypeArgumentsOrDiamond = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#nonWildcardTypeArgumentsOrDiamond.
ApexcodeListener.prototype.exitNonWildcardTypeArgumentsOrDiamond = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#superSuffix.
ApexcodeListener.prototype.enterSuperSuffix = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#superSuffix.
ApexcodeListener.prototype.exitSuperSuffix = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#explicitGenericInvocationSuffix.
ApexcodeListener.prototype.enterExplicitGenericInvocationSuffix = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#explicitGenericInvocationSuffix.
ApexcodeListener.prototype.exitExplicitGenericInvocationSuffix = function(ctx) {
};


// Enter a parse tree produced by ApexcodeParser#arguments.
ApexcodeListener.prototype.enterArguments = function(ctx) {
};

// Exit a parse tree produced by ApexcodeParser#arguments.
ApexcodeListener.prototype.exitArguments = function(ctx) {
};



exports.ApexcodeListener = ApexcodeListener;