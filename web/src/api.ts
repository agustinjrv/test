export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const api = {
  list: () => fetch("/api/tasks").then((r) => handle<Task[]>(r)),
  create: (title: string) =>
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then((r) => handle<Task>(r)),
  toggle: (id: string) =>
    fetch(`/api/tasks/${id}`, { method: "PATCH" }).then((r) => handle<Task>(r)),
  remove: (id: string) =>
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then((r) => handle<void>(r)),
};
