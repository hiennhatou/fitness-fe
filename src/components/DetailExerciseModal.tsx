import type { IExercise } from "../utils/interfaces";
import exerciseCover from "../assets/exercise-cover.jpg";

export function DetailExerciseModal({
  exercise,
  onClose,
  onDelete,
  isFinished = false,
}: {
  exercise?: IExercise;
  onClose?: () => void;
  onDelete?: () => void;
  isFinished?: boolean;
}) {
  return (
    <div
      id="hs-exercise-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-exercise-modal-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg md:max-w-4xl md:w-full m-3 md:mx-auto flex items-center">
        <div className="w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="hs-exercise-modal-label" className="font-bold text-blue-400">
              Bài tập: {exercise?.name}
            </h3>
            <button
              type="button"
              data-hs-overlay="#hs-exercise-modal"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              onClick={onClose}>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Đóng</span>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="relative h-[20rem] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img className="h-full object-cover object-center" src={exercise?.image || exerciseCover} />
              </div>
            </div>
            <p className="mt-1 text-gray-800">{exercise?.description}</p>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            {!isFinished && (
              <button
                type="button"
                onClick={onDelete}
                data-hs-overlay="#hs-exercise-modal"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-600 bg-white text-red-600 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                Xóa
              </button>
            )}
            <button
              onClick={onClose}
              data-hs-overlay="#hs-exercise-modal"
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
