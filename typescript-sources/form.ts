/// <reference path="node.d.ts"/>

var util = require('util');
var _ = require('underscore');
import utils = require('utils');
import widget = require('widget');

export	interface IWidgetLoader{
	//var widget = import widget;
	getWidget(type,name,options):widget.Base;
}
export	class WidgetLoader implements IWidgetLoader{
	getWidget(type:string,name:string,options):widget.Base{
		switch(type){
			case "checkboxgroup":
				return new widget.CheckboxGroup(name,options);
			case "radiogroup":
				return new widget.RadioGroup(name,options);
			case "select":
				return new widget.Select(name,options);
			case "button":
				return new widget.Button(name,options);
			case "submit":
				return new widget.Submit(name,options);
			default:
				return new widget.Text(name,options);
		}
	}
}
export	class FormBuilder{
	_model:any;
	widgets=[];
	widgetLoaders:Array<IWidgetLoader>=[];
	name:string;
	addWidgetLoader(widgetLoader){
		this.widgetLoaders.push(widgetLoader);
	}
	resolveWidget(type,name,options){
		var i=0,widget;
		while(!widget || i<this.widgetLoaders.length){
			widget = this.widgetLoaders[i].getWidget(type,name,options);
			i+=1;
		}
		return widget;
	}
	bound=false;
	add(type,name,options){
		if(type instanceof widget.Base){
			this.widgets.push(type);
		}else{
			var _widget = this.resolveWidget(type,name,options);
			this.widgets.push(_widget);
		}
		return this;
	}
	toHTML(iterator){
		if(_.isUndefined(iterator)){
			iterator=(w)=>w.toHTML()
		}
		return this.widgets.map(iterator).join("\n");
	}
	toJSON(){
		return this.widgets.map((w)=>w.toJSON());
	}	
	setModel(value){this._model=value;}
	getModel(){return this._model;}
	/**
	 * @chainable
	 * @param {Object} data
	 */
	setData(data){
		var widget,key;
		for(key in data){
			widget = this.getByName(key);
			if(widget) widget.setData(data[key]);
			if(this._model) this._model[key] = data[key];
		}
	}
	getData(){
		var datas={};
		this.widgets.forEach((w)=>datas[w.name]=w.getData(),{})
		return datas;
	}
	getByName(name){
		return _.find(this.widgets,(widget)=>widget.name===name);
	}
}
export	var createFormBuilder=function(){
		var form=new FormBuilder();
		form.addWidgetLoader(new WidgetLoader);
		return form;
}
//@ sourceMappingURL=forms.js.map