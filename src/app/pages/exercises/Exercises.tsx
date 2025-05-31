import { useCallback, useEffect, useRef, useState } from "react";
import type { IExercise } from "../../../utils/interfaces";
import { normalApi } from "../../../utils/http";
import { ExerciseCard } from "../../../components";
import { SearchIcon } from "../../../components/icons";

export function Exercises() {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);

  const fetchExercises = useCallback(async () => {
    if (nextPage && !loading) {
      setLoading(true);
      try {
        const data = await normalApi.get(`/exercises?page=${nextPage}${searchQuery && `&s=${searchQuery}`}`);
        if (data.status === 200 && data.data.length > 0) {
          setExercises(nextPage === 1 ? data.data : [...exercises, ...data.data]);
          setNextPage(nextPage + 1);
        } else {
          throw new Error("Failed to fetch exercises");
        }
      } catch (err) {
        setNextPage(null);
      } finally {
        setLoading(false);
      }
    }
  }, [nextPage, searchQuery, loading, exercises]);

  useEffect(() => {
    if (nextPage === 1) fetchExercises();
  }, [fetchExercises, nextPage]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("exercise-container");
      if (container && window.scrollY + window.innerHeight >= container.offsetTop + container.offsetHeight - 80 && nextPage !== 1) {
        fetchExercises();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchExercises, nextPage]);

  const onSearch = useCallback(() => {
    setSearchQuery(searchRef.current?.value || "");
    setExercises([]);
    setNextPage(1);
  }, []);

  return (
    <div className="col-span-full md:col-span-2">
      <div id="exercise-container" className="grid grid-cols-full md:grid-cols-3 gap-4">
        <div className="flex flex-row my-3 border-gray-400 border px-4 py-1.5 rounded-full col-span-full">
          <div className="basis-full">
            <input
              ref={searchRef}
              className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-300"
              placeholder="Tìm bài tập..."
              type="text"
            />
          </div>
          <div className="w-[1px] bg-gray-300 mx-2"></div>
          <button onClick={onSearch} className="size-6">
            <SearchIcon className="w-full h-full text-gray-600" />
          </button>
        </div>

        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
