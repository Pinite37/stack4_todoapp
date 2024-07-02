import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchTodos, createTodo, updateTodoById, deleteTodoById, Todo } from './api';

function MyButton({ title }: { title: string }) {
  return (
    <button className='button'>{title}</button>
  );
}

const TaskItem = ({ task, onEdit, onDelete }: { task: Todo, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  const [isChecked, setIsChecked] = useState(task.completed);

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    await updateTodoById(task._id, undefined, undefined, event.target.checked);
  };

  return (
    <div className="taskitem">
      <div className='titles'>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
        <h2>{task.title}</h2>
        <p className='para'>{task.description}</p>
      </div>
      
      <div className="taskactions">
        <button onClick={() => onEdit(task._id)}>Modifier</button>
        <button onClick={() => onDelete(task._id)}>Supprimer</button>
      </div>
    </div>
  );
};

export default function MyApp() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      const todos = await fetchTodos();
      setTasks(todos);
    }
    loadTasks();
  }, []);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editId) {
      await updateTodoById(editId, name, description);
      setEditId(null);
    } else {
      await createTodo(name, description);
    }
    setName("");
    setDescription("");
    const todos = await fetchTodos();
    setTasks(todos);
  };

  const handleEdit = (id: string) => {
    const task = tasks.find(task => task._id === id);
    if (task) {
      setName(task.title);
      setDescription(task.description);
      setEditId(id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTodoById(id);
    const todos = await fetchTodos();
    setTasks(todos);
  };

  return (
    <div className='container'>
      <div className='contain'>
        <h1>Safari Todo App</h1>
        <div className='formdiv'>
          <form className='form' onSubmit={handleAdd}>
            <div className='name'>
              <label htmlFor="name">Name</label>
              <input type="text" placeholder='Entrez votre tâche' required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className='description'>
              <label htmlFor="description">Description</label>
              <input type="text" placeholder='Entrez la description' required value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <MyButton title="Ajouter" />
          </form>
        </div>
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
