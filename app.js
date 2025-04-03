const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    console.log("connected to db");
    // init app and middleware
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes
app.get("/books", (req, res) => {
  let books = [];
  db.collection("books")
    .find()
    .sort({ auhtor: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne(
        { _id: new ObjectId(req.params.id) }
        // { projection: { title: 1, author: 1 } }
      )
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(500).json({ error: "invalid id" });
  }
});

app.post("/books", function (req, res) {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.delete("/books/:id", function (req, res) {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(500).json({ error: "invalid id" });
  }
});

app.patch("/books/:id", function (req, res) {
  const updateData = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(500).json({ error: "invalid id" });
  }
});
