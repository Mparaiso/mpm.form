"use strict";
var util= require('util');
var _ = require('underscore');
var utils = require('./utils');
var validation = require('./validation');
var fields = require('./fields');
var form = exports;

/**
 *
 * @constructor
 */
form.FieldLoader = function(){};
/**
 *
 * @type {{getField: Function}}
 */
form.FieldLoader.prototype = {
    /**
     *
     * @param type
     * @param name
     * @param options
     * @returns {*}
     */
		getField:function(type,name,options){
			switch(type){
				case "checkgroup":
				case "checkboxgroup":
					return new fields.CheckboxGroup(name,options);
				case "check":
				case "checkbox":
					return new fields.Check(name,options);
				case "radio":
					return new fields.Radio(name,options);
				case "radiogroup":
					return new fields.RadioGroup(name,options);
				case "select":
					return new fields.Select(name,options);
				case "button":
					return new fields.Button(name,options);
				case "submit":
					return new fields.Submit(name,options);
				default:
					return new fields.Text(name,options);
			}
		}
};

/**
 *
 * @constructor
 */
form.FormBuilder = function(){
    this._model={};
    this.fields = [];
    this.fieldLoaders=[];
    this.name="";
    this.bound=false;
};

form.FormBuilder.prototype={
    /**
     *
     * @param fieldLoader
     */
    addFieldLoader:function(fieldLoader){
        this.fieldLoaders.push(fieldLoader);
    },
    /**
     *
     * @param type
     * @param name
     * @param options
     * @returns {*}
     */
    resolveField:function(type,name,options){
        var i=0,field;
        while(!field || i<this.fieldLoaders.length){
            field = this.fieldLoaders[i].getField(type,name,options);
            i+=1;
        }
        return field;
    },
    /**
     *
     * @param type
     * @param name
     * @param options
     * @returns {*}
     */
    add:function(type,name,options){
        if(type instanceof fields.Base){
            this.fields.push(type);
        }else{
            var _field = this.resolveField(type,name,options);
            this.fields.push(_field);
        }
        return this;
    },
    /**
     *
     * @param {Function} iterator
     * @returns {string}
     */
    toHTML:function(iterator){
        var _iterator=iterator;
        if(_.isUndefined(_iterator)){
            _iterator=function(w){return w.toHTML();};
        }
        return this.fields.map(_iterator).join("\n");
    },
    /**
     *
     * @returns {Array}
     */
    toJSON:function(){
        return this.fields.map(function(w){return w.toJSON();});
    },
    /**
     *
     * @param value
     */
    setModel:function(value){this._model=value;},
    /**
     *
     * @returns {*}
     */
    getModel:function(){return this._model;},
    /**
     *
     * @param data
     */
    setData:function(data){
        this.fields.forEach(function(field,i){
            this.fields[i].setData(data[this.fields[i].name]);
        },this);
    },
    /**
     *
     * @returns {{}}
     */
    getData:function(){
        var datas={};
        this.fields.forEach(function(w){datas[w.name]=w.getData();},{});
        return datas;
    },
    /**
     *
     * @param name
     * @returns {*}
     */
    getByName:function(name){
        return _.find(this.fields,function(field){return field.name===name;});
    }
};

/**
 *
 * @returns {form.FormBuilder}
 */
form.createFormBuilder=function(){
		var f=new form.FormBuilder();
		f.addFieldLoader(new form.FieldLoader());
		return f;
};


