const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let todos = [];
let idCounter = 1;

// Load from file if it exists
if (fs.existsSync('todos.json')) {
    todos = JSON.parse(fs.readFileSync('todos.json', 'utf8'));
    idCounter = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
}

// Save function to write todos to file
function saveTodos() {
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
}

// GET /todos - list all todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// GET /todos/:id - get one todo
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).send('Todo not found');
    res.status(200).json(todo);
});

// POST /todos - add new todo
app.post('/todos', (req, res) => {
    const { title, description, completed } = req.body;
    const newTodo = {
        id: idCounter++,
        title,
        description,
        completed: completed || false
    };
    todos.push(newTodo);
    saveTodos();
    res.status(201).json({ id: newTodo.id });
});

// PUT /todos/:id - update todo
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).send('Todo not found');

    const { title, description, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    saveTodos();
    res.status(200).send('Todo updated');
});

// DELETE /todos/:id - delete todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).send('Todo not found');

    todos.splice(index, 1);
    saveTodos();
    res.status(200).send('Todo deleted');
});

// Catch-all for unknown routes
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
    console.log(' Todo server running at http://localhost:3000');
});
