import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";
import { buttonVariants } from "../ui/button";
import UserDropDown from "./UserDropDown";
import { useSession } from "next-auth/react";
import { auth } from "@/lib/auth";
import { getUserType } from "@/app/data/user/require-user";
import { boolean } from "zod";

const NavbarActions = async () => {
  const session = await auth();
  const userType = await getUserType()

  console.log(userType)
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />

      {session ? (
        <>
          <Link href={"/post-job"} className={buttonVariants()}>
            Post Job
          </Link>
          <UserDropDown
            name={session.user?.name as string}
            email={session.user?.email as string}
            image={session.user?.image as string}
            isCompany={userType as boolean}
          />
        </>
      ) : (
        <Link href={"/login"} className={buttonVariants()}>
          Log In
        </Link>
      )}
    </div>
  );
};

export default NavbarActions;
