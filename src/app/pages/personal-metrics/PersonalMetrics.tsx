import { lazy, useState } from "react";

const HeightWeightTab = lazy(() => import("./HeightWeightTab"));
const StepLogTab = lazy(() => import("./StepLogTab"));
const HeartBeatTab = lazy(() => import("./HeartBeatTab"));
const WaterLogTab = lazy(() => import("./WaterLogTab"));

const tabs = [
  {id: "height-weight", title: "Chiều cao - cân nặng", Component: HeightWeightTab},
  {id: "step-log", title: "Số bước đi", Component: StepLogTab},
  {id: "heart-beat", title: "Nhịp tim", Component: HeartBeatTab},
  {id: "water-log", title: "Lượng nước uống", Component: WaterLogTab},
]

export function PersonalMetrics() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveTab = tabs.find((tab) => tab.id === activeTab)?.Component;

  return (
    <div className="col-span-full my-4">
      <div className="flex flex-wrap">
        <div className="border-e border-gray-200">
          <nav className="flex flex-col space-y-2" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
            {
              tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`${activeTab === tab.id && "active "}py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none [&.active]:text-blue-600`}>
                  {tab.title}
                </button>
              ))
            }
          </nav>
        </div>

        <div className="ms-3">
          {ActiveTab && <ActiveTab />}
        </div>
      </div>
    </div>
  );
}
