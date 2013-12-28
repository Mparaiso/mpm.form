mpm.form
========

[![Build Status](https://travis-ci.org/Mparaiso/mpm.form.png?branch=master)](https://travis-ci.org/Mparaiso/mpm.form)

version: 0.0.16

author: mparaiso <mparaiso@online.fr>

A form library for node.js

With __mpm.form__ , js developpers no longer need to write their forms and validate them by hand. 
mpm.form handles form creation , request and model binding ,  validation and html rendering of
form widgets.

####INSTALLATION

in package.json file : 

	"dependencies":{
		"mpm.form":"*"
	}

####BASIC USAGE

```javascript
	/**
	 * Given a blog application , users need to write posts.
	 * Let's create a form for posts
	 */
	var form = require('mpm.form').form;
	validation = require('mpm.form').validation;

	// FormBuilder.add(fieldtype,fieldname,fieldoptions)
	var postForm = form.createBuilder("post_form"/*the form name*/)
        .add('text', 'title', {
            validators: [validation.Required(), validation.Length(3, 200)]})
        .add('textarea', 'excerpt', {attributes: {rows: 3},
            validators: validation.Required()})
        .add('textarea', 'content', {attributes: {rows: 10},
            validators: validation.Required()})
        .add("checkbox",'allow_comments',{label:'allow comments',attributes:{value:"allow_comments"}})
        .add('reset', 'reset', {attributes: {value: 'reset'}})
        .add('submit', 'create', {attributes: {value: 'create'}, validators: validation.Required()});
        
    //to render the fields as HTML , just call : 
    postForm.toHTML();

    //to get all the fields configurations and values ,
    //and support your own templating engine 
    //get all datas with : 
    postForm.toJSON();
    // you can then write your own helpers to render the form

    //we want our form to have initial datas and bind a model 
    //(from the a database for instance )
    var model = new ModelFromDB({content:'some content',title:"some title"});
    postForm.setModel(model);

    //we want to bind our form to the body of a post request
    //with express framework , one would write :
    if(request.method==="POST"){
    	postForm.bind(request.body);
    	//postForm now contains request.body datas
    	//our model (model) has been modified too
    }
    //let's validate the form
    postForm.validate(function(error,result){
		...
    });
    ///result will be true if the form is valid
    ///to get form errors
    postForm.getErrors(); 
    //will yield an array of Error objects
    ///if the form is valid ,we can save the model to the db
    model.save(callback)

```

####SUPPORTED FIELDS

- text: input of type text
- password: input of type password
- hidden: input of type hidden
- checkbox: input of type check
- radio: input of type radio
- button: input of type button
- submit: input of type submit
- reset: input of type reset
- textarea: textarea widget
- select: a dropdown list of options
- checkboxgroup: a group of checkboxes
- radiogroup: a group of radio widgets
- label: a label

####SUPPORTED VALIDATORS : 

see : https://github.com/Mparaiso/mpm.validation for a list of supported validators


