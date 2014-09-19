Rest service for getting information of a product by its bar code.

Install:

npm install

Run:

$ node server.js

Routes:

GET:
http://hostname:3000/product/@barcode
returns product info by its bar code


GET:
http://hostname:3000/product/list
returns list of all products