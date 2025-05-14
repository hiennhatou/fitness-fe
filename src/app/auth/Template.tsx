import type { ReactNode } from "react";

export default function Template({
  rightComponent,
  coverImage,
  name,
  quote,
}: {
  rightComponent: ReactNode;
  coverImage: string;
  name: string;
  quote: ReactNode;
}) {
  return (
    <div className="bg-[#d9f5fa] h-[100dvh] w-[100dvw] flex items-center justify-center">
      <div className="bg-white border-8 py-2 border-white drop-shadow-lg rounded-3xl min-h-5/7 min-w-4/5 grid grid-cols-2 gap-2 box-content overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          <img src={coverImage} className="max-w-md object-cover" />
          <h1 className="text-3xl font-semibold font-[Mulish_500] text-cyan-800 text-center">{quote}</h1>
        </div>
        <div className="max-w-2xl">
          <div className="flex flex-col justify-center px-4 h-full">
            <h1 className="text-5xl font-bold text-blue-400 text-center">Fitness App</h1>
            <div className="w-full py-4 flex flex-col gap-3">
              <h1 className="text-4xl font-semibold text-center text-gray-700 font-[Mulish]">{name}</h1>
              {rightComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
