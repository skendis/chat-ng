const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/ng-chat'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/ng-chat/index.html'));
});

// Start the app by listening on the default Heroku port
const server = app.listen(process.env.PORT || 8080);
const io = require('socket.io')(server);

let users = [];
let msgs = []
io.on('connection', (socket) => {
  users.push(socket)
  if(msgs.length!==0){
    for (const historyMsg of msgs) {
      io.emit('chat-message',historyMsg);
    }
  }
  io.emit('connected-users',users.length);
  socket.on('chat-message',(message)=>{
    msgs.push(message);
    socket.broadcast.emit('chat-message',message);
  });
  socket.on('disconnect', () => {
    users.splice(0,1)
    socket.broadcast.emit('connected-users',users.length);
  });
});

