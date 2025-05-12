import App from "./home/App.tsx";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

export default router;
