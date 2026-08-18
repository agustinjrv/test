import { createApp } from "./app.js";
import { TaskStore } from "./store.js";

const port = Number(process.env.PORT ?? 3001);

const store = new TaskStore();
store.seed();

const app = createApp(store);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
