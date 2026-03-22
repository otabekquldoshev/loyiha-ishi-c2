import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/dashboard-layout";
import { Dashboard } from "./pages/dashboard";
import { Targets } from "./pages/targets";
import { Tasks } from "./pages/tasks";
import { Payloads } from "./pages/payloads";
import { FileSystem } from "./pages/file-system";
import { Exfiltration } from "./pages/exfiltration";
import { Settings } from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "targets", Component: Targets },
      { path: "tasks", Component: Tasks },
      { path: "payloads", Component: Payloads },
      { path: "file-system", Component: FileSystem },
      { path: "exfiltration", Component: Exfiltration },
      { path: "settings", Component: Settings },
    ],
  },
]);
