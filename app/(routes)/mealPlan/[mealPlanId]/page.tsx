import { FormEditMealPlan } from "@/components/Shared/FormEditMealPlan";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MealPlanPage({
  params,
}: {
  params: Promise<{ mealPlanId: string }>;
}) {
  const { mealPlanId } = await params;

  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return redirect("/");
  }

  const mealPlan = await db.nutritionPlan.findUnique({
    where: {
      id: mealPlanId,
    },
  });

  if (!mealPlan) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">
        Editar Plan Nutricional
      </h1> */}
      <div>
        <FormEditMealPlan dataMealPlan={mealPlan} />
      </div>
    </div>
  );
}
