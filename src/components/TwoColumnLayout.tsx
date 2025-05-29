import { Outlet } from "react-router";
import { Measurement } from "./Measurement";
import Actions from "./Actions";

export function TwoColumnLayout() {
  return (
    <div className="grid grid-flow-row grid-cols-3 min-lg:gap-x-10 py-7 auto-rows-auto gap-y-7">
      <Outlet />
      <div className="col-span-3 min-md:col-span-1">
        <Measurement />
        <Actions />
      </div>
    </div>
  );
}
