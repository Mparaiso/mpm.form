/**
 * @namespace
 */
var utils = exports;
var _ =require('underscore');
/**
 * return true if argument is defined
 */
utils.isDefined = function(value){return !_.isUndefined(value)};
/**
 * return the defined argument
 */
utils.returnDefined =function(values){
    return _.find(arguments,function(value){
        return utils.isDefined(value)
    });
};
