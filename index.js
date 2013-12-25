require('source-map-support').install();

module.exports = {
    form:require('./lib/form'),
    fields:require('./lib/fields'),
    utils:require('./lib/utils'),
    validation:require('./lib/validation')
};