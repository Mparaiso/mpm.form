"use strict";

var meta=exports;

meta.DefaultMeta = function(){};
meta.DefaultMeta.prototype={
	/**
	 * bind_field allows potential customization of how fields are bound.
	 * @param  {form.Form} form       
	 * @param  {Object} unboundField 
	 * @param  {Object} options      
	 * @return {Object}             
	 */
	bindField:function(form,unboundField,options){
		return unboundField.find(form,options);
	},
	/**
	 * wrap_formdata allows doing custom wrappers of WTForms formdata.
	 * @param  {form.Form} form     
	 * @param  {Object} formData 
	 * @return {Object}          
	 */
	wrapFormData:function(form,formData){
		return formData;		
	},
	/**
	 *  render_field allows customization of how widget rendering is done.
	 * @param  {Object} field   
	 * @param  {Object} options 
	 * @return {Object}        
	 */
	renderField:function(field,options){
		return field.getWidget(options);
	},
	getTranslations:function(form){
		return [];
	},
	/**
	 * Given a dictionary of values, update values on this `Meta` instance.
	 * @param  {Object} values 
	 */
	setValues:function(values){
		this._values=values;
	},
	getValues:function(){
		return this._values;
	}
};