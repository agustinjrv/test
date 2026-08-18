export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

/**
 * A tiny in-memory task store. This keeps the starter dependency-free so the
 * environment can be demonstrated end-to-end without provisioning a database.
 */
export class TaskStore {
  private tasks: Task[] = [];

  list(): Task[] {
    return [...this.tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  add(title: string): Task {
    const task: Task = {
      id: globalThis.crypto.randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  toggle(id: string): Task | undefined {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    task.done = !task.done;
    return task;
  }

  remove(id: string): boolean {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }

  seed(): void {
    if (this.tasks.length > 0) return;
    this.add("Read the environment setup docs");
    this.add("Run the app end to end");
  }
}
