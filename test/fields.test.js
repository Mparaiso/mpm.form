/*global describe,it*/
"use strict";
var expect=require('chai').expect;
var fields = require('../index').fields;
describe('form.fields',function(){
    describe('.RadioGroup',function(){
        var options ={
            choices:['male','female','other'],
            attributes:{required:true}
        };
        var radioGroup = new fields.RadioGroup("sex",options);
        radioGroup.setData('male');
        var html = radioGroup.toHTML();
        console.log(html);
        expect(html).to.contain('male');
    });
});