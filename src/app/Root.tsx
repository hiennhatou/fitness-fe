import { StrictMode, useEffect } from "react";
import { RouterProvider } from "react-router";
import { MathJaxContext } from "better-react-mathjax";

import router from "./router";
import { loadUser } from "../utils/functions/loadUser";

export default function Root() {
  useEffect(() => {
    import("preline/dist/index.js").then(() => {
      window.HSStaticMethods.autoInit();
    });
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <StrictMode>
      <MathJaxContext>
        <RouterProvider router={router} />
      </MathJaxContext>
    </StrictMode>
  );
}
