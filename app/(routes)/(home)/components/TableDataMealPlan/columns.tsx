"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { NutritionPlan } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type ColumnsProps = NutritionPlan;

export const columns: ColumnDef<ColumnsProps>[] = [
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ getValue }) => {
      const rawValue = getValue();
      const date =
        rawValue instanceof Date ? rawValue : new Date(String(rawValue));
      return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "fullName",
    header: "Nombres y apellidos",
  },
  {
    accessorKey: "age",
    header: "Edad",
  },
  {
    accessorKey: "gender",
    header: "Género",
  },
  {
    accessorKey: "bmiClassification",
    header: "Clasificación",
  },
  {
    accessorKey: "physicalActivity",
    header: "Actividad Física",
  },
  {
    accessorKey: "targetCalories",
    header: "Calorías objetivo por día",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const onEditMealPlan = () => {
        window.location.href = `/mealPlan/${row.original.id}`;
      };

      return (
        <div className="flex gap-2 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onEditMealPlan}>
                Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
