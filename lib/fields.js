"use strict";
var _ = require('underscore');
var util = require('util');
var utils = require('./utils');
var fields = exports;
/**
 *
 * @param name
 * @param options
 * @constructor
 */
fields.Base = function (name, options) {
    this.type = "base";
    this.template = _.template('<%=label%> <input <%=attributes%> />');
    this.name = name;
    this.options = _.extend({}, options);
    this.options.attributes = this.options.attributes || {};
    this.options.label = this.options.label || this.name;
    /* set default data */
    if(this.options.default!==undefined){this.setData(this.options.default);}
};
fields.Base.prototype = {
    /**
     *
     * @param attrs
     * @returns {*}
     */
    renderAttributes: function (attrs) {
        var template = _.template("<% for(attr in attributes){%> <%-attr%>='<%-attributes[attr]%>' <%}%>");
        return template({attributes: attrs});
    },
    /**
     *
     * @returns {*}
     */
    getAttributes: function () {
        var attrs = _.extend({}, this.options.attributes);
        attrs.name = this.name;
        attrs.value = utils.returnDefined(this._data, attrs.value, "");
        attrs.type = utils.returnDefined(this.type, attrs.type);
        return attrs;
    },
    /**
     *
     * @param data
     */
    setData: function (data) {
        this._data = data;
    },
    /**
     *
     * @returns {*}
     */
    getData: function () {
        return this._data;
    },
    /**
     *
     */
    validate: function () {
    },
    /**
     *
     */
    processData: function () {
    },
    /**
     *
     * @returns {{options: *, name: *, type: *, data: (*|Array|Array|string)}}
     */
    toJSON: function () {
        return {
            options: this.options,
            name: this.name,
            type: this.type,
            data: this.getData()
        };
    },
    /**
     *
     * @returns {*}
     */
    toHTML: function () {
        return this.template({
            label: new fields.Label(this.options.label, this.options.labelAttributes).toHTML(), attributes: this.renderAttributes(this.getAttributes())
        });
    },
    /**
     *
     * @returns {*}
     */
    toString: function () {
        return util.format("[object form.widget.%s]", this.type);
    }
};
/**
 *
 * @constructor
 * @augments fields.Base
 */
fields.Text = function () {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "text";
};
/**
 *
 * @type {fields.Base}
 */
fields.Text.prototype = new fields.Base();
fields.Text.prototype.constructor = fields.Base;
/**
 * @augments fields.Base
 * @constructor
 */
fields.Hidden=function(){
    fields.Base.apply(this,[].slice.apply(arguments));
    this.template = _.template('<input <%=attributes%> />');
    this.type="hidden";
};
fields.Hidden.prototype=new fields.Base();
/**
 *
 * @constructor
 */
fields.Check = function () {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "checkbox";
    this.template = _.template("<input <%=attributes%> /> <%=label %>");
};
fields.Check.fromData = function (data) {
    var check = new fields.Check(data.key, {attributes: data.attributes});
    check.options.attributes.value = data.value;
    check.options.label = utils.returnDefined(data.key, data);
    return check;
};
fields.Check.prototype = new fields.Text();
fields.Check.prototype.constructor = fields.Text;
/**
 *
 * @returns {*}
 */
fields.Check.prototype.getAttributes = function () {
    return fields.Text.prototype.getAttributes.apply(this, [].slice.apply(arguments));
};
/**
 *
 * @param data
 */
fields.Check.prototype.setData = function (data) {
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
fields.Check.prototype.getData = function () {
    if (utils.isDefined(this.options.attributes.checked)) {
        return this._data;
    }
    return null;
};
/**
 *
 * @constructor
 */
fields.Label = function () {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "label";
    this.template = _.template('<label <%=attributes%> ><%-name%></label>');
    this.defaults = {};
};
fields.Label.prototype = new fields.Base();
fields.Label.prototype.constructor = fields.Base;
/**
 *
 * @returns {*}
 */
fields.Label.prototype.getAttributes = function () {
    return _.extend({}, this.options.attributes, this.defaults);
};
fields.Label.prototype.toHTML = function () {
    return this.template({
        attributes: this.renderAttributes(this.getAttributes()), name: utils.returnDefined(this.options.value, this.name)
    });
};
/**
 *
 * @constructor
 */
fields.Radio = function () {
    fields.Text.apply(this, [].slice.apply(arguments));
    this.type = "radio";
};
fields.Radio.fromData = function (data) {
    var radio;
    radio = new fields.Radio(data.key, {attributes: data.attributes||{}});
    radio.options.attributes.value = data.value;
    radio.options.label = data.key;
    return radio;
};
fields.Radio.prototype = new fields.Text();
fields.Radio.prototype.constructor = fields.Text;
/**
 *
 * @constructor
 */
fields.Button = function () {
    fields.Text.apply(this, [].slice.apply(this, [].slice.apply(arguments)));
    this.type = "button";

};
fields.Button.prototype = new fields.Text();
fields.Button.prototype.constructor = fields.Text;
/**
 *
 * @constructor
 */
fields.Submit = function () {
    fields.Button.apply(this, [].slice.apply(this, [].slice.apply(arguments)));
    this.type = "submit";
};
fields.Submit.prototype = new fields.Button();
fields.Submit.prototype.constructor = fields.Button;
/**
 *
 * @constructor
 */
fields.Option = function () {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "option";
    this.template = _.template("<option <%=attributes%> ><%-label%></option>\n");
};
fields.Option.prototype = new fields.Base();
fields.Option.prototype.constructor = fields.Base;
fields.Option.fromData = function (data) {
    var option;
    var attr = utils.returnDefined(data.attributes, {});
    option = new fields.Option(data.key, {attributes: attr});
    option.options.attributes.value = data.value;
    return option;
};
fields.Option.prototype.toHTML = function () {
    return this.template({attributes: this.renderAttributes(this.getAttributes()), label: this.name});
};
/**
 *
 * @constructor
 * @augments fields.Base
 */
fields.Choices = function () {
    fields.Base.apply(this, [].slice.apply(arguments));
    this.type = "choices";
    this.setChoices(this.options.choices || []);
};
fields.Choices.prototype = new fields.Base();
fields.Choices.prototype.constructor = fields.Base;
fields.Choices.prototype.getChoices = function () {
    return this._choices;
};
fields.Choices.prototype.setChoices = function (value) {
    this._choices = this.normaLizeChoices(value);
};
fields.Choices.prototype.normaLizeChoices = function (choices) {
    return choices.map(function (choice, i) {
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
fields.Choices.prototype.toJSON = function () {
    var json = fields.Base.prototype.toJSON.apply(this);
    json.choices = this.getChoices();
    json.data = this.getData();
    return json;
};
/**
 *
 * @constructor
 */
fields.Select = function () {
    fields.Choices.apply(this, [].slice.apply(arguments));
    this.type = "select";
    this.template = _.template('<label <%-labelAttrs%> ><%-label%></label><select <%=attributes%> >\n<% _.each(options,function(o){print(o.toHTML());}) %></select>');
};
fields.Select.prototype = new fields.Choices();
fields.Select.prototype.constructor = fields.Choices;
fields.Select.prototype.getAttributes = function () {
    var attrs = fields.Choices.prototype.getAttributes.apply(this);
    delete attrs.type;
    delete attrs.value;
    return attrs;
};
fields.Select.prototype.toHTML = function () {
    return this.template({
        label: utils.returnDefined(this.options.label, this.name),
        labelAttrs: this.renderAttributes(this.options.labelAttributes || {}),
        attributes: this.renderAttributes(this.getAttributes()), options: this.getChoices().map(fields.Option.fromData)
    });
};
fields.Select.prototype.setData = function (data) {
    this._data = _.isArray(data) ? data : [data];
    this._choices.forEach(function (c) {
        if(_.has(this._data, c.value)){
            c.attributes.selected = "selected";
        } else {
            delete c.attributes.selected;
        }
    }, this);
};
fields.Select.prototype.getData = function () {
    return this.getChoices().filter(function (c) {
        return c.attributes.selected;
    }).map(function (c) {
            return c.value;
        });
};
/**
 * @constructor
 */
fields.CheckboxGroup = function () {
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
fields.CheckboxGroup.prototype.toHTML = function () {
    return this.getChoices().map(function (o) {
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
fields.CheckboxGroup.prototype.setData = function (data) {
    this._data = _.isArray(data) ? data : [data];
    this.getChoices().forEach(function (c) {
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
fields.CheckboxGroup.prototype.getData = function () {
    return this.getChoices().filter(function (c) {
        return c.attributes.checked;
    }).map(function (c) {
            return c.value;
    });
};
/**
 *
 * @constructor
 * @augments fields.Choices
 */
fields.RadioGroup = function (name,options) {
    fields.Choices.apply(this, [].slice.apply(arguments));
    this.type = "radio-group";
};
fields.RadioGroup.prototype = new fields.Choices();
fields.RadioGroup.prototype.constructor = fields.Choices;
/**
 *
 * @returns {string}
 */
fields.RadioGroup.prototype.toHTML = function () {
    return this.getChoices().map(function (choice) {
        var radio = fields.Radio.fromData(choice);
        radio.name=this.name;
        radio.options.label = choice.key;
        return radio.toHTML();
    },this).join('\n');
};
/**
 *
 * @param data
 */
fields.RadioGroup.prototype.setData = function (data) {
    this._data = _.isArray(data)?data:[data];
    this.getChoices().forEach(function (c) {
        if(_.contains(this._data, c.value)){
            c.attributes.checked = "checked";
            if(!this.options.attributes.multiple){return false;}
        } else {
            delete c.attributes.checked;
        }
    }, this);
};
/**
 *
 * @returns {Array}
 */
fields.RadioGroup.prototype.getData = function () {
    return this.getChoices().filter(function (c) {
        return c.attributes.checked;
    });
};
