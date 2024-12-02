import { FormEditElement } from "@/components/Shared/FormEditElement";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ElementPage({
  params,
}: {
  params: Promise<{ elementId: string }>;
}) {
  const { elementId } = await params; // Esperamos la resolución de params

  const session = await getServerSession();
  if (!session || !session.user?.email) {
    redirect("/");
  }

  const element = await db.element.findUnique({
    where: {
      id: elementId,
    },
  });

  if (!element) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="col-span-full font-bold text-lg">Element Page</h1>
      <div>
        <FormEditElement dataElement={element} />
      </div>
    </div>
  );
}
