/**
 * mpm.validation
 * @copyright 2011 mparaiso <mparaiso@online.fr>
 * @license LGPL
 */
"use strict";
var validation = exports;
var _=require('underscore');
var util=require('util');
/**
 *
 * @constructor
 */
validation.ValidatorError = function(message){
    Error.apply(this,[].slice.call(arguments));
    this.message=message;
};
validation.ValidatorError.prototype=new Error();

/**
 * @namespace
 */
validation.validators={};
/**
 *
 * @constructor
 */
validation.validators.Base=function(){
};
validation.validators.Base.prototype={
    validate:function(value,callback){
        return callback(undefined,true);
    },
    validateSync:function(value){
        var result=true,self=this;
        this.validate(value,function(err,res){self.setError(err);result = res;});
        return result;
    },
    setMessage:function(value){this._message=value;},
    getMessage:function(){return this._message;},
    setError:function(value){this._error=value;},
    getError:function(){return this._error;}
};
/**
 *
 * @param min
 * @constructor
 */
validation.validators.Min=function(min){
    this._min=min;
};
validation.validators.Min.prototype=new validation.validators.Base();
validation.validators.Min.prototype.getMessage=function(){
    return util.format("should be at least %s",this._min);
};
validation.validators.Min.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(value<this._min){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @param max
 * @constructor
 */
validation.validators.Max=function(max){
    this._max=max;
};
validation.validators.Max.prototype=new validation.validators.Base();
validation.validators.Max.prototype.getMessage=function(){
    return util.format("should be at most %s",this._max);
};
validation.validators.Max.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(value>this._max){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @param min
 * @constructor
 */
validation.validators.MinLength=function(min){
    this._min=min;
};
validation.validators.MinLength.prototype=new validation.validators.Base();
validation.validators.MinLength.prototype.getMessage=function(){
    return util.format("should be at least %s character long",this._min);
};
validation.validators.MinLength.prototype.validate=function(value,callback){
    this.setError(undefined);
    if(value.length<this._min){
        this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),this.getError()?false:true);
};
/**
 *
 * @param {Number} max
 * @constructor
 */
validation.validators.MaxLength=function(max){
    this._max=max;
};
validation.validators.MaxLength.prototype=new validation.validators.Base();
validation.validators.MaxLength.prototype.getMessage=function(){
    return util.format("should be at most %s character long",this._max);
};
validation.validators.MaxLength.prototype.validate=function(value,callback){
    var valid=true;
    this.setError(undefined);
    if(value.length>this._max){
        this.setError(new validation.ValidatorError(this.getMessage()));
        valid=false;
    }
    return callback(this.getError(),valid);
};
/**
 *
 * @param equalTo
 * @constructor
 */
validation.validators.EqualTo=function(equalTo){
    this._equalTo=equalTo;
};
validation.validators.EqualTo.prototype=new validation.validators.Base();
validation.validators.EqualTo.prototype.getMessage=function(){
    return util.format("should be equal to %s",this._equalTo);
};
validation.validators.EqualTo.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(this._equalTo!==value){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @constructor
 */
validation.validators.Required=function(){};
validation.validators.Required.prototype=new validation.validators.Base();
validation.validators.Required.prototype.getMessage=function(){
    return util.format("is required");
};
validation.validators.Required.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(value===null || value===undefined){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @param regexp
 * @constructor
 */
validation.validators.Regexp=function(regexp){
    this._regexp=regexp;
};
validation.validators.Regexp.prototype=new validation.validators.Base();
validation.validators.Regexp.prototype.getMessage=function(){
    return util.format("should match %s",this._regexp);
};
validation.validators.Regexp.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(!value.match(this._regexp)){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @constructor
 */
validation.validators.Email=function(){
    validation.validators.Regexp.call(this,/^.+@[^.].*\.[a-z]{2,10}$/);
};
validation.validators.Email.prototype=new validation.validators.Regexp();
validation.validators.Email.prototype.getMessage=function(){
    return util.format("should be a valid email");
};
/**
 *
 * @param values
 * @constructor
 */
validation.validators.Any=function(values){this._values=values;};
validation.validators.Any.prototype=new validation.validators.Base();
validation.validators.Any.prototype.getMessage=function(){
    return util.format("should be one of: "+this._values.join(','));
};
validation.validators.Any.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(!this._values.some(function(v){return v===value;})){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @param values
 * @constructor
 */
validation.validators.None=function(values){this._values=values;};
validation.validators.None.prototype=new validation.validators.Base();
validation.validators.None.prototype.getMessage=function(){
    return util.format("should not be one of: "+this._values.join(','));
};
validation.validators.None.prototype.validate=function(value,callback){
    var res=true;
    this.setError(undefined);
    if(this._values.some(function(v){return v===value;})){
        res=false;this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),res);
};
/**
 *
 * @constructor
 */
validation.validators.ChainValidator=function(){
    this._validators = [].slice.apply(arguments);
};
validation.validators.ChainValidator.prototype=new validation.validators.Base();
validation.validators.ChainValidator.prototype.getValidators=function(){
   return this._validators;
};
validation.validators.ChainValidator.prototype.validate=function(value,callback){
    var i = 0,self=this;
    var cb = function cb(err,res){
        self.setError(err);
        i+=1;
        if(i < self._validators.length && res===true ){
            return self._validators[i].validate(value,cb);
        }
        return callback(err,res);
    };
    this.setError(undefined);
    return this._validators[i].validate(value,cb);
};
/**
 *
 * @param min
 * @param max
 * @constructor
 */
validation.validators.Length=function(min,max){
    this._chainValidator = new validation.validators.ChainValidator(
        new validation.validators.MinLength(min),
        new validation.validators.MaxLength(max)
    );
};
validation.validators.Length.prototype=new validation.validators.Base();
validation.validators.Length.prototype.validate=function(value,callback){
    return this._chainValidator.validate(value,callback);
};
/**
 *
 * @param min
 * @param max
 * @constructor
 */
validation.validators.Range=function(min,max){
    this._chainValidator= new validation.validators.ChainValidator(
        new validation.validators.Min(min),
        new validation.validators.Max(max)
    );
};
validation.validators.Range.prototype=new validation.validators.Base();
validation.validators.Range.prototype.validate=function(value,callback){
    return this._chainValidator.validate(value,callback);
};
/**
 *
 * @param min
 * @returns {validation.validators.Min}
 * @constructor
 */
validation.MinLength=function(min){
    return new validation.validators.MinLength(min);
};
validation.MaxLength=function(max){
    return new validation.validators.MaxLength(max);
};
validation.Length=function(min,max){
    return new validation.validators.Length(min,max);
};
validation.EqualTo=function(equalTo){
    return new validation.validators.EqualTo(equalTo);
};
validation.Required=function(){
    return new validation.validators.Required();
};
validation.Min=function(min){
    return new validation.validators.Min(min);
};
validation.Max=function(max){
    return new validation.validators.Max(max);
};
validation.Range=function(min,max){
    return new validation.validators.Range(min,max);
};
validation.Regexp=function(regexp){
    return new validation.validators.Regexp(regexp);
};
validation.Email=function(){
    return new validation.validators.Email();
};
validation.Any=function(values){
    return new validation.validators.Any(values);
};
validation.None=function(values){
    return new validation.validators.None(values);
};