//Initalize variables prior to use
const scryfall = require('scryfall-api');
const express = require('express');
const ejs = require('ejs');
const { log } = require('console');
const port = 9000;
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//initalize lists prior to use
let tokenList = []
let boardstate = []

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {

    res.render('home', {
        list: tokenList,
        board: boardstate
    })

})

class Token {
    constructor(name, colors, power, toughness, image, keywords){
        this.name = name
        this.colors = colors
        this.power = power
        this.toughness = toughness
        this.image = image
        this.keywords = keywords
    }
}

function newToken(values){


    for (let i = 0; i < tokenList.length; i++) {
        
                
        if (tokenList[i].name == values[0]) {
            if (tokenList[i].power === values[2] && tokenList[i].toughness === values[3] && tokenList[i].keywords == values[4]) {
                values.push(1)
                values.push(tokenList[i].image)
                boardstate.push(values)
                io.emit('reload')
                break;
            }
        }
        
        }

}

scryfall.Cards.search('type:token').all().then((value) => {
    let imageURI 

    //console.log(value);
   for (let i = 0; i < value.length; i++) {


if(Object.hasOwn(value[i], 'image_uris')){

imageURI = value[i].image_uris.small
    if(Object.hasOwn(value[i], 'power') && Object.hasOwn(value[i], 'toughness' )){
        tokenList.push(new Token(value[i].name, value[i].color_identity, value[i].power, value[i].toughness, imageURI, value[i].keywords))
    } else {
        tokenList.push(new Token(value[i].name, value[i].color_identity, '', '', imageURI, value[i].keywords))
    }
} else {
    if(Object.hasOwn(value[i], 'power') && Object.hasOwn(value[i], 'toughness' )){

        tokenList.push(new Token(value[i].name, value[i].color_identity, value[i].power, value[i].toughness, '', value[i].keywords))

    } else {

        tokenList.push(new Token(value[i].name, value[i].color_identity, '?', '?', '', value[i].keywords))
    }
}


         }
        

  });


  


io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('AddToken', function (valuesRaw){
        const values = valuesRaw.split(", ");  

if(boardstate[0] != undefined){
console.log(values);

    for (let u = 0; u < boardstate.length; u++) {
        if (boardstate[u][0] === values[0] && boardstate[u][1] === values[1] && boardstate[u][2] === values[2] && boardstate[u][3] === values[3] && boardstate[u][4] === values[4]) {
            
            boardstate[u][5]++
            io.emit('reload')
            break;
        } else {
            newToken(values)
            break;
        }
        
    } 
} else {
   newToken(values)

}
    
        
    })


    socket.on('IncreaseAmount', function (tokenName) {
     
        for (let i = 0; i < boardstate.length; i++) {
            if (boardstate[i][0] == tokenName) {
                boardstate[i][5]++
            }   
        }
        io.emit('reload')
      });


      socket.on('removeToken', function (tokenName) {
     
        for (let i = 0; i < boardstate.length; i++) {
            if (boardstate[i][0] == tokenName) {
                if( boardstate[i][5] != 1){
                    boardstate[i][5]--
                } else {
                    boardstate.splice(i, 1)
                    console.log(boardstate);
                    
                }
            }   
        }
        io.emit('reload')
      });
      socket.on('removeAll', function (tokenName) {
     
        for (let i = 0; i < boardstate.length; i++) {
            if (boardstate[i][0] == tokenName) {
                    boardstate.splice(i, 1)
                    console.log(boardstate);
                    
            }   
        }
        io.emit('reload')
      });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });



    socket.on('send_message', function (id, person, message) {
      console.log(message);
    });
  })

  

server.listen(port, function() {
    console.log(`Listening on port ${port}`);
  });