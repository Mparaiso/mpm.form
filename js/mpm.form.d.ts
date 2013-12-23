declare var util;
declare var _;
declare module utils {
    var isDefined: (value: any) => boolean;
    var returnDefined: (...values: any[]) => any;
}
declare module validation {
    interface IValidator {
        validate();
    }
    class DummyValidator {
        public validate(): boolean;
    }
}
declare module translation {
}
declare module widget {
    interface IBase {
        name;
        options;
        type;
        _data;
        default;
        toJSON(): any;
        toHTML();
        toString();
        getAttributes();
        setData(_data);
        getData();
        resetData();
        processData();
        validate();
    }
    class Base implements IBase {
        public options: any;
        public name;
        public _data;
        public default;
        public type: string;
        public template;
        constructor(name: string, options?: any);
        public renderAttributes(attrs: Object);
        /**
        * get attributes
        * @return {Object}
        */
        public getAttributes();
        public resetData(): void;
        public setData(data): void;
        public getData();
        public validate(): void;
        public processData(): void;
        public toJSON(): any;
        public toHTML();
        public toString();
    }
    class Text extends Base {
        public type: string;
    }
    class Check extends Text {
        public type: string;
        public template;
        public getAttributes();
        public setData(data): void;
        public getData();
        static fromData(data): Check;
    }
    class Label extends Base {
        public type: string;
        public template;
        public defaults: {};
        public getAttributes();
        public toHTML();
    }
    class Radio extends Text {
        public type: string;
        static fromData(data): Radio;
    }
    class Button extends Text {
        public type: string;
    }
    class Submit extends Button {
        public type: string;
    }
    class Option extends Base {
        public type: string;
        public template;
        /**
        * @return {String}
        */
        public toHTML();
        static fromData(data): Option;
    }
    interface Choice {
        key: string;
        value;
        attributes;
    }
    class Choices extends Base {
        public type: string;
        public _choices;
        constructor(name, options);
        public choices : any;
        public normaLizeChoices(choices);
        public toJSON(): any;
    }
    class Select extends Choices {
        public type: string;
        public template;
        public getAttributes();
        public toHTML();
        public setData(data: any[]): void;
        public getData();
    }
    class CheckboxGroup extends Choices {
        public type: string;
        public toHTML();
        public setData(data): void;
        public getData();
    }
    class RadioGroup extends Choices {
        public type: string;
        public toHTML();
        public setData(data): void;
        public getData();
    }
}
declare module form {
    interface IWidgetLoader {
        getWidget(type, name, options): widget.Base;
    }
    class WidgetLoader implements IWidgetLoader {
        public getWidget(type: string, name: string, options): widget.Base;
    }
    class FormBuilder {
        public _model: any;
        public widgets: widget.Base[];
        public widgetLoaders: IWidgetLoader[];
        public name: string;
        public addWidgetLoader(widgetLoader): void;
        public resolveWidget(type, name, options);
        public bound: boolean;
        public add(type, name, options): FormBuilder;
        public toHTML(iterator): string;
        public toJSON(): any[];
        public setModel(value): void;
        public getModel();
        /**
        * @chainable
        * @param {Object} data
        */
        public setData(data): void;
        public getData(): {};
        public getByName(name): widget.Base;
    }
    var createFormBuilder: () => FormBuilder;
}
