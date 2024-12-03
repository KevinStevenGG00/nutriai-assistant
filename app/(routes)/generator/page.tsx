import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientGeneratorPage from "./components/ClientGeneratorPage";

export default async function GeneratorPage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return redirect("/");
  }

  return <ClientGeneratorPage />;
}
