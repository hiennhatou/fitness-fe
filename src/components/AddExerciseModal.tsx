import { useState, useRef, useEffect } from "react";
import { CheckedIcon, SearchIcon } from "../components/icons";
import type { IExercise } from "../utils/interfaces";
import exerciseCover from "../assets/exercise-cover.jpg";
import { HSOverlay, type ICollectionItem } from "preline";
import { normalApi } from "../utils/http";

export function AddExerciseModal({
  existedExercise,
  addExistedExercise,
}: {
  existedExercise: IExercise[];
  addExistedExercise: (exercises: IExercise[]) => void;
}) {
  const [selectedExercises, setSelectedExercises] = useState<IExercise[]>([]);
  const [searchedExercises, setSearchedExercises] = useState<IExercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSearch = async () => {
    setIsLoading(true);
    try {
      const data = await normalApi.get(`/exercises`);
      if (data.status === 200)
        setSearchedExercises((data.data as IExercise[]).filter((exercise) => !existedExercise.find((value) => value.id === exercise.id)));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const { element } = HSOverlay.getInstance(ref.current, true) as ICollectionItem<HSOverlay>;
        element.on("close", () => {
          setSelectedExercises([]);
          setSearchedExercises([]);
        });
        element.on("open", () => {
          setSelectedExercises([]);
          setSearchedExercises([]);
        });
      }
    });
  }, [existedExercise]);

  return (
    <div
      ref={ref}
      id="hs-add-exercise-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-60 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-add-exercise-modal-label">
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto md:max-w-2xl h-[calc(100%-56px)]">
        <div className="max-h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex gap-3 justify-between items-center px-4 py-2.5 border-b border-gray-200">
            <div className="flex flex-row border-gray-400 border px-2 py-1.5 rounded-full basis-full">
              <div className="basis-full">
                <input className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-300" placeholder="Tìm bài tập..." type="text" />
              </div>
              <div className="w-[1px] bg-gray-300 mx-2"></div>
              <button onClick={onSearch} className="size-6">
                <SearchIcon className="w-full h-full text-gray-600" />
              </button>
            </div>
          </div>
          <div className="p-2 overflow-y-auto">
            <div className="space-y-4">
              {!isLoading && (!searchedExercises || searchedExercises.length <= 0) && (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="size-40">
                    <SearchIcon className="size-full" />
                  </div>
                  <p>Nhập vào ô tìm kiếm để tìm bài tập</p>
                </div>
              )}
              {!isLoading && searchedExercises && searchedExercises.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchedExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => {
                        if (selectedExercises.findIndex((value) => exercise.id === value.id) >= 0)
                          setSelectedExercises(selectedExercises.filter((value) => value.id != exercise.id));
                        else
                          setSelectedExercises([
                            ...selectedExercises,
                            exercise,
                          ]);
                      }}
                      className="w-full cursor-pointer rounded-xl relative h-72 overflow-hidden border-[0.1rem] border-gray-400 flex flex-col px-2 py-3 z-auto">
                      <h1 className="text-xl basis-[fit-content] font-bold overflow-ellipsis text-nowrap text-blue-400">{exercise.name}</h1>
                      <div className="relative basis-full overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img className="h-full object-cover object-center" src={exercise.image || exerciseCover} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <span className="size-8 rounded-full overflow-hidden">
                          {selectedExercises.findIndex((value) => exercise.id === value.id) >= 0 && (
                            <span className="inline-block size-full bg-blue-500 p-1">
                              <CheckedIcon className="size-full text-white" />
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="size-20">
                    <div
                      className="animate-spin inline-block size-full border-3 border-current border-t-transparent text-blue-600 rounded-full"
                      role="status"
                      aria-label="loading">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <p>Đang tìm kiếm...</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-add-exercise-modal">
              Đóng
            </button>
            <button
              onClick={() => {
                addExistedExercise(selectedExercises);
                if (ref.current) {
                  const { element } = HSOverlay.getInstance(ref.current, true) as ICollectionItem<HSOverlay>;
                  element.close();
                }
              }}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Thêm bài tập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
