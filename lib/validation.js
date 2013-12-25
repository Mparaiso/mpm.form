var validation = exports;

validation.DummyValidator = function(){};
validation.DummyValidator.prototype = {
    validate:function(){return true;}
};