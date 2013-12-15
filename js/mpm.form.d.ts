declare var require: any, module: any;
declare var util: any;
declare var _: any;
declare module utils {
    var isDefined: (value: any) => boolean;
    var returnDefined: (...values: any[]) => any;
}
/**
* @namespace
*/
declare module widget {
    interface IBase {
        name: any;
        options: any;
        type: any;
        _data: any;
        toJSON(): any;
        toHTML(): any;
        getAttributes(): any;
        setData(_data: any): any;
        getData(): any;
    }
    class Base implements IBase {
        public options: any;
        public name: any;
        public _data: any;
        public type: string;
        public template: any;
        /**
        * @constructor
        * @param {String} name
        * @param {Object} options
        */
        constructor(name: any, options?: any);
        public renderAttributes(attrs: Object): any;
        public getAttributes(): any;
        public setData(data: any): void;
        public getData(): any;
        /**
        * @return {Object}
        */
        public toJSON(): any;
        /**
        * @return {String}
        */
        public toHTML(): any;
        public toString(): any;
    }
    class Text extends Base {
        public type: string;
    }
    class Check extends Text {
        public type: string;
        public template: any;
        static fromData(data: any): Check;
    }
    class Label extends Base {
        public type: string;
        public template: any;
        public defaults: {};
        public getAttributes(): any;
        public toHTML(): any;
    }
    class Radio extends Text {
        public type: string;
        static fromData(data: any): Radio;
    }
    class Button extends Text {
        public type: string;
    }
    class Submit extends Button {
        public type: string;
    }
    class Option extends Base {
        public type: string;
        public template: any;
        /**
        * @return {String}
        */
        public toHTML(): any;
        static fromData(data: any): Option;
    }
    interface Choice {
        key: string;
        value: any;
        attributes: any;
    }
    class Choices extends Base {
        public type: string;
        public _choices: any;
        constructor(name: any, options: any);
        public choices : any;
        public normaLizeChoices(choices: any): any;
        public toJSON(): any;
    }
    class Select extends Choices {
        public type: string;
        public template: any;
        public getAttributes(): any;
        public toHTML(): any;
        public setData(data: any[]): void;
        public getData(): any;
    }
    class CheckboxGroup extends Choices {
        public type: string;
        public toHTML(): any;
        public setData(data: any): void;
        public getData(): any;
    }
    class RadioGroup extends Choices {
        public type: string;
        public toHTML(): any;
        public setData(data: any): void;
        public getData(): any;
    }
}
declare module form {
    interface IWidgetLoader {
        getWidget(type: any, name: any, options: any): widget.Base;
    }
    class WidgetLoader implements IWidgetLoader {
        public getWidget(type: string, name: string, options: any): widget.Base;
    }
    class FormBuilder {
        public _model: any;
        public widgets: widget.Base[];
        public widgetLoaders: IWidgetLoader[];
        public name: string;
        public addWidgetLoader(widgetLoader: any): void;
        public resolveWidget(type: any, name: any, options: any): any;
        public bound: boolean;
        public add(type: any, name: any, options: any): FormBuilder;
        public toHTML(iterator: any): string;
        public toJSON(): {}[];
        public setModel(value: any): void;
        public getModel(): any;
        /**
        * @chainable
        * @param {Object} data
        */
        public setData(data: any): void;
        public getData(): {};
        public getByName(name: any): widget.Base;
    }
    var createFormBuilder: () => FormBuilder;
}
