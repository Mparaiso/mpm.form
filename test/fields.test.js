/*global describe,it,beforeEach*/
"use strict";
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');
var fields = require('../index').fields;
var validation = require('mpm.validation');

describe('form.fields', function () {
    describe(".Base", function () {
        beforeEach(function(){
            this.base = new fields.Base('email');
            this.validators =[validation.Email(),validation.Regexp(/online\.fr/),validation.MinLength(15)];
        });
        it('should validate',function(done){
            this.base.getOptions().validators=this.validators;
            this.base.setData('mparaiso@online.fr');
            this.base.validate(function(err,result){
                assert(result);
                done();
            });
        });
        it('should not validate',function(done){
            var self=this;
            this.base.getOptions().validators=this.validators;
            this.base.setData('bogus@web.io');
            this.base.validate(function(err,result){
                assert(!result);
                assert(err instanceof Error);
                assert(self.base.hasError());
                console.log(err.message);
                done();
            });
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
                    required:true
                },
                label:label,
                default:"tos"
            });
        it('should be checked',function(){
            assert.equal(check.getData(),"tos");
        });
        it('should be well formed',function(){
            var html=check.toHTML();
            expect(html).to.contain('checked');
            expect(html).to.contain('tos');
            expect(html).to.contain('check');
            expect(html).to.contain('input');
        });
        it('should not be checked',function(){
            check.setData();
            assert.equal(check.getData(),undefined);
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
    describe('.TextArea',function(){
        var field=new fields.TextArea('description');
        it('should be a textarea',function(){
            assert.equal(field.type,'textarea');
        })
    });
});