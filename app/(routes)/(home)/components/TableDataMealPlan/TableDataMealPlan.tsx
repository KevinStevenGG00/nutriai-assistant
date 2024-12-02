import { NutritionPlan } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export type TableDataMealPlanProps = {
  nutritionPlan: NutritionPlan[];
};
export function TableDataMealPlan(props: TableDataMealPlanProps) {
  const { nutritionPlan } = props;
  return (
    <div className="py-10">
      <DataTable columns={columns} data={nutritionPlan} />
    </div>
  );
}
