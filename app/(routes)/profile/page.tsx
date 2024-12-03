import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FormProfile } from "./components/FormProfile";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return redirect("/");
  }

  const userDb = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!userDb) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="text-xl md:text-3xl font-semibold">Account Details</h1>

      <FormProfile user={userDb} />
    </div>
  );
}
