import { StrictMode, useEffect } from "react";
import { RouterProvider } from "react-router";

import router from "./router";
import { loadUser } from "../utils/functions/loadUser";

async function loadPreline() {
  return import("preline/dist/index.js");
}

export default function Root() {
  useEffect(() => {
    loadPreline().then(() => {
      window.HSStaticMethods.autoInit();
    });
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
