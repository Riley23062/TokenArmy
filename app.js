const scryfall = require('scryfall-api');
const express = require('express');
const ejs = require('ejs');
const port = 9000;
var app = express();


let list = []
scryfall.Cards.search('type:token').get(687).then((value) => {


   for (let i = 0; i < value.length; i++) {
   
       for (const key in value[i]) {
        if(key == "name"){

            list.push(value[i].name)
        }
    }
         
         }
         
        console.log(list);
          
  });




  




//app.use(express.urlencoded({ extended: true }));
//app.set('view engine', 'ejs');
//
//
//app.get('/', (req, res) => {
//
//    res.send('Hello World!')
//
//})
//
//app.listen(port, () => {
//console.log('Server running on port ' + port)
//
//});