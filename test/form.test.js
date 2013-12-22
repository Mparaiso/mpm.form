/*global describe,it*/
"use strict";
var form = require('../lib/form');
var underscore=require('underscore');
var assert=require('assert');
describe('form.Form',function(){
	describe(".extend",function(){
		var BasicForm=form.Form.extend();
		var _form= new BasicForm();
		it('should be a valid form',function(){
			assert.equal(_form.toString(),"[object form.Form]");
		});
	});
});