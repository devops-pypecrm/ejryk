import { requireAdmin } from "../../../lib/server-auth";
import { tasks } from "../../../lib/store";
import TasksClient from "../_components/TasksClient";

export default async function TasksPage() {
  await requireAdmin();
  return (<><h1 className="adm-h">Task board</h1><TasksClient initial={await tasks.list()} /></>);
}
