var app = require('http').createServer(handler),

    io = require('socket.io').listen(app),

    fs = require('fs'),

    url = require('url'),

    SerialPort = require('serialport').SerialPort,

    sp = new SerialPort('/dev/cu.usbmodem1411', {
        baudRate: 115200
    }),

    arduinoMessage = '',

  readFile = function(pathname, res) {

    if (pathname === '/'){

        pathname = 'index.html';
    }

    fs.readFile('../client/' + pathname, function(err, data) {

          if (err) {

            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
          }

          res.writeHead(200);
          res.end(data);

      });
  },




  /*
  * @ Thanks to Gianluca Guarini.
  *
  * @https://github.com/GianlucaGuarini
  *
  * */

  sendMessage = function(buffer, socket) {
    // concatenating the string buffers sent via usb port
    arduinoMessage += buffer.toString();

    // detecting the end of the string
    if (arduinoMessage.indexOf('\r') >= 0) {
      // log the message into the terminal
      // console.log(arduinoMessage);
      // send the message to the client
      socket.volatile.emit('notification', arduinoMessage);
      // reset the output string to an empty value
      arduinoMessage = '';
    }
  };


// creating a new websocket
io.sockets.on('connection', function(socket) {

  // listen all the serial port messages sent from arduino and passing them to the proxy function sendMessage

  sp.on('data', function(data) {
    sendMessage(data, socket);
  });

});


sp.on('close', function(err) {
  console.log('Port closed!');
});

sp.on('error', function(err) {
  console.error('error', err);
});

sp.on('open', function() {
  console.log('Port opened!');
});

app.listen(8000);


function handler(req, res) {

  readFile(url.parse(req.url).pathname, res);
}