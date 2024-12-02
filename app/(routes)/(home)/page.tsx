import React from "react";
import { HeaderMain } from "./components/HeaderMain";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TableDataMealPlan } from "./components/TableDataMealPlan";

export default async function Home() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      elements: {
        orderBy: {
          createdAt: "desc",
        },
      },
      nutritionPlan: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user || !user.elements || !user.nutritionPlan) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderMain userId={user.id} />
      {/* <TableData elements={user.elements} /> */}
      <TableDataMealPlan nutritionPlan={user.nutritionPlan} />
    </div>
  );
}
