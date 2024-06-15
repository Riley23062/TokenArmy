const scryfall = require('scryfall-api');
const express = require('express');
const ejs = require('ejs');
const port = 9000;
var app = express();

let tokenList = []


class Token {
    constructor(name, colors, power, toughness, image){
        this.name = name
        this.colors = colors
        this.power = power
        this.toughness = toughness
        this.amount = 0
        this.image = image
    }
}

scryfall.Cards.search('type:token').get(687).then((value) => {
    let imageURI 
    
    //console.log(value);
   for (let i = 0; i < value.length; i++) {


if(Object.hasOwn(value[i], 'image_uris')){

imageURI = value[i].image_uris.small

tokenList.push(new Token(value[i].name, value[i].color_identity, value[i].power, value[i].toughness, imageURI))
} else {

    tokenList.push(new Token(value[i].name, value[i].color_identity, value[i].power, value[i].toughness, ''))
}

   

         
         }
        

  });


  




app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {

    res.render('home', {
        list: tokenList
    })

})

app.listen(port, () => {
console.log('Server running on port ' + port)

});