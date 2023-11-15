import express from 'express';
import pug from 'pug';
import bodyParser from 'body-parser';
import path from 'path';
import {v4 as uuid} from 'uuid';

const PORT = process.env.PORT || 3001;

type Todo = {
    id: string,
    name: string,
    done: boolean
}

let todos: Todo[] = [
    {
        id: "123",
        name: 'Taste htmx',
        done: true
    },
    {
        id: uuid(),
        name: 'Buy a unicorn',
        done: false
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
    res.sendStatus(200);
});


app.listen(PORT);

console.log('Listening on port: ' + PORT);