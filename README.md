# XMLHttpRequest.responseXML to Javascript object

## Description
`autopulous-xdom2jso` is a module that converts a `XMLHttpRequest.responseXML` (XML DOM) object to a JavaScript object (JSO).

The typical use cases for this module is to convert the XML results of an HTTP GET into a JavaScript object to be processed (tabular data) or utilized (configuration parameters) by an application. 
## License
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## API
`convert(xmlRoot:Node):{}`

- Accepts any ELEMENT node from an `XMLHttpRequest.responseXML` as the root from which to convert
- Returns a JavaScript object that represents the content of the passed XML ELEMENT node and its children

- Only `ELEMENT`, `TEXT`, and `ATTRIBUTE` nodes are handled
- Empty `TEXT` nodes are discarded
- Leading and trailing whitespace on `TEXT` node values is trimmed

## Node Conversion Rules
XML elements become nodes within the JavaScript object

This XML fragment:
```
<invoice><customer/></invoice>
```
is equivalent to this JavaScript:
```
invoice.customer = {};
```
---
XML multiple instances of an element become an array of nodes within the JavaScript object

This XML fragment:
```
<batch><invoice></invoice><invoice></invoice><invoice></invoice></batch>
```
is equivalent to this JavaScript:
```
batch.invoice[0]={};
batch.invoice[1]={};
batch.invoice[2]={};
```
---
XML text nodes map to the `$` (dollar) property within the JavaScript object

This XML fragment:
```
<invoice><customer>Brazillian Government</customer></invoice>
```
is equivalent to this JavaScript:
```
invoice.customer.$ = 'Brazillian Government';
```
---
XML attribute nodes map into the `_` (underscore) property within the JavaScript object

This XML fragment:
```
<invoice number='10000CX' terms='30 days'></invoice>
```
is equivalent to this JavaScript:
```
invoice._.number = '10000CX';
invoice._.terms = '30 days';
```
---
_The unit tests (which are part of the https://github.com/autopulous/xdom2jso.git GitHub repository) provide complete examples of the conversions that `xdom2jso` can perform._
 
see: `tst/complete.xml`  
## Getting Started
1. Create or open your `package.json` project file
2. Add an `autopulous-xdom2jso` entry to the dependencies list:
```
"dependencies": {"autopulous-xdom2jso": "latest"}
```
3. Use `npm` to install the component in the node module library home:
```
npm install
```