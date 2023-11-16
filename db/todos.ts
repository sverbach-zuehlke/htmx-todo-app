import {v4 as uuid} from "uuid";

export type Todo = {
    id: string;
    name: string;
    description: string;
    done: boolean;
    createdAt: Date;
};

let initTodos: Todo[] = [
    {
        id: uuid(),
        name: "Uninstall htmx",
        description: "After trying out htmx I want to commit uninstall.",
        done: true,
        createdAt: new Date(new Date().getTime() - 24 * 3600 * 1000),
    },
    {
        id: uuid(),
        name: "setup neovim for 3 hrs",
        description: "goal is to have neovim configured for my dotnet project",
        done: false,
        createdAt: new Date(),
    },
];

export type TodoList = {
    id: string;
    items: Todo[]
};

const lists: TodoList[] = [];

export const db = {
    addTodo: (listId: string, todo: Todo): TodoList => {
        const list = getListOrDefault(listId);
        list.items.push(todo);
        return list;
    },
    get: (listId: string): TodoList => {
        return getListOrDefault(listId);
    },
    removeTodo: (listId: string, todoId: string) => {
        const list = lists.find(l => l.id === listId);
        if(!list) {
            return getListOrDefault(listId);
        }
        list.items = list.items.filter(i => i.id !== todoId);
    }
}

const getListOrDefault = (id: string) => {
    let list = lists.find(l => l.id === id);
    if(!list) {
        list = { id, items: [...initTodos]};
        lists.push(list);
    }

    return list;
}