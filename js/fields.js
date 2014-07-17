/*jslint stupid:true,eqeq:true,node:true,es5:true,white:true,plusplus:true,nomen:true,unparam:true,devel:true,regexp:true */
"use strict";
var _ = require('underscore');
var util = require('util');
var utils = require('./utils');
var validation = require('mpm.validation');

/**
 * @namespace
 * @type {Object}
 */
var fields = {};

/**
 * FieldOption type
 * @typedef {Object} FieldOption
 * @property {Array} validators an array of validators
 * @property {Object} attributes a hash of html tag attributes
 * @property {Object} default default value for field
 */


/**
 * Base class for fields
 * @param {String} name field name
 * @param {FieldOption} options field options
 * @constructor
 */
fields.Base = function(name, options) {
    options = options || {};
    this.type = "base";
    this.template = _.template('<%=label%> <input <%=attributes%> />');
    this.name = name;
    this.options = _.extend({}, options);
    this.options.attributes = this.options.attributes || {};
    this.options.label = this.options.label || this.name;
    this.options.validators = options.validators ? options.validators instanceof Array ? options.validators : [options.validators] : [];
    /* set default data */
    if (this.options.
        default !== undefined) {
        this.setData(this.options.
            default);
    }
};
fields.Base.prototype.getPrefix = function() {
    return this.options.prefix || "";
};
/**
 * Render attribute string
 * @param attrs
 * @returns {String}
 */
fields.Base.prototype.renderAttributes = function(attrs) {
    var template = _.template("<% for(attr in attributes){%> <%-attr%>='<%-attributes[attr]%>' <%}%>");
    return template({
        attributes: attrs
    });
};
/**
 * Normalise attributes
 * @returns {Ojbect}
 */
fields.Base.prototype.getAttributes = function() {
    var attrs = _.extend({}, this.options.attributes);
    attrs.name = this.name;
    attrs.value = utils.returnDefined(this._data, attrs.value);
    attrs.type = utils.returnDefined(attrs.type, this.type);
    return attrs;
};
fields.Base.prototype.setAttributes=function(attributes){
    _.extend(this.options.attributes,attributes);
    return this;
};
fields.Base.prototype.setAttribute=function(name,value){
    //this.options.attributes[name]=value;
    return this;
};
fields.Base.prototype.setParent = function(parent) {
    this._parent = parent;
};
/**
 * bind request field value to field value
 * @param value
 */
fields.Base.prototype.bind=function(value){
    this._data=value;
}
/**
 *
 * @param data
 */
fields.Base.prototype.setData = function(data) {
    var from=_.identity;
    if(this.options.transform && this.options.transform.from instanceof Function){
        from=this.options.transform.from;
    }
    this.bind(from(data));
};
/**
 *
 * @returns {*}
 */
fields.Base.prototype.getData = function() {
    var to=_.identity;
    if(this.options.transform && this.options.transform.to instanceof Function){
        to=this.options.transform.to;
    }
    return to(this._data);
};
/**
 * Execute all validators on the field data.
 * @param {Function} callback
 */
fields.Base.prototype.validate = function(callback) {
    var self,chain;
    this.setError(undefined);
    self = this;
    this.options.validators = this.options.validators instanceof Array ? this.options.validators : [this.options.validators];
    chain = validation.Chain.apply(this, _.compact(this.options.validators)); //compact will remove potential undefined values
    return chain.validate(this.getData(), function(err, result) {
        if (err) {
            self.setError(err);
            err.message = [self.getName(), err.message].join(" ");
        }
        return callback(err, result);
    });
};
/**
 * Validate a field synchronously
 * will not work if one of the validators is async.
 * @returns {*|Boolean}
 */
fields.Base.prototype.validateSync = function() {
    var valid;
    this.validate(function(e, v) {
        valid = v;
    });
    return valid;
};
fields.Base.prototype.getName = function() {
    return this.name;
};

/**
 *
 * @returns {{options: *, name: *, type: *, data: (*|Array|Array|string)}}
 */
fields.Base.prototype.toJSON = function() {
    return {
        options: this.options,
        name: this.name,
        type: this.type,
        data: this.getData(),
        error: this.getError()
    };
};
/**
 *
 * @returns {string}
 */
fields.Base.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.template({
        label: this.getLabel().toHTML(),
        attributes: this.renderAttributes(this.getAttributes())
    });
};
fields.Base.prototype.getLabel = function() {
    var id, labelAttributes;
    labelAttributes = _.extend({}, this.options.labelAttributes);
    id = this.getOptions().attributes.id;
    if (id) {
        labelAttributes.
        for = this.getOptions().attributes.id;
    }
    return new fields.Label(this.options.label, {
        attributes: labelAttributes
    });
};
/**
 *
 * @returns {String}
 */
fields.Base.prototype.toString = function() {
    return util.format("[object form.widget.%s]", this.type);
};
fields.Base.prototype.getError = function() {
    return this._error;
};
fields.Base.prototype.setError = function(error) {
    this._error = error;
};
fields.Base.prototype.hasError = function() {
    return this._error instanceof Error;
};
fields.Base.prototype.getOptions = function() {
    return this.options;
};

/**
 * @constructor
 * @extends {fields.Base}
 */
fields.Text = function(name, options) {
    if (name == undefined) {
        throw "name is mandatory";
    }
    fields.Base.apply(this, [].slice.call(arguments));
    this.type = "text";
};
/**
 *
 * @type {fields.Base}
 */
fields.Text.prototype=Object.create(fields.Base.prototype);
/**
 * Email field type
 * @constructor
 * @augments {fields.Base}
 */
fields.Email = function(name, options) {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "email";
};
fields.Email.prototype=Object.create(fields.Text.prototype);
/**
 * date form type
 */
fields.Date = function(name, options) {
    fields.Base.apply(this, [].slice.call(arguments));
    this.type = "date";
};
fields.Date.prototype = new fields.Base();
fields.Date.prototype.constructor = fields.Base;
/**
 * time form type
 */
fields.Time = function(name, options) {
    fields.Base.apply(this, [].slice.call(arguments));
    this.type = "time";
};
fields.Time.prototype = new fields.Base();
fields.Time.prototype.constructor = fields.Base;
/**
 * @augments fields.Base
 * @constructor
 */
fields.Password = function() {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "password";
};
fields.Password.prototype = new fields.Base();
fields.Password.prototype.constructor = fields.Base;
/**
 * @augments fields.Base
 * @constructor
 */
fields.Hidden = function() {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.template = _.template('<input <%=attributes%> />');
    this.type = "hidden";
};
fields.Hidden.prototype = new fields.Base();
/**
 *
 * @constructor
 */
fields.Check = function() {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "checkbox";
    this.template = _.template("<input <%=attributes%> /> <%=label %>");
};
fields.Check.fromData = function(data) {
    var check = new fields.Check(data.key, {
        attributes: data.attributes
    });
    check.options.attributes.value = data.value;
    check.options.label = utils.returnDefined(data.key, data);
    return check;
};
util.inherits(fields.Check, fields.Text);
/**
 *
 * @returns {*}
 */
fields.Check.prototype.getAttributes = function() {
    return fields.Text.prototype.getAttributes.apply(this, [].slice.apply(arguments));
};
/**
 *
 * @param data
 */
fields.Check.prototype.bind = function(data) {
    this._data = data;
    if (_.isUndefined(data)) {
        delete this.options.attributes.checked;
    } else {
        this.options.attributes.checked = "checked";
    }
};
/**
 *
 * @returns {*}
 */
fields.Check.prototype.getData = function() {
    if (utils.isDefined(this.options.attributes.checked)) {
        return this._data;
    }
    return null;
};
/**
 * Render as a checkbox, data can be true or false.
 * @inheritDoc
 * @extends {fields.Check}
 */
fields.Boolean = function(name,options) {
    fields.Check.apply(this, [].slice.call(arguments));
};
util.inherits(fields.Boolean, fields.Check);
fields.Boolean.prototype.getAttributes=function(){
    var attr = fields.Check.prototype.getAttributes.apply(this,[].slice.call(arguments));
    attr.value=true;
    return attr;
};

fields.Boolean.prototype.bind = function(data) {
    if (data) {
        this._data = true;
        this.options.attributes.checked = "checked";
    } else {
        this._data = false;
        delete this.options.attributes.checked;
    }
};
fields.Boolean.prototype.getData = function() {
    return this._data;
};
/**
 * @augments {fields.Base}
 * @constructor
 */
fields.Label = function() {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "label";
    this.template = _.template('<label <%=attributes%> ><%-name%></label>');
    this.defaults = {};
};
fields.Label.prototype = Object.create(fields.Base.prototype)
fields.Label.prototype.constructor = fields.Base;
/**
 *
 * @returns {*}
 */
fields.Label.prototype.getAttributes = function() {
    return _.extend({}, this.options.attributes, this.defaults);
};
fields.Label.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    var name = utils.returnDefined(this.options.value,this.options.attributes.value,this.name, "");
    //if no name , dont return a label.
    if (name.trim()) {
        return this.template({
            attributes: this.renderAttributes(this.getAttributes()),
            name: name
        });
    }
    return "";

};
/**
 *
 * @constructor
 */
fields.Radio = function() {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "radio";
};
fields.Radio.fromData = function(data) {
    var radio;
    radio = new fields.Radio(data.key, {
        attributes: data.attributes || {}
    });
    radio.options.attributes.value = data.value;
    radio.options.label = data.key;
    return radio;
};
util.inherits(fields.Radio, fields.Text);
/**
 * @augments {fields.Text}
 * @constructor
 */
fields.Button = function() {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.options.label = "";
    this.type = "button";
};
fields.Button.prototype=Object.create(fields.Text.prototype);

/**
 *
 * @constructor
 */
fields.Submit = function() {
    fields.Button.apply(this, [].slice.apply(arguments));
    this.type = "submit";
};
fields.Submit.prototype=Object.create(fields.Button.prototype);

fields.Reset = function() {
    fields.Button.apply(this, [].slice.apply(arguments));
    this.type = "reset";
};
fields.Reset.prototype=Object.create(fields.Button.prototype);

/**
 *
 * @constructor
 */
fields.Option = function() {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "option";
    this.template = _.template("<option <%=attributes%> ><%-label%></option>\n");
};
fields.Option.prototype = new fields.Base();
fields.Option.prototype.constructor = fields.Base;
fields.Option.fromData = function(data) {
    var attr,option;
    attr = utils.returnDefined(data.attributes, {});
    option = new fields.Option(data.key, {
        attributes: attr
    });
    option.options.attributes.value = data.value;
    return option;
};
fields.Option.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.template({
        attributes: this.renderAttributes(this.getAttributes()),
        label: this.name
    });
};
/**
 *
 * @constructor
 * @augments {fields.Base}
 */
fields.Choices = function() {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "choices";
    this.setChoices(this.options.choices || []);
};
fields.Choices.prototype = Object.create(fields.Base.prototype) 
fields.Choices.prototype.constructor = fields.Base;
fields.Choices.prototype.getChoices = function() {
    return this._choices;
};
fields.Choices.prototype.setChoices = function(value) {
    this._choices = this.normaLizeChoices(value);
};
fields.Choices.prototype.normaLizeChoices = function(choices) {
    return choices.map(function(choice, i) {
        var o;
        if (_.isString(choice)) {
            o = {
                key: choice,
                value: choice,
                attributes: {}
            };
        } else {
            o = {
                key: choice.key,
                value: choice.value,
                attributes: choice.attributes || {}
            };
        }
        return o;
    });
};
fields.Choices.prototype.toJSON = function() {
    var json = fields.Base.prototype.toJSON.apply(this);
    json.choices = this.getChoices();
    json.data = this.getData();
    return json;
};
/**
 *
 * @constructor
 * @extends {fields.Choices}
 */
fields.Select = function() {
    fields.Choices.apply(this, [].slice.apply(arguments));
    this.type = "select";
    this.template = _.template('<label <%-labelAttrs%> ><%-label%></label><select <%=attributes%> >\n<% _.each(options,function(o){print(o.toHTML());}) %></select>');
};
util.inherits(fields.Select, fields.Choices);
fields.Select.prototype.getAttributes = function() {
    var attrs = fields.Choices.prototype.getAttributes.apply(this);
    delete attrs.type;
    delete attrs.value;
    return attrs;
};
fields.Select.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.template({
        label: utils.returnDefined(this.options.label, this.name),
        labelAttrs: this.renderAttributes(this.options.labelAttributes || {}),
        attributes: this.renderAttributes(this.getAttributes()),
        options: this.getChoices().map(fields.Option.fromData)
    });
};
fields.Select.prototype.bind=function(data){
    var tempData = _.isArray(data) ? data : [data];
    this._data = data;
    this._choices.forEach(function(c) {
        if (~tempData.indexOf(c.value)) {
            c.attributes.selected = "selected";
        } else {
            delete c.attributes.selected;
        }
    }, this);
}

/**
 * @constructor
 */
fields.CheckboxGroup = function() {
    fields.Choices.apply(this, [].slice.apply(arguments));
    this.type = "checkboxgroup";
};
/**
 *
 * @type {fields.Choices}
 */
fields.CheckboxGroup.prototype = new fields.Choices();
fields.CheckboxGroup.prototype.constructor = fields.Choices;
/**
 *
 * @returns {string}
 */
fields.CheckboxGroup.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.getChoices().map(function(o) {
        var check;
        check = fields.Check.fromData(o);
        check.options.label = o.key;
        return check.toHTML();
    }).join('\n');
};
/**
 *
 * @param data
 */
fields.CheckboxGroup.prototype.bind = function(data) {
    this._data = _.isArray(data) ? data : [data];
    this.getChoices().forEach(function(c) {
        if (_.contains(this._data, c.value)) {
            c.attributes.checked = "checked";
        } else {
            delete c.attributes.checked;
        }
    }, this);
};
/**
 *
 * @returns {Array}
 */
fields.CheckboxGroup.prototype.getData = function() {
    return this.getChoices().filter(function(c) {
        return c.attributes.checked;
    }).map(function(c) {
        return c.value;
    });
};
/**
 *
 * @constructor
 * @augments fields.Choices
 */
fields.RadioGroup = function(name, options) {
    fields.Choices.apply(this, [].slice.apply(arguments));
    this.type = "radio-group";
};
fields.RadioGroup.prototype = new fields.Choices();
fields.RadioGroup.prototype.constructor = fields.Choices;
/**
 *
 * @returns {string}
 */
fields.RadioGroup.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.getChoices().map(function(choice) {
        var radio = fields.Radio.fromData(choice);
        radio.name = this.name;
        radio.options.label = choice.key;
        return radio.toHTML();
    }, this).join('\n');
};
/**
 *
 * @param data
 */
fields.RadioGroup.prototype.bind = function(data) {
    this._data = _.isArray(data) ? data : [data];
    this.getChoices().forEach(function(c) {
        if (_.contains(this._data, c.value)) {
            c.attributes.checked = "checked";
            if (!this.options.attributes.multiple) {
                return false;
            }
        } else {
            delete c.attributes.checked;
        }
    }, this);
};
/**
 *
 * @returns {Array}
 */
fields.RadioGroup.prototype.getData = function() {
    return this.getChoices().filter(function(c) {
        return c.attributes.checked;
    });
};

fields.TextArea = function(name, options) {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "textarea";
    this.template = _.template('<%=label%> <textarea <%=attributes%>><%=value%></textarea>');
};
fields.TextArea.prototype = Object.create(fields.Base.prototype);
fields.TextArea.prototype.constructor = fields.Base;
fields.TextArea.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    return this.template({
        label: this.getLabel().toHTML(),
        attributes: this.renderAttributes(this.getAttributes()),
        value: this._data
    });
};

/**
 * Repeated field type
 * @extends {fields.Base}
 * @param {String} name
 * @param {Object} options
 */
fields.Repeated = function(name, options) {
    fields.Base.apply(this, [].slice.call(arguments));
    this.type = "repeated";
};
util.inherits(fields.Repeated, fields.Base);

fields.Repeated.prototype.bind=function(data){
    this._data = data instanceof Array ? data : [data];
    return this;
}

fields.Repeated.prototype.getData = function() {
    if (this._data instanceof Array) {
        return this._data[0];
    }
    return "";
};

fields.Repeated.prototype.validate = function(callback) {
    this.options.validators.push(validation.EqualTo(this._data[1]));
    fields.Base.prototype.validate.call(this, callback);
};

fields.Repeated.prototype.toHTML = function(attributes) {
    this.setAttributes(attributes);
    var a, b;
    a = new fields.Text(this.name, this.options);
    b = new fields.Text(this.name, this.options);
    b.options = _.extend({}, this.options, {
        label: 'confirm ' + this.options.label
    });
    if (b.options.attributes.id) {
        b.options.attributes.id = b.options.attributes.id + "_repeated";
    }
    if (this._data instanceof Array) {
        a.setData(this._data[0]);
        b.setData(this._data[1]);
    }
    return a.toHTML() + b.toHTML();
};

module.exports=fields;
