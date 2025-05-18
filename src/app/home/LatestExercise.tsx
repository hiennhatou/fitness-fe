import { useState, useEffect } from "react";
import type { IExercise } from "../../utils/interfaces/IExercise";
import axios from "axios";
import ExerciseCard from "../../components/ExerciseCard"

export default function LatestExercises() {
  const [exercises, setExercise] = useState<IExercise[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_HOST}/exercises`)
      .then((data)=> {
        if (data.status === 200)
          setExercise(data.data);
      });
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-[Mulish] font-semibold text-blue-400 mb-4">Các bài tập</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {
          exercises.map(exercise => (<ExerciseCard exercise={exercise} key={exercise.id}/>))
        }
      </div>
    </div>
  );
}
