/// <reference path="../typescript-sources/node.d.ts" />
import widget = require('widget');
export interface IWidgetLoader {
    getWidget(type, name, options): widget.Base;
}
export declare class WidgetLoader implements IWidgetLoader {
    public getWidget(type: string, name: string, options): widget.Base;
}
export declare class FormBuilder {
    public _model: any;
    public widgets: any[];
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
    public getByName(name);
}
export declare var createFormBuilder: () => FormBuilder;
