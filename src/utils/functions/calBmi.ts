export function calBmi(weight: number, height: number) {
  const bmi = weight / height ** 2;

  return { bmi: bmi, status: getBmiStatus(bmi) };
}

function getBmiStatus(bmi: number) {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi >= 18.5 && bmi < 25) return "Bình thường";
  if (bmi >= 25 && bmi < 30) return "Thừa cân";
  return "Béo phì";
}
