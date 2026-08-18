import { useEffect, useMemo, useState } from "react";
import { api, type Task } from "./api.ts";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  useEffect(() => {
    api
      .list()
      .then(setTasks)
      .catch((e) => setError(String(e.message)))
      .finally(() => setLoading(false));
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const created = await api.create(trimmed);
      setTasks((prev) => [created, ...prev]);
      setTitle("");
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function toggle(id: string) {
    const updated = await api.toggle(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function remove(id: string) {
    await api.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Task Board</h1>
        <p className="subtitle">
          {remaining} open {remaining === 1 ? "task" : "tasks"}
        </p>
      </header>

      <form className="composer" onSubmit={addTask}>
        <input
          aria-label="New task"
          placeholder="Add a task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks yet — add your first one above.</p>
      ) : (
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "item done" : "item"}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggle(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                className="remove"
                aria-label={`Delete ${task.title}`}
                onClick={() => remove(task.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
