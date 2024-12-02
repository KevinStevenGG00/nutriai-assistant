import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export function useDeleteMealPlan() {
  const router = useRouter();

  const deleteMealPlan = async (mealPlanId: string) => {
    try {
      const response = await axios.delete(`/api/mealPlan/${mealPlanId}`);
      if (response.status === 200) {
        toast({
          title: "Plan de comidas eliminado ✅",
          description: response.data.message || "Tu plan de comidas ha sido eliminado exitosamente.",
        });
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("Error al eliminar el plan de comidas:", error);
      toast({
        title: "Error al eliminar el plan de comidas",
        variant: "destructive",
      });
    }
  };

  return { deleteMealPlan };
}

