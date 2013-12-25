/*global describe,it*/
"use strict";
var assert=require('assert');
var validation=require('../index').validation;
describe('validation.Min',function(){
    var min = validation.Min(5);
    it('should validate',function(){
        assert(min.validateSync("a long string"),true);
    });
});