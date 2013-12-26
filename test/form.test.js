/*global describe,it,beforeEach */
"use strict";
require('source-map-support').install();
var expect = require('chai').expect;
var assert = require('assert');
var forms = require('../index')
    , validation = forms.validation
    , form = forms.form;
describe('form', function () {
    describe('.FormBuilder', function () {
        beforeEach(function () {
            this.genders = ['male', 'female', 'other'];
            this.form = form.createBuilder();
            this.form.add('text', 'firstname', {validators: [validation.Required(), validation.Length(3, 50)]});
            this.form.add('text', 'lastname', {validators: [validation.Required(), validation.Length(3, 50)]});
            this.form.add('password', 'password', {validators: [validation.Required(), validation.Length(5, 50)]});
            this.form.add('password', 'password_repeat', {validators: [validation.Required(), validation.Length(5, 50)]});
            this.form.add('radiogroup', 'gender', {choices: this.genders, validators: [validation.Required()]});
            this.data = {
                firstname: "john",
                lastname: "doe",
                password: "password",
                password_repeat: "password",
                gender: 'male'
            };
        });
        it('should validate', function (done) {
            this.form.setData(this.data);
            this.form.validate(function(err,result){
                assert(result);
                assert(err===undefined);
                done();
            });
        });
    });
});
/*
 describe('FORM',function(){
 var attributes = {
 value:"a value",
 required:"true",
 class:"input-small"
 };
 describe("form.fields.Base",function(){
 var base = new forms.fields.Base("base",{'attributes':attributes});
 var html = base.toHTML();
 it('should render properly',function(){
 expect(html).to.contain("value");
 });
 });
 describe("form.fields.Text",function(){
 var text= new forms.fields.Text("address",{'attributes':attributes});
 text.setData("London");
 it('should render properly',function(){
 expect(text.toHTML()).to.contain(text.getData());
 });
 });
 describe("form.fields.Select",function(){
 describe('A select fields with a simple data list',function(){
 var attrs = {
 required:true
 };
 var options = ['London','Paris','Moscow','Zurich'];
 var select = new forms.fields.Select("towns",{attributes:attrs,choices:options});
 var html = select.toHTML();
 it('should contain a select tag',function(){
 expect(html).to.contain("select");
 });
 it('should be required',function(){
 expect(html).to.contain("required");
 });
 options.forEach(function(option,i){
 it('should contain the right key : '+option,function(){
 expect(html).to.contain(option);
 });
 it('should contain the right value : '+i,function(){
 expect(html).to.contain(option);
 });
 });
 });
 describe('A select fields with a complex data list',function(){
 var options=[
 {key:"male",value:"m"},
 {key:'female',value:'f'},
 {key:'other',value:'o'}
 ];
 var select = new forms.fields.Select('sex',{choices:options,attributes:{required:'true'}});
 var html = select.toHTML();
 var json = select.toJSON();
 it('should render properly',function(){
 expect(html).to.contain('male');
 expect(html).to.contain('m');
 expect(html).to.contain('female');
 expect(html).to.contain('f');
 expect(html).to.contain('other');
 expect(html).to.contain('o');
 });
 it('should return a proper json',function(){
 expect(json.options.choices).to.have.length(3);
 });
 });
 });
 });

 describe("forms.createFormBuilder",function  () {
 describe("A form",function(){
 var form = forms.form.createFormBuilder();
 var gender_options = ['male','female','other'];
 describe("has fields",function  () {
 form.add('text','firstname')
 .add('text','lastname')
 .add('choice','gender',{choices:gender_options,attributes:{required:true}})
 .add('submit','submit',{attributes:{value:'submit'}});
 it('renders properly',function(){
 var html = form.toHTML();
 assert.equal(typeof html,'string');
 });
 });
 });
 });
 */