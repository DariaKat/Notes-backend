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
const http = require('http');
const sockjs = require('sockjs');
const cors = require('cors');


//server.listen(9999, '0.0.0.0');

//app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
    
    const server = http.createServer(app);
    const echo = sockjs.createServer({prefix:'/echo'});
   
    echo.on('connection', (conn) => {
      setInterval(() => {
        // отправка времени
        conn.write(new Date().toLocaleTimeString());
        }, 1000)
      conn.on('data', (message)=> {
        conn.write(message);
      });
      conn.on('close', () => {});
    });

    echo.installHandlers(server, {prefix:'/echo'});

    server.listen(port, () => {
      console.log("server " + port);
    });
  } catch (err) {
    console.log(err.stack);
  }
})();
