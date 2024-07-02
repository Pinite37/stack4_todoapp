const API_URL = 'http://localhost:5000/api';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error('Erreur de récupération');
  }
  return response.json();
}

export async function createTodo(title: string, description: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) {
    throw new Error('Création de la tache échouée');
  }
  return response.json();
}

export async function updateTodoById(id: string, title?: string, description?: string, completed?: boolean): Promise<Todo> {
  const response = await fetch(`${API_URL}/todo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, completed }),
  });
  if (!response.ok) {
    throw new Error('Mise à jour échouée');
  }
  return response.json();
}

export async function deleteTodoById(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/todo/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Suppression de la tache échouée');
  }
  return response.json();
}
