import LatestSession from "./LatestSessions";
import LatestExercises from "./LatestExercise";

function Home() {
  return (
    <div className="col-span-3 min-md:col-span-2 flex flex-col gap-y-7">
      <LatestSession />
      <LatestExercises />
    </div>
  );
}

export default Home;
