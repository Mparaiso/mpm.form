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