/*global describe,it*/
"use strict";
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');
var fields = require('../index').fields;
var sys = require('sys');
describe('form.fields', function () {
    describe(".Base", function () {
        var firstname = "john";
        var base = new fields.Base('firstname');
        base.setData(firstname);
        it('data should be ' + firstname, function () {
            assert.equal(base.getData(), firstname);
        });
        it('should be well formed',function(){
            expect(base.toHTML()).to.contain('input');
        });
    });
    describe('.Text',function(){
        var lastname="Doe";
        var text=new fields.Text("lastname",{attributes:{required:true}});
        text.setData(lastname);
        it('data should be '+lastname,function(){
            assert.equal(text.getData(),lastname);
        });
        it('should be well formed',function(){
            expect(text.toHTML()).to.contain('required');
            expect(text.toHTML()).to.contain('text');
        });
    });
    describe('.Hidden',function(){
        var csrf="334svs4F34fdFDdfdf34";
        var hidden=new fields.Hidden("csrf",{attributes:{required:true},default:csrf});
        it('data should be '+csrf,function(){
            assert.equal(hidden.getData(),csrf);
        });
        it('should be well formed',function(){
            expect(hidden.toHTML()).to.contain('hidden');
            expect(hidden.toHTML()).to.contain(csrf);
        });
    });
    describe('.Check',function(){
        var label="I agree with the terms of use";
        var check=new fields.Check("tos",{
                attributes:{
                    required:true,
                    checked:"checked",
                    value:"tos"
                },
                label:label
            });

    });
    describe('.RadioGroup', function () {
        var options = {
            choices: ['male', 'female', 'other'],
            attributes: {required: true}
        };
        var radioGroup = new fields.RadioGroup("gender", options);
        radioGroup.setData('male');
        var html = radioGroup.toHTML();
        it('should be well formed', function () {
            expect(html).to.contain('male');
            expect(html).to.contain('checked');
        });
        it('male chould be checked', function () {
            expect(radioGroup.getChoices()[0].attributes.checked).to.equal('checked');
        });
    });
});