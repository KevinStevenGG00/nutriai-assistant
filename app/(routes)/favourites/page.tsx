import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export default async function FavouritesPage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return redirect("/");
  }
  // const user = await db.user.findUnique({
  //   where: {
  //     email: session?.user?.email,
  //   },
  //   include: {
  //     elements: {
  //       where: {
  //         isFavourite: true,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //   },
  // });
  return <div>FavouritesPage</div>;
}
