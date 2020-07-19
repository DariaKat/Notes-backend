const { ObjectId } = require("mongodb");

module.exports = function (app, db) {
  app.post("/notes/add", (req, res) => {
    const note = {
      text: req.body.body,
      title: req.body.title,
      importance: req.body.importance,
      date: req.body.date,
    };

    db.collection("notes").insertOne(note, (err, result) => {
      console.log("NOTE", note);
      if (err) {
        console.log("ERROR", err);
        res.send({
          error: "An error has occurred",
        });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.get("/all", (req, res) => {
    db.collection("notes")
      .find({})
      .toArray(function (err, result) {
        if (err) {
          console.log("WTFERR", err);
          res.send({
            error: "An error has occurred",
          });
        } else {
          console.log("result:", result);
          res.send(result);
        }
      });
  });

  app.post("/notes/delete", (req, res) => {
    console.log(req.body);
    db.collection("notes").deleteOne(
      { _id: ObjectId(req.body.id) },
      (err, result) => {
        if (err) {
          console.log("ERROR", err);
          res.send({
            error: "An error has occurred",
          });
        } else {
          res.send("Delete");
        }
      }
    );
  });

  app.post("/notes/update/", (req, res) => {
    console.log(req.body);
    db.collection("notes").updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          title: req.body.title,
          text: req.body.body,
          importance: req.body.importance,
          date: req.body.date,
        },
      },
      (err, result) => {
        if (err) {
          console.log("ERROR", err);
          res.send({
            error: "An error has occurred",
          });
        } else {
          console.log(result);
          res.send("Update");
        }
      }
    );
  });
};
