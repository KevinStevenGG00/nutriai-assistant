"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { FormAddMealPlanProps } from "./FormAddMealPlan.types";
import { formSchema } from "./FormAddMealPlan.form";
import { useEffect, useState } from "react";

export function FormAddMealPlan(props: FormAddMealPlanProps) {
  const { userId, closeDialog } = props;
  const router = useRouter();

  const [macronutrients, setMacronutrients] = useState({
    carbohydrates: "0",
    proteins: "0",
    fats: "0",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      weight: 0,
      height: 0,
      bmi: "0",
      bmiClassification: "",
      age: 0,
      gender: "",
      bmr: "0",
      physicalActivity: "",
      activityFactor: "0",
      targetCalories: "0",
      userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/mealPlan", values);
      toast({
        title: "Meal plan created ✅",
      });
      form.reset({
        fullName: "",
        weight: 0,
        height: 0,
        bmi: "0",
        bmiClassification: "",
        age: 0,
        gender: "",
        bmr: "0",
        physicalActivity: "",
        activityFactor: "0",
        targetCalories: "0",
      });
      closeDialog();

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const weight = form.watch("weight");
    const height = form.watch("height");
    const age = form.watch("age");
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
    let carbs = 0;
    let proteins = 0;
    let fats = 0;

    if (bmi < 18.5) {
      classification = "Bajo peso";
      targetCalories = 1.15 * bmr * activityFactor;
      carbs = (0.5 * targetCalories) / 4;
      proteins = (0.2 * targetCalories) / 4;
      fats = (0.3 * targetCalories) / 9;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      classification = "Peso normal";
      targetCalories = bmr * activityFactor;
      carbs = (0.4 * targetCalories) / 4;
      proteins = (0.3 * targetCalories) / 4;
      fats = (0.3 * targetCalories) / 9;
    } else if (bmi >= 25) {
      classification = bmi >= 30 ? "Obesidad" : "Sobrepeso";
      targetCalories = 0.8 * bmr * activityFactor;
      carbs = (0.3 * targetCalories) / 4;
      proteins = (0.4 * targetCalories) / 4;
      fats = (0.3 * targetCalories) / 9;
    }

    form.setValue("bmiClassification", classification);
    form.setValue("targetCalories", targetCalories.toFixed(2).toString());
    setMacronutrients({
      carbohydrates: carbs.toFixed(2).toString(),
      proteins: proteins.toFixed(2).toString(),
      fats: fats.toFixed(2).toString(),
    });
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
          <div className="grid md:grid-cols-3 gap-x-4">
            <FormItem>
              <FormLabel>Carbohidratos (g)</FormLabel>
              <FormControl>
                <Input value={macronutrients.carbohydrates} readOnly />
              </FormControl>
              <FormDescription>Cada gramo(g) aporta 4kcal</FormDescription>
            </FormItem>
            <FormItem>
              <FormLabel>Proteínas (g)</FormLabel>
              <FormControl>
                <Input value={macronutrients.proteins} readOnly />
              </FormControl>
              <FormDescription>Cada gramo(g) aporta 4kcal</FormDescription>
            </FormItem>
            <FormItem>
              <FormLabel>Grasas (g)</FormLabel>
              <FormControl>
                <Input value={macronutrients.fats} readOnly />
              </FormControl>
              <FormDescription>Cada gramo(g) aporta 9kcal</FormDescription>
            </FormItem>
          </div>
          <div className="col-span-full flex justify-end">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
