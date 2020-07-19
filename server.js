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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

    app.listen(port, () => {
      console.log("server " + port);
    });
  } catch (err) {
    console.log(err.stack);
  }
})();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
