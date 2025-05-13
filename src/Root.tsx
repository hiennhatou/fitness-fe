import { StrictMode, useEffect } from "react";
import { RouterProvider } from "react-router";
import router from "./app/router";

export default function Root() {
  useEffect(() => {
    import("preline/dist/index.js").then(() => {
      window.HSStaticMethods.autoInit();
    });
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
