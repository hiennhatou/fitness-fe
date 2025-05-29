import { GenderEnum } from "../enums";

export function calBurnedCalories(avgHeartRate: number, periodTime: number, weight: number, age: number, gender: GenderEnum) {
  switch (gender) {
    case GenderEnum.MALE:
      return (periodTime * (0.6309 * avgHeartRate + 0.1988 * weight + 0.2017 * age - 55.0969)) / 4.184;
    default:
      return (periodTime * (0.4472 * avgHeartRate - 0.1263 * weight + 0.074 * age - 20.4022)) / 4.184;
  }
}
