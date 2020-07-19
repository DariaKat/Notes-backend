var ObjectID = require("mongodb").ObjectID;

const collectionName = "notes";

module.exports = function (app, db) {
  app.get("/archive/all", (req, res) => {
    db.collection(collectionName)
      .find({})
      .toArray((err, result) => {
        if (err) res.send({ error: "An error has occurred" });
        res.send(result);
      });
  });

  app.post("/archive/add", (req, res) => {
    const note = {
      text: req.body.text,
      title: req.body.title,
      rate: req.body.rate,
      status: req.body.status,
    };
    db.collection(collectionName).insertOne(note, (err, result) => {
      if (err) res.send({ error: "An error has occurred" + err });
      res.send(result.ops[0]);
    });
  });
};
