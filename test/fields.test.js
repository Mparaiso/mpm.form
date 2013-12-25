/*global describe,it*/
"use strict";
var chai=require('chai');
var expect=chai.expect;
var fields = require('../index').fields;
var sys=require('sys');
describe('form.fields',function(){
    describe('.RadioGroup',function(){
        var options ={
            choices:['male','female','other'],
            attributes:{required:true}
        };
        var radioGroup = new fields.RadioGroup("gender",options);
        radioGroup.setData('male');
        var html = radioGroup.toHTML();
        expect(html).to.contain('male');
        expect(html).to.contain('checked');
    });
});