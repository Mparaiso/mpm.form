/// <reference path="../typescript-sources/node.d.ts" />
/**
* @namespace
*/
export interface IBase {
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
export declare class Base implements IBase {
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
export declare class Text extends Base {
    public type: string;
}
export declare class Check extends Text {
    public type: string;
    public template;
    static fromData(data): Check;
}
export declare class Label extends Base {
    public type: string;
    public template;
    public defaults: {};
    public getAttributes();
    public toHTML();
}
export declare class Radio extends Text {
    public type: string;
    static fromData(data): Radio;
}
export declare class Button extends Text {
    public type: string;
}
export declare class Submit extends Button {
    public type: string;
}
export declare class Option extends Base {
    public type: string;
    public template;
    /**
    * @return {String}
    */
    public toHTML();
    static fromData(data): Option;
}
export interface Choice {
    key: string;
    value;
    attributes;
}
export declare class Choices extends Base {
    public type: string;
    public _choices: Choice[];
    constructor(name, options);
    public choices : Choice[];
    public normaLizeChoices(choices: Array<T>): any[];
    public toJSON();
}
export declare class Select extends Choices {
    public type: string;
    public template;
    public getAttributes();
    public toHTML();
    public setData(data: Array<T>): void;
    public getData(): any[];
}
export declare class CheckboxGroup extends Choices {
    public type: string;
    public toHTML(): string;
    public setData(data): void;
    public getData(): any[];
}
export declare class RadioGroup extends Choices {
    public type: string;
    public toHTML(): string;
    public setData(data): void;
    public getData(): Choice[];
}
