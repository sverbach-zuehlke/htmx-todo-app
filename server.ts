import express from 'express';
import pug from 'pug';
import bodyParser from 'body-parser';
import path from 'path';
import {v4 as uuid} from 'uuid';

const PORT = process.env.PORT || 3001;

type Todo = {
    id: string,
    name: string,
    description: string,
    done: boolean,
    createdAt: Date
}

let todos: Todo[] = [
    {
        id: uuid(),
        name: 'Uninstall htmx',
        description: 'After trying out htmx I want to commit uninstall.',
        done: true,
        createdAt: new Date(new Date().getTime() - 24 * 3600 * 1000)
    },
    {
        id: uuid(),
        name: 'setup neovim for 3 hrs',
        description: 'goal is to have neovim configured for my dotnet project',
        done: false,
        createdAt: new Date()
    }
];

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res ) => {
    res.render('index', { todos });
});

app.delete('/todos/:id', (req,res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id !== id);
    res.sendStatus(200); // never, under ZERO circumstances, send 204, I dare you!
});

app.post('/todos', (req, res) => {
    const {name} = req.body;
    const todo: Todo = {id: uuid(), name, description: '', done: false, createdAt: new Date()};
    todos.push(todo);
    const template = pug.compileFile('views/components/todo-item.pug');
    const markup = template({ todo });
    res.status(201).send(markup);
});

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);

})

app.listen(PORT);

console.log('Listening on port: ' + PORT);