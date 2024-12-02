"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormEditMealPlanProps } from "./FormEditMealPlan.types";
import { formSchema } from "./FormEditMealPlan.form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FormEditMealPlan(props: FormEditMealPlanProps) {
  const { dataMealPlan } = props;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: dataMealPlan.fullName,
      weight: dataMealPlan.weight.toString(),
      height: dataMealPlan.height.toString(),
      bmi: dataMealPlan.bmi?.toString() || "",
      bmiClassification: dataMealPlan.bmiClassification || "",
      age: dataMealPlan.age.toString(),
      gender: dataMealPlan.gender,
      bmr: dataMealPlan.bmr?.toString() || "",
      physicalActivity: dataMealPlan.physicalActivity,
      activityFactor: dataMealPlan.activityFactor?.toString() || "",
      targetCalories: dataMealPlan.targetCalories?.toString() || "",
      userId: dataMealPlan.userId,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/mealPlan/${dataMealPlan.id}`, values);
      toast({
        title: "Meal plan edited ✅",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  type BMIClassification = "Bajo peso" | "Peso normal" | "Sobrepeso";

  const bmiPlans: Record<
    BMIClassification,
    { title: string; example: string[][] }
  > = {
    "Bajo peso": {
      title: "Plan para Bajo Peso",
      example: [
        [
          "Desayuno: 2 rebanadas de pan integral con aguacate y 2 huevos.",
          "Almuerzo: Arroz integral con pollo y ensalada.",
          "Cena: Pasta integral con atún y vegetales.",
        ],
        [
          "Desayuno: Yogur griego con granola y frutas.",
          "Almuerzo: Pollo a la parrilla con quinoa.",
          "Cena: Ensalada con atún, huevo duro y aceite de oliva.",
        ],
        [
          "Desayuno: Tostadas con aguacate y tomate.",
          "Almuerzo: Ensalada de pollo con aguacate.",
          "Cena: Sopa de lentejas con arroz integral.",
        ],
      ],
    },
    "Peso normal": {
      title: "Plan para Peso Normal",
      example: [
        [
          "Desayuno: Avena con miel y frutos rojos.",
          "Almuerzo: Quinoa con salmón y brócoli.",
          "Cena: Pollo con ensalada y pan integral.",
        ],
        [
          "Desayuno: Tostadas con aguacate y huevo.",
          "Almuerzo: Ensalada de atún con tomate y pepino.",
          "Cena: Filete de pescado con espárragos.",
        ],
        [
          "Desayuno: Yogur con frutos secos y miel.",
          "Almuerzo: Pechuga de pavo con batata.",
          "Cena: Sopa de verduras y ensalada.",
        ],
      ],
    },
    Sobrepeso: {
      title: "Plan para Sobrepeso/Obesidad",
      example: [
        [
          "Desayuno: 2 claras de huevo con espinacas.",
          "Almuerzo: Pollo a la plancha con ensalada y batata.",
          "Cena: Sopa de verduras y tofu salteado.",
        ],
        [
          "Desayuno: 1 batido de proteína con avena.",
          "Almuerzo: Pescado a la parrilla con ensalada de pepino.",
          "Cena: Verduras al vapor con tofu.",
        ],
        [
          "Desayuno: Café negro con 1 rebanada de pan integral.",
          "Almuerzo: Pollo con ensalada de espinacas.",
          "Cena: Calabacín con pechuga de pollo.",
        ],
      ],
    },
  };

  useEffect(() => {
    const weight = parseFloat(form.watch("weight"));
    const height = parseFloat(form.watch("height"));
    const age = parseFloat(form.watch("age"));
    const gender = form.watch("gender");
    const physicalActivity = form.watch("physicalActivity");

    let bmi = 0;
    if (weight > 0 && height > 0) {
      bmi = weight / Math.pow(height / 100, 2);
      form.setValue("bmi", bmi.toFixed(2).toString());
    }

    let bmr = 0;
    if (gender == "Masculino") {
      bmr = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
    } else if (gender == "Femenino") {
      bmr = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
    }
    form.setValue("bmr", bmr.toFixed(2).toString());

    let activityFactor = 0;
    if (physicalActivity == "Sedentario") {
      activityFactor = 1.2;
    } else if (physicalActivity == "Ligera actividad") {
      activityFactor = 1.375;
    } else if (physicalActivity == "Moderada actividad") {
      activityFactor = 1.55;
    } else if (physicalActivity == "Alta actividad") {
      activityFactor = 1.725;
    } else if (physicalActivity == "Muy alta actividad") {
      activityFactor = 1.9;
    }
    form.setValue("activityFactor", activityFactor.toString());

    let classification = "";
    let targetCalories = 0;
    if (bmi < 18.5) {
      classification = "Bajo peso";
      targetCalories = 1.15 * bmr * activityFactor;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      classification = "Peso normal";
      targetCalories = bmr * activityFactor;
    } else if (bmi >= 25 && bmi <= 29.9) {
      classification = "Sobrepeso";
      targetCalories = 0.8 * bmr * activityFactor;
    } else if (bmi >= 30) {
      classification = "Obesidad";
      targetCalories = 0.8 * bmr * activityFactor;
    }
    form.setValue("bmiClassification", classification);
    form.setValue("targetCalories", targetCalories.toFixed(2).toString());
  }, [
    form.watch("weight"),
    form.watch("height"),
    form.watch("age"),
    form.watch("gender"),
    form.watch("physicalActivity"),
  ]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-y-4 gap-x-4"
        >
          <div className="grid md:grid-cols-1">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres y Apellidos</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-x-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso en kg</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura en cm</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h1 className="col-span-full font-bold">
            Índice de masa corporal - según OMS
          </h1>

          <div className="grid md:grid-cols-2 gap-x-4">
            <FormField
              control={form.control}
              name="bmi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMC</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bmiClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clasificación</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h1 className="col-span-full font-bold">
            Gasto energético basal - según fórmula Harris Benedict
          </h1>
          <div className="grid md:grid-cols-3 gap-x-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edad</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige el género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bmr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BMR</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h1 className="col-span-full font-bold">
            Plan alimenticio por calorías de IMC
          </h1>

          <div className="grid md:grid-cols-3 gap-x-4">
            <FormField
              control={form.control}
              name="physicalActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actividad física</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige actividad física" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sedentario">Sedentario</SelectItem>
                      <SelectItem value="Ligera actividad">
                        Ligera actividad
                      </SelectItem>
                      <SelectItem value="Moderada actividad">
                        Moderada actividad
                      </SelectItem>
                      <SelectItem value="Alta actividad">
                        Alta actividad
                      </SelectItem>
                      <SelectItem value="Muy alta actividad">
                        Muy alta actividad
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityFactor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factor según actividad</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetCalories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calorías objetivo en kcal/día</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full flex justify-end">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 overflow-x-auto">
        <div className="flex flex-nowrap gap-5 pb-4">
          {Object.entries(bmiPlans).map(([key, plan]) => {
            if (form.getValues("bmiClassification") === key) {
              return plan.example.map((mealOptions, index) => (
                <div
                  key={`mealOption-${index}`}
                  className="flex-none w-[300px]"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>{`${plan.title} - Día ${
                        index + 1
                      }`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {mealOptions.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ));
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
