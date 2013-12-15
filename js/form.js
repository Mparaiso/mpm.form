/// <reference path="node.d.ts"/>
var util = require('util');
var _ = require('underscore');

var widget = require("./widget");

var WidgetLoader = (function () {
    function WidgetLoader() {
    }
    WidgetLoader.prototype.getWidget = function (type, name, options) {
        switch (type) {
            case "checkboxgroup":
                return new widget.CheckboxGroup(name, options);
            case "radiogroup":
                return new widget.RadioGroup(name, options);
            case "select":
                return new widget.Select(name, options);
            case "button":
                return new widget.Button(name, options);
            case "submit":
                return new widget.Submit(name, options);
            default:
                return new widget.Text(name, options);
        }
    };
    return WidgetLoader;
})();
exports.WidgetLoader = WidgetLoader;
var FormBuilder = (function () {
    function FormBuilder() {
        this.widgets = [];
        this.widgetLoaders = [];
        this.bound = false;
    }
    FormBuilder.prototype.addWidgetLoader = function (widgetLoader) {
        this.widgetLoaders.push(widgetLoader);
    };
    FormBuilder.prototype.resolveWidget = function (type, name, options) {
        var i = 0, widget;
        while (!widget || i < this.widgetLoaders.length) {
            widget = this.widgetLoaders[i].getWidget(type, name, options);
            i += 1;
        }
        return widget;
    };

    FormBuilder.prototype.add = function (type, name, options) {
        if (type instanceof widget.Base) {
            this.widgets.push(type);
        } else {
            var _widget = this.resolveWidget(type, name, options);
            this.widgets.push(_widget);
        }
        return this;
    };
    FormBuilder.prototype.toHTML = function (iterator) {
        if (_.isUndefined(iterator)) {
            iterator = function (w) {
                return w.toHTML();
            };
        }
        return this.widgets.map(iterator).join("\n");
    };
    FormBuilder.prototype.toJSON = function () {
        return this.widgets.map(function (w) {
            return w.toJSON();
        });
    };
    FormBuilder.prototype.setModel = function (value) {
        this._model = value;
    };
    FormBuilder.prototype.getModel = function () {
        return this._model;
    };

    /**
    * @chainable
    * @param {Object} data
    */
    FormBuilder.prototype.setData = function (data) {
        var widget, key;
        for (key in data) {
            widget = this.getByName(key);
            if (widget)
                widget.setData(data[key]);
            if (this._model)
                this._model[key] = data[key];
        }
    };
    FormBuilder.prototype.getData = function () {
        var datas = {};
        this.widgets.forEach(function (w) {
            return datas[w.name] = w.getData();
        }, {});
        return datas;
    };
    FormBuilder.prototype.getByName = function (name) {
        return _.find(this.widgets, function (widget) {
            return widget.name === name;
        });
    };
    return FormBuilder;
})();
exports.FormBuilder = FormBuilder;
exports.createFormBuilder = function () {
    var form = new FormBuilder();
    form.addWidgetLoader(new WidgetLoader());
    return form;
};

//# sourceMappingURL=form.js.map
