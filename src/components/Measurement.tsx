export default function Measurement() {
  return (
    <div>
      <h1 className="text-2xl font-[Mulish] font-semibold text-blue-400 mb-4">Chỉ số sức khỏe hiện tại</h1>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 min-sm:grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Nhịp tim</h1>
          <span className="text-4xl">12</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Lượng nước</h1>
          <span className="text-4xl">0.2</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Bước đi</h1>
          <span className="text-4xl">1200</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">BMI</h1>
          <span className="text-4xl">18.5</span>
        </div>
      </div>
    </div>
  );
}
