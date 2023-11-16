import express from "express";
import pug from "pug";
import bodyParser from "body-parser";
import path from "path";
import { v4 as uuid } from "uuid";
import {Todo, db} from "./db/todos";

const PORT = process.env.PORT || 3001;

const app = express();
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.redirect(`/${uuid()}`);
});

app.get("/:listId", (req, res) => {
  const {listId} = req.params;
  res.render("index", { todoList: db.get(listId) });
})

app.delete("/:listId/todos/:id", (req, res) => {
  const { listId, id } = req.params;
  db.removeTodo(listId, id);
  res.sendStatus(200); // never, under ZERO circumstances, send 204, I dare you!
});

app.post("/:listId/todos", (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;
  const todo: Todo = {
    id: uuid(),
    name,
    description: "",
    done: false,
    createdAt: new Date(),
  };
  const todoList = db.addTodo(listId, todo);
  const template = pug.compileFile("views/components/todo-item.pug");
  const markup = template({ todo, todoList });
  res.status(201).send(markup);
});

app.get("/:listId/todos/:id", (req, res) => {
  const { listId, id } = req.params;
  const todoList = db.get(listId);
  const todo = todoList.items.find(t => t.id === id);
  const template = pug.compileFile("views/components/todo-item-details.pug");
  const markup = template({ todo, todoList });
  res.status(200).send(markup);
});

app.post("/:listId/todos/:id/toggle", (req, res) => {
  const { listId, id } = req.params;
  const todoList = db.get(listId);
  const todo = todoList.items.find((t) => t.id === id)!;
  todo.done = !todo.done;

  const template = pug.compileFile("views/components/todo-item.pug");
  const markup = template({ todo, todoList });
  res.status(200).send(markup);
});

app.listen(PORT);

console.log("Listening on port: " + PORT);

