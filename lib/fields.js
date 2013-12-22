"use strict";

var fields=exports;
var DummyTranslations=require('./i18n').DummyTranslations;
var StopValidator=require('./validators').StopValidator;
var widgets=require('./widgets');

fields.Field=function(){
	this.errors=[];
	this.processError=[];
	this.rawData=null;
	this.validators=[];
	this.widget=null;
	this._formField=null;
	this._translations=new DummyTranslations();
	this.doNotCallInTemplates=true;
};