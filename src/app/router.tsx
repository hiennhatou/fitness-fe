import { createBrowserRouter, type LoaderFunctionArgs } from "react-router";

import { Login, Register } from "./auth";
import RootTemplate from "./RootTemplate";
import { Home } from "./home";
import { SessionDetail, Sessions } from "./sessions";
import axios from "axios";
import { TwoColumnLayout } from "../components/TwoColumnLayout";

const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  {
    path: "/",
    Component: RootTemplate,
    children: [
      {
        Component: TwoColumnLayout,
        children: [
          { index: true, Component: Home },
          {
            path: "sessions",
            children: [
              { index: true, Component: Sessions },
              {
                path: ":id",
                Component: SessionDetail,
                loader: loadSessionDetail,
              },
            ],
          },
        ],
      },
    ],
  },
]);

async function loadSessionDetail({ params }: LoaderFunctionArgs) {
  if (!params.id) return {};
  try {
    const id = parseInt(params.id);
    const result = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_HOST}/sessions/${id}`),
      axios.get(`${import.meta.env.VITE_API_HOST}/sessions/${id}/exercises`),
    ]);
    if (result[0].status === 200 && result[1].status === 200) {
      return {
        session: result[0].data,
        exercises: result[1].data,
        coverImg: result[0].data.coverImage
      };
    }
  } catch (err) {
    console.log(err);
  }
  return {};
}

export default router;
