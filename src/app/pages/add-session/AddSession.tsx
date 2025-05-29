import { useEffect, useState, useRef } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { HSOverlay, HSTooltip, type ICollectionItem } from "preline";
import { useUserState } from "../../globalState";
import { secureApi } from "../../../utils/http";
import sessionCover from "../../../assets/session-cover.webp";
import { Plus } from "../../../components/icons";
import type { IExercise, IExerciseLog, ISession } from "../../../utils/interfaces";
import { ExerciseCardNoExpand, AddExerciseModal, DetailExerciseModal } from "../../../components";
import { AddNewExerciseModal } from "./AddNewExerciseModal";
import { useNavigate } from "react-router";

export function AddSession() {
  const user = useUserState((state) => state.user);
  const isLoaded = useUserState((state) => state.isLoaded);
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [coverImg, setCoverImg] = useState<File | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<IExercise | undefined>();

  const imgInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (isLoaded && (!user || user.role !== UserRoleEnum.ROLE_TRAINER)) throw new HttpError(404, "Not found");
  // }, [user, isLoaded]);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      const hsAddExerciseModal = document.getElementById("hs-add-exercise-button");

      if (hsAddExerciseModal && !hsAddExerciseModal.contains(e.target as Node)) {
        const { element } = HSTooltip.getInstance("#hs-add-exercise-button", true) as ICollectionItem<HSTooltip>;
        element.hide();
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  const onChooseImage = () => {
    imgInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImg(file);
    }
  };

  const getCoverImg = (img: File | string | null) => {
    if (img) {
      if (typeof img === "string") {
        return img;
      }
      return URL.createObjectURL(img);
    }
    return sessionCover;
  };

  const handleDeleteExercise = (exercise: IExercise | undefined) => {
    if (!exercise) return;
    setExercises(exercises.filter((e) => e !== exercise));
  };

  const handleAddExercises = (newExercises: IExercise[]) => {
    setExercises([...exercises, ...newExercises]);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isPublic", isPublic.toString());
      if (coverImg && coverImg instanceof File) {
        formData.append("img", coverImg);
      }

      const sessionResponse = await secureApi.post<ISession>("/sessions", formData);
      console.log(sessionResponse.data);

      await Promise.allSettled(
        exercises.map((exercise) =>
          secureApi.post<IExerciseLog>(`/sessions/${sessionResponse.data.id}/exercises?exerId=${exercise.id}`)
        )
      );

      navigate(`/sessions/${sessionResponse.data.id}`);

      toast.success("Thêm bài tập thành công", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
      toast.error("Thêm bài tập thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 max-w-2xl">
      <div className="absolute">
        <ToastContainer />
      </div>
      <div className="text-center">
        <h2 className="text-xl text-gray-800 font-bold sm:text-3xl">Tạo bài tập tổng hợp</h2>
      </div>

      <div className="rounded-xl my-4 flex flex-col gap-4">
        <div className="">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Tên bài tập
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Nhập tên buổi tập"
          />
        </div>

        <div className="">
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            rows={3}
            placeholder="Nhập mô tả buổi tập"></textarea>
        </div>

        <div className="">
          <label htmlFor="coverImg" className="block mb-2 text-sm font-medium">
            Ảnh bìa
          </label>
          <input type="file" id="coverImg" ref={imgInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
          <div
            onClick={onChooseImage}
            className="relative h-48 rounded-lg bg-gray-200 border border-gray-50 overflow-hidden hover:[&>span]:bg-[rgba(122,122,122,0.5)]">
            <span className="absolute bottom-0 left-0 right-0 bg-[rgba(87,87,87,0.3)] text-white text-xs flex items-center justify-center pb-1 z-20">
              Chọn ảnh bìa
            </span>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img className="h-full w-full object-cover object-center" src={getCoverImg(coverImg)} alt="cover" />
            </div>
          </div>
        </div>

        <div className="flex">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="shrink-0 mt-0.5 border border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-500 ms-3">
            Công khai bài tập
          </label>
        </div>

        <div>
          <h3 className="text-lg text-blue-400 mb-3">Các bài tập</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {exercises.map((exercise) => (
              <ExerciseCardNoExpand
                key={`${exercise.id}`}
                exercise={exercise}
                isFinished={false}
                onClick={() => {
                  setCurrentExercise(exercise);
                  const { element } = HSOverlay.getInstance("#hs-exercise-modal", true) as ICollectionItem<HSOverlay>;
                  element.open();
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteExercise(exercise);
                }}
              />
            ))}
            <div id="hs-add-exercise-button" className="hs-tooltip [--trigger:click] sm:[--placement:top] inline-block">
              <div className="hs-tooltip-toggle">
                <div className="grow h-72 overflow-hidden border-[0.1rem] border-gray-400 flex flex-col px-2 py-3 justify-center items-center gap-2 rounded-xl">
                  <Plus className="size-16 text-blue-500 stroke-1" />
                  <span className="text-lg text-blue-500">Thêm bài tập</span>
                </div>
                <div
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity absolute invisible z-10 bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full"
                  role="tooltip">
                  <div className="flex flex-col overflow-hidden">
                    <button
                      className="w-full py-2 px-3 text-sm hover:bg-gray-100"
                      onClick={() => {
                        const { element } = HSOverlay.getInstance("#hs-add-exercise-modal", true) as ICollectionItem<HSOverlay>;
                        element.open();
                      }}>
                      Bài tập có sẵn
                    </button>
                    <button
                      className="w-full py-2 px-3 text-sm hover:bg-gray-100"
                      onClick={() => {
                        const { element } = HSOverlay.getInstance("#hs-add-new-exercise-modal", true) as ICollectionItem<HSOverlay>;
                        element.open();
                      }}>
                      Tạo bài tập mới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          {isLoading ? (
            <div
              className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Thêm bài tập"
          )}
        </button>
      </div>

      <DetailExerciseModal
        exercise={currentExercise}
        onClose={() => setCurrentExercise(undefined)}
        onDelete={() => handleDeleteExercise(currentExercise)}
      />
      <AddExerciseModal addExistedExercise={handleAddExercises} existedExercise={exercises} />
      <AddNewExerciseModal onDone={(exercise) => setExercises([...exercises, exercise])} />
    </div>
  );
}
