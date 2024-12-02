import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  weight: z.string().transform((value) => Number(value)),
  height: z.string().transform((value) => Number(value)),
  bmi: z.string(),
  bmiClassification: z.string(),
  age: z.string().transform((value) => Number(value)),
  gender: z.string().min(2).max(50),
  bmr: z.string(),
  physicalActivity: z.string().min(2).max(50),
  activityFactor: z.string(),
  targetCalories: z.string(),
  userId: z.string(),
});