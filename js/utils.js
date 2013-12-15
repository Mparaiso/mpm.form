/// <reference path="node.d.ts"/>
var util = require('util');
var _ = require('underscore');

exports.isDefined = function (value) {
    return !_.isUndefined(value);
};
exports.returnDefined = function () {
    var values = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        values[_i] = arguments[_i + 0];
    }
    return _.find(values, function (value) {
        return exports.isDefined(value);
    });
};

//# sourceMappingURL=utils.js.map
