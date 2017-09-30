
var http = require("https");
var req;
var net;
var client;
var ws;

var options = {
  "method": "POST",
  "hostname": "api.ciscospark.com",
  "port": null,
  "path": "/v1/messages",
  "headers": {
    "authorization": "Bearer OWY2ODAxODctZjA4Ny00MzQ4LTg4YjQtNjhmMTNhYTM1MzI5OWY1MTNiODgtNWJj",
    "content-type": "application/json",
    "cache-control": "no-cache",
    "postman-token": "57e45bc0-2b11-7d34-9dc3-ca5c4b9dda03"
  }
};

connectToUVS();

function connectToUVS() {
  ws = require("nodejs-websocket");
  client = ws.connect('ws://10.49.133.86:2012',function (conn) {
//  client = ws.connect('ws://10.127.25.169:2012',function (conn) {
  client.sendText('REALTIME');
//  console.log('Connected, REALTIME Messages Subscribed\n');
  });
}
var msgCount = 0;
client.on('text', function(data) {
  msgCount++;
   parsedString = data.split(',');
   var flag = 0;

   for (var i = 0; i < parsedString.length; ++i) {

     tokens = parsedString[i].split(":");

     if (tokens[0] == "\"SystemName\"") {
       console.log(tokens[0] + " = "+ tokens[1]);
       if ( (tokens[1] == "\"STOCKING_REQUEST_ALERT\"") || ((tokens[1] == "\"RESTOCK_COMPLETED_ALERT\"")) || ((tokens[1] == "\"WRONG_RESTOCK_LOCATION_ALERT\"")) ) {
         flag=1;
       }
     }
    if (tokens[0] == "\"Description\"") {
      console.log(tokens[0] + " = "+ tokens[1]);
      if (flag == 1){
         postToSpark("Msg " + msgCount + " " + tokens[1]);
         flag = 0;
       }
    }
  }
});

client.on('close', function() {
                console.log('Connection closed');
  connectToUVS();
});

function openHttpConnection() {
req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
  });
});
}

function postToSpark(data) {
  openHttpConnection();
  req.write(JSON.stringify({ roomId: 'Y2lzY29zcGFyazovL3VzL1JPT00vNjRhZjVkNzAtMTUyZi0xMWU3LWI2NTgtZjllOTRiMjcwM2Zj',
    text: data + '\n'}));
  req.end();
}

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
//    console.log("you entered: [" + d.toString().trim() + "]");
    var datetime = new Date();
  //  console.log('Console Input' + d.toString().trim());
    postToSpark( "Console Input> " + d.toString().trim());
  });
