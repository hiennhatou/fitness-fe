import { isRouteErrorResponse, useRouteError } from "react-router";
import { HttpError } from "../utils/errors";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <div>{error.status}</div>
        <div>Error: {error.statusText}</div>
      </div>
    );
  } else if (error instanceof HttpError) {
    return (
      <div>
        <div>{error.status}</div>
        <div>Error: {error.message}</div>
      </div>
    );
  } else {
    return <div>An unknown error occurred</div>;
  }
}
