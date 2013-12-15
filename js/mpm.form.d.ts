declare var util;
declare var _;
declare module utils {
    var isDefined: (value: any) => boolean;
    var returnDefined: (...values: any[]) => any;
}
/**
* @namespace
*/
declare module widget {
    interface IBase {
        name;
        options;
        type;
        _data;
        toJSON(): any;
        toHTML();
        getAttributes();
        setData(_data);
        getData();
    }
    class Base implements IBase {
        public options: any;
        public name;
        public _data;
        public type: string;
        public template;
        /**
        * @constructor
        * @param {String} name
        * @param {Object} options
        */
        constructor(name, options?: any);
        public renderAttributes(attrs: Object);
        public getAttributes();
        public setData(data): void;
        public getData();
        /**
        * @return {Object}
        */
        public toJSON(): any;
        /**
        * @return {String}
        */
        public toHTML();
        public toString();
    }
    class Text extends Base {
        public type: string;
    }
    class Check extends Text {
        public type: string;
        public template;
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
        public _choices: Choice[];
        constructor(name, options);
        public choices : Choice[];
        public normaLizeChoices(choices: Array<T>): any[];
        public toJSON();
    }
    class Select extends Choices {
        public type: string;
        public template;
        public getAttributes();
        public toHTML();
        public setData(data: Array<T>): void;
        public getData(): any[];
    }
    class CheckboxGroup extends Choices {
        public type: string;
        public toHTML(): string;
        public setData(data): void;
        public getData(): any[];
    }
    class RadioGroup extends Choices {
        public type: string;
        public toHTML(): string;
        public setData(data): void;
        public getData(): Choice[];
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
