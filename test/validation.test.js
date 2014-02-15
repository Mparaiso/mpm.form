/*global describe,it*/
"use strict";
var assert = require('assert');
var validation = require('../form').validation;
describe('validation.MinLength', function () {
    var min = validation.MinLength(5);
    it('should validate async', function (done) {
        min.validate("another long string", function (err, res) {
            assert.ok(res);
            assert.equal(err, undefined);
            done();
        });
    });
    it('should validate sync', function () {
        assert(min.validateSync("a long string"), true);
    });
});
describe('validation.MaxLength', function () {
    var max = validation.MaxLength(10);
    it('should validate sync', function () {
        assert(max.validateSync("short"), true);
    });
    it('should not validate sync', function () {
        assert(!max.validateSync("too long string"));
    });
});
describe('validation.Length', function () {
    var length = validation.Length(5, 10);
    it('should validate async', function (done) {
        length.validate("temple", function (err, res) {
            assert(res);
            done();
        });
    });
    it('should validate sync', function () {
        assert(length.validateSync('brother'));
    });
    it('should not validate async', function (done) {
        debugger;
        length.validate('pen',function(err,res){
            assert.equal(res,false);
            done();
        });
    });
});
describe('validation.EqualTo',function(){
    var equalTo = validation.EqualTo("foo");
    it('should validate async',function(done){
        equalTo.validate("foo",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        equalTo.validate("bar",function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Required',function(){
    var required = validation.Required();
    it('should validate async',function(done){
        required.validate("foo",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        var bar;
        required.validate(bar,function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Min',function(){
    var validator = validation.Min(3);
    it('should validate async',function(done){
        validator.validate(4,function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate(1,function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Max',function(){
    var validator = validation.Max(10);
    it('should validate async',function(done){
        validator.validate(4,function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate(15,function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Range',function(){
    var validator = validation.Range(5,8);
    it('should validate async',function(done){
        validator.validate(5,function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate(10,function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Regexp',function(){
    var validator = validation.Regexp(/\w+\-\d+/);
    it('should validate async',function(done){
        validator.validate("foo-50",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate("bar-",function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Email',function(){
    var validator = validation.Email(/\w+\-\d+/);
    it('should validate async',function(done){
        validator.validate("mparaiso@online.fr",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate("mparaiso@online",function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Any',function(){
    var validator = validation.Any(['foo','bar']);
    it('should validate async',function(done){
        validator.validate("foo",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate("baz",function(err,res){
            assert(!res);
            done();
        });
    });
});
describe('validation.Node',function(){
    var validator = validation.None(['foo','bar']);
    it('should validate async',function(done){
        validator.validate("baz",function(err,res){
            assert(res);
            done();
        });
    });
    it('should not validate async',function(done){
        validator.validate("bar",function(err,res){
            assert(!res);
            done();
        });
    });
});