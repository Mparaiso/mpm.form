"use strict";
var _ = require('underscore');
var DefaultMeta =require('./meta').DefaultMeta;
/**
 * @namespace [description]
 */
var form = exports;
/**
 * Provides core behaviour like field construction, validation, and data and error proxying.
 * @param {Object} fields A dict or sequence of 2-tuples of partially-constructed fields.]
 * @param {string} name If provided, all fields will have their name nameed with the value.
 * @param {Object} meta   A meta instance which is used for configuration and customization of WTForms behaviors.
 */
form.Form = function(fields,name,meta){
	name=name||"";
	meta=meta||new DefaultMeta();
	this.meta=meta;
	this.setName(name);
	this.fields={};
	var translations= this.getTranslations();
	// T0D0 fix extra_fields 
	_.each(fields,function(_field,name){
		var options={name:name,prefix:this.name,translations:translations};
		var field =meta.bindField(this,_field,options);
		this._fields[name]=field;
	},this);
};

form.Form.extend= function(params){
	params=params||{};
	var F = function(_params){
		if(_params===undefined){
			_params=params;
		}else{
			_params.fields=_params.fields||{};
			_.extend(_params.fields,params.fields);
			_.extend(_params,{name:params.name,meta:params.meta});
		}
		return new form.Form(_params.fields,_params.name,_params.meta);
	};
	F.extend=form.Form.extend;
	return F;
};

form.Form.prototype={
	get:function(name){
		return this._fields[name];
	},
	set:function(name,value){
		this._fields[name]=value.bind(this,name,this.name);
	},
	remove:function(name){
		return delete this._fields[name];
	},
	getName:function(){
		return this._name;
	},
	setName:function(value){
				if(!_.contains('-_;:/.',_.last(value))){ value+='_';}
				this._name=value;
	},
	getFields:function(){
		return this._fields;
	},
	getTranslations:function(){
		return this.meta.getTranslations(this);
	},
	/**
	 * Populates the attributes of the passed `obj` with data from the form's fields.
	 * @param  {Object} object 
	 */
	populateObject:function(object){
		_.each(this._fields,function(field,name){
			field.populateObject(object,name);
		},this);
	},
	/**
	 * Take form, object data, and keyword arg input and have the fields process them.
	 * @param  {Object} formData Used to pass data coming from the enduser, usually `request.POST` or equivalent.
	 * @param  {Object} obj 	 If `formdata` is empty or not provided, this object is checked for attributes matching form field names, which will be used for field values.
	 * @param  {Object} data     If provided, must be a dictionary of data. This is only used if  `formdata` is empty or not provided and `obj` does not contain  an attribute named the same as the field.
	 * @return {void}
	 */
	process:function(formData,obj,data){
		formData=formData||{};
		obj=obj||{};
		data=data||{};
		formData=this.meta.wrapFormData(this,formData);
		_.each(this._fields,function(field,name){
			if(_.has(obj,name)){
				field.process(formData,obj[name]);
			}else if(_.has(data,name)){
				field.process(formData,obj[name]);
			}else{
				field.process(formData);
			}
		});
	},
	/**
	 *  Validates the form by calling `validate` on each field.
	 * @param  {Ibject} extraValidator 
	 * @return {Boolean}              
	 */
	validate:function(){
		// T0D0 implement extra validator
		this._errors=undefined;
		var success=true;
		_.each(this._fields,function(field){
			if(!field.validate(this)){success=false;}
		});
		return success;
	},
	getData:function(){
		return _.object(
			_.map(this._fields,function(field,name){
				return [name,field.getData()];
			},this)
		);
	},
	getErrors:function(){
		if(! this._errors){
			this._errors = _.object(_.map(this._fields,function(field,name){
				return [name,field.getErrors()];
			},this));
		}
		return this._errors;
	},
	toString:function(){
		return "[object form.Form]";
	}
};