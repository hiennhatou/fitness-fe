import { Login, Register } from "./auth";
import { createBrowserRouter } from "react-router";
import App from "./home/App";
import RootTemplate from "./RootTemplate";

const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/", Component: RootTemplate, children: [{ index: true, Component: App }] },
]);

export default router;
