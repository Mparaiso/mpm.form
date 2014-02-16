"use strict";
var util = require('util');
var _ = require('underscore');
var utils = require('./utils');
var validation = require('mpm.validation');
var fields = require('./fields');
var form = exports;

/**
 * Field loading strategies
 * @namespace
 */
form.loaders = {};
/**
 * load fields by string name,ex :"email"
 * @constructor
 */
form.loaders.FieldLoader = function () {
};
/**
 * Load field
 * @param type
 * @param name
 * @param options
 * @returns {*}
 */
form.loaders.FieldLoader.prototype.load = function (name, type, options) {
    switch (type) {
        case "text":
            return new fields.Text(name, options);
        case "email":
            return new fields.Email(name, options);
        case "date":
            return new fields.Date(name, options);
        case "time":
            return new fields.Time(name, options);
        case "textarea":
            return new fields.TextArea(name, options);
        case "password":
            return new fields.Password(name, options);
        case "hidden":
            return new fields.Hidden(name, options);
        case "checkgroup":
        case "checkboxgroup":
            return new fields.CheckboxGroup(name, options);
        case "check":
        case "checkbox":
            return new fields.Check(name, options);
        case "radio":
            return new fields.Radio(name, options);
        case "radiogroup":
            return new fields.RadioGroup(name, options);
        case "select":
            return new fields.Select(name, options);
        case "reset":
            return new fields.Reset(name, options);
        case "button":
            return new fields.Button(name, options);
        case "submit":
            return new fields.Submit(name, options);
        case "repeated":
            return new fields.Repeated(name, options);
    }
};

/**
 * load fields by actual type: ex: fields.Email
 */
form.loaders.FieldTypeLoader = function () {
};
form.loaders.FieldTypeLoader.prototype.load = function (name, type, options) {
    if (_.contains(fields, type)) {
        return new type(name, options);
    }
};


/**
 *
 * @constructor
 */
form.FormBuilder = function (name) {
    this._fields = [];
    this.fieldLoaders = [];
    this._name = name || 'form';
    this._bound = false;
};
form.FormBuilder.prototype.getName = function () {
    return this._name;
};
form.FormBuilder.prototype.getPrefix = function () {
    return this._name + "_";
};
/**
 * given a prefixed name , return name
 * @param name
 * @returns {*}
 */
form.FormBuilder.prototype.getNameWithoutPrefix = function (name) {
    return name.replace(this.getPrefix(), "");
};

/**
 *
 * @param fieldLoader
 */
form.FormBuilder.prototype.addFieldLoader = function (fieldLoader) {
    this.fieldLoaders.push(fieldLoader);
};
/**
 *
 * @param type
 * @param name
 * @param options
 * @returns {*}
 */
form.FormBuilder.prototype.resolveField = function (name, type, options) {
    var i = 0, field;
    while (!field && i < this.fieldLoaders.length) {
        field = this.fieldLoaders[i].load(name, type, options);
        i += 1;
    }
    if (field != undefined) {
        return field;
    }
};
/**
 *
 * @param type
 * @param name
 * @param options
 * @returns {*}
 */
form.FormBuilder.prototype.add = function (name, type, options) {
    var _field;
    if (name instanceof fields.Base) {
        _field = name;
    } else {
        _field = this.resolveField(name, type, options);
    }
    if (_field !== undefined) {
        _field.getOptions().attributes.id = this.getPrefix() + _field.getName();
        this.getFields().push(_field);
    }
    return this;
};
form.FormBuilder.prototype.remove = function (name) {
    var fields, field = this.getByName(name);
    if (field) {
        fields = this.getFields();
        fields.splice(fields.indexOf(field), 1);
    }
    return this;
};
/**
 *
 * @param {Function} iterator
 * @returns {string}
 */
form.FormBuilder.prototype.toHTML = function (iterator) {
    var _iterator = iterator;
    if (_.isUndefined(_iterator)) {
        _iterator = function (w) {
            return w.toHTML();
        };
    }
    return this._fields.map(_iterator).join("\n");
};
/**
 *
 * @returns {Array}
 */
form.FormBuilder.prototype.toJSON = function () {
    return this._fields.map(function (w) {
        return w.toJSON();
    });
};
/**
 *
 * @param value
 */
form.FormBuilder.prototype.setModel = function (value) {
    this._model = value;
    this.setData(this.getModel());
    return this;
};
/**
 *
 * @returns {*}
 */
form.FormBuilder.prototype.getModel = function () {
    return this._model;
};
/**
 *
 * @param data
 */
form.FormBuilder.prototype.setData = function (data) {
    this._fields.forEach(function (field, i) {
        this._fields[i].setData(data[this._fields[i].name]);
    }, this);
};
/**
 *
 * @returns {{}}
 */
form.FormBuilder.prototype.getData = function () {
    var datas = {};
    this._fields.forEach(function (w) {
        datas[this.nameFromPrefixedName(w.name)] = w.getData();
    }, this);
    return datas;
};
/**
 * Find field by name
 * @param name
 * @returns {*}
 */
form.FormBuilder.prototype.getByName = function (name) {
    return _.find(this._fields, function (field) {
        return field.name === this.getNameWithoutPrefix(name);
    }, this);
};
form.FormBuilder.prototype.find = form.FormBuilder.prototype.getByName;
form.FormBuilder.prototype.getName = function () {
    return this._name;
};
form.FormBuilder.prototype.setName = function (name) {
    this._name = name;
};
form.FormBuilder.prototype.getFields = function () {
    return this._fields;
};
/**
 *
 * @param callback
 * @returns {*}
 */
form.FormBuilder.prototype.validate = function (callback) {
    var i = 0, length = this.getFields().length, cb, self = this, res = true;
    this.setErrors(undefined);
    cb = function (error, result) {
        if (error) {
            self.addError(error);
            res = false;
        }
        i += 1;
        if (i < length) {
            return self.getFields()[i].validate(cb);
        }
        return callback(self.getErrors(), res);
    };
    return this.getFields()[i].validate(cb);

};
form.FormBuilder.prototype.addError = function (err) {
    if (!this._errors) {
        this._errors = [];
    }
    this._errors.push(err);
};
form.FormBuilder.prototype.getErrors = function () {
    return this._errors
};
form.FormBuilder.prototype.setErrors = function (errors) {
    this._errors = errors
};
form.FormBuilder.prototype.hasError = function () {
    return this._errors !== undefined;
};
/**
 *
 * @param body the body of a request
 */
form.FormBuilder.prototype.bind = function (body) {
    var model = this.getModel();
    this.getFields().forEach(function (field) {
        var name = field.getName();
        field.setData(body[name]);
        if (model[name]) {
            model[name] = field.getData();
        }
    }, this);
    this._bound = true;
    return this;
};
form.FormBuilder.prototype.isBound = function () {
    return this._bound;
};
/**
 *
 * @returns {form.FormBuilder}
 */
form.create = function (name) {
    var f = new form.FormBuilder(name);
    f.addFieldLoader(new form.loaders.FieldLoader());
    f.addFieldLoader(new form.loaders.FieldTypeLoader());
    return f;
};


