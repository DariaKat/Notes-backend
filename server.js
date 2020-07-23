const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
const port = 8001;
const dbUri = require("./config/db");
const uri = dbUri.uri;
const url = "mongodb://localhost:27017/";
const dbNameCloud = "test";
const dbNameLocal = "archive";
//const http = require('http');
const sockjs = require('sockjs');
const cors = require('cors');
//const server = http.createServer();

//server.listen(9999, '0.0.0.0');

app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Credentials,  X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

(async function () {
  let clientCloud;
  let clientLocal;
  try {
    const echo = sockjs.createServer({ prefix:'/echo', disable_cors: true });

    echo.header={
      origin: '*:*'
    };
    console.log('conn.header: ',echo.header);

    echo.on('connection', function(conn) {
      setInterval(function() {
        // отправка времени
        conn.write(new Date().toLocaleTimeString());
        }, 1000)
      conn.on('data', function(message) {
        conn.write(message);
      });
      conn.on('close', function() {});
    });

    clientCloud = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    clientLocal = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected correctly to server");

    const dbCloud = clientCloud.db(dbNameCloud);
    require("./app/routes/cloud")(app, dbCloud);

    const dbLocal = clientLocal.db(dbNameLocal);
    require("./app/routes/local")(app, dbLocal);

    app.listen(port, () => {
      console.log("server " + port);
      //echo.attach(app);
      console.log(echo);
    });
  } catch (err) {
    console.log(err.stack);
  }
})();
