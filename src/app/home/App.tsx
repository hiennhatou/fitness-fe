import { Eye } from "../../components/icons";

function App() {
  return (
    <div>
      <div className="relative">
        <input
          id="hs-toggle-password"
          type="password"
          className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Enter password"
          value="12345qwerty"
        />
        <button
          type="button"
          data-hs-toggle-password='{
        "target": "#hs-toggle-password"
      }'
          className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600"
        >
          <Eye />
        </button>
      </div>
    </div>
  );
}

export default App;
