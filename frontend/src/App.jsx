import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function loadTasks() {
    const res = await fetch(`${API_URL}/api/tasks`);
    const data = await res.json();
    setTasks(data);
  }

  async function addTask(e) {
    e.preventDefault();

    if (!title.trim()) return;

    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    setTitle("");
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE"
    });

    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>DevOps Tasks App</h1>

      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button>Add</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
