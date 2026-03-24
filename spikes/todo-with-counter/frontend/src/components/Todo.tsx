// export default function Todo() {
//   // Example of fetching todos from the API
//   try {
//     fetch("/todos")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Todos:", data);
//       });
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//   }

//   return (
//     <div className="todo">
//       <h2>Todo List</h2>
//       {/* Todo list UI goes here */}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';

// Matches your schema.ts: id (number), title (string), completed (boolean)
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/todos";

  // 1. Fetch todos on mount (matches GET /todos)

  // setup phase
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. Add a new todo (matches POST /todos)
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input }), // Your API expects { title }
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setInput("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // 3. Toggle completed status (matches PATCH /todos/:id)
  const toggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // 4. Delete a todo (matches DELETE /todos/:id)
  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (loading) return <p>Loading todos...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="border p-2 flex-grow rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <span className={todo.completed ? "line-through text-gray-500" : ""}>
                {todo.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}