import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params}: { params: Promise <{mealPlanId: string}> }) {
  try {
    const { mealPlanId } = await params;

    if (!mealPlanId) {
      return new NextResponse("Unauthorized: Missing mealPlanId", { status: 401 });
    }

    const values = await req.json();

    const nutritionPlan = await db.nutritionPlan.update({
      where: {
        id: mealPlanId,
      },
      data: {
        fullName: values.fullName,
        weight: parseFloat(values.weight),
        height: parseFloat(values.height),
        bmi: parseFloat(values.bmi),
        bmiClassification: values.bmiClassification,
        age: parseInt(values.age, 10),
        gender: values.gender,
        bmr: parseFloat(values.bmr),
        physicalActivity: values.physicalActivity,
        activityFactor: parseFloat(values.activityFactor),
        targetCalories: parseFloat(values.targetCalories),
      },
    });

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("Error updating nutrition plan:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
