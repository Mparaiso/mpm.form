/*jslint eqeq:true,node:true,es5:true,white:true,plusplus:true,nomen:true,unparam:true,devel:true,regexp:true */
/*global describe,it,beforeEach */
"use strict";
var expect = require('chai').expect;
var assert = require('assert');
var form = require('../form'),
    validation = form.validation,
    fields = form.fields;

describe('form', function() {
    describe('loaders.FieldTypeLoader', function() {
        var loader = new form.loaders.FieldTypeLoader();
        it('should load forms.fields.Email ', function(done) {
            var email = loader.load('email', fields.Email, {
                validators: [validation.Required()]
            });
            assert.ok(email instanceof fields.Email);
            assert.ok(email.validate);
            assert.ok(email.setData);
            email.validate(function(err, result) {
                assert(err instanceof Error);
                expect(err.message).to.contain('email', 'required');
                done();
            });
        });
    });
});
describe('form', function() {

    describe('form with select field',function  () {
        beforeEach(function  () {
            this.countries = ['FR','EN','IT'];
            this.form = form.create('countries')
            .add('country','select',{choices:this.countries});
            this.form.bind({country:'FR'});
        }); 
        it('FR should be selected',function() {
            expect(this.form.getField('country')
                .toJSON()
                .choices.filter(function(c){return c.key=="FR" && c.attributes.selected=="selected";})[0]
                ).not.to.be.null
        })

    })
    describe('#create', function() {
        beforeEach(function() {
            this.genders = ['male', 'female', 'other'];
            this.form = form.create()
                .add('firstname', 'text', {
                    validators: [validation.Required(), validation.Length(3, 50)]
                })
                .add('lastname', 'text', {
                    validators: [validation.Required(), validation.Length(3, 50)]
                })
                .add('birthday', 'date', {
                    validators: [validation.Required()]
                })
                .add('email', 'email', {
                    validators: [validation.Required(), validation.Email()]
                })
                .add('password', 'password', {
                    validators: [validation.Required(), validation.Length(5, 50)]
                })
                .add('gender', 'radiogroup', {
                    choices: this.genders,
                    validators: [validation.Required()]
                });

            this.data = {
                firstname: "john",
                lastname: "doe",
                birthday: "1979-10-02",
                email: "mparaiso@online.fr",
                password: "password",
                gender: 'male'
            };
        });
        it('should have an  field name email', function() {
            assert(this.form.getByName('email'));
        });
        it('should validate', function(done) {
            this.form.setData(this.data);
            this.form.validate(done);
        });
        it('should validate sync', function() {
            this.form.setData(this.data);
            assert(this.form.validateSync());
            assert(!this.form.getErrors());
        });
    });
});
describe('A registration form', function() {
    beforeEach(function() {
        this.form = form.create("registration")
            .add('username', 'text', {
                validators: [validation.Required(), validation.Length(5, 50)]
            })
            .add('email', 'email', {
                validators: [validation.Email(), validation.Required(), validation.Length(7, 50)]
            })
            .add('password', 'repeated', {
                validators: [validation.Required()]
            })
            .add('agreement', 'checkbox', {
                validators: [validation.Required()],
                attributes: {
                    value: "agreed"
                }
            })
            .add('submit', 'submit');
    });
    it('should validate with correct data', function() {
        var body = {
            username: 'johnny',
            email: 'johnny@doe.com',
            password: ['bar', 'bar'],
            agreement: 'agreed'
        };
        this.form.bind(body);
        assert(this.form.validateSync(), JSON.stringify(this.form.getErrors()));
    });
    it('shouldnt validate if paswords dont match', function() {
        var body = {
            username: 'michelle',
            email: "michelle@mozilla.com",
            password: ['bar', 'baz'],
            agreement: 'agreed'
        };
        this.form.bind(body);
        var valid = this.form.validateSync();
        console.log(this.form.getErrors());
        assert(!valid);
    });
});
describe("form with repeated field ", function() {
    beforeEach(function() {
        this.form = form.create('repeat')
            .add('word', 'repeated');
    });
    it('should not validate when words mismatch', function() {
        this.form.bind({
            word: ['foo', 'bar']
        });
        var valid = this.form.validateSync();
        assert(!valid);
    });
});
/*
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
