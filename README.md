mpm.form
========

version: 0.0.1

author: mparaiso <mparaiso@online.fr>

A form library for node.js

####BASIC USAGE

<pre><code language="javascript">
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

</code></pre>

Result : 
<pre><code>

<label  >firstname</label> <input  name='firstname'  value='Marc'  type='text'  />
<label  >lastname</label> <input  name='lastname'  value='Prades'  type='text'  />
<select  required='true'  name='gender'  >
<option  selected='selected'  value='0'  name='male'  type='option'  >male</option>
<option  value='1'  name='female'  type='option'  >female</option>
<option  value='2'  name='other'  type='option'  >other</option>
</select>
<input  checked='checked'  value='tech'  name='tech'  type='check'  /> <label  >tech</label>
<input  value='politics'  name='politics'  type='check'  /> <label  >politics</label>
<label  >submit</label> <input  value='submit'  name='submit'  type='submit'  />

</code></pre>