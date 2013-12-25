"use strict";
var validation = exports;
var _=require('underscore');
var util=require('util');
/**
 *
 * @constructor
 */
validation.ValidatorError = function(){
    Error.prototype.apply(this,[].slice.call(arguments));
    this.type=validation.ValidatorError;
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
    validate:function(callback){
        return callback(undefined,true);
    },
    validateSync:function(){
        var result,self=this;
        this.validate(function(err,res){self.setError(err);result = res;});
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
validation.validators.MinLength=function(min){
    this._min=min;
};
validation.validators.MinLength.prototype=new validation.validators.Base();
validation.validators.MinLength.prototype.getMessage=function(){
    return util.format("should be at least %s character long",this.min);
};
validation.validators.MinLength.prototype.validate=function(value,callback){
    this.setError(undefined);
    if(value.length<this.min){
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
    this.setError(undefined);
    if(value.length>this._max){
        this.setError(new validation.ValidatorError(this.getMessage()));
    }
    return callback(this.getError(),this.getError()?false:true);
};
/**
 *
 * @constructor
 */
validation.validators.ChainValidator=function(){
    this._validators = [].slice.apply(arguments);
};
validation.validators.ChainValidator.getValidators=function(){
   return this._validators;
};
validation.validators.ChainValidator.validate=function(value,callback){
    var i = 0,self=this;
    var cb = function cb(err,res){
        if(i<self._validators.length || res===false ){
            i=+1;
            return self._validators[i].validate(value,cb);
        }
        return callback(err,res);
    };
    this._validators[i].validate(value,cb);
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
 * @returns {validation.validators.Min}
 * @constructor
 */
validation.MixLength=function(min){
    return new validation.validators.MinLength(min);
};
validation.MaxLength=function(max){
    return new validation.validators.MaxLength(max);
};
validation.Length=function(min,max){
    return new validation.validators.Length(min,max);
};