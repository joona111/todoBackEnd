const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");

const password = process.env.password;
const url = `mongodb+srv://joona:${password}@cluster0.zdwny.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(url);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./todoFront/build"));
}

const taskSchema = new mongoose.Schema({
  name: String,
});

const Task = mongoose.model("Task", taskSchema);

const todoSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  selectedTask: String,
  category: String,
});

const Todo = mongoose.model("Todo", todoSchema);

const categorySchema = mongoose.Schema({
  name: String,
  task: String,
});
const categoryModel = mongoose.model("categoryModel", categorySchema);

app.post("/api/newcategory", (req, res) => {
  const newcategory = new categoryModel({
    name: req.body.name,
    task: req.body.task,
  });

  newcategory.save();

  res.sendStatus(200);
});

app.delete("/api/deletetodo/:id", (req, res) => {
  Todo.findByIdAndRemove(req.params.id, (err, res) => {
    if (err) console.log(err);
  });
  res.sendStatus(200);
});

app.delete("/api/deletetask/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err, res) => {
    if (err) console.log(err);
  });
  res.sendStatus(200);
});

app.put("/api/update/:id", (req, res) => {
  Todo.find({ name: "p" }).then((res) => {});

  Todo.findOneAndUpdate(
    { _id: req.params.id },
    { completed: req.body.completed },
    (error, data) => {
      if (error) console.log("err" + error);
      else {
        console.log(data);
      }
    }
  );

  res.sendStatus(200);
});
app.post("/api/newtodo", (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    selectedTask: req.body.selectedTask,
    completed: false,
    category: req.body.category,
  });
  todo.save();
  res.sendStatus(200);
});

app.post("/api/inserttasks", (req, res) => {
  const task = new Task({
    name: req.body.name,
  });
  task.save();
  res.sendStatus(200);
});

app.get("/api/getcategories", (req, res) => {
  categoryModel.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/get", (req, res) => {
  Todo.find({}).then((result) => {
    res.json(result);
  });
});
app.get("/api/gettasks", (req, res) => {
  Task.find({}).then((result) => {
    res.json(result);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("toimii");
});
