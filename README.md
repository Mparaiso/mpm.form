mpm.form
========

[![NPM](https://nodei.co/npm/mpm.form.png?downloads=true)](https://nodei.co/npm/mpm.form/)


[![Build Status](https://travis-ci.org/Mparaiso/mpm.form.png?branch=master)](https://travis-ci.org/Mparaiso/mpm.form)

version: 0.0.22

author: mparaiso <mparaiso@online.fr>

A form library for node.js

With __mpm.form__ , js developpers no longer need to write their forms and validate them by hand. 
mpm.form handles form creation , request and model binding ,  validation and html rendering of
form widgets.

####ChangeLog
- 0.0.23 api changed , see basic usage
- 0.0.22 added fields.Repeated
- 0.0.20 added fields.Email
- 0.0.19 fields.Date && fields.Time added
- 0.0.17 formBuilder.add arguments are now (name,formType,options) instead of (formType,name,options)


####INSTALLATION

in package.json file : 

	"dependencies":{
		"mpm.form":"*"
	}

####BASIC USAGE



Given a blog application , users need to write posts.
Let's create a form for blog posts
	 
	var form = require('mpm.form'),
	    validation = form.validation;

form.creatBuildler(name,options):form.FormBuilder

	// FormBuilder.add(fieldname,fieldtype,fieldoptions)
	var postForm = form.createBuilder("post_form"/*the form name*/)
        .add('title', 'text', {
            validators: [validation.Required(), validation.Length(3, 200)]})
        .add('excerpt', 'textarea', {attributes: {rows: 3},
            validators: validation.Required()})
        .add('content', 'textarea', {attributes: {rows: 10},
            validators: validation.Required()})
        .add("allow_comments",'checkbox',{label:'allow comments',attributes:{value:"allow_comments"}})
        .add('reset', 'reset', {attributes: {value: 'reset'}})
        .add('create', 'submit', {attributes: {value: 'create'}, validators: validation.Required()});
        
Render the fields as HTML , just call formBuilder.toHTML()

    postForm.toHTML();

Get all form datas ,for your own templating engine , view helpers , ... :

    postForm.toJSON();

Add initial form data to the formBuidlder (from the a database for instance ):

    var model = new ModelFromDB({content:'some content',title:"some title"});
    postForm.setModel(model);

We want to bind our form to the body of a post request

with expressjs , one would write :

    if(request.method==="POST"){
    	postForm.bind(request.body);
    }

postForm now contains request.body datas, the model has been modified too
    
validate the form : 

    postForm.validate(function(error,isValid){
		...
    });
    
isValid  will be true if the form is valid

Get form errors : 

    postForm.getErrors(); 

will yield an array of Error objects
if the form is valid ,we can save the model to the db

    model.save(callback)

```

####SUPPORTED FIELDS

- text: input of type text
- email: input of type email
- date: input of type date
- time: input of type time
- password: input of type password
- hidden: input of type hidden
- repeated  : 2 input fields that must have the same value (for password confirmation for instance )
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


