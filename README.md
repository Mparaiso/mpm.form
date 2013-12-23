mpm.form
========

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

Result : 
```html
	&lt;label  &gt;firstname&lt;/label&gt; &lt;input  name=&apos;firstname&apos;  value=&apos;Marc&apos;  type=&apos;text&apos;  /&gt;
	&lt;label  &gt;lastname&lt;/label&gt; &lt;input  name=&apos;lastname&apos;  value=&apos;Prades&apos;  type=&apos;text&apos;  /&gt;
	&lt;select  required=&apos;true&apos;  name=&apos;gender&apos;  &gt;
	&lt;option  selected=&apos;selected&apos;  value=&apos;0&apos;  name=&apos;male&apos;  type=&apos;option&apos;  &gt;male&lt;/option&gt;
	&lt;option  value=&apos;1&apos;  name=&apos;female&apos;  type=&apos;option&apos;  &gt;female&lt;/option&gt;
	&lt;option  value=&apos;2&apos;  name=&apos;other&apos;  type=&apos;option&apos;  &gt;other&lt;/option&gt;
	&lt;/select&gt;
	&lt;input  checked=&apos;checked&apos;  value=&apos;tech&apos;  name=&apos;tech&apos;  type=&apos;check&apos;  /&gt; &lt;label  &gt;tech&lt;/label&gt;
	&lt;input  value=&apos;politics&apos;  name=&apos;politics&apos;  type=&apos;check&apos;  /&gt; &lt;label  &gt;politics&lt;/label&gt;
	&lt;label  &gt;submit&lt;/label&gt; &lt;input  value=&apos;submit&apos;  name=&apos;submit&apos;  type=&apos;submit&apos;  /&gt;
```