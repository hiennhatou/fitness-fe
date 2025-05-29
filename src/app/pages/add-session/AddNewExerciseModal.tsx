import { HSOverlay, type ICollectionItem } from "preline";
import exerciseCover from "../../../assets/exercise-cover.jpg";
import { useEffect, useState } from "react";
import { secureApi } from "../../../utils/http";
import type { IExercise } from "../../../utils/interfaces";

export function AddNewExerciseModal({onDone} : {onDone: (exercise: IExercise) => void}) {
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [exerciseDescription, setExerciseDescription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImg(file);
    }
  };

  const onSave = async () => {
    if (!exerciseName || !coverImg) {
      return;
    }

    const formData = new FormData();
    formData.append("name", exerciseName);
    formData.append("img", coverImg);
    formData.append("description", exerciseDescription);

    try {
      setIsProcessing(true);
      const response = await secureApi.post("/exercises", formData);
      onDone(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      const { element } = HSOverlay.getInstance("#hs-add-new-exercise-modal", true) as ICollectionItem<HSOverlay>;
      element.close();
    }
  };

  useEffect(() => {
    const modal = HSOverlay.getInstance("#hs-add-new-exercise-modal", true) as ICollectionItem<HSOverlay>;
    modal.element.on("close", () => {
      setIsProcessing(false);
      setCoverImg(null);
      setExerciseName("");
    });
  }, []);

  const onChooseImage = () => {
    document.getElementById("exercise-cover-input")?.click();
  };

  return (
    <div
      id="hs-add-new-exercise-modal"
      data-hs-overlay-keyboard="false"
      className={`hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none [--overlay-backdrop:static]`}
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-add-new-exercise-modal-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg md:max-w-4xl md:w-full m-3 md:mx-auto flex items-center">
        <div className="w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="hs-add-new-exercise-modal-label" className="font-bold text-blue-400">
              Tạo bài tập mới
            </h3>
            {!isProcessing && (
              <button
                type="button"
                data-hs-overlay="#hs-add-new-exercise-modal"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none">
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
            )}
          </div>
          {!isProcessing && (
            <>
              <div className="p-4 overflow-y-auto">
                <div className="relative h-[20rem] overflow-hidden my-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img className="h-full object-cover object-center" src={(coverImg && URL.createObjectURL(coverImg)) || exerciseCover} />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 justify-center">
                    <input id="exercise-cover-input" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                    <button onClick={onChooseImage} type="button" className="rounded-xl bg-blue-400 px-3 py-1.5 text-white hover:bg-blue-500">
                      Chọn ảnh
                    </button>
                    <button type="button" className="rounded-xl bg-red-400 px-3 py-1.5 text-white hover:bg-red-500">
                      Xóa ảnh
                    </button>
                  </div>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="py-2.5 sm:py-3 px-4 block w-full border outline-none border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Tên bài tập"
                  />
                  <textarea
                    value={exerciseDescription}
                    onChange={(e) => setExerciseDescription(e.target.value)}
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border outline-none border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    rows={3}
                    placeholder="Mô tả bài tập"></textarea>
                </div>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
                <button
                  onClick={onSave}
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  Xong
                </button>
              </div>
            </>
          )}
          {isProcessing && (
            <div className="flex justify-center items-center">
              <div
                className="m-5   animate-spin inline-block size-8 border-3 border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
                aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
