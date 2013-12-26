mpm.form
========

[![Build Status](https://travis-ci.org/Mparaiso/mpm.form.png?branch=master)](https://travis-ci.org/Mparaiso/mpm.form)

version: 0.0.1

author: mparaiso <mparaiso@online.fr>

A form library for node.js

####BASIC USAGE

```javascript
	require('source-map-support').install();
	var forms = require('mpm.form');
	var gender_options = ['male','female','other'];
	var subject_options=[
		{key:"tech",value:"tech"},{key:"politics",value:"politics"}
	];
	// build form
	var form = forms.form.createFormBuilder();
	form.add('text','firstname');
	form.add('text','lastname');
	form.add('select','gender',{choices:gender_options,attributes:{required:true}});
	form.add('checkboxgroup','subjects',{choices:subject_options,multiple:true,extended:true});
	form.add('submit','submit',{attributes:{value:'submit'}});
	// set form datas
	form.setData({
		firstname:"Marc",
		lastname:"Prades",
		gender:[0],
		subjects:["tech"]
	});
	// render form
	console.log(form.toHTML()); 
	// get form datas
	console.log(form.getData());
	// export data for templating engines
	console.log(form.toJSON());
```

