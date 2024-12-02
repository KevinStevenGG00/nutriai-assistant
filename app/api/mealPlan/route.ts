import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const {
            fullName,
            weight,
            height,
            bmi,
            bmiClassification,
            age,
            gender,
            bmr,
            physicalActivity,
            activityFactor,
            targetCalories,
            userId,
        } = await req.json()
        const nutritionPlan = await db.nutritionPlan.create({
            data: {
                fullName,
                weight,
                height,
                bmi: parseFloat(bmi),
                bmiClassification,
                age,
                gender,
                bmr: parseFloat(bmr),
                physicalActivity,
                activityFactor: parseFloat(activityFactor),
                targetCalories: parseFloat(targetCalories),
                userId,
            },
        });
        return NextResponse.json(nutritionPlan);
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}