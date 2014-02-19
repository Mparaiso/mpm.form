/*global describe,it,beforeEach*/
"use strict";
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');
var form = require('../form'),
    fields = form.fields,
    validation = form.validation;

describe('form.fields', function () {
    describe(".Base", function () {
        beforeEach(function () {
            this.base = new fields.Base('email');
            this.validators = [validation.Email(), validation.Regexp(/online\.fr/), validation.MinLength(15)];
        });
        it('should validate', function (done) {
            this.base.getOptions().validators = this.validators;
            this.base.setData('mparaiso@online.fr');
            this.base.validate(function (err, result) {
                assert(result);
                done();
            });
        });
        it('should not validate', function (done) {
            var self = this;
            this.base.getOptions().validators = this.validators;
            this.base.setData('bogus@web.io');
            this.base.validate(function (err, result) {
                assert(!result);
                assert(err instanceof Error);
                assert(self.base.hasError());
                done();
            });
        });

    });
    describe('.Text', function () {
        var text = new fields.Text('username',
            {validators: validation.Required(),
                attributes: {class: "form-control", required: true}}
        );
        it('should be well formed', function () {
            expect(text.toHTML()).to.contain('form-control');
        });
        it('should validate',function(done){
            text.setData('john_doe');
            text.validate(done);
        });
    });
    describe('.Date', function () {
        var birthday = "1979-10-02";
        var text = new fields.Date("birthday", {
            validators: [validation.Required()],
            attributes: {
                required: true
            }
        });
        text.setData(birthday);
        it('data should be ' + birthday, function () {
            assert.equal(text.getData(), birthday);
        });
        it('should be well formed', function () {
            expect(text.toHTML()).to.contain('required');
            expect(text.toHTML()).to.contain('date');
        });
        it('should validate', function (done) {
            text.validate(done);
        });
    });
    describe('.Time', function () {
        var lunch = "12:00";
        var text = new fields.Time("lunch", {
            attributes: {
                required: true
            }
        });
        text.setData(lunch);
        it('data should be ' + lunch, function () {
            assert.equal(text.getData(), lunch);
        });
        it('should be well formed', function () {
            expect(text.toHTML()).to.contain('required');
            expect(text.toHTML()).to.contain('time');
        });
    });
    describe('.Hidden', function () {
        var csrf = "334svs4F34fdFDdfdf34";
        var hidden = new fields.Hidden("csrf", {
            attributes: {
                required: true
            },
            default: csrf
        });
        it('data should be ' + csrf, function () {
            assert.equal(hidden.getData(), csrf);
        });
        it('should be well formed', function () {
            expect(hidden.toHTML()).to.contain('hidden');
            expect(hidden.toHTML()).to.contain(csrf);
        });
    });
    describe('.Check', function () {
        var label = "I agree with the terms of use";
        var check = new fields.Check("tos", {
            attributes: {
                required: true
            },
            label: label,
            default: "tos"
        });
        it('should be checked', function () {
            assert.equal(check.getData(), "tos");
        });
        it('should be well formed', function () {
            var html = check.toHTML();
            expect(html).to.contain('checked');
            expect(html).to.contain('tos');
            expect(html).to.contain('check');
            expect(html).to.contain('input');
        });
        it('should not be checked', function () {
            check.setData();
            assert.equal(check.getData(), undefined);
        });
    });
    describe('.RadioGroup', function () {
        var options = {
            choices: ['male', 'female', 'other'],
            attributes: {
                required: true
            }
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
    describe('.TextArea', function () {
        var field = new fields.TextArea('description');
        it('should be a textarea', function () {
            assert.equal(field.type, 'textarea');
        });
        it('should render properly', function () {
            field.setData('foo');
            expect(field.toHTML()).to.contain('foo');
            expect(field.toHTML()).to.contain('textarea');
            expect(field.toHTML()).to.contain('description');
        });
    }); 
    describe('.Repeated', function () {
        var repeated = new fields.Repeated('password', {attributes: {id: "repeated"}});
        it('should be a repeated field', function () {
            assert.equal(repeated.type, 'repeated');
        });
        it('should render properly', function () {
            repeated.setData(['mypass', "mypass"]);
            expect(repeated.toHTML()).to.contain('password');
            expect(repeated.toHTML()).to.contain('mypass');
        });
        it('should validate', function (done) {
            repeated.setData(['mypass', "mypass"]);
            repeated.validate(done);
        });
        it('shouldnt validate', function (done) {
            repeated.setData(['mypass', "mypass1"]);
            repeated.validate(function (err) {
                assert(err);
                done();
            });
        });
        it('shouldnt validate sync when passwords dont match',function(){
            repeated.setData(['pass','pass1']);
            assert(!repeated.validateSync());
        });
        it('should get the right data', function () {
            repeated.setData(['mypass', "mypass"]);
            assert.equal(repeated.getData(), "mypass");
        });
    });
});
