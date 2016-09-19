/*eslint-env node*/

//------------------------------------------------------------------------------
// Blue Socks Chat Application Authors
// This application is based off of the socket.io chat example seen here (https://github.com/socketio/socket.io)
// Watson Tone Analyzer and SockBot implementation built by Stefania Kacmarczyk (https://github.com/slkaczma)
// Language Translation implemented by Oliver Rodriguez (https://github.com/odrodrig)

//------------------------------------------------------------------------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Pull in Watson Developer Cloud library here


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

/*********************************************************************************************************
                                           Parsing Service Credentials
*********************************************************************************************************/

//get services from environment variables
var services = appEnv.services;

console.log(services);
//Paste below here


if(appEnv.isLocal) {
  console.log("Running Locally. Deploy to Bluemix for this app to work.");
} else {
  //If running in the cloud, then we will pull the service credentials from the environment variables
  console.log("Running in Cloud");
  //Paste below here

}
//Paste below here



/*********************************************************************************************************
                                        End of Parsing Service Credentials
*********************************************************************************************************/

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

http.listen(appEnv.port, function(){
  console.log('listening on '+ appEnv.port);
});

// Chatroom

var numUsers = 0;
var chatHistory= [];

io.on('connection', function (socket) {
  var addedUser = false;
  console.log("connected to socket.io");

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'

  console.log('in new message: ' + data);
  chatHistory.push(data.message);
  //Paste below here



    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data.message
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
    console.log("added user");

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });


  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

 /**********************************************************************************************************
                                           Translation Socket
 ***********************************************************************************************************/

  //When a translation tag is read from chat
  socket.on('translate', function(data) {

    console.log(data.message);
    console.log(data.sourceLang);
    console.log(data.targetLang);
    //paste below here (getTone)

  //paste below here (language Translation)
    


  });

  /**********************************************************************************************************
                                         End of Translation Socket
  ***********************************************************************************************************/
  //Paste below here

      

  function botTalk(message){
  socket.emit('new message', {
    username:"SockBot",
    message: message
  });

  socket.broadcast.emit('new message', {
    username: "SockBot",
    message: message
  });
}


});
